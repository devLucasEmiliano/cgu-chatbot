"use client"

import { useState, useEffect } from "react"
import { LanguageSelection } from "@/src/components/language-selection"
import { TermsAcceptance } from "@/src/components/terms-acceptance"
import { ChatbotInterface } from "@/src/components/chatbot-interface"
import { ConfirmationScreen } from "@/src/components/confirmation-screen"
import { useUserPreferences } from "@/src/lib/user-preferences"

export type Language = "pt-BR" | "en" | "es"

export type Step = "language" | "terms" | "chat" | "confirmation"

export default function Home() {
  const { preferences, isLoaded, setLanguage, acceptTerms } = useUserPreferences()
  const [currentStep, setCurrentStep] = useState<Step>("language")
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("pt-BR")
  const [protocol, setProtocol] = useState<string>("")

  // Carregar preferências salvas quando o componente montar
  useEffect(() => {
    if (!isLoaded) return

    // Se já tem idioma salvo, usa ele
    if (preferences.language) {
      setSelectedLanguage(preferences.language)
    }

    // Se já aceitou os termos e tem idioma, vai direto pro chat
    if (preferences.termsAccepted && preferences.language) {
      setCurrentStep("chat")
    } else if (preferences.language && !preferences.termsAccepted) {
      // Se tem idioma mas não aceitou termos, vai pra tela de termos
      setCurrentStep("terms")
    }
  }, [isLoaded, preferences])

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language)
    setLanguage(language)
    setCurrentStep("terms")
  }

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language)
    setLanguage(language)
  }

  const handleTermsAccept = () => {
    acceptTerms()
    setCurrentStep("chat")
  }

  const handleChatComplete = (generatedProtocol: string) => {
    setProtocol(generatedProtocol)
    setCurrentStep("confirmation")
  }

  const handleRestart = () => {
    setCurrentStep("language")
    setProtocol("")
  }

  // Mostrar loading enquanto carrega preferências
  if (!isLoaded) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      {currentStep === "language" && <LanguageSelection onLanguageSelect={handleLanguageSelect} />}
      {currentStep === "terms" && (
        <TermsAcceptance
          language={selectedLanguage}
          onAccept={handleTermsAccept}
          onBack={() => setCurrentStep("language")}
          onLanguageChange={handleLanguageChange}
        />
      )}
      {currentStep === "chat" && (
        <ChatbotInterface
          language={selectedLanguage}
          onComplete={handleChatComplete}
          onLanguageChange={handleLanguageChange}
        />
      )}
      {currentStep === "confirmation" && (
        <ConfirmationScreen language={selectedLanguage} protocol={protocol} onRestart={handleRestart} />
      )}
    </main>
  )
}
