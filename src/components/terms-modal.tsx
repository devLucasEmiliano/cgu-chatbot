"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Checkbox } from "@/src/components/ui/checkbox"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { X } from "lucide-react"
import type { Language } from "@/src/app/page"

interface TermsModalProps {
  language: Language
  isOpen: boolean
  onAccept: () => void
  onClose: () => void
}

const translations = {
  title: {
    "pt-BR": "Termos de Uso",
    en: "Terms of Use",
    es: "Términos de Uso",
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
  close: {
    "pt-BR": "Fechar",
    en: "Close",
    es: "Cerrar",
  },
}

const parseLinks = (text: string) => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
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

export function TermsModal({ language, isOpen, onAccept, onClose }: TermsModalProps) {
  const [accepted, setAccepted] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 animate-backdrop-blur">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/90 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container - responsive sizing */}
      <div className="relative bg-card border shadow-2xl rounded-2xl w-full max-w-[95vw] md:max-w-3xl lg:max-w-4xl h-[90vh] md:h-[85vh] flex flex-col animate-modal-entrance">
        {/* Header - sticky */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b bg-card/95 backdrop-blur-sm rounded-t-2xl shrink-0">
          <h2 className="text-xl md:text-2xl font-bold text-balance">{translations.title[language]}</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="hover:bg-muted transition-smooth hover:scale-110 shrink-0"
            aria-label={translations.close[language]}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content with scroll - flexible height */}
        <ScrollArea className="flex-1 p-4 md:p-6 overflow-y-auto chat-scrollbar">
          <div className="prose prose-sm max-w-none text-foreground">
            {translations.content[language].split("\n\n").map((paragraph, i) => {
              const parts = parseLinks(paragraph)
              return (
                <p 
                  key={i} 
                  className="mb-4 leading-relaxed text-sm md:text-base animate-in fade-in slide-in-from-bottom-2 duration-500"
                  style={{ animationDelay: `${i * 50}ms` }}
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

        {/* Footer - sticky, always visible */}
        <div className="p-4 md:p-6 border-t bg-card/95 backdrop-blur-sm space-y-3 md:space-y-4 rounded-b-2xl shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex items-start gap-3 p-3 md:p-4 rounded-xl bg-muted/50 border border-border/50 transition-smooth hover:bg-muted/70">
            <Checkbox
              id="terms-modal"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked as boolean)}
              className="mt-0.5 md:mt-1 transition-smooth"
            />
            <label 
              htmlFor="terms-modal" 
              className="text-xs md:text-sm font-medium leading-relaxed cursor-pointer select-none"
            >
              {translations.checkboxLabel[language]}
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <Button 
              onClick={onClose} 
              variant="outline" 
              className="flex-1 transition-smooth hover:scale-[1.02] active:scale-[0.98]"
              size="lg"
            >
              {translations.close[language]}
            </Button>
            <Button 
              onClick={onAccept} 
              disabled={!accepted} 
              className="flex-1 transition-smooth hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {translations.accept[language]}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
