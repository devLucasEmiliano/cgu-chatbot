import { gzip } from "zlib";
import { promisify } from "util";
import { fileTypeFromBuffer } from "file-type";
import type {
  AnexoInput,
  AnexoPayload,
  ManifestacaoPayloadMinimo,
  ManifestacaoRequestDTO,
} from "./types";

export const maxFiles = 10;
export const maxFileBytes = 30 * 1024 * 1024; // 30 MB processed per file (Falabr individual limit)
export const maxTotalBytes = 30 * 1024 * 1024; // 30 MB total (Fala.BR rule)
export const allowedExtensions = [
  ".pdf",
  ".doc",
  ".docx",
  ".txt",
  ".xls",
  ".xlsx",
  ".png",
  ".jpg",
  ".jpeg",
  ".mp3",
  ".mp4",
  ".avi",
];
export const maxTextChars = 8000;
const maxBase64Length = Math.ceil(maxFileBytes / 3) * 4; // fail fast for oversized Base64 blobs
const gzipAsync = promisify(gzip);
const allowedMimeByExtension: Record<string, readonly string[]> = {
  ".pdf": ["application/pdf"],
  ".doc": ["application/msword"],
  ".docx": [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  ".txt": ["text/plain"],
  ".xls": ["application/vnd.ms-excel"],
  ".xlsx": [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  ".png": ["image/png"],
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".mp3": ["audio/mpeg"],
  ".mp4": ["video/mp4"],
  ".avi": ["video/x-msvideo", "video/avi"],
};
const extensionsAllowingUnknownMagic = new Set<string>([".txt"]);

const getFileExtension = (name: string): string => {
  const lastDotIndex = name.lastIndexOf(".");
  return lastDotIndex >= 0 ? name.slice(lastDotIndex).toLowerCase() : "";
};

// ManifestationType -> accepted form types matrix (mirrors the table shared by the client)
const formTypeMatrix: Record<number, number[]> = {
  1: [4], // Report -> Report form
  2: [1], // Complaint -> Standard form
  3: [1], // Compliment -> Standard form
  4: [1], // Suggestion -> Standard form
  5: [1], // Request -> Standard form
  6: [], // Unclassified
  7: [], // Communication (no form listed)
  8: [], // Access to Information
  9: [2], // Simplifique -> Simplifique form
};

export function validateFormTypePair(
  manifestationTypeId: number,
  formTypeId: number
): { valid: boolean; reason?: string } {
  const allowedForms = formTypeMatrix[manifestationTypeId] ?? [];
  if (allowedForms.length === 0) {
    return {
      valid: allowedForms.includes(formTypeId),
      reason: allowedForms.length
        ? undefined
        : "Manifestation type does not list accepted forms; confirm API policy.",
    };
  }
  if (!allowedForms.includes(formTypeId)) {
    return {
      valid: false,
      reason: `Invalid combination: manifestationTypeId=${manifestationTypeId} does not allow formTypeId=${formTypeId}. Allowed values: ${allowedForms.join(
        ", "
      )}`,
    };
  }
  return { valid: true };
}

export function buildManifestationText(params: {
  paisNaturalidade?: string;
  linguagem?: string;
  numeroUnfccc?: string | null;
  textoUsuario: string;
}): string {
  const {
    paisNaturalidade: countryOrNationality,
    linguagem: language,
    numeroUnfccc: unfcccNumber,
    textoUsuario: userText,
  } = params;

  const line1 = "Manifestação recebida no âmbito da COP30.";
  const line2 = `País/Naturalidade selecionado: ${
    countryOrNationality || "Não informado"
  }`;
  const line3 = `Linguagem selecionada: ${language || "Não informado"}`;
  const line4 = `Número de inscrição UNFCCC: ${
    unfcccNumber?.trim() || "Não informado"
  }`;
  const header = [line1, line2, line3, line4].join("\n") + "\n";

  const normalize = (value: string) =>
    value.replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\uFFFF]/g, "");
  const normalizedHeader = normalize(header);
  const remainingCharacters = maxTextChars - normalizedHeader.length;

  let body = normalize(userText || "");
  if (remainingCharacters <= 0) {
    return normalizedHeader.slice(0, maxTextChars);
  }
  if (body.length > remainingCharacters) {
    const ellipsis = "...";
    body =
      body.slice(0, Math.max(0, remainingCharacters - ellipsis.length)) +
      ellipsis;
  }
  return normalizedHeader + body;
}

export function validateAttachments(attachments: AnexoInput[] = []): void {
  if (attachments.length > maxFiles) {
    throw new Error(
      `Maximum of ${maxFiles} attachments. Received: ${attachments.length}.`
    );
  }
  let totalBytes = 0;
  for (const attachment of attachments) {
    const fileSize = attachment.TamanhoArquivo ?? 0;
    totalBytes += fileSize;
    if (fileSize > maxFileBytes) {
      throw new Error(
        `File ${attachment.NomeArquivo} exceeds ${
          maxFileBytes / (1024 * 1024)
        }MB (${fileSize} bytes).`
      );
    }
    const extension = getFileExtension(attachment.NomeArquivo || "");
    if (!allowedExtensions.includes(extension)) {
      throw new Error(
        `File type not allowed: ${attachment.NomeArquivo || "(no name)"}.`
      );
    }
  }
  if (totalBytes > maxTotalBytes) {
    throw new Error(
      `Total attachment size exceeds ${
        maxTotalBytes / (1024 * 1024)
      }MB (${totalBytes} bytes).`
    );
  }
}

export function base64ToBuffer(base64: string): Buffer {
  // Supports standard Base64; strip data URI prefix when present
  const clean = base64.replace(/^data:.*;base64,/, "");
  if (clean.length > maxBase64Length) {
    throw new Error(
      `Base64 file exceeds the limit of ${maxFileBytes / (1024 * 1024)}MB.`
    );
  }
  const buffer = Buffer.from(clean, "base64");
  if (buffer.length > maxFileBytes) {
    throw new Error(
      `Decoded file exceeds the limit of ${maxFileBytes / (1024 * 1024)}MB.`
    );
  }
  return buffer;
}

export async function attachmentsToPayload(
  attachments: AnexoInput[] = []
): Promise<AnexoPayload[]> {
  const payloads: AnexoPayload[] = [];
  let totalBytes = 0;

  for (const attachment of attachments) {
    const buffer = base64ToBuffer(attachment.ConteudoBase64);
    totalBytes += buffer.length;
    if (totalBytes > maxTotalBytes) {
      throw new Error(
        `Total attachment size exceeds ${
          maxTotalBytes / (1024 * 1024)
        }MB (${totalBytes} bytes).`
      );
    }
    const extension = getFileExtension(attachment.NomeArquivo || "");
    const allowedMimes = allowedMimeByExtension[extension] ?? [];
    const detectedMime = (await fileTypeFromBuffer(buffer))?.mime;
    if (detectedMime) {
      if (!allowedMimes.includes(detectedMime)) {
        throw new Error(
          `File ${attachment.NomeArquivo} reports MIME type ${detectedMime}, which is not allowed.`
        );
      }
    } else if (!extensionsAllowingUnknownMagic.has(extension)) {
      throw new Error(
        `Unable to verify the type of file ${attachment.NomeArquivo}.`
      );
    }
    const gzipped = await gzipAsync(buffer);
    const gzippedBase64 = gzipped.toString("base64");
    payloads.push({
      NomeArquivo: attachment.NomeArquivo,
      ConteudoZipadoEBase64: gzippedBase64,
      TamanhoArquivo: buffer.length,
      IdAws: "",
      IdAnexoGenerico: 1,
    });
  }

  return payloads;
}

export async function toCguPayload(dto: ManifestacaoRequestDTO) {
  // Leverage the stable key mapping first; environment variables act as fallbacks
  const manifestationTypeByKey: Record<string, { type: number; form: number }> =
    {
      report: { type: 1, form: 4 },
      complaint: { type: 2, form: 1 },
      compliment: { type: 3, form: 1 },
      suggestion: { type: 4, form: 1 },
      request: { type: 5, form: 1 },
    };

  const readEnvNumber = (name: string): number | undefined => {
    const value = process.env[name];
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  let manifestationTypeId = dto.idTipoManifestacao;
  let formTypeId = dto.idTipoFormulario;

  if (dto.tipoChave && manifestationTypeByKey[dto.tipoChave]) {
    // When the key is provided by the client, trust the mapping and do not override via env
    manifestationTypeId = manifestationTypeByKey[dto.tipoChave].type;
    formTypeId = manifestationTypeByKey[dto.tipoChave].form;
  } else {
    // Without an explicit key, allow environment overrides
    manifestationTypeId =
      readEnvNumber("CGU_ID_TIPO_MANIFESTACAO") ?? manifestationTypeId;
    formTypeId = readEnvNumber("CGU_ID_TIPO_FORMULARIO") ?? formTypeId;
  }

  const validation = validateFormTypePair(manifestationTypeId, formTypeId);
  if (!validation.valid) {
    throw new Error(
      validation.reason || "Invalid manifestation/form combination."
    );
  }

  validateAttachments(dto.anexos);
  const processedAttachments = await attachmentsToPayload(dto.anexos);

  const manifestationText = buildManifestationText({
    paisNaturalidade: dto.paisNaturalidade,
    linguagem: dto.linguagem,
    numeroUnfccc: dto.numeroUnfccc,
    textoUsuario: dto.textoUsuario,
  });

  // Resolve configurable IDs: prefer the DTO, fall back to server-side environment variables
  const parseEnvInteger = (name: string): number | undefined => {
    const raw = process.env[name];
    if (!raw) return undefined;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const resolvedDestinationOmbudsmanId =
    dto.idOuvidoriaDestino ?? parseEnvInteger("CGU_ID_OUVIDORIA_DESTINO");
  const resolvedResponseModeId =
    dto.idModoResposta ?? parseEnvInteger("CGU_ID_MODO_RESPOSTA");

  if (resolvedDestinationOmbudsmanId == null) {
    throw new Error(
      "Destination ombudsman ID not provided and CGU_ID_OUVIDORIA_DESTINO environment variable is not set."
    );
  }
  if (resolvedResponseModeId == null) {
    throw new Error(
      "Response mode ID not provided and CGU_ID_MODO_RESPOSTA environment variable is not set."
    );
  }

  const payload: ManifestacaoPayloadMinimo = {
    IdTipoFormulario: formTypeId,
    IdTipoManifestacao: manifestationTypeId,
    IdOuvidoriaDestino: resolvedDestinationOmbudsmanId,
    TextoManifestacao: manifestationText,
    Anexos: processedAttachments,
    IdModoResposta: resolvedResponseModeId,
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
