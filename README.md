# COP30 Chatbot Ã¢â‚¬â€ CGU

AplicaÃƒÂ§ÃƒÂ£o Next.js que conduz participantes da COP30 pelo registro de manifestaÃƒÂ§ÃƒÂµes na plataforma Fala.BR. O fluxo conversa com o usuÃƒÂ¡rio em trÃƒÂªs idiomas, valida dados, trata anexos e envia o payload final para a API oficial controlada pela CGU.

## VisÃƒÂ£o Geral do CÃƒÂ³digo

- `src/app/page.tsx`: orquestra o fluxo por etapas (idioma Ã¢â€ â€™ termos Ã¢â€ â€™ chat Ã¢â€ â€™ confirmaÃƒÂ§ÃƒÂ£o) e integra o hook de preferÃƒÂªncias do usuÃƒÂ¡rio.
- `src/components/language-selection.tsx`: tela inicial para escolha de idioma com salvamento da opÃƒÂ§ÃƒÂ£o selecionada.
- `src/components/terms-acceptance.tsx`: apresenta os termos de uso multilÃƒÂ­ngues e sÃƒÂ³ libera o prosseguimento apÃƒÂ³s o aceite.
- `src/components/chatbot-interface.tsx`: nÃƒÂºcleo do assistente, conduz o preenchimento da manifestaÃƒÂ§ÃƒÂ£o, gerencia anexos, normaliza dados e chama o endpoint interno `/api/manifestacoes`.
- `src/components/confirmation-screen.tsx`: exibe protocolos/cÃƒÂ³digos retornados pela CGU e permite baixar recibo em PDF.
- `src/components/language-switcher.tsx` e demais componentes em `src/components/ui`: elementos visuais reutilizÃƒÂ¡veis baseados no shadcn/ui.
- `src/lib/user-preferences.ts`: hook client-side que persiste idioma e aceite dos termos no `localStorage`.
- `src/lib/cgu/*`: tipagens, normalizaÃƒÂ§ÃƒÂ£o do texto da manifestaÃƒÂ§ÃƒÂ£o e regras para anexos; `client.ts` abstrai o POST para a API da CGU.
- `src/app/api/manifestacoes/route.ts`: endpoint Next.js (runtime Node) que aplica rate limiting, monta o payload com `toCguPayload` e faz o `postManifestacao`.
- `server.js`: servidor Node customizado para produÃƒÂ§ÃƒÂ£o (inclusive quando hospedado no IIS) usando o handler do Next.
- `web.config`: configuraÃƒÂ§ÃƒÂ£o para IIS + iisnode redirecionando todas as requisiÃƒÂ§ÃƒÂµes para `server.js`.

## Stack e DependÃƒÂªncias

- Next.js 15 (App Router) + React 19
- TypeScript e ESLint
- Tailwind CSS 4 + shadcn/ui (Radix UI, class-variance-authority, lucide-react)
- Zod e React Hook Form para validaÃƒÂ§ÃƒÂµes
- iisnode + rewrite module para hospedagem em IIS (Windows Server)

## VariÃƒÂ¡veis de Ambiente

Copie `.env.example` para `.env.local` em desenvolvimento ou `.env` em produÃƒÂ§ÃƒÂ£o.

| Variavel                   | Uso                                                                                      |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| `CGU_API_BASE_URL`         | URL base da API Fala.BR (deixe vazio para `https://treinafalabr.cgu.gov.br`).            |
| `CGU_API_TOKEN`            | Token Bearer opcional, quando exigido pela instancia da API.                             |
| `ALLOWED_ORIGINS`          | Lista de origens permitidas para CORS (ex: `http://localhost:3000,https://seu.dominio`). |
| `CGU_ID_OUVIDORIA_DESTINO` | ID obrigatorio da ouvidoria de destino.                                                  |
| `CGU_ID_MODO_RESPOSTA`     | ID obrigatorio do modo de resposta.                                                      |

> Outros IDs podem ser sobrepostos via DTO vindo do frontend. Em produÃƒÂ§ÃƒÂ£o, configure as variÃƒÂ¡veis no ambiente do servidor/IIS.

## Preparando arquivos de ambiente por ambiente

Alem do `.env.example`, o repositorio traz tres modelos especificos por ambiente: `.env.development.sample`, `.env.staging.sample` e `.env.production.sample`. Preencha cada um deles com os valores que devem ser utilizados no respectivo contexto e salve-os como:

- Desenvolvimento: copie para `.env.development`;
- Staging (UAT): copie para `.env.staging`;
- Producao: copie para `.env.production`.

Esses arquivos podem ser referenciados por pipelines ou ferramentas de deploy automatizado, garantindo que cada ambiente utilize credenciais e IDs adequados.

## Docker e Makefile

O projeto disponibiliza alvos no `Makefile` para construir e subir containers Docker por ambiente. O `make` atua como um orquestrador simples: cada alvo executa internamente o comando `docker compose` correspondente, evitando que voce memorize caminhos e flags.

### Pre-requisitos

- Docker + Docker Compose instalados;
- GNU Make. No Windows, instale via `winget install GnuWin32.Make`, `choco install make`, utilize Git Bash/MSYS2 (que ja incluem o `make`) ou execute os comandos em um shell WSL.

> Se o `make` nao estiver disponivel, e possivel executar os mesmos comandos diretamente com `docker compose` (por exemplo, `docker compose -f docker/development/compose.yaml build`).

### Fluxos por ambiente

- **Desenvolvimento (testes locais)**
  - `make build-development`
  - `make start-development`
  - Acesse `http://localhost:3001`
- **Staging / UAT**
  - `make build-staging`
  - `make start-staging`
  - Acesse `http://localhost:3002`
- **Producao (simulacao do ambiente de usuarios)**
  - `make build-production`
  - `make start-production`
  - Acesse `http://localhost:3003`

Para encerrar os containers, execute o alvo correspondente (`make stop-development`, `make stop-staging` ou `make stop-production`).

## Scripts ÃƒÅ¡teis

- `npm run dev`: inicia o servidor Next em modo desenvolvimento.
- `npm run build`: gera o build otimizado (executa lint, type-check e output em `.next`).
- `npm run start`: sobe o build usando o servidor do Next.
- `npm run lint`: executa ESLint.
- `npm run typecheck`: valida os tipos TypeScript.

## Executando Localmente

1. **Requisitos**: Node.js Ã¢â€°Â¥ 18.18 (recomendado 20 LTS) e npm.
2. `npm install`
3. Configure `.env.local` com os IDs/tokens necessÃƒÂ¡rios.
4. `npm run dev` e acesse `http://localhost:3000`.

Para validar o build antes de publicar:

```bash
npm run build
npm run start
```

## Deploy PadrÃƒÂ£o (qualquer servidor Node)

1. Garanta que as variÃƒÂ¡veis de ambiente estejam definidas (`NODE_ENV=production`).
2. Execute `npm run build`.
3. Publique os artefatos necessÃƒÂ¡rios (`.next/`, `public/`, `package.json`, `package-lock.json`, `server.js`, `.env`).
4. Instale dependÃƒÂªncias (`npm ci --only=production`) e inicie com `node server.js` ou `npm run start`.

O arquivo `server.js` jÃƒÂ¡ prepara o app Next e respeita `PORT` (padrÃƒÂ£o 3000). O build foi validado com sucesso via `npm run build`.

## Deploy no IIS (Windows Server)

PrÃƒÂ©-requisitos:

- IIS 10+ com **URL Rewrite Module** instalado.
- **iisnode** configurado (handler disponÃƒÂ­vel para `server.js`).
- Node.js instalado no servidor (a configuraÃƒÂ§ÃƒÂ£o padrÃƒÂ£o do `web.config` aponta para `C:\Program Files\nodejs\node.exe`).

Passo a passo sugerido:

1. **Build** em ambiente de CI ou na prÃƒÂ³pria mÃƒÂ¡quina: `npm run build`.
2. **Publicar** para a pasta do site no IIS copiando: `.next/`, `public/`, `server.js`, `web.config`, `package.json`, `package-lock.json`, `.env` (ou configure variÃƒÂ¡veis diretamente no IIS).
3. **VariÃƒÂ¡veis de ambiente**: defina `NODE_ENV=production`, `CGU_API_*` e IDs via _Application Settings_ do IIS ou `<appSettings>` no `web.config`.
4. **PermissÃƒÂµes**: a conta do aplicativo precisa ler a pasta do site e escrever nos diretÃƒÂ³rios onde o iisnode grava logs (opcional).
5. **Reciclagem**: reinicie o _Application Pool_ apÃƒÂ³s cada publicaÃƒÂ§ÃƒÂ£o para carregar o novo build.

O `web.config` incluÃƒÂ­do:

- Reescreve todas as requisiÃƒÂ§ÃƒÂµes para `server.js`.
- Registra o handler `iisnode` para executar o servidor.
- Funciona em conjunto com o `server.js`, que escuta a porta fornecida pelo IIS. Certifique-se de que o mÃƒÂ³dulo iisnode esteja ativo no site; caso contrÃƒÂ¡rio, adicione novamente o handler via IIS Manager.

## Fluxo da AplicaÃƒÂ§ÃƒÂ£o

1. **SeleÃƒÂ§ÃƒÂ£o de idioma** (`LanguageSelection`): guarda preferÃƒÂªncias no `localStorage` e permite trocar idioma a qualquer momento.
2. **Aceite de termos** (`TermsAcceptance`): exige consentimento antes de avanÃƒÂ§ar e exibe conteÃƒÂºdo multilÃƒÂ­ngue com links ÃƒÂºteis.
3. **Chat** (`ChatbotInterface`): conduz perguntas e coletas de dados, valida anexos (tamanho, extensÃƒÂ£o, conteÃƒÂºdo), normaliza o texto e envia os dados ao backend.
4. **Endpoint interno** (`/api/manifestacoes`): aplica rate limiting simples (60 req/min por IP), converte dados para o payload da CGU, garante IDs obrigatÃƒÂ³rios e chama a API oficial.
5. **ConfirmaÃƒÂ§ÃƒÂ£o** (`ConfirmationScreen`): apresenta protocolos, gera comprovante PDF e permite iniciar nova solicitaÃƒÂ§ÃƒÂ£o.

## Qualidade e Troubleshooting

- Use `npm run lint` e `npm run typecheck` antes de subir alteracoes.
- Logs do endpoint `/api/manifestacoes` agora incluem niveis (info/warn/error), correlacao via `x-correlation-id` e dados estruturados.
- Para investigar problemas em producao no IIS, consulte os logs do iisnode (`iisnode` cria arquivos dentro de `\logs` da aplicacao) e cheque o Event Viewer.
- Erros de payload geralmente indicam IDs faltantes (`CGU_ID_*`) ou anexos fora do padrao permitido (30MB totais/arquivo e extensoes especificas).

---




