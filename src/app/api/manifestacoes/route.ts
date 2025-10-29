import { NextRequest, NextResponse } from "next/server";
import { toCguPayload } from "@/src/lib/cgu/utils";
import { postManifestacao } from "@/src/lib/cgu/client";
import type { ManifestacaoRequestDTO } from "@/src/lib/cgu/types";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 60;
const RATE_LIMIT_MESSAGE = "Muitas solicitacoes. Tente novamente em breve.";
const rateLimitBucket = new Map<string, { count: number; expiresAt: number }>();

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

const enforceRateLimit = (identifier: string): { allowed: boolean; retryAfterMs: number } => {
  const now = Date.now();
  const entry = rateLimitBucket.get(identifier);
  if (!entry || now >= entry.expiresAt) {
    rateLimitBucket.set(identifier, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfterMs: 0 };
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, retryAfterMs: Math.max(0, entry.expiresAt - now) };
  }
  entry.count += 1;
  return { allowed: true, retryAfterMs: 0 };
};

const sanitizeErrorMessage = (input: string): string => {
  const normalized = input.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim();
  const fallback = "Erro ao processar a solicitacao.";
  return normalized ? normalized.slice(0, 200) : fallback;
};

export async function POST(req: NextRequest) {
  const clientId = getClientIdentifier(req);
  const rateStatus = enforceRateLimit(clientId);
  if (!rateStatus.allowed) {
    const retryAfterSeconds = Math.max(1, Math.ceil(rateStatus.retryAfterMs / 1000));
    return NextResponse.json(
      { ok: false, error: RATE_LIMIT_MESSAGE },
      {
        status: 429,
        headers: {
          "Retry-After": `${retryAfterSeconds}`,
        },
      },
    );
  }

  try {
    const dto = (await req.json()) as ManifestacaoRequestDTO;

    // Token opcional via env ou header de forward
    const token = process.env.CGU_API_TOKEN || req.headers.get("x-cgu-token") || undefined;
    const payload = await toCguPayload(dto);
    const data = await postManifestacao(payload, { token });
    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (err) {
    const rawMessage = err instanceof Error ? err.message : "Erro desconhecido";
    const msg = sanitizeErrorMessage(rawMessage);
    const status = /combina[cc][aa]o.*inv[aa]lida/i.test(msg) || /\d+MB|anexos|manifestante|texto/i.test(msg) ? 400 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}


