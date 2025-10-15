# 📊 Fluxograma da Aplicação CGU Chatbot

## Fluxograma Principal

```mermaid
flowchart TD
    Start([👤 Usuário Acessa a Aplicação]) --> LoadApp[⚙️ Carregar Next.js App]
    LoadApp --> RootLayout[📐 Root Layout - layout.tsx]
    RootLayout --> LoadFonts[🔤 Carregar Fontes Geist]
    LoadFonts --> ApplyStyles[🎨 Aplicar Estilos Globais]
    ApplyStyles --> RenderPage[🖥️ Renderizar Página Inicial]

    RenderPage --> HomePage[📄 page.tsx - Home]
    HomePage --> DisplayUI[💬 Exibir Interface do Chat]

    DisplayUI --> UserAction{🤔 Ação do Usuário}

    UserAction -->|Enviar Mensagem| ProcessInput[📝 Processar Input do Usuário]
    UserAction -->|Navegar| Navigation[🧭 Navegação na Interface]
    UserAction -->|Sair| End([👋 Fim da Sessão])

    ProcessInput --> ValidateInput{✅ Input Válido?}
    ValidateInput -->|Não| ShowError[⚠️ Exibir Mensagem de Erro]
    ShowError --> DisplayUI

    ValidateInput -->|Sim| SendToBackend[🚀 Enviar para Backend/API]
    SendToBackend --> ProcessAI[🤖 Processar com IA/Lógica]

    ProcessAI --> QueryDatabase{🗄️ Consultar Base de Dados?}
    QueryDatabase -->|Sim| FetchData[📊 Buscar Informações da CGU]
    QueryDatabase -->|Não| GenerateResponse[💭 Gerar Resposta Direta]

    FetchData --> GenerateResponse
    GenerateResponse --> FormatResponse[📋 Formatar Resposta]
    FormatResponse --> DisplayResponse[✉️ Exibir Resposta ao Usuário]

    DisplayResponse --> DisplayUI
    Navigation --> DisplayUI

    style Start fill:#4CAF50,stroke:#333,stroke-width:2px,color:#fff
    style End fill:#f44336,stroke:#333,stroke-width:2px,color:#fff
    style ProcessAI fill:#2196F3,stroke:#333,stroke-width:2px,color:#fff
    style DisplayResponse fill:#FF9800,stroke:#333,stroke-width:2px,color:#fff
    style HomePage fill:#9C27B0,stroke:#333,stroke-width:2px,color:#fff
```

---

## Fluxograma de Arquitetura Técnica

```mermaid
graph TB
    subgraph Cliente["🌐 Cliente (Browser)"]
        UI[Interface do Usuário React]
        Router[Next.js App Router]
    end

    subgraph Servidor["⚙️ Servidor Next.js"]
        SSR[Server-Side Rendering]
        API[API Routes]
        ServerComponents[Server Components]
    end

    subgraph Dados["🗄️ Camada de Dados"]
        Database[(Base de Dados CGU)]
        Cache[Cache/Redis]
        External[APIs Externas]
    end

    subgraph Processamento["🤖 Processamento"]
        AIEngine[Motor de IA/NLP]
        BusinessLogic[Lógica de Negócio]
        Validator[Validador de Entrada]
    end

    UI --> Router
    Router --> SSR
    Router --> ServerComponents
    UI --> API

    API --> Validator
    Validator --> BusinessLogic
    BusinessLogic --> AIEngine

    AIEngine --> Database
    AIEngine --> Cache
    AIEngine --> External

    Database --> BusinessLogic
    Cache --> BusinessLogic
    External --> BusinessLogic

    BusinessLogic --> API
    SSR --> UI
    ServerComponents --> UI

    style Cliente fill:#E3F2FD,stroke:#1976D2,stroke-width:2px
    style Servidor fill:#F3E5F5,stroke:#7B1FA2,stroke-width:2px
    style Dados fill:#FFF3E0,stroke:#F57C00,stroke-width:2px
    style Processamento fill:#E8F5E9,stroke:#388E3C,stroke-width:2px
```

---

## Fluxograma do Ciclo de Vida do Componente

```mermaid
sequenceDiagram
    participant U as Usuário
    participant B as Browser
    participant N as Next.js Server
    participant R as React Component
    participant A as API/Backend
    participant D as Database

    U->>B: Acessa aplicação
    B->>N: Requisição HTTP
    N->>N: Server-Side Rendering
    N->>R: Renderizar Layout
    R->>R: Carregar fontes e estilos
    N->>B: HTML inicial
    B->>U: Exibe página

    U->>B: Digita mensagem
    B->>R: Evento onChange
    U->>B: Clica enviar
    B->>R: Evento onSubmit

    R->>R: Validar input
    R->>A: POST /api/chat
    A->>A: Processar com IA
    A->>D: Query dados CGU
    D-->>A: Retorna resultados
    A->>A: Gerar resposta
    A-->>R: Response JSON
    R->>R: Atualizar estado
    R->>B: Re-render UI
    B->>U: Exibe resposta
```

---

## Fluxograma de Deploy e Build

```mermaid
flowchart LR
    Dev[💻 Desenvolvimento Local] --> Git[📦 Git Commit]
    Git --> Push[⬆️ Push para Repositório]
    Push --> CI{🔄 CI/CD Pipeline}

    CI -->|Tests| RunTests[🧪 Executar Testes]
    CI -->|Lint| RunLint[✅ Verificar Lint]
    CI -->|Build| RunBuild[🏗️ Build Produção]

    RunTests --> TestResult{Passou?}
    TestResult -->|Não| Fail[❌ Build Falhou]
    TestResult -->|Sim| Continue1[➡️]

    RunLint --> LintResult{Passou?}
    LintResult -->|Não| Fail
    LintResult -->|Sim| Continue2[➡️]

    Continue1 --> RunBuild
    Continue2 --> RunBuild

    RunBuild --> BuildResult{Sucesso?}
    BuildResult -->|Não| Fail
    BuildResult -->|Sim| Deploy[🚀 Deploy]

    Deploy --> Vercel[☁️ Vercel/Servidor]
    Vercel --> Live[✅ Aplicação Live]

    Fail --> Notify[📧 Notificar Desenvolvedor]
    Notify --> Dev

    style Dev fill:#4CAF50,stroke:#333,stroke-width:2px
    style Live fill:#2196F3,stroke:#333,stroke-width:2px,color:#fff
    style Fail fill:#f44336,stroke:#333,stroke-width:2px,color:#fff
```

---

## Fluxograma de Estados do Chat

```mermaid
stateDiagram-v2
    [*] --> Idle: Aplicação Carregada

    Idle --> Typing: Usuário digitando
    Typing --> Idle: Limpa campo
    Typing --> Validating: Envia mensagem

    Validating --> Error: Input inválido
    Validating --> Processing: Input válido

    Error --> Idle: Exibe erro

    Processing --> Waiting: Enviando para API
    Waiting --> Receiving: Recebendo resposta
    Receiving --> Displaying: Formatar resposta

    Displaying --> Idle: Resposta exibida

    Idle --> [*]: Usuário sai
```

---

## Descrição dos Fluxos

### 1. Fluxograma Principal

Representa o fluxo completo de interação do usuário com a aplicação, desde o acesso inicial até o recebimento de respostas do chatbot.

**Pontos-chave:**

- Inicialização da aplicação Next.js
- Carregamento de recursos (fontes, estilos)
- Interação do usuário
- Processamento de mensagens
- Exibição de respostas

### 2. Arquitetura Técnica

Mostra a separação em camadas da aplicação e como elas se comunicam.

**Camadas:**

- **Cliente**: Interface React e roteamento
- **Servidor**: SSR e API routes
- **Dados**: Banco de dados e cache
- **Processamento**: IA e lógica de negócio

### 3. Ciclo de Vida do Componente

Demonstra a sequência de eventos e comunicação entre os diferentes componentes do sistema.

**Fluxo:**

1. Requisição inicial do usuário
2. Server-Side Rendering
3. Interação com o chat
4. Comunicação com API
5. Atualização da interface

### 4. Deploy e Build

Ilustra o processo de continuous integration e deployment.

**Etapas:**

1. Desenvolvimento local
2. Commit e push
3. Pipeline CI/CD
4. Testes automatizados
5. Build de produção
6. Deploy

### 5. Estados do Chat

Diagrama de estados mostrando as diferentes fases da interação no chat.

**Estados:**

- Idle (ocioso)
- Typing (digitando)
- Validating (validando)
- Processing (processando)
- Waiting (aguardando)
- Displaying (exibindo)

---

## Como Visualizar

### Ferramentas Recomendadas

1. **GitHub / GitLab**

   - Renderizam Mermaid automaticamente em arquivos `.md`

2. **VS Code**

   - Extensão: [Markdown Preview Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid)

3. **Mermaid Live Editor**

   - Acesse: [mermaid.live](https://mermaid.live/)
   - Cole o código Mermaid para editar e exportar

4. **Confluence / Notion**
   - Suportam Mermaid diagrams nativamente

---

## Legenda de Símbolos

| Símbolo | Significado             |
| ------- | ----------------------- |
| 👤      | Usuário                 |
| ⚙️      | Processamento/Sistema   |
| 🤖      | Inteligência Artificial |
| 🗄️      | Banco de Dados          |
| 🚀      | Deploy/API              |
| ✅      | Validação/Sucesso       |
| ❌      | Erro/Falha              |
| 💬      | Interface/Chat          |
| 📊      | Dados/Informação        |

---

<div align="center">

**Documentação do Fluxograma - CGU Chatbot**

[← Voltar para README](./README.md)

</div>
