"use client"

import { Button } from "@/src/components/ui/button"
import { Card } from "@/src/components/ui/card"
import { CheckCircle2, Download, Home } from "lucide-react"
import type { Language } from "@/src/app/page"
import Image from "next/image"

interface ConfirmationScreenProps {
  language: Language
  result:
    | { success: true; data: { NumeroProtocolo?: string; CodigoAcesso?: string; DataCadastro?: string; PrazoResposta?: string } }
    | { success: false; error: string }
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
  consult: {
    "pt-BR": "Consultar no Fala.BR",
    en: "Consult on Fala.BR",
    es: "Consultar en Fala.BR",
  },
  newRequest: {
    "pt-BR": "Nova Solicitação",
    en: "New Request",
    es: "Nueva Solicitud",
  },
  errorTitle: {
    "pt-BR": "Ocorreu um erro ao enviar",
    en: "An error occurred while submitting",
    es: "Se produjo un error al enviar",
  },
  tryAgain: {
    "pt-BR": "Tentar novamente",
    en: "Try again",
    es: "Intentar de nuevo",
  },
  details: {
    "pt-BR": {
      protocol: "Número do Protocolo",
      access: "Código de Acesso",
      createdAt: "Data de Cadastro",
      deadline: "Prazo de Resposta",
    },
    en: {
      protocol: "Protocol Number",
      access: "Access Code",
      createdAt: "Registration Date",
      deadline: "Response Deadline",
    },
    es: {
      protocol: "Número de Protocolo",
      access: "Código de Acceso",
      createdAt: "Fecha de Registro",
      deadline: "Plazo de Respuesta",
    },
  },
}

export function ConfirmationScreen({ language, result, onRestart }: ConfirmationScreenProps) {
  const isSuccess = result.success
  const data = result.success ? result.data : undefined

  const handleDownload = () => {
    // Create a simple text receipt
    const receipt = `
COP30 Brasil - Comprovante de Registro
${translations.details[language].protocol}: ${data?.NumeroProtocolo ?? "-"}
${translations.details[language].access}: ${data?.CodigoAcesso ?? "-"}
${translations.details[language].createdAt}: ${data?.DataCadastro ?? new Date().toLocaleString(language)}
${translations.details[language].deadline}: ${data?.PrazoResposta ?? "-"}
Status: ${isSuccess ? "Registered" : "Error"}
    `.trim()

    const blob = new Blob([receipt], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `COP30-${data?.NumeroProtocolo || "comprovante"}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/10 to-background relative overflow-hidden">
      {/* Animated palm tree decorations */}
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
          width={230}
          height={330}
          className="absolute bottom-0 right-0 scale-x-[-1] animate-float"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <Card className="w-full max-w-2xl p-6 md:p-10 lg:p-12 shadow-2xl animate-modal-entrance relative z-10 border-2 rounded-2xl">
        <div className="flex flex-col items-center text-center space-y-5 md:space-y-6">
          {/* Success icon with pulse */}
          <div 
            className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center animate-pulse-glow animate-in zoom-in duration-500"
            style={{ animationDelay: "200ms" }}
          >
            <CheckCircle2 className="w-12 h-12 md:w-14 md:h-14 text-primary" />
          </div>

          {/* Title and subtitle */}
          <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500" style={{ animationDelay: "300ms" }}>
            <h1 className="text-2xl md:text-3xl font-bold text-balance">
              {isSuccess ? translations.title[language] : translations.errorTitle[language]}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground text-balance px-2">{translations.subtitle[language]}</p>
          </div>

          {/* Details card (success) or error card */}
          {isSuccess ? (
            <Card 
              className="w-full p-5 md:p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 hover:shadow-xl transition-smooth"
              style={{ animationDelay: "400ms" }}
            >
              <div className="space-y-3">
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wide">{translations.details[language].protocol}</p>
                  <p className="text-xl md:text-2xl font-bold font-mono tracking-wider text-primary">{data?.NumeroProtocolo ?? "-"}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wide">{translations.details[language].access}</p>
                    <p className="text-sm md:text-base font-mono">{data?.CodigoAcesso ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wide">{translations.details[language].createdAt}</p>
                    <p className="text-sm md:text-base">{data?.DataCadastro ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wide">{translations.details[language].deadline}</p>
                    <p className="text-sm md:text-base">{data?.PrazoResposta ?? "-"}</p>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card 
              className="w-full p-5 md:p-6 bg-gradient-to-br from-red-50 to-red-100/70 border-2 border-red-200 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: "400ms" }}
            >
              <p className="text-sm md:text-base text-red-900 whitespace-pre-wrap">{result.error}</p>
            </Card>
          )}

          {/* Optional next steps (without email confirmation step) */}
          {isSuccess && (
            <div 
              className="w-full text-left space-y-4 pt-2 md:pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: "500ms" }}
            >
              <h2 className="font-semibold text-base md:text-lg">{translations.nextSteps[language]}</h2>
              <div className="space-y-3">
                <div className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-500" style={{ animationDelay: "700ms" }}>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{translations.step2[language]}</p>
                </div>
                <div className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-500" style={{ animationDelay: "800ms" }}>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{translations.step3[language]}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div 
            className="w-full flex flex-col sm:flex-row gap-3 pt-2 md:pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: "900ms" }}
          >
            {isSuccess ? (
              <>
                <Button 
                  onClick={() => window.open("https://falabr.cgu.gov.br/web/manifestacao/consultar", "_blank")}
                  variant="default" 
                  className="flex-1 gap-2 transition-smooth hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl" 
                  size="lg"
                >
                  <Home className="w-4 h-4" />
                  {translations.consult[language]}
                </Button>
                <Button 
                  onClick={handleDownload} 
                  variant="outline" 
                  className="flex-1 gap-2 bg-transparent transition-smooth hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg border-2" 
                  size="lg"
                >
                  <Download className="w-4 h-4" />
                  {translations.download[language]}
                </Button>
              </>
            ) : (
              <Button 
                onClick={onRestart} 
                className="flex-1 gap-2 transition-smooth hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl" 
                size="lg"
              >
                <Home className="w-4 h-4" />
                {translations.tryAgain[language]}
              </Button>
            )}
            <Button 
              onClick={onRestart} 
              className="flex-1 gap-2 transition-smooth hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl" 
              size="lg"
            >
              <Home className="w-4 h-4" />
              {translations.newRequest[language]}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
