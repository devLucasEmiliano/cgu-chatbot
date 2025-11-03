import type { CGUResponse, ManifestacaoPayloadMinimo } from "./types";

const ALLOWED_HOSTS = new Set([
  "treinafalabr.cgu.gov.br",
  "falabr.cgu.gov.br"
]);

const validateFalaBrURL = (url: string): string => {
  try {
    const parsed = new URL(url);
    if (!ALLOWED_HOSTS.has(parsed.hostname)) {
      throw new Error(`URL não permitida: ${parsed.hostname}`);
    }
    if (parsed.protocol !== "https:") {
      throw new Error("Necessário HTTPS");
    }
    return url;
  } catch (error) {
    throw new Error(`URL do FalaBR inválida: ${error instanceof Error ? error.message : 'Erro desconhecido!'}`);
  }
};

const BASE_URL = validateFalaBrURL(
  process.env.CGU_API_BASE_URL || "https://treinafalabr.cgu.gov.br"
);
const API_PATH = "/api/manifestacoes";
const DEFAULT_TIMEOUT_MS = (() => {
  const raw = process.env.CGU_API_TIMEOUT_MS?.trim();
  if (!raw) {
    return 60000;
  }
  const parsed = Number(raw);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return 60000;
})();

const AUTH_TOKEN = process.env.CGU_API_TOKEN?.trim() || undefined;

export async function postManifestacao(
  payload: ManifestacaoPayloadMinimo,
  opts?: { timeoutMs?: number }
): Promise<CGUResponse> {
  const controller = new AbortController();
  const effectiveTimeout =
    typeof opts?.timeoutMs === "number" && opts.timeoutMs > 0 ? opts.timeoutMs : DEFAULT_TIMEOUT_MS;
  const timeout = setTimeout(() => controller.abort(), effectiveTimeout);
  try {
    const res = await fetch(`${BASE_URL}${API_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const text = await res.text();
    let parsed: unknown = {};
    try { parsed = text ? JSON.parse(text) : {}; } catch { parsed = { raw: text } as unknown; }

    if (!res.ok) {
      const obj = (parsed && typeof parsed === "object") ? (parsed as Record<string, unknown>) : {};
      const message = (obj["message"] as string) || (obj["Message"] as string) || res.statusText || "Erro ao enviar manifestacao";
      throw new Error(`CGU API ${res.status}: ${message}`);
    }
    return (parsed ?? {}) as CGUResponse;
  } finally {
    clearTimeout(timeout);
  }
}


