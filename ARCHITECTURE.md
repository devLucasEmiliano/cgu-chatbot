# 🏛️ Arquitetura do CGU Chatbot

## Visão Geral

Este documento descreve a arquitetura detalhada do projeto CGU Chatbot, incluindo padrões de design, estrutura de componentes e fluxo de dados.

---

## 📐 Arquitetura em Camadas

```mermaid
graph TD
    subgraph Presentation["🎨 Camada de Apresentação"]
        Pages[Páginas Next.js]
        Components[Componentes React]
        Layouts[Layouts]
        Styles[Estilos Tailwind]
    end

    subgraph Application["⚡ Camada de Aplicação"]
        Hooks[Custom Hooks]
        Context[Context API]
        State[Gerenciamento de Estado]
        Utils[Utilitários]
    end

    subgraph Domain["🧠 Camada de Domínio"]
        Business[Lógica de Negócio]
        Models[Modelos de Dados]
        Services[Serviços]
        Validators[Validadores]
    end

    subgraph Infrastructure["🔧 Camada de Infraestrutura"]
        API[API Routes]
        Database[Base de Dados]
        External[Serviços Externos]
        Cache[Sistema de Cache]
    end

    Pages --> Hooks
    Components --> Hooks
    Layouts --> Context

    Hooks --> State
    Context --> State
    State --> Business

    Business --> Services
    Business --> Models
    Business --> Validators

    Services --> API
    API --> Database
    API --> External
    API --> Cache

    style Presentation fill:#E3F2FD,stroke:#1976D2,stroke-width:3px
    style Application fill:#F3E5F5,stroke:#7B1FA2,stroke-width:3px
    style Domain fill:#FFF3E0,stroke:#F57C00,stroke-width:3px
    style Infrastructure fill:#E8F5E9,stroke:#388E3C,stroke-width:3px
```

---

## 🗂️ Estrutura de Diretórios Proposta

```
cgu-chatbot/
├── 📁 app/                          # App Router do Next.js
│   ├── 📁 (auth)/                  # Grupo de rotas de autenticação
│   │   ├── 📄 login/
│   │   └── 📄 register/
│   ├── 📁 api/                     # API Routes
│   │   ├── 📁 chat/
│   │   │   └── 📄 route.ts        # POST /api/chat
│   │   ├── 📁 messages/
│   │   │   └── 📄 route.ts        # GET /api/messages
│   │   └── 📁 cgu/
│   │       └── 📄 route.ts        # Integração com APIs da CGU
│   ├── 📁 chat/                    # Página do chat
│   │   └── 📄 page.tsx
│   ├── 📁 dashboard/               # Dashboard administrativo
│   │   └── 📄 page.tsx
│   ├── 📄 globals.css             # Estilos globais
│   ├── 📄 layout.tsx              # Layout raiz
│   └── 📄 page.tsx                # Página inicial
│
├── 📁 components/                   # Componentes reutilizáveis
│   ├── 📁 chat/
│   │   ├── 📄 ChatMessage.tsx
│   │   ├── 📄 ChatInput.tsx
│   │   ├── 📄 ChatHistory.tsx
│   │   └── 📄 ChatContainer.tsx
│   ├── 📁 ui/
│   │   ├── 📄 Button.tsx
│   │   ├── 📄 Input.tsx
│   │   ├── 📄 Card.tsx
│   │   └── 📄 Loading.tsx
│   └── 📁 layout/
│       ├── 📄 Header.tsx
│       ├── 📄 Footer.tsx
│       └── 📄 Sidebar.tsx
│
├── 📁 lib/                         # Bibliotecas e utilitários
│   ├── 📁 ai/
│   │   ├── 📄 chatbot.ts          # Lógica do chatbot
│   │   └── 📄 nlp.ts              # Processamento de linguagem
│   ├── 📁 api/
│   │   ├── 📄 cgu-client.ts       # Cliente API da CGU
│   │   └── 📄 http-client.ts      # Cliente HTTP genérico
│   ├── 📁 db/
│   │   ├── 📄 client.ts           # Cliente do banco de dados
│   │   └── 📄 queries.ts          # Queries SQL/NoSQL
│   └── 📁 utils/
│       ├── 📄 validators.ts       # Validadores
│       ├── 📄 formatters.ts       # Formatadores
│       └── 📄 constants.ts        # Constantes
│
├── 📁 types/                       # Definições de tipos TypeScript
│   ├── 📄 chat.ts
│   ├── 📄 user.ts
│   └── 📄 api.ts
│
├── 📁 hooks/                       # Custom React Hooks
│   ├── 📄 useChat.ts
│   ├── 📄 useMessages.ts
│   └── 📄 useAuth.ts
│
├── 📁 context/                     # Context Providers
│   ├── 📄 ChatContext.tsx
│   ├── 📄 ThemeContext.tsx
│   └── 📄 AuthContext.tsx
│
├── 📁 public/                      # Arquivos estáticos
│   ├── 📁 images/
│   ├── 📁 icons/
│   └── 📁 fonts/
│
├── 📁 tests/                       # Testes
│   ├── 📁 unit/
│   ├── 📁 integration/
│   └── 📁 e2e/
│
├── 📁 docs/                        # Documentação adicional
│   ├── 📄 API.md
│   └── 📄 DEPLOYMENT.md
│
├── 📄 .env.local                   # Variáveis de ambiente locais
├── 📄 .env.example                 # Exemplo de variáveis
├── 📄 .gitignore
├── 📄 eslint.config.mjs
├── 📄 next.config.ts
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 README.md
├── 📄 FLOWCHART.md
└── 📄 ARCHITECTURE.md
```

---

## 🔄 Fluxo de Dados

```mermaid
sequenceDiagram
    actor User as 👤 Usuário
    participant UI as 🖥️ UI Components
    participant Hook as 🎣 useChat Hook
    participant Context as 📦 ChatContext
    participant API as 🚀 API Route
    participant Service as 🧠 ChatService
    participant AI as 🤖 AI Engine
    participant DB as 🗄️ Database

    User->>UI: Digite mensagem
    UI->>Hook: sendMessage(text)
    Hook->>Context: updateMessages(newMessage)
    Context->>UI: Re-render com nova mensagem

    Hook->>API: POST /api/chat
    API->>Service: processMessage(text)
    Service->>AI: analyzeIntent(text)
    AI-->>Service: Intent + Entities

    Service->>DB: Query relevant data
    DB-->>Service: Data results

    Service->>AI: generateResponse(intent, data)
    AI-->>Service: Response text

    Service-->>API: Formatted response
    API-->>Hook: Response JSON
    Hook->>Context: updateMessages(botResponse)
    Context->>UI: Re-render com resposta
    UI->>User: Exibir resposta do bot
```

---

## 🧩 Componentes Principais

### 1. ChatContainer

```typescript
// components/chat/ChatContainer.tsx
interface ChatContainerProps {
  initialMessages?: Message[];
  userId?: string;
  theme?: "light" | "dark";
}

export function ChatContainer({
  initialMessages,
  userId,
  theme,
}: ChatContainerProps) {
  // Gerencia o estado completo do chat
  // Coordena ChatHistory e ChatInput
  // Implementa lógica de scroll automático
}
```

### 2. ChatMessage

```typescript
// components/chat/ChatMessage.tsx
interface ChatMessageProps {
  message: Message;
  isBot: boolean;
  timestamp: Date;
  avatar?: string;
}

export function ChatMessage({
  message,
  isBot,
  timestamp,
  avatar,
}: ChatMessageProps) {
  // Renderiza mensagem individual
  // Suporta markdown
  // Mostra indicador de digitação
}
```

### 3. useChat Hook

```typescript
// hooks/useChat.ts
interface UseChatReturn {
  messages: Message[];
  sendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  clearHistory: () => void;
}

export function useChat(config?: ChatConfig): UseChatReturn {
  // Gerencia estado das mensagens
  // Envia requisições para API
  // Trata erros e loading
}
```

---

## 🔌 Integrações com APIs da CGU

```mermaid
graph LR
    App[CGU Chatbot] --> Portal[Portal da Transparência]
    App --> FALA[Fala.BR]
    App --> LAI[LAI - Lei de Acesso à Informação]
    App --> CEAF[CEAF - Central de Atendimento]
    App --> Dados[Dados Abertos CGU]

    Portal --> |Consultas de Gastos| Response1[Dados Financeiros]
    FALA --> |Ouvidoria| Response2[Manifestações]
    LAI --> |Pedidos de Informação| Response3[Solicitações]
    CEAF --> |Suporte| Response4[Atendimento]
    Dados --> |Datasets| Response5[Dados Públicos]

    style App fill:#2196F3,stroke:#333,stroke-width:3px,color:#fff
    style Portal fill:#4CAF50,stroke:#333,stroke-width:2px
    style FALA fill:#FF9800,stroke:#333,stroke-width:2px
    style LAI fill:#9C27B0,stroke:#333,stroke-width:2px
    style CEAF fill:#F44336,stroke:#333,stroke-width:2px
    style Dados fill:#00BCD4,stroke:#333,stroke-width:2px
```

---

## 🔐 Segurança e Autenticação

```mermaid
flowchart TD
    Request[📨 Request] --> Auth{🔐 Autenticado?}
    Auth -->|Não| Login[🔑 Página de Login]
    Auth -->|Sim| CheckRole{👤 Verificar Role}

    Login --> Authenticate[Autenticar Usuário]
    Authenticate --> ValidCreds{✅ Credenciais Válidas?}
    ValidCreds -->|Não| LoginError[❌ Erro de Login]
    ValidCreds -->|Sim| GenerateToken[🎟️ Gerar JWT Token]

    GenerateToken --> SetCookie[🍪 Set Cookie]
    SetCookie --> CheckRole

    CheckRole -->|Admin| AdminDashboard[⚙️ Dashboard Admin]
    CheckRole -->|User| UserChat[💬 Interface de Chat]
    CheckRole -->|Guest| GuestView[👁️ Visualização Limitada]

    LoginError --> Login

    AdminDashboard --> Access[✅ Acesso Concedido]
    UserChat --> Access
    GuestView --> Access

    style Auth fill:#FFC107,stroke:#333,stroke-width:2px
    style Access fill:#4CAF50,stroke:#333,stroke-width:2px,color:#fff
    style LoginError fill:#f44336,stroke:#333,stroke-width:2px,color:#fff
```

---

## 📊 Modelo de Dados

```mermaid
erDiagram
    USER ||--o{ MESSAGE : sends
    USER ||--o{ SESSION : has
    SESSION ||--o{ MESSAGE : contains
    MESSAGE ||--o{ ATTACHMENT : includes
    USER ||--o{ FEEDBACK : provides
    MESSAGE ||--o{ FEEDBACK : receives

    USER {
        string id PK
        string email
        string name
        string role
        datetime createdAt
        datetime lastLogin
    }

    SESSION {
        string id PK
        string userId FK
        datetime startedAt
        datetime endedAt
        string status
    }

    MESSAGE {
        string id PK
        string sessionId FK
        string userId FK
        string content
        string type
        datetime timestamp
        boolean isBot
    }

    ATTACHMENT {
        string id PK
        string messageId FK
        string fileUrl
        string fileType
        int fileSize
    }

    FEEDBACK {
        string id PK
        string messageId FK
        string userId FK
        int rating
        string comment
        datetime createdAt
    }
```

---

## ⚡ Estratégias de Performance

### 1. Server Components

```typescript
// app/chat/page.tsx - Server Component por padrão
export default async function ChatPage() {
  // Busca dados no servidor
  const initialData = await fetchInitialMessages();

  return (
    <ChatContainer initialMessages={initialData}>
      <ChatHistory /> {/* Client Component */}
    </ChatContainer>
  );
}
```

### 2. Streaming e Suspense

```typescript
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<ChatSkeleton />}>
      <ChatContainer />
    </Suspense>
  );
}
```

### 3. Caching

```mermaid
graph TD
    Request[📨 Request] --> Cache{💾 Cache Hit?}
    Cache -->|Sim| ReturnCached[⚡ Retorna do Cache]
    Cache -->|Não| FetchData[🔍 Buscar Dados]

    FetchData --> UpdateCache[📝 Atualizar Cache]
    UpdateCache --> ReturnFresh[✅ Retorna Dados Frescos]

    ReturnCached --> Response[📤 Response]
    ReturnFresh --> Response

    style Cache fill:#FF9800,stroke:#333,stroke-width:2px
    style ReturnCached fill:#4CAF50,stroke:#333,stroke-width:2px,color:#fff
```

---

## 🧪 Estratégia de Testes

```mermaid
graph TB
    Tests[🧪 Testes]

    Tests --> Unit[Unit Tests]
    Tests --> Integration[Integration Tests]
    Tests --> E2E[E2E Tests]

    Unit --> Jest[Jest + React Testing Library]
    Unit --> Coverage[Coverage > 80%]

    Integration --> API_Test[Testes de API]
    Integration --> Component_Test[Testes de Componentes]

    E2E --> Playwright[Playwright]
    E2E --> User_Flow[Fluxos do Usuário]

    style Tests fill:#2196F3,stroke:#333,stroke-width:3px,color:#fff
    style Unit fill:#4CAF50,stroke:#333,stroke-width:2px
    style Integration fill:#FF9800,stroke:#333,stroke-width:2px
    style E2E fill:#9C27B0,stroke:#333,stroke-width:2px
```

---

## 🚀 Pipeline de Deploy

```mermaid
gitGraph
    commit id: "feat: initial setup"
    commit id: "feat: add chat component"
    branch develop
    checkout develop
    commit id: "feat: add AI integration"
    commit id: "test: add unit tests"
    branch feature/new-feature
    checkout feature/new-feature
    commit id: "feat: new feature"
    checkout develop
    merge feature/new-feature
    commit id: "fix: bug fix"
    checkout main
    merge develop tag: "v1.0.0"
    commit id: "deploy: production"
```

### Stages do Pipeline

1. **Commit** → Lint e Format Check
2. **Push** → Unit Tests
3. **PR** → Integration Tests + Code Review
4. **Merge to Develop** → Deploy to Staging
5. **Merge to Main** → Deploy to Production

---

## 📈 Monitoramento e Observabilidade

```mermaid
graph TD
    App[🤖 CGU Chatbot] --> Metrics[📊 Métricas]
    App --> Logs[📝 Logs]
    App --> Traces[🔍 Traces]
    App --> Errors[❌ Errors]

    Metrics --> Dashboard[📈 Dashboard]
    Logs --> Aggregation[🗂️ Log Aggregation]
    Traces --> APM[⚡ APM Tool]
    Errors --> Tracking[🐛 Error Tracking]

    Dashboard --> Alert[🚨 Alertas]
    Aggregation --> Alert
    APM --> Alert
    Tracking --> Alert

    Alert --> Team[👥 Equipe DevOps]

    style App fill:#2196F3,stroke:#333,stroke-width:3px,color:#fff
    style Alert fill:#f44336,stroke:#333,stroke-width:2px,color:#fff
    style Team fill:#4CAF50,stroke:#333,stroke-width:2px
```

---

## 🌍 Internacionalização (i18n)

```typescript
// Estrutura de tradução
const translations = {
  "pt-BR": {
    chat: {
      placeholder: "Digite sua mensagem...",
      send: "Enviar",
      welcome: "Bem-vindo ao CGU Chatbot!",
    },
  },
  en: {
    chat: {
      placeholder: "Type your message...",
      send: "Send",
      welcome: "Welcome to CGU Chatbot!",
    },
  },
};
```

---

## 📱 Responsividade

```mermaid
graph LR
    Design[🎨 Design System] --> Mobile[📱 Mobile First]
    Design --> Tablet[📱 Tablet]
    Design --> Desktop[💻 Desktop]

    Mobile --> Breakpoint1[< 640px]
    Tablet --> Breakpoint2[640px - 1024px]
    Desktop --> Breakpoint3[> 1024px]

    Breakpoint1 --> TailwindSM[sm:]
    Breakpoint2 --> TailwindMD[md:]
    Breakpoint3 --> TailwindLG[lg:]

    style Design fill:#2196F3,stroke:#333,stroke-width:3px,color:#fff
```

---

<div align="center">

**Documentação de Arquitetura - CGU Chatbot**

[← Voltar para README](./README.md) | [Ver Fluxogramas](./FLOWCHART.md)

</div>
