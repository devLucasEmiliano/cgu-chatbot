"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Card } from "@/src/components/ui/card"
import { Globe } from "lucide-react"
import type { Language } from "@/src/app/page"
import Image from "next/image"

interface LanguageSelectionProps {
  onLanguageSelect: (language: Language) => void
}

const languages = [
  { code: "pt-BR" as Language, flag: "🇧🇷", name: "Português (Brasil)" },
  { code: "en" as Language, flag: "🇺🇸", name: "English" },
  { code: "es" as Language, flag: "🇪🇸", name: "Español" },
]

const translations = {
  title: {
    "pt-BR": "Escolha seu idioma preferido",
    en: "Select your preferred language",
    es: "Seleccione su idioma preferido",
  },
  subtitle: {
    "pt-BR": "Escolha o idioma para iniciar",
    en: "Choose the language to start",
    es: "Elija el idioma para comenzar",
  },
  continue: {
    "pt-BR": "Continuar",
    en: "Continue",
    es: "Continuar",
  },
}

export function LanguageSelection({ onLanguageSelect }: LanguageSelectionProps) {
  const [selected, setSelected] = useState<Language | null>(null)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Animated background decorations */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <Image
          src="/plant-1.svg"
          alt=""
          width={300}
          height={400}
          className="absolute bottom-0 left-0 animate-float"
          style={{ animationDelay: "0s" }}
        />
        <Image
          src="/plant-1.svg"
          alt=""
          width={280}
          height={380}
          className="absolute bottom-0 right-0 scale-x-[-1] animate-float"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <Card className="w-full max-w-md p-6 md:p-8 shadow-2xl relative z-10 animate-modal-entrance rounded-2xl border-2 hover:shadow-3xl transition-smooth">
        <div className="flex flex-col items-center gap-5 md:gap-6">
          {/* Globe icon with pulse animation */}
          <div
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center animate-in zoom-in duration-500 shadow-lg"
            style={{ animationDelay: "300ms" }}
          >
            <Globe className="w-8 h-8 md:w-10 md:h-10 text-primary animate-pulse" />
          </div>

          {/* Title and subtitle */}
          <div
            className="text-center space-y-2 animate-in fade-in slide-in-from-top-4 duration-500"
            style={{ animationDelay: "400ms" }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-balance">
              {selected ? translations.title[selected] : translations.title["pt-BR"]}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground text-balance">
              {selected ? translations.subtitle[selected] : translations.subtitle["pt-BR"]}
            </p>
          </div>

          {/* Language options */}
          <div className="w-full space-y-3">
            {languages.map((lang, index) => (
              <button
                key={lang.code}
                onClick={() => setSelected(lang.code)}
                className={`w-full p-4 rounded-xl border-2 transition-smooth text-left flex items-center gap-3 animate-in fade-in slide-in-from-left-4 hover:scale-[1.02] active:scale-[0.98] ${
                  selected === lang.code
                    ? "border-primary bg-primary/10 shadow-lg ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50 bg-card hover:shadow-md"
                }`}
                style={{ animationDelay: `${500 + index * 100}ms` }}
              >
                <span className="text-2xl md:text-3xl">{lang.flag}</span>
                <span className="font-medium text-sm md:text-base">{lang.name}</span>
                {selected === lang.code && (
                  <span className="ml-auto text-primary animate-in zoom-in duration-200">✓</span>
                )}
              </button>
            ))}
          </div>

          {/* Continue button */}
          <Button
            onClick={() => selected && onLanguageSelect(selected)}
            disabled={!selected}
            className="w-full h-11 md:h-12 text-sm md:text-base font-medium animate-in fade-in slide-in-from-bottom-4 duration-500 transition-smooth hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            style={{ animationDelay: "800ms" }}
            size="lg"
          >
            {selected ? translations.continue[selected] : translations.continue["pt-BR"]}
          </Button>
        </div>
      </Card>
    </div>
  )
}
