import { z } from "zod";

export const AnexoInputSchema = z.object({
  NomeArquivo: z.string().min(1),
  ConteudoBase64: z.string().min(1),
  TamanhoArquivo: z.number().int().nonnegative(),
});

export const ManifestacaoRequestDTOSchema = z.object({
  tipoChave: z.string().trim().min(1).optional(),
  idTipoFormulario: z.number().int(),
  idTipoManifestacao: z.number().int(),
  idOuvidoriaDestino: z.number().int().optional(),
  idModoResposta: z.number().int().optional(),
  idTipoIdentificacaoManifestante: z.number().int(),
  manifestante: z
    .object({
      idPais: z.number().int(),
      nome: z.string().trim().min(1),
      email: z.string().email(),
    })
    .optional(),
  paisNaturalidade: z.string().optional(),
  linguagem: z.string().optional(),
  numeroUnfccc: z.string().trim().min(1).nullable().optional(),
  textoUsuario: z.string().trim().min(1),
  anexos: z.array(AnexoInputSchema).max(10).optional(),
});

export type ManifestacaoRequestDTOInput = z.infer<
  typeof ManifestacaoRequestDTOSchema
>;
