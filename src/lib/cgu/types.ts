export interface AnexoInput {
  NomeArquivo: string;
  ConteudoBase64: string; // conteúdo original em Base64
  TamanhoArquivo: number; // bytes do arquivo original
}

export interface AnexoPayload {
  NomeArquivo: string;
  ConteudoZipadoEBase64: string;
  TamanhoArquivo: number; // bytes do arquivo original
  IdAws?: string;
  IdAnexoGenerico?: number;
}

export interface ManifestantePayload {
  IdPais: number;
  Nome: string;
  Email: string;
}

// Payload mínimo atualmente utilizado para POST da CGU
export interface ManifestacaoPayloadMinimo {
  IdTipoFormulario: number;
  IdTipoManifestacao: number;
  IdOuvidoriaDestino: number;
  TextoManifestacao: string;
  Anexos?: AnexoPayload[];
  IdModoResposta: number;
  IdTipoIdentificacaoManifestante: number;
  Manifestante?: ManifestantePayload; // obrigatório quando identificado
}

// DTO de entrada no nosso endpoint interno (mais amigável ao front)
export interface ManifestacaoRequestDTO {
  idTipoFormulario: number;
  idTipoManifestacao: number;
  idOuvidoriaDestino: number;
  idModoResposta: number;
  idTipoIdentificacaoManifestante: number;
  manifestante?: {
    idPais: number;
    nome: string;
    email: string;
  };
  paisNaturalidade?: string;
  linguagem?: string;
  numeroUnfccc?: string | null;
  textoUsuario: string;
  anexos?: AnexoInput[];
}

export interface CGUResponse {
  // Estrutura genérica; mantenha flexível pois a API pode retornar protocolo e outros campos
  NumProtocolo?: string;
  [key: string]: unknown;
}
