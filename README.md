# COP30 Chatbot — CGU

Aplicação Next.js que conduz participantes da COP30 pelo registro de manifestações na plataforma Fala.BR. O fluxo conversa com o usuário em três idiomas, valida dados, trata anexos e envia o payload final para a API oficial controlada pela CGU.

## Visão Geral do Código
- `src/app/page.tsx`: orquestra o fluxo por etapas (idioma → termos → chat → confirmação) e integra o hook de preferências do usuário.
- `src/components/language-selection.tsx`: tela inicial para escolha de idioma com salvamento da opção selecionada.
- `src/components/terms-acceptance.tsx`: apresenta os termos de uso multilíngues e só libera o prosseguimento após o aceite.
- `src/components/chatbot-interface.tsx`: núcleo do assistente, conduz o preenchimento da manifestação, gerencia anexos, normaliza dados e chama o endpoint interno `/api/manifestacoes`.
- `src/components/confirmation-screen.tsx`: exibe protocolos/códigos retornados pela CGU e permite baixar recibo em PDF.
- `src/components/language-switcher.tsx` e demais componentes em `src/components/ui`: elementos visuais reutilizáveis baseados no shadcn/ui.
- `src/lib/user-preferences.ts`: hook client-side que persiste idioma e aceite dos termos no `localStorage`.
- `src/lib/cgu/*`: tipagens, normalização do texto da manifestação e regras para anexos; `client.ts` abstrai o POST para a API da CGU.
- `src/app/api/manifestacoes/route.ts`: endpoint Next.js (runtime Node) que aplica rate limiting, monta o payload com `toCguPayload` e faz o `postManifestacao`.
- `server.js`: servidor Node customizado para produção (inclusive quando hospedado no IIS) usando o handler do Next.
- `web.config`: configuração para IIS + iisnode redirecionando todas as requisições para `server.js`.

## Stack e Dependências
- Next.js 15 (App Router) + React 19
- TypeScript e ESLint
- Tailwind CSS 4 + shadcn/ui (Radix UI, class-variance-authority, lucide-react)
- Zod e React Hook Form para validações
- iisnode + rewrite module para hospedagem em IIS (Windows Server)

## Variáveis de Ambiente
Copie `.env.example` para `.env.local` em desenvolvimento ou `.env` em produção.

| Variável | Uso |
| --- | --- |
| `CGU_API_BASE_URL` | URL base da API Fala.BR (deixe vazio para `https://treinafalabr.cgu.gov.br`). |
| `CGU_API_TOKEN` | Token Bearer opcional, quando exigido pela instância da API. |
| `CGU_ID_OUVIDORIA_DESTINO` | ID obrigatório da ouvidoria de destino. |
| `CGU_ID_MODO_RESPOSTA` | ID obrigatório do modo de resposta. |

> Outros IDs podem ser sobrepostos via DTO vindo do frontend. Em produção, configure as variáveis no ambiente do servidor/IIS.

## Scripts Úteis
- `npm run dev`: inicia o servidor Next em modo desenvolvimento.
- `npm run build`: gera o build otimizado (executa lint, type-check e output em `.next`).
- `npm run start`: sobe o build usando o servidor do Next.
- `npm run lint`: executa ESLint.
- `npm run typecheck`: valida os tipos TypeScript.

## Executando Localmente
1. **Requisitos**: Node.js ≥ 18.18 (recomendado 20 LTS) e npm.
2. `npm install`
3. Configure `.env.local` com os IDs/tokens necessários.
4. `npm run dev` e acesse `http://localhost:3000`.

Para validar o build antes de publicar:
```bash
npm run build
npm run start
```

## Deploy Padrão (qualquer servidor Node)
1. Garanta que as variáveis de ambiente estejam definidas (`NODE_ENV=production`).
2. Execute `npm run build`.
3. Publique os artefatos necessários (`.next/`, `public/`, `package.json`, `package-lock.json`, `server.js`, `.env`).
4. Instale dependências (`npm ci --only=production`) e inicie com `node server.js` ou `npm run start`.

O arquivo `server.js` já prepara o app Next e respeita `PORT` (padrão 3000). O build foi validado com sucesso via `npm run build`.

## Deploy no IIS (Windows Server)
Pré-requisitos:
- IIS 10+ com **URL Rewrite Module** instalado.
- **iisnode** configurado (handler disponível para `server.js`).
- Node.js instalado no servidor (a configuração padrão do `web.config` aponta para `C:\Program Files\nodejs\node.exe`).

Passo a passo sugerido:
1. **Build** em ambiente de CI ou na própria máquina: `npm run build`.
2. **Publicar** para a pasta do site no IIS copiando: `.next/`, `public/`, `server.js`, `web.config`, `package.json`, `package-lock.json`, `.env` (ou configure variáveis diretamente no IIS).
3. **Variáveis de ambiente**: defina `NODE_ENV=production`, `CGU_API_*` e IDs via *Application Settings* do IIS ou `<appSettings>` no `web.config`.
4. **Permissões**: a conta do aplicativo precisa ler a pasta do site e escrever nos diretórios onde o iisnode grava logs (opcional).
5. **Reciclagem**: reinicie o *Application Pool* após cada publicação para carregar o novo build.

O `web.config` incluído:
- Reescreve todas as requisições para `server.js`.
- Registra o handler `iisnode` para executar o servidor.
- Funciona em conjunto com o `server.js`, que escuta a porta fornecida pelo IIS. Certifique-se de que o módulo iisnode esteja ativo no site; caso contrário, adicione novamente o handler via IIS Manager.

## Fluxo da Aplicação
1. **Seleção de idioma** (`LanguageSelection`): guarda preferências no `localStorage` e permite trocar idioma a qualquer momento.
2. **Aceite de termos** (`TermsAcceptance`): exige consentimento antes de avançar e exibe conteúdo multilíngue com links úteis.
3. **Chat** (`ChatbotInterface`): conduz perguntas e coletas de dados, valida anexos (tamanho, extensão, conteúdo), normaliza o texto e envia os dados ao backend.
4. **Endpoint interno** (`/api/manifestacoes`): aplica rate limiting simples (60 req/min por IP), converte dados para o payload da CGU, garante IDs obrigatórios e chama a API oficial.
5. **Confirmação** (`ConfirmationScreen`): apresenta protocolos, gera comprovante PDF e permite iniciar nova solicitação.

## Qualidade e Troubleshooting
- Use `npm run lint` e `npm run typecheck` antes de subir alterações.
- Para investigar problemas em produção no IIS, consulte os logs do iisnode (`iisnode` cria arquivos dentro de `\logs` da aplicação) e cheque o Event Viewer.
- Erros de payload geralmente indicam IDs faltantes (`CGU_ID_*`) ou anexos fora do padrão permitido (30 MB totais/arquivo e extensões específicas).

---

Projeto mantido pela CGU para apoiar o atendimento multicanal durante a COP30. Ajuste os textos e IDs de destino conforme a necessidade do evento.
