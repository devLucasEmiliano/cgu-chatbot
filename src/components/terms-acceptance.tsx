"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Card } from "@/src/components/ui/card"
import { Checkbox } from "@/src/components/ui/checkbox"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { ArrowLeft, Globe } from "lucide-react"
import Image from "next/image"
import type { Language } from "@/src/app/page"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"

interface TermsAcceptanceProps {
  language: Language
  onAccept: () => void
  onBack: () => void
  onLanguageChange?: (language: Language) => void
}

const translations = {
  title: {
    "pt-BR": "Termos de Uso",
    en: "Terms of Use",
    es: "Términos de Uso",
  },
  subtitle: {
    "pt-BR": "Ao aceitar, você concorda com os termos e pode prosseguir com o registro de sua solicitação.",
    en: "By accepting, you agree to the terms and can proceed with registering your request.",
    es: "Al aceptar, usted acepta los términos y puede proceder con el registro de su solicitud.",
  },
  content: {
    "pt-BR": `Este canal foi projetado especialmente para manifestações como sugestões, elogios, denúncias, reclamações ou solicitações relacionadas à COP30 a serem encaminhadas ao governo brasileiro, sempre com respeito à sua voz e compromisso com a transparência e integridade.

**Prazo de Atendimento**

O prazo para atendimento das manifestações registradas neste formulário é de 30 dias, prorrogável por igual período.

**Informações Importantes**

Antes de iniciar o formulário, aconselhamos verificar se já existe um canal apropriado para encaminhar sua solicitação. Para casos específicos, utilizar os canais abaixo pode fornecer soluções mais rápidas:

a) Denúncias Trabalhistas: Acesse [https://mpt.mp.br/pgt/servicos/servico-denuncia](https://mpt.mp.br/pgt/servicos/servico-denuncia) (sistema em português)

b) Reclamações sobre serviços de acomodação e transporte: Denuncie em [https://falabr.cgu.gov.br](https://falabr.cgu.gov.br)

c) Incidentes na Zona Azul: Denuncie em [https://falabr.cgu.gov.br](https://falabr.cgu.gov.br)

**Plataforma Fala.BR**

As manifestações registradas neste formulário serão processadas na Plataforma Fala.BR. A Plataforma Fala.BR é o canal oficial de comunicação entre o cidadão e o governo federal, gerenciado pela Controladoria-Geral da União (CGU).`,
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
    es: `Este canal fue diseñado especialmente para manifestaciones como sugerencias, elogios, denuncias, quejas o solicitudes relacionadas con la COP30 para ser enviadas al gobierno brasileño, siempre con respeto a su voz y compromiso con la transparencia e integridad.

**Plazo de Atención**

El plazo para atender las manifestaciones registradas en este formulario es de 30 días, prorrogable por igual período.

**Información Importante**

Antes de iniciar el formulario, le aconsejamos verificar si ya existe un canal apropiado para enviar su solicitud. Para casos específicos, usar los canales a continuación puede proporcionar soluciones más rápidas:

a) Denuncias Laborales: Acceda a [https://mpt.mp.br/pgt/servicos/servico-denuncia](https://mpt.mp.br/pgt/servicos/servico-denuncia) (sistema en portugués)

b) Quejas sobre servicios de alojamiento y transporte: Denuncie en [https://falabr.cgu.gov.br](https://falabr.cgu.gov.br)

c) Incidentes en la Zona Azul: Denuncie en [https://falabr.cgu.gov.br](https://falabr.cgu.gov.br)

**Plataforma Fala.BR**

Las manifestaciones registradas en este formulario serán procesadas en la Plataforma Fala.BR. La Plataforma Fala.BR es el canal oficial de comunicación entre el ciudadano y el gobierno federal, gestionado por la Contraloría General de la Unión (CGU).`,
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
}

const languages = [
  { code: "pt-BR" as Language, flag: "🇧🇷", name: "Português" },
  { code: "en" as Language, flag: "🇺🇸", name: "English" },
  { code: "es" as Language, flag: "🇪🇸", name: "Español" },
]

const parseLinks = (text: string) => {
  const linkRegex = /\[([^\]]+)\]$$([^)]+)$$/g
  const parts: (string | { text: string; url: string })[] = []
  let lastIndex = 0
  let match

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push({ text: match[1], url: match[2] })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : [text]
}

export function TermsAcceptance({ language, onAccept, onBack, onLanguageChange }: TermsAcceptanceProps) {
  const [accepted, setAccepted] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)

  const currentLang = languages.find((lang) => lang.code === language)

  return (
    <div className="fixed inset-0 flex items-center justify-center p-3 md:p-4 bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Image
          src="/plant-1.svg"
          alt=""
          width={250}
          height={350}
          className="absolute bottom-0 left-0 animate-float"
          style={{ animationDelay: "0s" }}
        />
        <Image
          src="/plant-1.svg"
          alt=""
          width={200}
          height={300}
          className="absolute bottom-0 right-0 scale-x-[-1] animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <Card className="w-full max-w-[95vw] md:max-w-3xl lg:max-w-4xl max-h-[92vh] shadow-2xl animate-modal-entrance relative z-10 flex flex-col overflow-hidden rounded-2xl">
        <div className="p-4 md:p-6 lg:p-8 flex flex-col max-h-[92vh]">
          {/* Header with back button and language selector */}
          <div className="flex items-center justify-between mb-4 md:mb-6 animate-in fade-in slide-in-from-top-4 duration-500 shrink-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack} 
              className="gap-2 transition-smooth hover:scale-105 hover-lift"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{translations.back[language]}</span>
            </Button>

            {onLanguageChange && (
              <DropdownMenu open={isLangOpen} onOpenChange={setIsLangOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 transition-smooth hover:scale-105 border-2 bg-transparent hover-glow"
                  >
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="font-medium text-xs md:text-sm">{currentLang?.code.split("-")[0].toUpperCase()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 animate-in fade-in slide-in-from-top-2 duration-200">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code)
                        setIsLangOpen(false)
                      }}
                      className={`gap-3 cursor-pointer transition-smooth ${
                        language === lang.code ? "bg-primary/10 font-medium" : "hover:bg-muted"
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

          {/* Title and subtitle */}
          <div
            className="text-center mb-4 md:mb-6 animate-in fade-in slide-in-from-top-4 duration-500 shrink-0"
            style={{ animationDelay: "200ms" }}
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3 text-balance">{translations.title[language]}</h1>
            <p className="text-xs md:text-sm text-muted-foreground text-balance px-2">{translations.subtitle[language]}</p>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-hidden mb-4 md:mb-6 min-h-0">
            <ScrollArea
              className="h-full rounded-xl border-2 bg-muted/30 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 chat-scrollbar"
              style={{ animationDelay: "400ms" }}
            >
              <div className="prose prose-sm max-w-none text-foreground pr-2">
                {translations.content[language].split("\n\n").map((paragraph, i) => {
                  const parts = parseLinks(paragraph)
                  return (
                    <p
                      key={i}
                      className="mb-3 md:mb-4 leading-relaxed text-xs md:text-sm animate-in fade-in slide-in-from-left-2 duration-500"
                      style={{ animationDelay: `${600 + i * 50}ms` }}
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
                            className="text-primary hover:text-primary/80 underline decoration-primary/30 hover:decoration-primary transition-smooth font-medium"
                          >
                            {part.text}
                          </a>
                        ),
                      )}
                    </p>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Checkbox section */}
          <div
            className="flex items-start gap-3 mb-4 md:mb-6 p-3 md:p-4 rounded-xl bg-muted/50 border-2 border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-smooth hover:bg-muted/70 hover:border-primary/20 shrink-0"
            style={{ animationDelay: "500ms" }}
          >
            <Checkbox
              id="terms"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked as boolean)}
              className="mt-0.5 md:mt-1 transition-smooth"
            />
            <label htmlFor="terms" className="text-xs md:text-sm font-medium leading-relaxed cursor-pointer select-none">
              {translations.checkboxLabel[language]}
            </label>
          </div>

          {/* Action button */}
          <Button
            onClick={onAccept}
            disabled={!accepted}
            className="w-full h-11 md:h-12 text-sm md:text-base font-medium animate-in fade-in slide-in-from-bottom-4 duration-500 transition-smooth hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl shrink-0"
            style={{ animationDelay: "600ms" }}
            size="lg"
          >
            {translations.accept[language]}
          </Button>
        </div>
      </Card>
    </div>
  )
}
