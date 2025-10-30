# COP30 Chatbot CGU

Aplicacao web desenvolvida em Next.js 16 para orientar participantes da COP30 no registro de manifestacoes na plataforma Fala.BR. O fluxo cobre todo o processo: escolha de idioma, aceite de termos, coleta guiada das informacoes, upload de anexos e envio seguro para a API oficial da CGU.

## Principais funcionalidades

- Atendimento trilingue (portugues, ingles e espanhol) com mensagens contextualizadas ao longo do fluxo.
- Suporte a anexos com verificacao de tamanho e extensao aceitas pela API da CGU.
- Persistencia de preferencias do usuario (idioma e aceite dos termos) no `localStorage` para reentrada rapida.
- Geracao de recibo com protocolo e dados de retorno, incluindo opcao de baixar um PDF.
- Endpoint interno `/api/manifestacoes` com CORS configuravel, limitador de taxa, correlacao de logs e sanitizacao de erros antes de encaminhar ao backend oficial.

## Arquitetura em alto nivel

- **Frontend (App Router)**: Pagina unica em `src/app/page.tsx` que controla as etapas `language`, `terms`, `chat` e `confirmation`. Componentes React ficam em `src/components`, com UI baseada em shadcn/ui e Tailwind CSS 4.
- **Backend Next.js**: Endpoint serverless em `src/app/api/manifestacoes/route.ts` (runtime Node.js) que recebe as respostas do chatbot, valida o DTO, monta o payload esperado e chama a API da CGU via `src/lib/cgu/client.ts`.
- **Biblioteca CGU**: Tipos, esquemas de validacao e utilitarios estao organizados em `src/lib/cgu`, incluindo lista de paises, normalizacao de texto e montagem do corpo da requisicao.
- **Infra de desenvolvimento**: Dockerfiles separados por ambiente (`docker/development|staging|production`) e Makefile com alvos para compilar, subir e derrubar os containers via Docker Compose.

## Requisitos

- Node.js 20 LTS (minimo 18.18) e npm 10.
- Docker e Docker Compose (opcional para executar em container).
- GNU Make (opcional; necessario apenas para usar os atalhos do Makefile).

## Configuracao de ambiente

1. Copie `.env.example` para `.env.local` e defina os valores minimos para desenvolvimento.
2. Os arquivos `.env.development.sample`, `.env.staging.sample` e `.env.production.sample` trazem modelos completos por ambiente.
3. Variaveis principais:
   - `CGU_API_BASE_URL`: URL base da API Fala.BR (padrao `https://treinafalabr.cgu.gov.br/`).
   - `CGU_API_TOKEN`: Token Bearer quando o endpoint exigir autenticacao.
   - `CGU_ID_OUVIDORIA_DESTINO`: ID da ouvidoria destino da manifestacao.
   - `CGU_ID_MODO_RESPOSTA`: ID do modo de resposta escolhido.
   - `ALLOWED_ORIGINS`: Lista separada por virgula de origens autorizadas para CORS (`http://localhost:3000` etc).

Mantenha os arquivos `.env.*` fora de controle de versao e configure-os nos ambientes de deploy (CI/CD ou servidor) conforme a politica de credenciais da CGU.

## Executando localmente com Node

```bash
npm install
npm run dev
```

A aplicacao ficara disponivel em `http://localhost:3000`.

Para inspecionar erros de tipagem e lint antes de enviar alteracoes:

```bash
npm run lint
npm run typecheck
```

Para gerar o build otimizado e testar a versao de producao:

```bash
npm run build
npm run start
```

## Executando via Docker e Makefile

1. Certifique-se de que Docker, Docker Compose e GNU Make estao instalados (no Windows, instale Make via `winget install GnuWin32.Make`, `choco install make`, Git Bash ou WSL).
2. Rode o fluxo desejado:
   - Desenvolvimento: `make build-development` e `make start-development` (acesso em `http://localhost:3001`).
   - Staging/UAT: `make build-staging` e `make start-staging` (acesso em `http://localhost:3002`).
   - Producao: `make build-production` e `make start-production` (acesso em `http://localhost:3003`).
3. Para encerrar containers, utilize `make stop-<ambiente>` (por exemplo, `make stop-development`).

Sem `make`, execute diretamente `docker compose -f docker/<ambiente>/compose.yaml up -d` e o respectivo `down` para finalizar.

## Estrutura de pastas

```text
.
|-- docker/
|   |-- development/
|   |-- staging/
|   |-- production/
|-- src/
|   |-- app/
|   |   |-- api/manifestacoes/route.ts
|   |   |-- globals.css
|   |   |-- page.tsx
|   |-- components/
|   |-- lib/
|-- Makefile
|-- package.json
|-- README.md
```

## Fluxo de submissao

1. O usuario escolhe idioma e aceita os termos.
2. O chatbot coleta dados de forma guiada, valida entradas e permite anexar arquivos.
3. Ao finalizar, os dados sao enviados para `/api/manifestacoes` junto com o `x-correlation-id`.
4. O endpoint aplica CORS, limita 60 requisicoes por minuto por IP, valida o DTO e chama a API da CGU.
5. A resposta (protocolo, codigo de acesso, prazos) e exibida na tela de confirmacao e pode ser baixada como PDF.

## Boas praticas e suporte

- Execute `npm run lint` e `npm run typecheck` antes de abrir PRs.
- Revise os limites de anexos definidos em `src/lib/cgu/utils.ts` (30 MB totais e extensoes controladas) se precisar alterar regras.
- Configure `ALLOWED_ORIGINS` adequadamente em producao para liberar apenas dominios confiaveis.
- Use o `x-correlation-id` para rastrear chamadas entre frontend e logs do endpoint.

Em caso de duvidas, consulte os componentes no diretorio `src/components` e a camada de integracao em `src/lib/cgu` para entender como novos campos ou validacoes devem ser adicionados.

---
