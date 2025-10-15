# Changelog - CGU Chatbot COP30

## Novas Funcionalidades Implementadas

### 1. Sistema de Preferências do Usuário
- ✅ **Armazenamento Local**: Implementado sistema de localStorage para salvar preferências
- ✅ **Salvamento de Idioma**: A linguagem escolhida pelo usuário é salva e recuperada automaticamente
- ✅ **Registro de Termos Aceitos**: Sistema registra quando o usuário aceita os termos de uso
- ✅ **Hook Personalizado**: Criado `useUserPreferences` para gerenciar estado das preferências
- **Arquivo**: `src/lib/user-preferences.ts`

### 2. Modal de Termos de Uso
- ✅ **Modal com Scroll**: Termos de uso agora são exibidos em um modal com scroll interno
- ✅ **Design Responsivo**: Modal adaptável para diferentes tamanhos de tela
- ✅ **Tradução Completa**: Conteúdo disponível em português, inglês e espanhol
- ✅ **Checkbox de Confirmação**: Usuário deve marcar checkbox antes de aceitar
- **Arquivo**: `src/components/terms-modal.tsx`

### 3. Mensagem Inicial Aprimorada
- ✅ **Confirmação de Termos**: Chat informa que usuário já aceitou os termos
- ✅ **Verificação de Brasileiros**: Pergunta inicial se usuário é brasileiro
- ✅ **Redirecionamento Fala.BR**: Opção para brasileiros usarem o portal oficial
- ✅ **Opção "Não sou Brasileiro"**: Permite continuar com registro internacional
- **Formato da mensagem**:
  1. "Olá! Bem-vindo ao sistema de atendimento da COP30."
  2. "Você já leu e aceitou os Termos de Uso."
  3. "Se você for brasileiro, utilize o serviço oficial Fala.BR: [Ir para o Fala.BR] | [Eu não sou Brasileiro]"

### 4. Fluxo de Chat Otimizado
- ✅ **Eliminação de Duplicação**: Removida pergunta duplicada de nacionalidade
- ✅ **Fluxo Linear**: Processo mais direto e consistente
- ✅ **Menos Perguntas**: Reduzido número de etapas no atendimento
- **Mudanças**:
  - Verificação de brasileiro movida para o início
  - Removida pergunta de nacionalidade após descrição
  - Função `handleCountrySelect` removida
  - FlowStep "nationality" removido

### 5. Interface Visual Melhorada
- ✅ **Palmeiras Decorativas**: Elementos visuais de palmeiras nas laterais
- ✅ **Logo COP30**: Logo incluída no header do chatbot
- ✅ **Design Temático**: Identidade visual relacionada à COP30
- **Localização**: Header do `chatbot-interface.tsx`

### 6. Carregamento Inteligente de Estado
- ✅ **Auto-restauração**: Sistema restaura preferências ao recarregar página
- ✅ **Pular Etapas**: Se termos já aceitos, usuário vai direto ao chat
- ✅ **Tela de Loading**: Exibe "Carregando..." enquanto recupera preferências
- **Arquivo**: `src/app/page.tsx`

## Arquivos Criados/Modificados

### Novos Arquivos
1. `src/lib/user-preferences.ts` - Sistema de gerenciamento de preferências
2. `src/components/terms-modal.tsx` - Componente modal de termos
3. `CHANGELOG.md` - Este arquivo de documentação

### Arquivos Modificados
1. `src/app/page.tsx` - Integração com sistema de preferências
2. `src/components/chatbot-interface.tsx` - Mensagem inicial, logo COP30, palmeiras, fluxo otimizado

## Como Usar

### Sistema de Preferências
```typescript
import { useUserPreferences } from "@/src/lib/user-preferences"

const { preferences, setLanguage, acceptTerms, clearPreferences } = useUserPreferences()

// Salvar idioma
setLanguage("pt-BR")

// Aceitar termos
acceptTerms()

// Verificar se termos foram aceitos
if (preferences.termsAccepted) {
  // Usuário já aceitou
}
```

### Modal de Termos
```typescript
import { TermsModal } from "@/src/components/terms-modal"

<TermsModal
  language={language}
  isOpen={isModalOpen}
  onAccept={handleAccept}
  onClose={handleClose}
/>
```

## Fluxo Atualizado

1. **Seleção de Idioma** → Salva preferência
2. **Termos de Uso** → Salva aceitação (pula se já aceito)
3. **Chat - Mensagem Inicial**:
   - Confirma aceitação dos termos
   - Pergunta se é brasileiro
   - Oferece Fala.BR ou continuação
4. **Registro de Manifestação** → Sem perguntar nacionalidade novamente

## Benefícios

- ✅ Melhor experiência do usuário (UX)
- ✅ Menos perguntas repetitivas
- ✅ Preferências persistentes entre sessões
- ✅ Fluxo mais rápido e direto
- ✅ Design visualmente atraente
- ✅ Conformidade com requisitos da COP30
