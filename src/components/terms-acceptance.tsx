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
    es: "Terminos de Uso",
  },
  subtitle: {
    "pt-BR":
      "Ao aceitar, voce concorda com os termos e pode prosseguir com o registro de sua solicitacao.",
    en: "By accepting, you agree to the terms and can proceed with registering your request.",
    es: "Al aceptar, usted acepta los terminos y puede proceder con el registro de su solicitud.",
  },
  content: {
    "pt-BR": `Este canal foi projetado especialmente para manifestacoes como sugestoes, elogios, denuncias, reclamacoes ou solicitacoes relacionadas a COP30 a serem encaminhadas ao governo brasileiro, sempre com respeito a sua voz e compromisso com a transparencia e integridade.

**Prazo de Atendimento**

O prazo para atendimento das manifestacoes registradas neste formulario e de 30 dias, prorrogavel por igual periodo.

**Informacoes Importantes**

Antes de iniciar o formulario, aconselhamos verificar se ja existe um canal apropriado para encaminhar sua solicitacao. Para casos especificos, utilizar os canais abaixo pode fornecer solucoes mais rapidas:

a) Denuncias Trabalhistas: Acesse [https://mpt.mp.br/pgt/servicos/servico-denuncia](https://mpt.mp.br/pgt/servicos/servico-denuncia) (sistema em portugues)

b) Reclamacoes sobre servicos de acomodacao e transporte: Denuncie em [https://falabr.cgu.gov.br](https://falabr.cgu.gov.br)

c) Incidentes na Zona Azul: Denuncie em [https://falabr.cgu.gov.br](https://falabr.cgu.gov.br)

**Plataforma Fala.BR**

As manifestacoes registradas neste formulario serao processadas na Plataforma Fala.BR. A Plataforma Fala.BR e o canal oficial de comunicacao entre o cidadao e o governo federal, gerenciado pela Controladoria-Geral da Uniao (CGU).`,
    en: `This channel was designed especially for manifestations such as suggestions, compliments, reports, complaints, or requests related to COP30 to be forwarded to the Brazilian government, always with respect for your voice and commitment to transparency and integrity.

**Service Timeline**

The deadline for addressing the manifestations registered in this form is 30 days, extendable for an equal period.

**Important Information**

Before starting the form, we advise you to check if there is already an appropriate channel for forwarding your request. For specific cases, using the channels below may provide quicker solutions:

a) Labor Complaints: Access [https://mpt.mp.br/pgt/servicos/servico-denuncia](https://mpt.mp.br/pgt/servicos/servico-denuncia) (system in Portuguese language)

b) Complaints regarding accommodation and transportation services: Report at [https://falabr.cgu.gov.br](https://falabr.cgu.gov.br)

c) Incidents in the Blue Zone: Report at [https://falabr.cgu.gov.br](https://falabr.cgu.gov.br)

**Fala.BR Platform**

The manifestations registered in this form will be processed on the Fala.BR Platform. The Fala.BR Platform is the official communication channel between citizens and the federal government, managed by the Office of the Comptroller General (CGU).`,
    es: `Este canal fue disenado especialmente para manifestaciones como sugerencias, elogios, denuncias, quejas o solicitudes relacionadas con la COP30 para ser enviadas al gobierno brasileno, siempre con respeto a su voz y compromiso con la transparencia e integridad.

**Plazo de Atencion**

El plazo para atender las manifestaciones registradas en este formulario es de 30 dias, prorrogable por igual periodo.

**Informacion Importante**

Antes de iniciar el formulario, le aconsejamos verificar si ya existe un canal apropiado para enviar su solicitud. Para casos especificos, usar los canales a continuacion puede proporcionar soluciones mas rapidas:

a) Denuncias Laborales: Acceda a [https://mpt.mp.br/pgt/servicos/servico-denuncia](https://mpt.mp.br/pgt/servicos/servico-denuncia) (sistema en portugues)

b) Quejas sobre servicios de alojamiento y transporte: Denuncie en [https://falabr.cgu.gov.br](https://falabr.cgu.gov.br)

c) Incidentes en la Zona Azul: Denuncie en [https://falabr.cgu.gov.br](https://falabr.cgu.gov.br)

**Plataforma Fala.BR**

Las manifestaciones registradas en este formulario seran procesadas en la Plataforma Fala.BR. La Plataforma Fala.BR es el canal oficial de comunicacion entre el ciudadano y el gobierno federal, gestionado por la Contraloria General de la Union (CGU).`,
  },
  checkboxLabel: {
    "pt-BR": "Li e aceito os termos de uso",
    en: "I have read and accept the terms of use",
    es: "He leido y acepto los terminos de uso",
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
  { code: "pt-BR" as Language, flag: "ðŸ‡§ðŸ‡·", name: "Portugues" },
  { code: "en" as Language, flag: "ðŸ‡ºðŸ‡¸", name: "English" },
  { code: "es" as Language, flag: "ðŸ‡ªðŸ‡¸", name: "Espanol" },
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
              <p className="text-xs md:text-sm text-muted-foreground text-balance">
                {translations.subtitle[language]}
              </p>
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


