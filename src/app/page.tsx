"use client"

import { useState } from "react"
import { LanguageSelection } from "@/src/components/language-selection"
import { TermsAcceptance } from "@/src/components/terms-acceptance"
import { ChatbotInterface } from "@/src/components/chatbot-interface"
import { ConfirmationScreen } from "@/src/components/confirmation-screen"

export type Language = "pt-BR" | "en" | "es"

export type Step = "language" | "terms" | "chat" | "confirmation"

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>("language")
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("pt-BR")
  const [protocol, setProtocol] = useState<string>("")

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language)
    setCurrentStep("terms")
  }

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language)
  }

  const handleTermsAccept = () => {
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
