import { gzipSync } from "zlib";
import type { AnexoInput, AnexoPayload, ManifestacaoPayloadMinimo, ManifestacaoRequestDTO } from "./types";

export const MAX_FILES = 10;
export const MAX_FILE_BYTES = 30 * 1024 * 1024; // 30 MB por arquivo (proteção adicional)
export const MAX_TOTAL_BYTES = 30 * 1024 * 1024; // 30 MB no total (regra Fala.BR)
export const ALLOWED_EXT = [
  ".pdf", ".doc", ".docx", ".txt",
  ".xls", ".xlsx",
  ".png", ".jpg", ".jpeg",
  ".mp3",
  ".mp4", ".avi",
];
export const TEXTO_MAX_CHARS = 8000;

// Matriz de permissões TipoManifestacao -> Tipos de Formulário aceitos
// Baseado na tabela fornecida pelo usuário
const FORM_MAP: Record<number, number[]> = {
  1: [4], // Denúncia -> Denúncia
  2: [1], // Reclamação -> Padrão
  3: [1], // Elogio -> Padrão
  4: [1], // Sugestão -> Padrão
  5: [1], // Solicitação -> Padrão
  6: [],   // Não classificada
  7: [],   // Comunicação (não lista formulário)
  8: [],   // Acesso à Informação
  9: [2], // Simplifique -> Simplifique
};

export function validarParTipoFormulario(idTipoManifestacao: number, idTipoFormulario: number): { valido: boolean; motivo?: string } {
  const permitidos = FORM_MAP[idTipoManifestacao] ?? [];
  if (permitidos.length === 0) {
    // Alguns tipos não listam formulário; manter flexível e sinalizar ao chamador
    return { valido: permitidos.includes(idTipoFormulario), motivo: permitidos.length ? undefined : "Tipo de manifestação sem formulário listado; confirmar política da API." };
  }
  if (!permitidos.includes(idTipoFormulario)) {
    return {
      valido: false,
      motivo: `Combinação inválida: IdTipoManifestacao=${idTipoManifestacao} não permite IdTipoFormulario=${idTipoFormulario}. Permitidos: ${permitidos.join(", ")}`,
    };
  }
  return { valido: true };
}

export function buildTextoManifestacao(params: { paisNaturalidade?: string; linguagem?: string; numeroUnfccc?: string | null; textoUsuario: string; }): string {
  const { paisNaturalidade, linguagem, numeroUnfccc, textoUsuario } = params;
  const linha1 = "Manifestação recebida no âmbito da COP30.";
  const linha2 = `País/Naturalidade selecionado: ${paisNaturalidade || "Não Informado"}`;
  const linha3 = `Linguagem selecionada: ${linguagem || "Não Informado"}`;
  const linha4 = `Número de inscrição UNFCCC: ${(numeroUnfccc && numeroUnfccc.trim()) ? numeroUnfccc.trim() : "Não Informado"}`;
  const header = [linha1, linha2, linha3, linha4].join("\n") + "\n";

  const normalizar = (s: string) => s.replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\uFFFF]/g, "");
  const headerNorm = normalizar(header);
  const restante = TEXTO_MAX_CHARS - headerNorm.length;

  let corpo = normalizar(textoUsuario || "");
  if (restante <= 0) return headerNorm.slice(0, TEXTO_MAX_CHARS);
  if (corpo.length > restante) {
    const ellipsis = "…";
    corpo = corpo.slice(0, Math.max(0, restante - ellipsis.length)) + ellipsis;
  }
  return headerNorm + corpo;
}

export function validarAnexos(entradas: AnexoInput[] = []): void {
  if (entradas.length > MAX_FILES) {
    throw new Error(`Máximo de ${MAX_FILES} anexos. Recebidos: ${entradas.length}`);
  }
  const getExt = (name: string) => {
    const i = name.lastIndexOf(".");
    return i >= 0 ? name.slice(i).toLowerCase() : "";
  };
  let total = 0;
  for (const a of entradas) {
    total += a.TamanhoArquivo || 0;
    if (a.TamanhoArquivo > MAX_FILE_BYTES) {
      throw new Error(`Arquivo ${a.NomeArquivo} excede 30MB (${a.TamanhoArquivo} bytes)`);
    }
    const ext = getExt(a.NomeArquivo || "");
    if (!ALLOWED_EXT.includes(ext)) {
      throw new Error(`Tipo de arquivo não permitido: ${a.NomeArquivo || "(sem nome)"}`);
    }
  }
  if (total > MAX_TOTAL_BYTES) {
    throw new Error(`Soma dos anexos excede 30MB (${total} bytes)`);
  }
}

export function base64ToBuffer(b64: string): Buffer {
  // Suporta Base64 padrão; caso venha com prefixo data: remover
  const clean = b64.replace(/^data:.*;base64,/, "");
  return Buffer.from(clean, "base64");
}

export function anexosToPayload(anexos: AnexoInput[] = []): AnexoPayload[] {
  return anexos.map((a) => {
    const buf = base64ToBuffer(a.ConteudoBase64);
    const gz = gzipSync(buf);
    const b64gz = gz.toString("base64");
    return {
      NomeArquivo: a.NomeArquivo,
      ConteudoZipadoEBase64: b64gz,
      TamanhoArquivo: a.TamanhoArquivo,
      IdAws: "",
      IdAnexoGenerico: 1,
    };
  });
}

export function toCGUPayload(dto: ManifestacaoRequestDTO) {
  const { idTipoFormulario, idTipoManifestacao } = dto;
  const valid = validarParTipoFormulario(idTipoManifestacao, idTipoFormulario);
  if (!valid.valido) {
    throw new Error(valid.motivo || "Combinação de tipo/formulário inválida");
  }

  validarAnexos(dto.anexos);

  const TextoManifestacao = buildTextoManifestacao({
    paisNaturalidade: dto.paisNaturalidade,
    linguagem: dto.linguagem,
    numeroUnfccc: dto.numeroUnfccc,
    textoUsuario: dto.textoUsuario,
  });

  // Resolver IDs configuráveis: prioriza valor vindo do DTO; se ausente, usa env no servidor
  const parseEnvInt = (name: string): number | undefined => {
    const raw = process.env[name];
    if (!raw) return undefined;
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  };

  const efetivoIdOuvidoriaDestino = dto.idOuvidoriaDestino ?? parseEnvInt("CGU_ID_OUVIDORIA_DESTINO");
  const efetivoIdModoResposta = dto.idModoResposta ?? parseEnvInt("CGU_ID_MODO_RESPOSTA");

  if (efetivoIdOuvidoriaDestino == null) {
    throw new Error("IdOuvidoriaDestino não informado e variável de ambiente CGU_ID_OUVIDORIA_DESTINO não definida.");
  }
  if (efetivoIdModoResposta == null) {
    throw new Error("IdModoResposta não informado e variável de ambiente CGU_ID_MODO_RESPOSTA não definida.");
  }

  const payload: ManifestacaoPayloadMinimo = {
    IdTipoFormulario: dto.idTipoFormulario,
    IdTipoManifestacao: dto.idTipoManifestacao,
    IdOuvidoriaDestino: efetivoIdOuvidoriaDestino,
    TextoManifestacao,
    Anexos: anexosToPayload(dto.anexos),
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
