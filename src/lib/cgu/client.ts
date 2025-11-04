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

const getBaseUrl = (): string => {
  const envUrl = process.env.CGU_API_BASE_URL?.trim();
  if (!envUrl || envUrl.startsWith('SECRET_')) {
    return "https://treinafalabr.cgu.gov.br";
  }
  return envUrl;
};

const BASE_URL = validateFalaBrURL(getBaseUrl());
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

const AUTH_TOKEN = (() => {
  const token = process.env.CGU_API_TOKEN?.trim();
  return (token && !token.startsWith('SECRET_')) ? token : undefined;
})();

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
    
    if (!res.ok) {
      let errorMessage = res.statusText || "Erro ao enviar manifestacao";
      
      if (text) {
        try {
          const parsed = JSON.parse(text);
          if (parsed && typeof parsed === "object") {
            const obj = parsed as Record<string, unknown>;
            errorMessage = (obj["message"] as string) || (obj["Message"] as string) || errorMessage;
          }
        } catch {
          if (text.length < 200 && !text.includes('<')) {
            errorMessage = text;
          }
        }
      }
      
      throw new Error(`CGU API ${res.status}: ${errorMessage}`);
    }
    
    let parsed: unknown = {};
    try { 
      parsed = text ? JSON.parse(text) : {}; 
    } catch { 
      throw new Error(`Resposta inválida da CGU API: não é JSON válido`);
    }
    return (parsed ?? {}) as CGUResponse;
  } finally {
    clearTimeout(timeout);
  }
}


