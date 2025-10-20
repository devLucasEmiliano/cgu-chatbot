import { gzip } from "zlib";
import { promisify } from "util";
import { fileTypeFromBuffer } from "file-type";
import type { AnexoInput, AnexoPayload, ManifestacaoPayloadMinimo, ManifestacaoRequestDTO } from "./types";

export const MAX_FILES = 10;
export const MAX_FILE_BYTES = 30 * 1024 * 1024; // 30 MB processados por arquivo (limite Falabr individual)
export const MAX_TOTAL_BYTES = 30 * 1024 * 1024; // 30 MB no total (regra Fala.BR)
export const ALLOWED_EXT = [
  ".pdf", ".doc", ".docx", ".txt",
  ".xls", ".xlsx",
  ".png", ".jpg", ".jpeg",
  ".mp3",
  ".mp4", ".avi",
];
export const TEXTO_MAX_CHARS = 8000;
const MAX_BASE64_LENGTH = Math.ceil((MAX_FILE_BYTES / 3)) * 4; // falha cedo para blobs Base64 grandes
const gzipAsync = promisify(gzip);
const ALLOWED_MIME_BY_EXT: Record<string, readonly string[]> = {
  ".pdf": ["application/pdf"],
  ".doc": ["application/msword"],
  ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  ".txt": ["text/plain"],
  ".xls": ["application/vnd.ms-excel"],
  ".xlsx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  ".png": ["image/png"],
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".mp3": ["audio/mpeg"],
  ".mp4": ["video/mp4"],
  ".avi": ["video/x-msvideo", "video/avi"],
};
const EXT_ALLOWING_UNKNOWN_MAGIC = new Set<string>([".txt"]);

const getExtension = (name: string): string => {
  const idx = name.lastIndexOf(".");
  return idx >= 0 ? name.slice(idx).toLowerCase() : "";
};

// Matriz de permissÃµes TipoManifestacao -> Tipos de FormulÃ¡rio aceitos
// Baseado na tabela fornecida pelo usuÃ¡rio
const FORM_MAP: Record<number, number[]> = {
  1: [4], // DenÃºncia -> DenÃºncia
  2: [1], // ReclamaÃ§Ã£o -> PadrÃ£o
  3: [1], // Elogio -> PadrÃ£o
  4: [1], // SugestÃ£o -> PadrÃ£o
  5: [1], // SolicitaÃ§Ã£o -> PadrÃ£o
  6: [],   // NÃ£o classificada
  7: [],   // ComunicaÃ§Ã£o (nÃ£o lista formulÃ¡rio)
  8: [],   // Acesso Ã  InformaÃ§Ã£o
  9: [2], // Simplifique -> Simplifique
};

export function validarParTipoFormulario(idTipoManifestacao: number, idTipoFormulario: number): { valido: boolean; motivo?: string } {
  const permitidos = FORM_MAP[idTipoManifestacao] ?? [];
  if (permitidos.length === 0) {
    // Alguns tipos nÃ£o listam formulÃ¡rio; manter flexÃ­vel e sinalizar ao chamador
    return { valido: permitidos.includes(idTipoFormulario), motivo: permitidos.length ? undefined : "Tipo de manifestaÃ§Ã£o sem formulÃ¡rio listado; confirmar polÃ­tica da API." };
  }
  if (!permitidos.includes(idTipoFormulario)) {
    return {
      valido: false,
      motivo: `CombinaÃ§Ã£o invÃ¡lida: IdTipoManifestacao=${idTipoManifestacao} nÃ£o permite IdTipoFormulario=${idTipoFormulario}. Permitidos: ${permitidos.join(", ")}`,
    };
  }
  return { valido: true };
}

export function buildTextoManifestacao(params: { paisNaturalidade?: string; linguagem?: string; numeroUnfccc?: string | null; textoUsuario: string; }): string {
  const { paisNaturalidade, linguagem, numeroUnfccc, textoUsuario } = params;
  const linha1 = "ManifestaÃ§Ã£o recebida no Ã¢mbito da COP30.";
  const linha2 = `PaÃ­s/Naturalidade selecionado: ${paisNaturalidade || "NÃ£o Informado"}`;
  const linha3 = `Linguagem selecionada: ${linguagem || "NÃ£o Informado"}`;
  const linha4 = `NÃºmero de inscriÃ§Ã£o UNFCCC: ${(numeroUnfccc && numeroUnfccc.trim()) ? numeroUnfccc.trim() : "NÃ£o Informado"}`;
  const header = [linha1, linha2, linha3, linha4].join("\n") + "\n";

  const normalizar = (s: string) => s.replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\uFFFF]/g, "");
  const headerNorm = normalizar(header);
  const restante = TEXTO_MAX_CHARS - headerNorm.length;

  let corpo = normalizar(textoUsuario || "");
  if (restante <= 0) return headerNorm.slice(0, TEXTO_MAX_CHARS);
  if (corpo.length > restante) {
    const ellipsis = "â€¦";
    corpo = corpo.slice(0, Math.max(0, restante - ellipsis.length)) + ellipsis;
  }
  return headerNorm + corpo;
}

export function validarAnexos(entradas: AnexoInput[] = []): void {
  if (entradas.length > MAX_FILES) {
    throw new Error(`MÃ¡ximo de ${MAX_FILES} anexos. Recebidos: ${entradas.length}`);
  }
  let total = 0;
  for (const a of entradas) {
    total += a.TamanhoArquivo || 0;
    if (a.TamanhoArquivo > MAX_FILE_BYTES) {
      throw new Error(`Arquivo ${a.NomeArquivo} excede ${MAX_FILE_BYTES / (1024 * 1024)}MB (${a.TamanhoArquivo} bytes)`);
    }
    const ext = getExtension(a.NomeArquivo || "");
    if (!ALLOWED_EXT.includes(ext)) {
      throw new Error(`Tipo de arquivo nÃ£o permitido: ${a.NomeArquivo || "(sem nome)"}`);
    }
  }
  if (total > MAX_TOTAL_BYTES) {
    throw new Error(`Soma dos anexos excede ${MAX_TOTAL_BYTES / (1024 * 1024)}MB (${total} bytes)`);
  }
}

export function base64ToBuffer(b64: string): Buffer {
  // Suporta Base64 padrÃ£o; caso venha com prefixo data: remover
  const clean = b64.replace(/^data:.*;base64,/, "");
  if (clean.length > MAX_BASE64_LENGTH) {
    throw new Error(`Arquivo Base64 excede o limite de ${MAX_FILE_BYTES / (1024 * 1024)}MB.`);
  }
  const buf = Buffer.from(clean, "base64");
  if (buf.length > MAX_FILE_BYTES) {
    throw new Error(`Arquivo decodificado excede o limite de ${MAX_FILE_BYTES / (1024 * 1024)}MB.`);
  }
  return buf;
}

export async function anexosToPayload(anexos: AnexoInput[] = []): Promise<AnexoPayload[]> {
  const payloads: AnexoPayload[] = [];
  let totalBytes = 0;

  for (const a of anexos) {
    const buf = base64ToBuffer(a.ConteudoBase64);
    totalBytes += buf.length;
    if (totalBytes > MAX_TOTAL_BYTES) {
      throw new Error(`Soma dos anexos excede ${MAX_TOTAL_BYTES / (1024 * 1024)}MB (${totalBytes} bytes).`);
    }
    const ext = getExtension(a.NomeArquivo || "");
    const allowedMimes = ALLOWED_MIME_BY_EXT[ext] ?? [];
    const detectedMime = (await fileTypeFromBuffer(buf))?.mime;
    if (detectedMime) {
      if (!allowedMimes.includes(detectedMime)) {
        throw new Error(`Arquivo ${a.NomeArquivo} apresenta tipo MIME ${detectedMime} não permitido.`);
      }
    } else if (!EXT_ALLOWING_UNKNOWN_MAGIC.has(ext)) {
      throw new Error(`Não foi possível verificar o tipo do arquivo ${a.NomeArquivo}.`);
    }
    const gz = await gzipAsync(buf);
    const b64gz = gz.toString("base64");
    payloads.push({
      NomeArquivo: a.NomeArquivo,
      ConteudoZipadoEBase64: b64gz,
      TamanhoArquivo: buf.length,
      IdAws: "",
      IdAnexoGenerico: 1,
    });
  }

  return payloads;
}

export async function toCGUPayload(dto: ManifestacaoRequestDTO) {
  // Mapeamento robusto com base em tipoChave (se fornecido) e variÃ¡veis de ambiente para override
  const mapFromKey: Record<string, { tipo: number; form: number }> = {
    report: { tipo: 1, form: 4 },
    complaint: { tipo: 2, form: 1 },
    compliment: { tipo: 3, form: 1 },
    suggestion: { tipo: 4, form: 1 },
    request: { tipo: 5, form: 1 },
  };

  const fromEnv = (name: string): number | undefined => {
    const v = process.env[name];
    if (!v) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  let idTipoManifestacao = dto.idTipoManifestacao;
  let idTipoFormulario = dto.idTipoFormulario;

  if (dto.tipoChave && mapFromKey[dto.tipoChave]) {
    // Se o front mandou a chave, prioriza mapeamento estÃ¡vel e nÃ£o sobrescreve por env
    idTipoManifestacao = mapFromKey[dto.tipoChave].tipo;
    idTipoFormulario = mapFromKey[dto.tipoChave].form;
  } else {
    // Sem chave explÃ­cita, permite override por ambiente
    idTipoManifestacao = fromEnv("CGU_ID_TIPO_MANIFESTACAO") ?? idTipoManifestacao;
    idTipoFormulario = fromEnv("CGU_ID_TIPO_FORMULARIO") ?? idTipoFormulario;
  }

  const valid = validarParTipoFormulario(idTipoManifestacao, idTipoFormulario);
  if (!valid.valido) {
    throw new Error(valid.motivo || "CombinaÃ§Ã£o de tipo/formulÃ¡rio invÃ¡lida");
  }

  validarAnexos(dto.anexos);
  const anexosProcessados = await anexosToPayload(dto.anexos);

  const TextoManifestacao = buildTextoManifestacao({
    paisNaturalidade: dto.paisNaturalidade,
    linguagem: dto.linguagem,
    numeroUnfccc: dto.numeroUnfccc,
    textoUsuario: dto.textoUsuario,
  });

  // Resolver IDs configurÃ¡veis: prioriza valor vindo do DTO; se ausente, usa env no servidor
  const parseEnvInt = (name: string): number | undefined => {
    const raw = process.env[name];
    if (!raw) return undefined;
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  };

  const efetivoIdOuvidoriaDestino = dto.idOuvidoriaDestino ?? parseEnvInt("CGU_ID_OUVIDORIA_DESTINO");
  const efetivoIdModoResposta = dto.idModoResposta ?? parseEnvInt("CGU_ID_MODO_RESPOSTA");

  if (efetivoIdOuvidoriaDestino == null) {
    throw new Error("IdOuvidoriaDestino nÃ£o informado e variÃ¡vel de ambiente CGU_ID_OUVIDORIA_DESTINO nÃ£o definida.");
  }
  if (efetivoIdModoResposta == null) {
    throw new Error("IdModoResposta nÃ£o informado e variÃ¡vel de ambiente CGU_ID_MODO_RESPOSTA nÃ£o definida.");
  }

  const payload: ManifestacaoPayloadMinimo = {
    IdTipoFormulario: idTipoFormulario,
    IdTipoManifestacao: idTipoManifestacao,
    IdOuvidoriaDestino: efetivoIdOuvidoriaDestino,
    TextoManifestacao,
    Anexos: anexosProcessados,
    IdModoResposta: efetivoIdModoResposta,
    IdTipoIdentificacaoManifestante: dto.idTipoIdentificacaoManifestante,
  };

  if (dto.manifestante) {
    payload.Manifestante = {
      IdPais: dto.manifestante.idPais,
      Nome: dto.manifestante.nome,
      Email: dto.manifestante.email,
    };
  }

  return payload;
}

