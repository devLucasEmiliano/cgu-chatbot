# 🗺️ Mapa Visual da Aplicação CGU Chatbot

## 📱 Visão Geral da Interface do Usuário

```
┌─────────────────────────────────────────────────────────────────┐
│                         CGU CHATBOT                             │
│                    🇧🇷 Controladoria-Geral da União                │
├─────────────────────────────────────────────────────────────────┤
│  [🏠 Início]  [💬 Chat]  [📊 Dados]  [ℹ️ Sobre]  [👤 Perfil]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                  HISTÓRICO DE CONVERSA                    │ │
│  │                                                           │ │
│  │  👤 Usuário: Olá, como posso consultar gastos públicos?  │ │
│  │                                              12:30 PM  ✓  │ │
│  │                                                           │ │
│  │  🤖 CGU Bot: Olá! Você pode consultar gastos através do  │ │
│  │     Portal da Transparência. Posso ajudá-lo com:         │ │
│  │     • Consulta de gastos por órgão                       │ │
│  │     • Contratos e licitações                             │ │
│  │     • Transferências de recursos                         │ │
│  │                                              12:30 PM     │ │
│  │                                                           │ │
│  │  👤 Usuário: Quero ver gastos do Ministério da Educação  │ │
│  │                                              12:31 PM  ✓  │ │
│  │                                                           │ │
│  │  🤖 CGU Bot: ⏳ Digitando...                              │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Digite sua mensagem aqui...                    [📎] [😊] │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                               [Enviar 📤]      │
│                                                                 │
│  💡 Sugestões: Gastos | Transparência | Denúncias | FAQ        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Arquitetura Simplificada

```
                        ┌──────────────────┐
                        │   👤 USUÁRIO     │
                        └────────┬─────────┘
                                 │
                                 ▼
        ┌────────────────────────────────────────────┐
        │        🌐 NAVEGADOR (CLIENT-SIDE)          │
        │  ┌──────────────────────────────────────┐  │
        │  │   React Components (UI)              │  │
        │  │   • ChatContainer                    │  │
        │  │   • ChatMessage                      │  │
        │  │   • ChatInput                        │  │
        │  └──────────────┬───────────────────────┘  │
        │                 │                           │
        │  ┌──────────────▼───────────────────────┐  │
        │  │   State Management                   │  │
        │  │   • useChat Hook                     │  │
        │  │   • Context API                      │  │
        │  └──────────────┬───────────────────────┘  │
        └─────────────────┼───────────────────────────┘
                          │ HTTP Request
                          │
        ┌─────────────────▼───────────────────────────┐
        │       ⚙️ SERVIDOR (SERVER-SIDE)              │
        │  ┌──────────────────────────────────────┐   │
        │  │   Next.js App Router                 │   │
        │  │   • Server Components                │   │
        │  │   • API Routes                       │   │
        │  └──────────────┬───────────────────────┘   │
        │                 │                            │
        │  ┌──────────────▼───────────────────────┐   │
        │  │   Business Logic Layer               │   │
        │  │   • ChatService                      │   │
        │  │   • AIEngine                         │   │
        │  │   • Validators                       │   │
        │  └──────────────┬───────────────────────┘   │
        └─────────────────┼────────────────────────────┘
                          │
        ┌─────────────────▼────────────────────────────┐
        │         🗄️ CAMADA DE DADOS                   │
        │  ┌────────────┐  ┌─────────────┐  ┌───────┐ │
        │  │ PostgreSQL │  │ Redis Cache │  │  APIs │ │
        │  │  Database  │  │             │  │  CGU  │ │
        │  └────────────┘  └─────────────┘  └───────┘ │
        └──────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Comunicação (Diagrama Simplificado)

```
USUÁRIO                  FRONTEND                BACKEND              DADOS
  │                         │                       │                   │
  │  1. Digita mensagem     │                       │                   │
  ├────────────────────────>│                       │                   │
  │                         │                       │                   │
  │                         │  2. Valida input      │                   │
  │                         │────────┐              │                   │
  │                         │        │              │                   │
  │                         │<───────┘              │                   │
  │                         │                       │                   │
  │                         │  3. POST /api/chat    │                   │
  │                         │──────────────────────>│                   │
  │                         │                       │                   │
  │                         │                       │  4. Query data    │
  │                         │                       │──────────────────>│
  │                         │                       │                   │
  │                         │                       │  5. Return data   │
  │                         │                       │<──────────────────│
  │                         │                       │                   │
  │                         │                       │  6. Process AI    │
  │                         │                       │────────┐          │
  │                         │                       │        │          │
  │                         │                       │<───────┘          │
  │                         │                       │                   │
  │                         │  7. Response JSON     │                   │
  │                         │<──────────────────────│                   │
  │                         │                       │                   │
  │                         │  8. Update UI         │                   │
  │                         │────────┐              │                   │
  │                         │        │              │                   │
  │                         │<───────┘              │                   │
  │                         │                       │                   │
  │  9. Exibe resposta      │                       │                   │
  │<────────────────────────│                       │                   │
  │                         │                       │                   │
```

---

## 🎯 Mapa de Funcionalidades

```
                      ┌─────────────────────┐
                      │   CGU CHATBOT       │
                      │   FUNCIONALIDADES   │
                      └──────────┬──────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
         ┌───────▼────┐   ┌─────▼─────┐   ┌────▼─────┐
         │   CHAT     │   │   DADOS   │   │  ADMIN   │
         │ INTERATIVO │   │    CGU    │   │  PAINEL  │
         └─────┬──────┘   └─────┬─────┘   └────┬─────┘
               │                │                │
        ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐
        │             │  │             │  │             │
    ┌───▼───┐   ┌────▼────┐  ┌────▼────┐  ┌────▼────┐  ┌────▼────┐
    │Enviar │   │Histórico│  │Portal   │  │Relatór. │  │Usuários │
    │Mensag.│   │Conversa │  │Transp.  │  │Estatíst.│  │Sistema  │
    └───────┘   └─────────┘  └─────────┘  └─────────┘  └─────────┘
        │             │  │             │  │             │  │
    ┌───▼───┐   ┌────▼────┐  ┌────▼────┐  ┌────▼────┐  ┌────▼────┐
    │Receber│   │Buscar   │  │Fala.BR  │  │Logs     │  │Config.  │
    │Respost│   │Mensag.  │  │Ouvidoria│  │Sistema  │  │Sistema  │
    └───────┘   └─────────┘  └─────────┘  └─────────┘  └─────────┘
        │             │  │             │
    ┌───▼───┐   ┌────▼────┐  ┌────▼────┐
    │Rating │   │Export   │  │LAI      │
    │Respost│   │Histórico│  │Consulta │
    └───────┘   └─────────┘  └─────────┘
```

---

## 📦 Estrutura de Componentes React

```
App
│
├── RootLayout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── UserMenu
│   │
│   ├── Main Content
│   │   │
│   │   └── ChatPage
│   │       │
│   │       ├── ChatContainer
│   │       │   │
│   │       │   ├── ChatHistory
│   │       │   │   └── ChatMessage[]
│   │       │   │       ├── Avatar
│   │       │   │       ├── MessageBubble
│   │       │   │       │   ├── Text
│   │       │   │       │   ├── Timestamp
│   │       │   │       │   └── Actions
│   │       │   │       └── Attachments[]
│   │       │   │
│   │       │   ├── TypingIndicator
│   │       │   │
│   │       │   └── ChatInput
│   │       │       ├── TextArea
│   │       │       ├── AttachButton
│   │       │       ├── EmojiButton
│   │       │       └── SendButton
│   │       │
│   │       └── ChatSidebar
│   │           ├── QuickActions
│   │           └── SuggestedTopics
│   │
│   └── Footer
│       ├── Links
│       ├── Copyright
│       └── SocialMedia
│
└── Providers
    ├── ThemeProvider
    ├── AuthProvider
    └── ChatProvider
```

---

## 🔐 Fluxo de Autenticação

```
┌─────────────┐
│   INÍCIO    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐      NÃO      ┌──────────────┐
│ Está logado?    │──────────────>│ Redirecionar │
└──────┬──────────┘                │ para /login  │
       │ SIM                       └──────┬───────┘
       ▼                                  │
┌─────────────────┐                       │
│ Verificar Token │                       │
└──────┬──────────┘                       │
       │                                  │
       ▼                                  │
┌─────────────────┐      INVÁLIDO        │
│ Token válido?   │──────────────────────┘
└──────┬──────────┘
       │ VÁLIDO
       ▼
┌─────────────────┐
│ Carregar Perfil │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Verificar Role  │
└──────┬──────────┘
       │
       ├─── Admin ────> Dashboard Admin
       ├─── User ─────> Interface de Chat
       └─── Guest ────> Acesso Limitado
```

---

## 📊 Tipos de Mensagens Suportadas

```
┌────────────────────────────────────────────┐
│         TIPOS DE MENSAGENS                 │
├────────────────────────────────────────────┤
│                                            │
│  📝 TEXTO                                  │
│  ├─ Mensagens simples                     │
│  ├─ Markdown formatado                    │
│  └─ Links e menções                       │
│                                            │
│  📎 ANEXOS                                 │
│  ├─ Imagens (JPG, PNG, GIF)               │
│  ├─ Documentos (PDF, DOC, XLS)            │
│  └─ Arquivos genéricos                    │
│                                            │
│  🔘 AÇÕES RÁPIDAS                          │
│  ├─ Botões de resposta                    │
│  ├─ Carrosséis de opções                  │
│  └─ Formulários inline                    │
│                                            │
│  📊 DADOS ESTRUTURADOS                     │
│  ├─ Tabelas                                │
│  ├─ Gráficos                               │
│  └─ Cards informativos                    │
│                                            │
│  🔗 LINKS E REFERÊNCIAS                    │
│  ├─ Links para portais CGU                │
│  ├─ Referências a documentos              │
│  └─ Deep links para outras seções         │
│                                            │
└────────────────────────────────────────────┘
```

---

## 🎨 Sistema de Design (Cores e Estilos)

```
┌─────────────────────────────────────────────────────┐
│                 SISTEMA DE CORES                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🟦 PRIMÁRIA     #2196F3  (Azul CGU)              │
│  ├─ Uso: Botões principais, links, destaques      │
│  └─ Variações: Light, Dark, Hover                 │
│                                                     │
│  🟩 SECUNDÁRIA   #4CAF50  (Verde Sucesso)          │
│  ├─ Uso: Confirmações, estados positivos          │
│  └─ Variações: Light, Dark                        │
│                                                     │
│  ⬜ NEUTRO       #616161  (Cinza)                  │
│  ├─ Uso: Textos, bordas, backgrounds              │
│  └─ Variações: 50, 100, 200, ..., 900            │
│                                                     │
│  🟥 ALERTA       #F44336  (Vermelho)               │
│  ├─ Uso: Erros, avisos críticos                   │
│  └─ Variações: Light, Dark                        │
│                                                     │
│  🟨 ATENÇÃO      #FF9800  (Laranja)                │
│  ├─ Uso: Avisos, informações importantes          │
│  └─ Variações: Light, Dark                        │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   TIPOGRAFIA                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Geist Sans        → Texto geral                   │
│  ├─ Regular (400)                                  │
│  ├─ Medium (500)                                   │
│  └─ Bold (700)                                     │
│                                                     │
│  Geist Mono        → Código e dados                │
│  ├─ Regular (400)                                  │
│  └─ Medium (500)                                   │
│                                                     │
│  TAMANHOS:                                          │
│  ├─ H1: 2.5rem (40px)                              │
│  ├─ H2: 2rem (32px)                                │
│  ├─ H3: 1.5rem (24px)                              │
│  ├─ Body: 1rem (16px)                              │
│  └─ Small: 0.875rem (14px)                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Performance e Otimização

```
┌───────────────────────────────────────────────────┐
│          ESTRATÉGIAS DE PERFORMANCE               │
├───────────────────────────────────────────────────┤
│                                                   │
│  ⚡ RENDERIZAÇÃO                                  │
│  ├─ Server Components (padrão)                   │
│  ├─ Streaming com Suspense                       │
│  ├─ Lazy loading de componentes                  │
│  └─ Code splitting automático                    │
│                                                   │
│  💾 CACHING                                       │
│  ├─ Cache de API responses (Redis)               │
│  ├─ Static Generation quando possível            │
│  ├─ Revalidação incremental (ISR)                │
│  └─ Browser cache (Service Workers)              │
│                                                   │
│  📦 OTIMIZAÇÃO DE ASSETS                          │
│  ├─ Compressão de imagens (WebP)                 │
│  ├─ Minificação CSS/JS                            │
│  ├─ Tree shaking                                  │
│  └─ Font optimization                             │
│                                                   │
│  🔄 ESTADO E DADOS                                │
│  ├─ Debouncing de inputs                          │
│  ├─ Virtualização de listas longas               │
│  ├─ Paginação/Infinite scroll                    │
│  └─ Optimistic UI updates                        │
│                                                   │
└───────────────────────────────────────────────────┘
```

---

## 📱 Responsividade (Breakpoints)

```
┌────────┐      ┌──────────┐      ┌───────────────┐
│ MOBILE │      │  TABLET  │      │    DESKTOP    │
│< 640px │      │640-1024px│      │    >1024px    │
└───┬────┘      └─────┬────┘      └───────┬───────┘
    │                 │                   │
    ▼                 ▼                   ▼
┌────────┐      ┌──────────┐      ┌───────────────┐
│ Stack  │      │ 2 Cols   │      │  3 Cols +     │
│ Layout │      │ Layout   │      │  Sidebar      │
│        │      │          │      │               │
│ [Nav]  │      │ [Nav]    │      │ [Nav]         │
│ [Chat] │      │ [Chat]   │      │ [Side][Chat]  │
│ [Input]│      │ [Input]  │      │ [Input]       │
│        │      │          │      │               │
└────────┘      └──────────┘      └───────────────┘

Tailwind Classes:
• sm:  640px+
• md:  768px+
• lg:  1024px+
• xl:  1280px+
• 2xl: 1536px+
```

---

## 🔗 Integrações Externas

```
                  ┌─────────────────┐
                  │  CGU CHATBOT    │
                  └────────┬────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    ┌───▼────┐      ┌─────▼─────┐     ┌─────▼─────┐
    │Portal  │      │ Fala.BR   │     │    LAI    │
    │Transp. │      │ Ouvidoria │     │  Acesso   │
    └───┬────┘      └─────┬─────┘     └─────┬─────┘
        │                 │                  │
        ▼                 ▼                  ▼
    API REST          API SOAP           API REST
        │                 │                  │
        └─────────────────┴──────────────────┘
                          │
                  ┌───────▼────────┐
                  │  API Gateway   │
                  │  + Rate Limit  │
                  └────────────────┘
```

---

## 🎯 Casos de Uso Principais

```
┌──────────────────────────────────────────────────────┐
│              CASOS DE USO DO CHATBOT                 │
├──────────────────────────────────────────────────────┤
│                                                      │
│ 1️⃣ CONSULTAR INFORMAÇÕES                            │
│    └─> Gastos públicos, licitações, contratos       │
│                                                      │
│ 2️⃣ FAZER DENÚNCIAS                                  │
│    └─> Encaminhar para Fala.BR ou LAI               │
│                                                      │
│ 3️⃣ SOLICITAR ACESSO À INFORMAÇÃO                    │
│    └─> Criar pedido via LAI                         │
│                                                      │
│ 4️⃣ PERGUNTAS FREQUENTES                             │
│    └─> Responder automaticamente FAQ                │
│                                                      │
│ 5️⃣ NAVEGAÇÃO ASSISTIDA                              │
│    └─> Guiar usuário pelos portais da CGU           │
│                                                      │
│ 6️⃣ ANÁLISE DE DADOS                                 │
│    └─> Gráficos e visualizações de dados públicos   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## ✅ Checklist de Implementação

```
FASE 1 - SETUP BÁSICO
  ✅ Configurar Next.js 15
  ✅ Configurar TypeScript
  ✅ Configurar Tailwind CSS
  ✅ Estrutura de pastas
  ⬜ Configurar ESLint + Prettier

FASE 2 - UI/UX
  ⬜ Criar componentes base (Button, Input, Card)
  ⬜ Implementar ChatContainer
  ⬜ Implementar ChatMessage
  ⬜ Implementar ChatInput
  ⬜ Design responsivo

FASE 3 - LÓGICA DO CHAT
  ⬜ Criar useChat hook
  ⬜ Implementar Context API
  ⬜ Gerenciamento de estado
  ⬜ Validação de inputs
  ⬜ Histórico de mensagens

FASE 4 - BACKEND
  ⬜ Criar API Routes
  ⬜ Integrar banco de dados
  ⬜ Implementar cache (Redis)
  ⬜ Sistema de autenticação
  ⬜ Rate limiting

FASE 5 - IA/NLP
  ⬜ Integrar engine de IA
  ⬜ Processamento de linguagem natural
  ⬜ Intenção e entidades
  ⬜ Geração de respostas

FASE 6 - INTEGRAÇÕES
  ⬜ Portal da Transparência API
  ⬜ Fala.BR API
  ⬜ LAI API
  ⬜ Dados Abertos CGU

FASE 7 - TESTES
  ⬜ Testes unitários (Jest)
  ⬜ Testes de integração
  ⬜ Testes E2E (Playwright)
  ⬜ Testes de acessibilidade

FASE 8 - DEPLOY
  ⬜ Configurar CI/CD
  ⬜ Deploy em staging
  ⬜ Monitoramento e logs
  ⬜ Deploy em produção
```

---

<div align="center">

**Mapa Visual Completo - CGU Chatbot**

Este documento fornece uma visão visual e simplificada da arquitetura
e funcionalidades do projeto CGU Chatbot.

[← Voltar para README](./README.md) | [Ver Fluxogramas](./FLOWCHART.md) | [Ver Arquitetura](./ARCHITECTURE.md)

---

**Desenvolvido com ❤️ para a Controladoria-Geral da União**

</div>
