"use client"

import { Button } from "@/src/components/ui/button"
import { Card } from "@/src/components/ui/card"
import { CheckCircle2, Download, Home } from "lucide-react"
import type { Language } from "@/src/app/page"

interface ConfirmationScreenProps {
  language: Language
  protocol: string
  onRestart: () => void
}

const translations = {
  title: {
    "pt-BR": "Solicitação Enviada com Sucesso!",
    en: "Request Submitted Successfully!",
    es: "¡Solicitud Enviada con Éxito!",
  },
  subtitle: {
    "pt-BR": "Sua manifestação foi registrada e será processada pela Plataforma Fala.BR",
    en: "Your manifestation has been registered and will be processed by the Fala.BR Platform",
    es: "Su manifestación ha sido registrada y será procesada por la Plataforma Fala.BR",
  },
  protocolLabel: {
    "pt-BR": "Número do Protocolo",
    en: "Protocol Number",
    es: "Número de Protocolo",
  },
  protocolInfo: {
    "pt-BR": "Guarde este número para acompanhar sua solicitação",
    en: "Save this number to track your request",
    es: "Guarde este número para seguir su solicitud",
  },
  nextSteps: {
    "pt-BR": "Próximos Passos",
    en: "Next Steps",
    es: "Próximos Pasos",
  },
  step1: {
    "pt-BR": "Você receberá um e-mail de confirmação com os detalhes da sua solicitação",
    en: "You will receive a confirmation email with the details of your request",
    es: "Recibirá un correo electrónico de confirmación con los detalles de su solicitud",
  },
  step2: {
    "pt-BR": "O prazo para resposta é de 30 dias, prorrogável por igual período",
    en: "The response deadline is 30 days, extendable for an equal period",
    es: "El plazo de respuesta es de 30 días, prorrogable por igual período",
  },
  step3: {
    "pt-BR": "Você pode acompanhar o status através do número do protocolo",
    en: "You can track the status using the protocol number",
    es: "Puede seguir el estado usando el número de protocolo",
  },
  download: {
    "pt-BR": "Baixar Comprovante",
    en: "Download Receipt",
    es: "Descargar Comprobante",
  },
  newRequest: {
    "pt-BR": "Nova Solicitação",
    en: "New Request",
    es: "Nueva Solicitud",
  },
}

export function ConfirmationScreen({ language, protocol, onRestart }: ConfirmationScreenProps) {
  const handleDownload = () => {
    // Create a simple text receipt
    const receipt = `
COP30 Brasil - Comprovante de Registro
Protocol Number: ${protocol}
Date: ${new Date().toLocaleString(language)}
Status: Registered
    `.trim()

    const blob = new Blob([receipt], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `COP30-${protocol}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-background">
      <Card className="w-full max-w-2xl p-8 md:p-12 shadow-2xl">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-balance">{translations.title[language]}</h1>
            <p className="text-muted-foreground text-balance">{translations.subtitle[language]}</p>
          </div>

          <Card className="w-full p-6 bg-primary/5 border-primary/20">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{translations.protocolLabel[language]}</p>
              <p className="text-3xl font-bold font-mono tracking-wider text-primary">{protocol}</p>
              <p className="text-xs text-muted-foreground">{translations.protocolInfo[language]}</p>
            </div>
          </Card>

          <div className="w-full text-left space-y-4 pt-4">
            <h2 className="font-semibold text-lg">{translations.nextSteps[language]}</h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{translations.step1[language]}</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{translations.step2[language]}</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{translations.step3[language]}</p>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={handleDownload} variant="outline" className="flex-1 gap-2 bg-transparent" size="lg">
              <Download className="w-4 h-4" />
              {translations.download[language]}
            </Button>
            <Button onClick={onRestart} className="flex-1 gap-2" size="lg">
              <Home className="w-4 h-4" />
              {translations.newRequest[language]}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
