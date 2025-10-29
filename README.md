# COP30 Chatbot â€” CGU

AplicaÃ§Ã£o Next.js que conduz participantes da COP30 pelo registro de manifestaÃ§Ãµes na plataforma Fala.BR. O fluxo conversa com o usuÃ¡rio em trÃªs idiomas, valida dados, trata anexos e envia o payload final para a API oficial controlada pela CGU.

## VisÃ£o Geral do CÃ³digo

- `src/app/page.tsx`: orquestra o fluxo por etapas (idioma â†’ termos â†’ chat â†’ confirmaÃ§Ã£o) e integra o hook de preferÃªncias do usuÃ¡rio.
- `src/components/language-selection.tsx`: tela inicial para escolha de idioma com salvamento da opÃ§Ã£o selecionada.
- `src/components/terms-acceptance.tsx`: apresenta os termos de uso multilÃ­ngues e sÃ³ libera o prosseguimento apÃ³s o aceite.
- `src/components/chatbot-interface.tsx`: nÃºcleo do assistente, conduz o preenchimento da manifestaÃ§Ã£o, gerencia anexos, normaliza dados e chama o endpoint interno `/api/manifestacoes`.
- `src/components/confirmation-screen.tsx`: exibe protocolos/cÃ³digos retornados pela CGU e permite baixar recibo em PDF.
- `src/components/language-switcher.tsx` e demais componentes em `src/components/ui`: elementos visuais reutilizÃ¡veis baseados no shadcn/ui.
- `src/lib/user-preferences.ts`: hook client-side que persiste idioma e aceite dos termos no `localStorage`.
- `src/lib/cgu/*`: tipagens, normalizaÃ§Ã£o do texto da manifestaÃ§Ã£o e regras para anexos; `client.ts` abstrai o POST para a API da CGU.
- `src/app/api/manifestacoes/route.ts`: endpoint Next.js (runtime Node) que aplica rate limiting, monta o payload com `toCguPayload` e faz o `postManifestacao`.
- `server.js`: servidor Node customizado para produÃ§Ã£o (inclusive quando hospedado no IIS) usando o handler do Next.
- `web.config`: configuraÃ§Ã£o para IIS + iisnode redirecionando todas as requisiÃ§Ãµes para `server.js`.

## Stack e DependÃªncias

- Next.js 15 (App Router) + React 19
- TypeScript e ESLint
- Tailwind CSS 4 + shadcn/ui (Radix UI, class-variance-authority, lucide-react)
- Zod e React Hook Form para validaÃ§Ãµes
- iisnode + rewrite module para hospedagem em IIS (Windows Server)

## VariÃ¡veis de Ambiente

Copie `.env.example` para `.env.local` em desenvolvimento ou `.env` em produÃ§Ã£o.

| Variavel                   | Uso                                                                                      |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| `CGU_API_BASE_URL`         | URL base da API Fala.BR (deixe vazio para `https://treinafalabr.cgu.gov.br`).            |
| `CGU_API_TOKEN`            | Token Bearer opcional, quando exigido pela instancia da API.                             |
| `ALLOWED_ORIGINS`          | Lista de origens permitidas para CORS (ex: `http://localhost:3000,https://seu.dominio`). |
| `CGU_ID_OUVIDORIA_DESTINO` | ID obrigatorio da ouvidoria de destino.                                                  |
| `CGU_ID_MODO_RESPOSTA`     | ID obrigatorio do modo de resposta.                                                      |

> Outros IDs podem ser sobrepostos via DTO vindo do frontend. Em produÃ§Ã£o, configure as variÃ¡veis no ambiente do servidor/IIS.

## Scripts Ãšteis

- `npm run dev`: inicia o servidor Next em modo desenvolvimento.
- `npm run build`: gera o build otimizado (executa lint, type-check e output em `.next`).
- `npm run start`: sobe o build usando o servidor do Next.
- `npm run lint`: executa ESLint.
- `npm run typecheck`: valida os tipos TypeScript.

## Executando Localmente

1. **Requisitos**: Node.js â‰¥ 18.18 (recomendado 20 LTS) e npm.
2. `npm install`
3. Configure `.env.local` com os IDs/tokens necessÃ¡rios.
4. `npm run dev` e acesse `http://localhost:3000`.

Para validar o build antes de publicar:

```bash
npm run build
npm run start
```

## Deploy PadrÃ£o (qualquer servidor Node)

1. Garanta que as variÃ¡veis de ambiente estejam definidas (`NODE_ENV=production`).
2. Execute `npm run build`.
3. Publique os artefatos necessÃ¡rios (`.next/`, `public/`, `package.json`, `package-lock.json`, `server.js`, `.env`).
4. Instale dependÃªncias (`npm ci --only=production`) e inicie com `node server.js` ou `npm run start`.

O arquivo `server.js` jÃ¡ prepara o app Next e respeita `PORT` (padrÃ£o 3000). O build foi validado com sucesso via `npm run build`.

## Deploy no IIS (Windows Server)

PrÃ©-requisitos:

- IIS 10+ com **URL Rewrite Module** instalado.
- **iisnode** configurado (handler disponÃ­vel para `server.js`).
- Node.js instalado no servidor (a configuraÃ§Ã£o padrÃ£o do `web.config` aponta para `C:\Program Files\nodejs\node.exe`).

Passo a passo sugerido:

1. **Build** em ambiente de CI ou na prÃ³pria mÃ¡quina: `npm run build`.
2. **Publicar** para a pasta do site no IIS copiando: `.next/`, `public/`, `server.js`, `web.config`, `package.json`, `package-lock.json`, `.env` (ou configure variÃ¡veis diretamente no IIS).
3. **VariÃ¡veis de ambiente**: defina `NODE_ENV=production`, `CGU_API_*` e IDs via _Application Settings_ do IIS ou `<appSettings>` no `web.config`.
4. **PermissÃµes**: a conta do aplicativo precisa ler a pasta do site e escrever nos diretÃ³rios onde o iisnode grava logs (opcional).
5. **Reciclagem**: reinicie o _Application Pool_ apÃ³s cada publicaÃ§Ã£o para carregar o novo build.

O `web.config` incluÃ­do:

- Reescreve todas as requisiÃ§Ãµes para `server.js`.
- Registra o handler `iisnode` para executar o servidor.
- Funciona em conjunto com o `server.js`, que escuta a porta fornecida pelo IIS. Certifique-se de que o mÃ³dulo iisnode esteja ativo no site; caso contrÃ¡rio, adicione novamente o handler via IIS Manager.

## Fluxo da AplicaÃ§Ã£o

1. **SeleÃ§Ã£o de idioma** (`LanguageSelection`): guarda preferÃªncias no `localStorage` e permite trocar idioma a qualquer momento.
2. **Aceite de termos** (`TermsAcceptance`): exige consentimento antes de avanÃ§ar e exibe conteÃºdo multilÃ­ngue com links Ãºteis.
3. **Chat** (`ChatbotInterface`): conduz perguntas e coletas de dados, valida anexos (tamanho, extensÃ£o, conteÃºdo), normaliza o texto e envia os dados ao backend.
4. **Endpoint interno** (`/api/manifestacoes`): aplica rate limiting simples (60 req/min por IP), converte dados para o payload da CGU, garante IDs obrigatÃ³rios e chama a API oficial.
5. **ConfirmaÃ§Ã£o** (`ConfirmationScreen`): apresenta protocolos, gera comprovante PDF e permite iniciar nova solicitaÃ§Ã£o.

## Qualidade e Troubleshooting

- Use `npm run lint` e `npm run typecheck` antes de subir alteracoes.
- Logs do endpoint `/api/manifestacoes` agora incluem niveis (info/warn/error), correlacao via `x-correlation-id` e dados estruturados.
- Para investigar problemas em producao no IIS, consulte os logs do iisnode (`iisnode` cria arquivos dentro de `\logs` da aplicacao) e cheque o Event Viewer.
- Erros de payload geralmente indicam IDs faltantes (`CGU_ID_*`) ou anexos fora do padrao permitido (30MB totais/arquivo e extensoes especificas).

---
