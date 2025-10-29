import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { toCguPayload } from "@/src/lib/cgu/utils";
import { ManifestacaoRequestDTOSchema } from "@/src/lib/cgu/schemas";
import { postManifestacao } from "@/src/lib/cgu/client";
import type { ManifestacaoRequestDTO } from "@/src/lib/cgu/types";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 60;
const RATE_LIMIT_MESSAGE = "Muitas solicitacoes. Tente novamente em breve.";
const rateLimitBucket = new Map<string, { count: number; expiresAt: number }>();

const CORRELATION_HEADER = "x-correlation-id";

type LogLevel = "info" | "warn" | "error";

const parseAllowedOrigins = (raw?: string | null): Set<string> => {
  if (!raw) {
    return new Set();
  }
  const tokens = raw
    .split(/[\s,;]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
  const normalized = tokens
    .map((entry) => {
      try {
        const candidate = entry.includes("://") ? entry : `http://${entry}`;
        return new URL(candidate).origin;
      } catch {
        return null;
      }
    })
    .filter((origin): origin is string => Boolean(origin));
  return new Set(normalized);
};

const isValidCorrelationId = (value: string | null): string | null => {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }
  return /^[A-Za-z0-9._-]{5,64}$/.test(trimmed) ? trimmed : null;
};

const normalizeOrigin = (value: string | null | undefined): string | null => {
  if (!value) {
    return null;
  }
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

const ALLOWED_ORIGINS = parseAllowedOrigins(process.env.ALLOWED_ORIGINS);

const getClientIdentifier = (req: NextRequest): string => {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const cloudflareIp = req.headers.get("cf-connecting-ip")?.trim();
  if (cloudflareIp) return cloudflareIp;
  return "unknown";
};

const enforceRateLimit = (
  identifier: string
): { allowed: boolean; retryAfterMs: number } => {
  const now = Date.now();
  const entry = rateLimitBucket.get(identifier);
  if (!entry || now >= entry.expiresAt) {
    rateLimitBucket.set(identifier, {
      count: 1,
      expiresAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, retryAfterMs: 0 };
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, retryAfterMs: Math.max(0, entry.expiresAt - now) };
  }
  entry.count += 1;
  return { allowed: true, retryAfterMs: 0 };
};

const evaluateCors = (
  req: NextRequest
):
  | { allowed: true; origin: string | null; headers: Record<string, string> }
  | {
      allowed: false;
      reason: "invalid_origin" | "not_whitelisted";
      headers: Record<string, string>;
    } => {
  const originHeader = req.headers.get("origin");
  const headers: Record<string, string> = originHeader ? { Vary: "Origin" } : {};
  if (!originHeader) {
    return { allowed: true, origin: null, headers };
  }
  const normalizedOrigin = normalizeOrigin(originHeader);
  if (!normalizedOrigin) {
    return { allowed: false, reason: "invalid_origin", headers };
  }
  const requestOrigin = normalizeOrigin(req.nextUrl.origin) ?? req.nextUrl.origin;
  if (normalizedOrigin === requestOrigin || ALLOWED_ORIGINS.has(normalizedOrigin)) {
    headers["Access-Control-Allow-Origin"] = normalizedOrigin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type,x-correlation-id";
    headers["Access-Control-Expose-Headers"] = CORRELATION_HEADER;
    return { allowed: true, origin: normalizedOrigin, headers };
  }
  return { allowed: false, reason: "not_whitelisted", headers };
};

const logStructured = (
  level: LogLevel,
  message: string,
  context: Record<string, unknown> = {}
) => {
  const entry = {
    level,
    timestamp: new Date().toISOString(),
    message,
    ...context,
  };
  const logger =
    level === "error"
      ? console.error
      : level === "warn"
      ? console.warn
      : console.info;
  logger(JSON.stringify(entry));
};

const sanitizeErrorMessage = (input: string): string => {
  const normalized = input
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  const fallback = "Erro ao processar a solicitacao.";
  return normalized ? normalized.slice(0, 200) : fallback;
};

const getCorrelationId = (req: NextRequest): string => {
  const existing = isValidCorrelationId(req.headers.get(CORRELATION_HEADER));
  return existing ?? randomUUID();
};

const respondWithError = (
  message: string,
  status: number,
  baseHeaders: Record<string, string>,
  correlationId: string
) => {
  return NextResponse.json(
    { ok: false, error: message, correlationId },
    {
      status,
      headers: { ...baseHeaders, [CORRELATION_HEADER]: correlationId },
    }
  );
};

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const correlationId = getCorrelationId(req);
  const cors = evaluateCors(req);
  const baseHeaders = { ...cors.headers };
  const clientId = getClientIdentifier(req);

  if (!cors.allowed) {
    logStructured("warn", "Origin not allowed", {
      correlationId,
      origin: req.headers.get("origin") ?? "none",
      reason: cors.reason,
      clientId,
    });
    return respondWithError("Origin not allowed", 403, baseHeaders, correlationId);
  }

  logStructured("info", "Manifestacao request received", {
    correlationId,
    origin: cors.origin ?? "same-origin",
    clientId,
  });

  const contentLengthHeader = req.headers.get("content-length");
  const contentLength = Number(contentLengthHeader ?? 0);
  const MAX_CONTENT_LENGTH = 35 * 1024 * 1024;
  if (Number.isFinite(contentLength) && contentLength > MAX_CONTENT_LENGTH) {
    logStructured("warn", "Payload too large", {
      correlationId,
      contentLength,
    });
    return respondWithError("Payload too large", 413, baseHeaders, correlationId);
  }

  const rateStatus = enforceRateLimit(clientId);
  if (!rateStatus.allowed) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil(rateStatus.retryAfterMs / 1000)
    );
    logStructured("warn", "Rate limit exceeded", {
      correlationId,
      clientId,
      retryAfterMs: rateStatus.retryAfterMs,
    });
    return respondWithError(
      RATE_LIMIT_MESSAGE,
      429,
      { ...baseHeaders, "Retry-After": `${retryAfterSeconds}` },
      correlationId
    );
  }

  try {
    const json = await req.json();
    const parsed = ManifestacaoRequestDTOSchema.safeParse(json);
    if (!parsed.success) {
      logStructured("warn", "Validation failed", {
        correlationId,
        issues: parsed.error.issues,
      });
      return respondWithError("Requisicao invalida", 400, baseHeaders, correlationId);
    }

    const dto = parsed.data as ManifestacaoRequestDTO;
    const payload = await toCguPayload(dto);
    const data = await postManifestacao(payload);

    logStructured("info", "Manifestacao forwarded", {
      correlationId,
      clientId,
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json(
      { ok: true, data },
      {
        status: 200,
        headers: baseHeaders,
      }
    );
  } catch (err) {
    const rawMessage = err instanceof Error ? err.message : "Erro desconhecido";
    const msg = sanitizeErrorMessage(rawMessage);
    const status =
      /combina[cc][aa]o.*inv[aa]lida/i.test(msg) ||
      /\d+MB|anexos|manifestante|texto/i.test(msg)
        ? 400
        : 500;

    logStructured(status === 500 ? "error" : "warn", "CGU API error", {
      correlationId,
      status,
      message: msg,
      error: err instanceof Error ? err.stack ?? err.message : String(err),
    });

    return respondWithError(msg, status, baseHeaders, correlationId);
  }
}

export async function OPTIONS(req: NextRequest) {
  const correlationId = getCorrelationId(req);
  const cors = evaluateCors(req);
  const baseHeaders = { ...cors.headers };

  if (!cors.allowed) {
    logStructured("warn", "Preflight origin not allowed", {
      correlationId,
      origin: req.headers.get("origin") ?? "none",
      reason: cors.reason,
    });
    return new NextResponse(null, {
      status: 403,
      headers: { ...baseHeaders, [CORRELATION_HEADER]: correlationId },
    });
  }

  logStructured("info", "Preflight ok", {
    correlationId,
    origin: cors.origin ?? "same-origin",
  });

  return new NextResponse(null, {
    status: 204,
    headers: {
      ...baseHeaders,
      "Access-Control-Max-Age": "86400",
      [CORRELATION_HEADER]: correlationId,
    },
  });
}
