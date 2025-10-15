# CGU Chatbot

Aplicacao web criada para receber manifestacoes relacionadas a COP30 e encaminha-las automaticamente a Controladoria-Geral da Uniao (CGU) via Plataforma Fala.BR. O fluxo conduz o usuario desde a escolha do idioma ate o envio dos dados e retorno do protocolo, garantindo acessibilidade, validacoes e suporte a anexos.

## Principais funcionalidades
- Experiencia guiada em etapas: selecao de idioma -> aceite de termos -> preenchimento via chatbot -> tela de confirmacao.
- Suporte a tres idiomas (pt-BR, en, es) com persistencia de preferencias no navegador.
- Termos de uso multilingues e checagem obrigatoria antes de prosseguir.
- Chatbot stateful com prompts encadeados, validacoes de entrada e sugestao de botoes rapidos.
- Upload de ate 10 anexos (total 30 MB) com compactacao GZIP antes do envio.
- Integracao com a API Fala.BR (manifestacao minima) e tratamento de falhas comuns.
- Geracao de comprovante em PDF (usando jsPDF) com protocolo e prazos.

## Tecnologias
- Next.js 15 (App Router) + React 19 com componentes client/server.
- TypeScript e ESLint (config Next).
- Tailwind CSS 4 + tw-animate-css para estilos e animacoes.
- Radix UI (dropdowns, menus, etc.) e lucide-react para icones.
- React Hook Form, Zod e utilitarios customizados para validacao.

## Fluxo da experiencia
```mermaid
flowchart TD
    A([Usuario acessa a aplicacao]) --> B[Selecao de idioma]
    B --> C{Idioma escolhido?}
    C -->|Sim| D[Aceite dos termos de uso]
    C -->|Nao| B
    D --> E[Chatbot coleta dados do manifestante]
    E --> F{Ha anexos?}
    F -->|Sim| G[Upload e validacao dos arquivos<br/>(tamanho, extensao, quantidade)]
    F -->|Nao| H[Preparar payload para CGU]
    G --> H
    H --> I[Envio para API /api/manifestacoes]
    I --> J{Resposta da CGU}
    J -->|Sucesso| K[Exibir protocolo, gerar PDF e proximos passos]
    J -->|Erro| L[Mostrar mensagem e oferecer nova tentativa]
    K --> M[Usuario pode iniciar nova manifestacao]
    L --> E
```

Consulte `FLOWCHART.md` para diagramas adicionais de arquitetura, ciclo de vida e estados do chat.

## Estrutura de pastas
```text
src/
  app/             # Rotas Next.js, layout e API route de manifestacoes
  components/      # Componentes do fluxo (chatbot, termos, idioma, confirmacao) e UI primitives
  lib/             # Cliente CGU, regras de negocio, utilitarios e preferencias do usuario
public/            # Assets estaticos (icones, ilustracoes, manifest.json etc.)
```

## Pre-requisitos
- Node.js 20 LTS (ou superior compativel com Next.js 15).
- NPM 10 ou equivalente (pnpm/yarn podem ser usados, ajustando os comandos).

## Configuracao e uso
1. Instale as dependencias:
   ```bash
   npm install
   ```
2. Duplique o arquivo de variaveis:
   ```bash
   cp .env.example .env
   ```
3. Preencha o `.env` com as credenciais/IDs fornecidos pela CGU (veja tabela abaixo).
4. Inicie o ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse `http://localhost:3000` para testar o fluxo completo.

### Scripts disponiveis
- `npm run dev` - servidor Next.js em modo desenvolvimento.
- `npm run build` - build otimizado para producao.
- `npm run start` - executa a versao compilada.
- `npm run lint` - verificacao de estilo e padroes com ESLint.
- `npm run typecheck` - checagem de tipos TypeScript sem emissao.

### Variaveis de ambiente
| Nome | Descricao |
| --- | --- |
| `CGU_API_BASE_URL` | URL base da API da CGU (padrao: ambiente de treinamento `https://treinafalabr.cgu.gov.br`). |
| `CGU_API_TOKEN` | Token Bearer opcional para autenticacao na API (pode vir de proxy via header `x-cgu-token`). |
| `CGU_ID_OUVIDORIA_DESTINO` | ID da ouvidoria destino exigido pelo payload minimo. |
| `CGU_ID_MODO_RESPOSTA` | ID do modo de resposta (ex.: eletronico, postal). |

> O utilitario `toCGUPayload` valida combinacoes de tipo de manifestacao/formulario, tamanho de anexos e campos obrigatorios. Erros sao propagados para a camada de UI, permitindo feedback imediato ao usuario.

## API interna
A rota `src/app/api/manifestacoes/route.ts` recebe o `ManifestacaoRequestDTO` gerado pelo chatbot, normaliza os dados (incluindo compactacao de anexos), e envia para a API oficial via `src/lib/cgu/client.ts`. O tempo limite padrao e 30 s e a resposta da CGU e devolvida integralmente a interface.

## Proximos passos sugeridos
- Automatizar testes de integracao do fluxo (ex.: Playwright) para garantir regressao zero.
- Monitorar erros da API em producao via observabilidade (ex.: Vercel Analytics, Sentry).
- Internacionalizar textos restantes dos componentes e mensagens auxiliares.
