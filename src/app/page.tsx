"use client";

import { useState, useEffect } from "react";
import { LanguageSelection } from "@/src/components/language-selection";
import { TermsAcceptance } from "@/src/components/terms-acceptance";
import { ChatbotInterface } from "@/src/components/chatbot-interface";
import { ConfirmationScreen } from "@/src/components/confirmation-screen";
import { useUserPreferences } from "@/src/lib/user-preferences";

export type Language = "pt-BR" | "en" | "es";

export type Step = "language" | "terms" | "chat" | "confirmation";

type SubmissionMeta = {
  isAnonymousReport?: boolean;
  redirectToFalaBr?: boolean;
};
type SuccessResult = {
  success: true;
  data: {
    NumeroProtocolo?: string;
    CodigoAcesso?: string;
    DataCadastro?: string;
    PrazoResposta?: string;
  };
  meta?: SubmissionMeta;
};
type ErrorResult = { success: false; error: string };
export type SubmitResult = SuccessResult | ErrorResult;

export default function Home() {
  console.log("[ACESSO] Página principal acessada -", new Date().toISOString());

  const { preferences, isLoaded, setLanguage, acceptTerms } =
    useUserPreferences();
  const [currentStep, setCurrentStep] = useState<Step>("language");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("pt-BR");
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);

  // Carregar preferencias salvas quando o componente montar
  useEffect(() => {
    if (!isLoaded) return;

    // Se ja tem idioma salvo, usa ele
    if (preferences.language) {
      setSelectedLanguage(preferences.language);
    }

    // Se ja aceitou os termos e tem idioma, vai direto pro chat
    if (preferences.termsAccepted && preferences.language) {
      setCurrentStep("chat");
    } else if (preferences.language && !preferences.termsAccepted) {
      // Se tem idioma mas nao aceitou termos, vai pra tela de termos
      setCurrentStep("terms");
    }
  }, [isLoaded, preferences]);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setLanguage(language);
    setCurrentStep("terms");
  };

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    setLanguage(language);
  };

  const handleTermsAccept = () => {
    acceptTerms();
    setCurrentStep("chat");
  };

  const handleChatComplete = (result: SubmitResult) => {
    setSubmitResult(result);
    setCurrentStep("confirmation");
  };

  const handleRestart = () => {
    // Volta direto para o chat, mantendo idioma ja escolhido e termos aceitos
    setSubmitResult(null);
    setCurrentStep("chat");
  };

  const isAnonymousSubmission =
    submitResult && submitResult.success
      ? Boolean(submitResult.meta?.isAnonymousReport)
      : false;

  // Mostrar loading enquanto carrega preferencias
  if (!isLoaded) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {currentStep === "language" && (
        <LanguageSelection onLanguageSelect={handleLanguageSelect} />
      )}
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
      {currentStep === "confirmation" && submitResult && (
        <ConfirmationScreen
          language={selectedLanguage}
          result={submitResult}
          onRestart={handleRestart}
          isAnonymous={isAnonymousSubmission}
        />
      )}
    </main>
  );
}
