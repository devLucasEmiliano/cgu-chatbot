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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <Image
          src="plant-1.svg"
          alt=""
          width={300}
          height={400}
          className="absolute bottom-0 left-0 animate-in fade-in slide-in-from-bottom-8 duration-1000"
          style={{ animationDelay: "200ms" }}
        />
      </div>

      <Card className="w-full max-w-md p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center gap-6">
          <div
            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-in zoom-in duration-500"
            style={{ animationDelay: "300ms" }}
          >
            <Globe className="w-8 h-8 text-primary animate-pulse" />
          </div>

          <div
            className="text-center space-y-2 animate-in fade-in slide-in-from-top-4 duration-500"
            style={{ animationDelay: "400ms" }}
          >
            <h1 className="text-2xl font-semibold text-balance">
              {selected ? translations.title[selected] : translations.title["pt-BR"]}
            </h1>
            <p className="text-sm text-muted-foreground">
              {selected ? translations.subtitle[selected] : translations.subtitle["pt-BR"]}
            </p>
          </div>

          <div className="w-full space-y-3">
            {languages.map((lang, index) => (
              <button
                key={lang.code}
                onClick={() => setSelected(lang.code)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left flex items-center gap-3 animate-in fade-in slide-in-from-left-4 hover:scale-105 ${
                  selected === lang.code
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-border hover:border-primary/50 bg-card hover:shadow-md"
                }`}
                style={{ animationDelay: `${500 + index * 100}ms` }}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </button>
            ))}
          </div>

          <Button
            onClick={() => selected && onLanguageSelect(selected)}
            disabled={!selected}
            className="w-full h-12 text-base font-medium animate-in fade-in slide-in-from-bottom-4 duration-500 transition-all hover:scale-105"
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
