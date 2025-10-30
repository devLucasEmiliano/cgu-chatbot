# COP30 Chatbot - CGU

Aplicacao Next.js que orienta participantes da COP30 no registro de manifestacoes na plataforma Fala.BR. O fluxo conversa em tres idiomas, valida dados, trata anexos e envia o payload final para a API oficial da CGU.

## Visao Geral do Codigo

- `src/app/page.tsx`: conduz o fluxo por etapas (idioma, termos, chat, confirmacao) e integra o hook de preferencias do usuario.
- `src/components/language-selection.tsx`: tela inicial para escolha de idioma com persistencia da selecao.
- `src/components/terms-acceptance.tsx`: exibe os termos de uso multilingues e bloqueia o avanco ate o aceite.
- `src/components/chatbot-interface.tsx`: nucleo do assistente; coleta dados, gerencia anexos, normaliza respostas e chama `/api/manifestacoes`.
- `src/components/confirmation-screen.tsx`: mostra protocolos retornados pela CGU e permite baixar recibo em PDF.
- `src/components/language-switcher.tsx` e demais componentes em `src/components/ui`: componentes visuais reutilizaveis baseados em shadcn/ui.
- `src/lib/user-preferences.ts`: hook client-side que guarda idioma e aceite dos termos no `localStorage`.
- `src/lib/cgu/*`: tipagens, normalizacao de texto e regras para anexos; `client.ts` abstrai a chamada da API da CGU.
- `src/app/api/manifestacoes/route.ts`: endpoint Next.js (runtime Node) com rate limiting que monta o payload via `toCguPayload` e chama `postManifestacao`.
- `server.js`: servidor Node customizado para producao (incluindo hospedagem em IIS) usando o handler do Next.
- `web.config`: configuracao para IIS + iisnode que redireciona as requisicoes para `server.js`.

## Stack e Dependencias

- Next.js 15 (App Router) + React 19
- TypeScript e ESLint
- Tailwind CSS 4 + shadcn/ui (Radix UI, class-variance-authority, lucide-react)
- Zod e React Hook Form
- iisnode + URL Rewrite (IIS) para hospedagem em Windows Server

## Variaveis de Ambiente

Copie `.env.example` para `.env.local` em desenvolvimento ou `.env` em producao.

| Variavel                   | Uso                                                                                      |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| `CGU_API_BASE_URL`         | URL base da API Fala.BR (deixe vazio para `https://treinafalabr.cgu.gov.br`).            |
| `CGU_API_TOKEN`            | Token Bearer opcional, quando exigido pela instancia da API.                             |
| `ALLOWED_ORIGINS`          | Lista de origens permitidas para CORS (ex: `http://localhost:3000,https://seu.dominio`). |
| `CGU_ID_OUVIDORIA_DESTINO` | ID obrigatorio da ouvidoria de destino.                                                  |
| `CGU_ID_MODO_RESPOSTA`     | ID obrigatorio do modo de resposta.                                                      |

> Outros IDs podem ser enviados via DTO do frontend. Em producao, configure as variaveis diretamente no ambiente do servidor/IIS.

## Preparando arquivos de ambiente por ambiente

Alem do `.env.example`, o repositorio traz tres modelos especificos por ambiente: `.env.development.sample`, `.env.staging.sample` e `.env.production.sample`. Preencha cada um deles com os valores que devem ser usados em cada contexto e salve-os como:

- Desenvolvimento: copie para `.env.development`.
- Staging (UAT): copie para `.env.staging`.
- Producao: copie para `.env.production`.

Esses arquivos podem ser referenciados por pipelines ou ferramentas de deploy automatizado, garantindo que cada ambiente utilize credenciais e IDs corretos.

## Docker e Makefile

O projeto disponibiliza alvos no `Makefile` para construir e subir containers Docker por ambiente. O `make` atua como um orquestrador simples: cada alvo executa internamente o comando `docker compose` correspondente, evitando que voce memorize caminhos e flags.

### Pre-requisitos

- Docker + Docker Compose instalados.
- GNU Make. No Windows, instale via `winget install GnuWin32.Make`, `choco install make`, utilize Git Bash/MSYS2 (que ja incluem o `make`) ou execute os comandos em um shell WSL.

> Sem `make`, e possivel chamar os mesmos comandos diretamente com `docker compose` (por exemplo, `docker compose -f docker/development/compose.yaml build`).

### Fluxos por ambiente

- **Desenvolvimento (testes locais)**
  - `make build-development`
  - `make start-development`
  - Acesse `http://localhost:3001`
- **Staging / UAT**
  - `make build-staging`
  - `make start-staging`
  - Acesse `http://localhost:3002`
- **Producao (simulacao do ambiente final)**
  - `make build-production`
  - `make start-production`
  - Acesse `http://localhost:3003`

Para encerrar os containers, execute o alvo correspondente (`make stop-development`, `make stop-staging` ou `make stop-production`).

## Scripts Uteis

- `npm run dev`: inicia o servidor Next em modo desenvolvimento.
- `npm run build`: gera o build otimizado (lint, type-check e output em `.next`).
- `npm run start`: sobe o build usando o servidor do Next.
- `npm run lint`: executa ESLint.
- `npm run typecheck`: valida os tipos TypeScript.

## Executando Localmente

1. **Requisitos**: Node.js >= 18.18 (recomendado 20 LTS) e npm.
2. `npm install`
3. Configure `.env.local` com os IDs e tokens necessarios.
4. `npm run dev` e acesse `http://localhost:3000`.

Para validar o build antes de publicar:

```bash
npm run build
npm run start
```

## Deploy Padrao (qualquer servidor Node)

1. Garanta que as variaveis de ambiente estejam definidas (`NODE_ENV=production`).
2. Execute `npm run build`.
3. Publique os artefatos necessarios (`.next/`, `public/`, `server.js`, `package.json`, `package-lock.json`, `.env`).
4. Instale dependencias (`npm ci --only=production`) e inicie com `node server.js` ou `npm run start`.

O `server.js` ja prepara o app Next e respeita a variavel `PORT` (padrao 3000). O build foi validado via `npm run build`.

## Deploy no IIS (Windows Server)

Pre-requisitos:

- IIS 10+ com **URL Rewrite Module** instalado.
- **iisnode** configurado (handler disponivel para `server.js`).
- Node.js instalado no servidor (o `web.config` aponta por padrao para `C:\Program Files\nodejs\node.exe`).

Passo a passo sugerido:

1. Gere o build (`npm run build`).
2. Publique para a pasta do site no IIS copiando `.next/`, `public/`, `server.js`, `web.config`, `package.json`, `package-lock.json`, `.env` (ou configure variaveis diretamente no IIS).
3. Defina `NODE_ENV=production`, `CGU_API_*` e IDs em _Application Settings_ do IIS ou via `<appSettings>` no `web.config`.
4. Garanta permissoes de leitura para a pasta e, se necessario, escrita nos diretorios onde o iisnode gera logs.
5. Recicle o _Application Pool_ apos cada publicacao para carregar o novo build.

O `web.config` incluso:

- Reescreve todas as requisicoes para `server.js`.
- Registra o handler `iisnode` que executa o servidor.
- Opera junto com `server.js`, que escuta a porta fornecida pelo IIS. Caso o modulo iisnode nao esteja ativo, readicione o handler via IIS Manager.

## Fluxo da Aplicacao

1. **LanguageSelection**: salva idioma preferido no `localStorage` e permite alterar a qualquer momento.
2. **TermsAcceptance**: apresenta termos de uso e exige consentimento antes de prosseguir.
3. **ChatbotInterface**: conduz perguntas, valida anexos (tamanho, extensao e conteudo), normaliza respostas e envia ao backend.
4. **/api/manifestacoes**: aplica rate limiting (60 req/min por IP), monta o payload exigido pela CGU e chama a API oficial.
5. **ConfirmationScreen**: mostra protocolos recebidos, gera comprovante em PDF e permite iniciar nova solicitacao.

## Qualidade e Troubleshooting

- Execute `npm run lint` e `npm run typecheck` antes de enviar alteracoes.
- O endpoint `/api/manifestacoes` registra logs estruturados com niveis (info/warn/error) e correlacao via `x-correlation-id`.
- Para diagnosticar problemas no IIS, consulte os logs do iisnode (pasta `\logs` da aplicacao) e o Event Viewer.
- Erros de payload costumam indicar IDs faltantes (`CGU_ID_*`) ou anexos fora do padrao aceito (30 MB totais e extensoes autorizadas).

---

