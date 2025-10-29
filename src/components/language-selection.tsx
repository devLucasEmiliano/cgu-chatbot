"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import type { Language } from "@/src/app/page";
import Image from "next/image";

interface LanguageSelectionProps {
  onLanguageSelect: (language: Language) => void;
}

const languages = [
  { code: "pt-BR" as Language, flag: "BR", name: "Português (Brasil)" },
  { code: "en" as Language, flag: "US", name: "English" },
  { code: "es" as Language, flag: "ES", name: "Español" },
];

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
};

export function LanguageSelection({
  onLanguageSelect,
}: LanguageSelectionProps) {
  const [selected, setSelected] = useState<Language | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleLanguageKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (languages.length === 0) return;

    const moveFocus = (nextIndex: number) => {
      const nextLang = languages[nextIndex];
      setSelected(nextLang.code);
      optionRefs.current[nextIndex]?.focus();
    };

    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight": {
        event.preventDefault();
        const nextIndex = (index + 1) % languages.length;
        moveFocus(nextIndex);
        break;
      }
      case "ArrowUp":
      case "ArrowLeft": {
        event.preventDefault();
        const prevIndex = (index - 1 + languages.length) % languages.length;
        moveFocus(prevIndex);
        break;
      }
      case "Home": {
        event.preventDefault();
        moveFocus(0);
        break;
      }
      case "End": {
        event.preventDefault();
        moveFocus(languages.length - 1);
        break;
      }
      default:
        break;
    }
  };

  const groupLabel = selected
    ? translations.title[selected]
    : translations.title["pt-BR"];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Animated background decorations */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <Image
          src="/plant-1.svg"
          alt=""
          width={300}
          height={400}
          className="absolute bottom-0 left-0 animate-in fade-in duration-1000"
        />
        <Image
          src="/plant-1.svg"
          alt=""
          width={280}
          height={380}
          className="absolute bottom-0 right-0 scale-x-[-1] animate-in fade-in duration-1000"
          style={{ animationDelay: "200ms" }}
        />
      </div>

      <Card className="w-full max-w-md p-6 md:p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500 rounded-2xl border-2">
        <div className="flex flex-col items-center gap-5 md:gap-6">
          <div className="flex items-center gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
            <Image
              src="/cop30logo.svg"
              alt="COP30 logo"
              width={72}
              height={72}
              className="h-12 w-auto md:h-14"
              priority
            />
            <span className="text-sm font-medium text-muted-foreground md:text-base">
              +
            </span>
            <Image
              src="/falabrilogo.ico"
              alt="Fala.BR logo"
              width={72}
              height={72}
              className="h-12 w-auto md:h-14"
              priority
            />
          </div>

          {/* Title and subtitle */}
          <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-3 duration-400">
            <h1 className="text-2xl md:text-3xl font-bold text-balance">
              {selected
                ? translations.title[selected]
                : translations.title["pt-BR"]}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground text-balance">
              {selected
                ? translations.subtitle[selected]
                : translations.subtitle["pt-BR"]}
            </p>
          </div>

          {/* Language options */}
          <div
            className="w-full space-y-3"
            role="radiogroup"
            aria-label={groupLabel}
          >
            {languages.map((lang, index) => (
              <button
                key={lang.code}
                onClick={() => setSelected(lang.code)}
                type="button"
                role="radio"
                aria-checked={selected === lang.code}
                aria-label={lang.name}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 hover:scale-[1.02] active:scale-[0.98] ${
                  selected === lang.code
                    ? "border-primary bg-primary/10 shadow-lg ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50 bg-card hover:shadow-md"
                }`}
                style={{
                  animationDelay: `${200 + index * 80}ms`,
                  animationDuration: "400ms",
                }}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                onKeyDown={(event) => handleLanguageKeyDown(event, index)}
                tabIndex={
                  selected === lang.code || (!selected && index === 0) ? 0 : -1
                }
              >
                <span className="text-2xl md:text-3xl">{lang.flag}</span>
                <span className="font-medium text-sm md:text-base">
                  {lang.name}
                </span>
                {selected === lang.code && (
                  <span className="ml-auto text-primary animate-in zoom-in-95 duration-200">
                    OK
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Continue button */}
          <Button
            onClick={() => selected && onLanguageSelect(selected)}
            disabled={!selected}
            className="w-full h-11 md:h-12 text-sm md:text-base font-medium animate-in fade-in slide-in-from-bottom-2 duration-400 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            style={{ animationDelay: "500ms" }}
            size="lg"
          >
            {selected
              ? translations.continue[selected]
              : translations.continue["pt-BR"]}
          </Button>
        </div>
      </Card>
    </div>
  );
}
