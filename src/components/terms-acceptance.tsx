"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { ArrowLeft, Globe } from "lucide-react";
import Image from "next/image";
import type { Language } from "@/src/app/page";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

interface TermsAcceptanceProps {
  language: Language;
  onAccept: () => void;
  onBack: () => void;
  onLanguageChange?: (language: Language) => void;
}

const translations = {
  title: {
    "pt-BR": "Termos de Uso",
    en: "Terms of Use",
    es: "Términos de Uso",
  },
  content: {
    "pt-BR": `Este canal foi pensado especialmente para que sejam encaminhadas ao governo brasileiro manifestações como sugestões, elogios, denúncias, reclamações ou solicitações relacionadas à COP30, sempre com respeito à sua voz e ao compromisso com a transparência e integridade.

**Prazo de Atendimento**

O prazo para atendimento das manifestações registradas neste formulário é de 30 dias, prorrogável por igual período.

**Informações Importantes**

Antes de iniciar o formulário, orientamos que verifique se já existe canal adequado para encaminhamento da sua demanda em [https://cop30.br/pt-br/servicos-da-cop30/fale-conosco](https://cop30.br/pt-br/servicos-da-cop30/fale-conosco). A utilização adequada dos canais indicados na página mencionada pode trazer maior tempestividade para soluções de casos específicos, como denúncias trabalhistas e problemas com serviços de hospedagem e transporte.

**Plataforma Fala.BR**

As manifestações registradas nesse formulário serão tratadas na Plataforma Fala.BR. A Plataforma Fala.BR é um canal integrado para encaminhamento de manifestações a órgãos e entidades do poder público brasileiro.`,
    en: `This channel was designed specifically to forward expressions such as suggestions, compliments, complaints, or requests related to COP30 to the Brazilian government, always respecting your voice and the commitment to transparency and integrity.

**Deadline for service**

The deadline for addressing the manifestations registered in this form is 30 days, extendable for an equal period.

**Important Information**

Before starting the form, we advise you to check if there is already an appropriate channel for forwarding your request at [https://cop30.br/pt-br/servicos-da-cop30/fale-conosco](https://cop30.br/pt-br/servicos-da-cop30/fale-conosco). The proper use of the channels indicated on the mentioned page may provide quicker solutions to specific cases, such as labor complaints and complaints regarding accommodation and transportation services.

**Fala.BR Platform**

The manifestations registered in this form will be processed on the Fala.BR Platform. The Fala.BR Platform is an integrated channel for forwarding manifestations to agencies and entities of the Brazilian public authorities.`,
    es: `Este canal fue creado especialmente para que se envíen al gobierno brasileño solicitudes como sugerencias, felicitaciones, denuncias, reclamos o peticiones relacionadas con la COP30, siempre con respeto a su voz y al compromiso con la transparencia y la integridad.

**Plazo para atender las solicitudes**

El plazo para atender las solicitudes registradas en este formulario es de 30 días, prorrogable por igual período.

**Información Importante**

Antes de iniciar el formulario, le aconsejamos verificar si ya existe un canal apropiado para enviar su solicitud en [https://cop30.br/pt-br/servicos-da-cop30/fale-conosco](https://cop30.br/pt-br/servicos-da-cop30/fale-conosco). El uso de los canales indicados en la página mencionada puede proporcionar una solución más rápida de casos específicos, como denuncias laborales y quejas sobre servicios de hospedaje y transporte.

**Plataforma Fala.BR**

Las manifestaciones registradas en este formulario serán tratadas en la Plataforma Fala.BR. La Plataforma Fala.BR es un canal integrado para el envío de manifestaciones a órganos y entidades del poder público brasileño.`,
  },
  checkboxLabel: {
    "pt-BR": "Li e aceito os termos de uso",
    en: "I have read and accept the terms of use",
    es: "He leído y acepto los términos de uso",
  },
  accept: {
    "pt-BR": "Aceitar e Continuar",
    en: "Accept and Continue",
    es: "Aceptar y Continuar",
  },
  back: {
    "pt-BR": "Voltar",
    en: "Back",
    es: "Volver",
  },
};

const languages = [
  { code: "pt-BR" as Language, flag: "🇧🇷", name: "Português" },
  { code: "en" as Language, flag: "🇺🇸", name: "English" },
  { code: "es" as Language, flag: "🇪🇸", name: "Español" },
];

const parseLinks = (text: string) => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: (string | { text: string; url: string })[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push({ text: match[1], url: match[2] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};

export function TermsAcceptance({
  language,
  onAccept,
  onBack,
  onLanguageChange,
}: TermsAcceptanceProps) {
  const [accepted, setAccepted] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const currentLang = languages.find((lang) => lang.code === language);

  return (
    <div className="fixed inset-0 flex items-center justify-center p-3 md:p-4 bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <Image
          src="/plant-1.svg"
          alt=""
          width={250}
          height={350}
          className="absolute bottom-0 left-0 animate-in fade-in duration-1000"
        />
        <Image
          src="/plant-1.svg"
          alt=""
          width={200}
          height={300}
          className="absolute bottom-0 right-0 scale-x-[-1] animate-in fade-in duration-1000"
          style={{ animationDelay: "200ms" }}
        />
      </div>

      <Card className="w-full max-w-[95vw] md:max-w-3xl lg:max-w-4xl h-[92vh] shadow-2xl animate-in fade-in zoom-in-95 duration-500 relative z-10 flex flex-col overflow-hidden rounded-2xl">
        <div className="p-4 md:p-6 lg:p-8 flex flex-col h-full overflow-hidden">
          {/* Header with back button and language selector */}
          <div className="flex items-start justify-between mb-4 md:mb-6 animate-in fade-in duration-300 shrink-0 gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="gap-2 transition-all duration-200 hover:scale-105 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">
                {translations.back[language]}
              </span>
            </Button>

            {/* Title and subtitle - centered */}
            <div className="flex-1 text-center px-2">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1 md:mb-2 text-balance">
                {translations.title[language]}
              </h1>
            </div>

            {onLanguageChange && (
              <DropdownMenu open={isLangOpen} onOpenChange={setIsLangOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 transition-all duration-200 hover:scale-105 border-2 bg-transparent shrink-0"
                  >
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="font-medium text-xs md:text-sm">
                      {currentLang?.code.split("-")[0].toUpperCase()}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`gap-3 cursor-pointer transition-all duration-200 ${
                        language === lang.code
                          ? "bg-primary/10 font-medium"
                          : "hover:bg-muted"
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Scrollable content area */}
          <div
            className="flex-1 overflow-hidden mb-4 md:mb-6 min-h-0 animate-in fade-in duration-400"
            style={{ animationDelay: "100ms" }}
          >
            <ScrollArea className="h-full w-full rounded-xl border-2 bg-muted/30">
              <div className="max-w-none text-foreground p-4 md:p-6 overflow-x-hidden">
                {translations.content[language]
                  .split("\n\n")
                  .map((paragraph, i) => {
                    const parts = parseLinks(paragraph);
                    return (
                      <p
                        key={i}
                        className="mb-3 md:mb-4 leading-relaxed text-xs md:text-sm break-words"
                      >
                        {parts.map((part, j) =>
                          typeof part === "string" ? (
                            <span key={j}>{part}</span>
                          ) : (
                            <a
                              key={j}
                              href={part.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 underline decoration-primary/30 hover:decoration-primary transition-all duration-200 font-medium cursor-pointer break-all"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              {part.text}
                            </a>
                          )
                        )}
                      </p>
                    );
                  })}
              </div>
            </ScrollArea>
          </div>

          {/* Checkbox section */}
          <div
            className="flex items-start gap-3 mb-4 md:mb-6 p-3 md:p-4 rounded-xl bg-muted/50 border-2 border-border/50 animate-in fade-in duration-400 transition-all hover:bg-muted/70 hover:border-primary/20 shrink-0"
            style={{ animationDelay: "200ms" }}
          >
            <Checkbox
              id="terms"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked as boolean)}
              className="mt-0.5 md:mt-1 transition-all duration-200"
            />
            <label
              htmlFor="terms"
              className="text-xs md:text-sm font-medium leading-relaxed cursor-pointer select-none"
            >
              {translations.checkboxLabel[language]}
            </label>
          </div>

          {/* Action button */}
          <Button
            onClick={onAccept}
            disabled={!accepted}
            className="w-full h-11 md:h-12 text-sm md:text-base font-medium animate-in fade-in duration-400 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl shrink-0"
            style={{ animationDelay: "300ms" }}
            size="lg"
          >
            {translations.accept[language]}
          </Button>
        </div>
      </Card>
    </div>
  );
}
