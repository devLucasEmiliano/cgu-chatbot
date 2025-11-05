"use client";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { CheckCircle2, Download, Home } from "lucide-react";
import type { Language, SubmitResult } from "@/src/app/page";
import Image from "next/image";
import { jsPDF } from "jspdf";

interface ConfirmationScreenProps {
  language: Language;
  result: SubmitResult;
  onRestart: () => void;
  // When true, do not show protocol/access/dates; only show a completion message
  isAnonymous?: boolean;
}

const translations = {
  title: {
    "pt-BR": "Solicitação Enviada com Sucesso!",
    en: "Request Submitted Successfully!",
    es: "¡Solicitud Enviada con Éxito!",
  },
  subtitle: {
    "pt-BR":
      "Sua manifestação foi registrada e será processada pela Plataforma Fala.BR",
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
    "pt-BR":
      "O prazo para resposta é de 30 dias, prorrogável por igual período",
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
  anonymousNotice: {
    "pt-BR":
      "Por se tratar de uma manifestação anônima, não será possível acompanhar o andamento pelo sistema.",
    en: "Because this is an anonymous report, it will not be possible to follow the progress through the system.",
    es: "Por tratarse de una denuncia anónima, no será posible seguir el progreso en el sistema.",
  },
  redirectTitle: {
    "pt-BR": "Atendimento encerrado",
    en: "Service closed",
    es: "Atención finalizada",
  },
  redirectSubtitle: {
    "pt-BR":
      "Para manifestações de cidadãos brasileiros, utilize o serviço oficial Fala.BR.",
    en: "For manifestations from Brazilian citizens, please use the official Fala.BR service.",
    es: "Para manifestaciones de ciudadanos brasileños, utilice el servicio oficial Fala.BR.",
  },
  redirectNotice: {
    "pt-BR":
      "Para prosseguir com seu registro, acesse falabr.cgu.gov.br. Este atendimento foi encerrado aqui.",
    en: "To continue your submission, visit falabr.cgu.gov.br. This session is now closed here.",
    es: "Para continuar con su registro, acceda a falabr.cgu.gov.br. Esta atención se cerró aquí.",
  },
  redirectButton: {
    "pt-BR": "Ir para o Fala.BR",
    en: "Go to Fala.BR",
    es: "Ir a Fala.BR",
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
};

export function ConfirmationScreen({
  language,
  result,
  onRestart,
  isAnonymous = false,
}: ConfirmationScreenProps) {
  const isSuccess = result.success;
  const data = result.success ? result.data : undefined;
  const meta = result.success ? result.meta : undefined;
  const isBrazilRedirect = Boolean(meta?.redirectToFalaBr);
  const anonymousView = isAnonymous || Boolean(meta?.isAnonymousReport);
  const titleText = isSuccess
    ? isBrazilRedirect
      ? translations.redirectTitle[language]
      : translations.title[language]
    : translations.errorTitle[language];
  const subtitleText =
    isSuccess && isBrazilRedirect
      ? translations.redirectSubtitle[language]
      : translations.subtitle[language];
  const showDownload = isSuccess && !anonymousView && !isBrazilRedirect;
  const showPrimarySuccessButton =
    isSuccess && (isBrazilRedirect || !anonymousView);
  const primarySuccessLabel = isBrazilRedirect
    ? translations.redirectButton[language]
    : translations.consult[language];
  const primaryButtonUrl = isBrazilRedirect
    ? "https://falabr.cgu.gov.br"
    : "https://falabr.cgu.gov.br/web/manifestacao/consultar";

  // Format protocol from 17 digits to 55555.000467/2025-31
  const formatProtocol = (raw?: string) => {
    if (!raw) return "-";
    const digits = (raw.match(/\d/g) || []).join("");
    if (digits.length !== 17) return raw; // fallback if unexpected
    const p1 = digits.slice(0, 5);
    const p2 = digits.slice(5, 11);
    const p3 = digits.slice(11, 15);
    const p4 = digits.slice(15, 17);
    return `${p1}.${p2}/${p3}-${p4}`;
  };

  const handleDownload = () => {
    // Create a PDF receipt
    const doc = new jsPDF();

    // Set title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("COP30 Brasil", 105, 20, { align: "center" });

    doc.setFontSize(14);
    doc.text("Comprovante de Registro", 105, 30, { align: "center" });

    // Add details
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    let yPos = 50;
    const lineHeight = 10;

    // Protocol number
    doc.setFont("helvetica", "bold");
    doc.text(`${translations.details[language].protocol}:`, 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(formatProtocol(data?.NumeroProtocolo), 20, yPos + 7);
    yPos += lineHeight + 10;

    // Access code
    doc.setFont("helvetica", "bold");
    doc.text(`${translations.details[language].access}:`, 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(data?.CodigoAcesso ?? "-", 20, yPos + 7);
    yPos += lineHeight + 10;

    // Registration date
    doc.setFont("helvetica", "bold");
    doc.text(`${translations.details[language].createdAt}:`, 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(
      data?.DataCadastro ?? new Date().toLocaleString(language),
      20,
      yPos + 7
    );
    yPos += lineHeight + 10;

    // Deadline
    doc.setFont("helvetica", "bold");
    doc.text(`${translations.details[language].deadline}:`, 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(data?.PrazoResposta ?? "-", 20, yPos + 7);
    yPos += lineHeight + 15;

    // Status
    doc.setFont("helvetica", "bold");
    doc.text("Status:", 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(isSuccess ? "Registrado" : "Erro", 20, yPos + 7);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Controladoria-Geral da Uniao", 105, 280, { align: "center" });
    doc.text("Governo Federal do Brasil", 105, 285, { align: "center" });

    // Save the PDF
    doc.save(`COP30-${data?.NumeroProtocolo || "comprovante"}.pdf`);
  };

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
          <div
            className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500"
            style={{ animationDelay: "300ms" }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-balance">
              {titleText}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground text-balance px-2">
              {subtitleText}
            </p>
          </div>

          {/* Details card (success) or error card */}
          {isSuccess ? (
            <Card
              className="relative w-full p-5 md:p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 hover:shadow-xl transition-smooth"
              style={{ animationDelay: "400ms" }}
            >
              {/* Minimalist download button inside the green card */}
              {showDownload && (
                <div className="absolute right-3 top-3">
                  <Button
                    onClick={handleDownload}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary hover:bg-primary/10"
                    aria-label={translations.download[language]}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {isBrazilRedirect ? (
                <p className="text-sm md:text-base text-muted-foreground pr-10">
                  {translations.redirectNotice[language]}
                </p>
              ) : anonymousView ? (
                <p className="text-sm md:text-base text-muted-foreground pr-10">
                  {translations.anonymousNotice[language]}
                </p>
              ) : (
                <div className="space-y-3 pr-10">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      {translations.details[language].protocol}
                    </p>
                    <p className="text-xl md:text-2xl font-bold font-mono tracking-wider text-primary">
                      {formatProtocol(data?.NumeroProtocolo)}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {translations.details[language].access}
                      </p>
                      <p className="text-sm md:text-base font-mono">
                        {data?.CodigoAcesso ?? "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {translations.details[language].createdAt}
                      </p>
                      <p className="text-sm md:text-base">
                        {data?.DataCadastro ?? "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {translations.details[language].deadline}
                      </p>
                      <p className="text-sm md:text-base">
                        {data?.PrazoResposta ?? "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card
              className="w-full p-5 md:p-6 bg-gradient-to-br from-red-50 to-red-100/70 border-2 border-red-200 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: "400ms" }}
            >
              <p className="text-sm md:text-base text-red-900 whitespace-pre-wrap">
                {result.error}
              </p>
            </Card>
          )}

          {/* Optional next steps (without email confirmation step) */}
          {isSuccess && !anonymousView && !isBrazilRedirect && (
            <div
              className="w-full text-left space-y-4 pt-2 md:pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: "500ms" }}
            >
              <h2 className="font-semibold text-base md:text-lg">
                {translations.nextSteps[language]}
              </h2>
              <div className="space-y-3">
                <div
                  className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-500"
                  style={{ animationDelay: "700ms" }}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {translations.step2[language]}
                  </p>
                </div>
                <div
                  className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-500"
                  style={{ animationDelay: "800ms" }}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {translations.step3[language]}
                  </p>
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
              showPrimarySuccessButton && (
                <Button
                  onClick={() => window.open(primaryButtonUrl, "_blank")}
                  variant="default"
                  className="flex-1 gap-2 transition-smooth hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                  size="lg"
                >
                  <Home className="w-4 h-4" />
                  {primarySuccessLabel}
                </Button>
              )
            ) : (
              <Button
                onClick={onRestart}
                className="flex-1 gap-2 transition-smooth hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                size="lg"
              >
                <Home className="w-4 h-4" />
                {translations.tryAgain[language]}
              </Button>
            )}
            <Button
              onClick={onRestart}
              className="flex-1 gap-2 transition-smooth hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl border-2 border-teal-500 text-teal-700 hover:bg-teal-600 hover:text-white hover:border-teal-600"
              variant="outline"
              size="lg"
            >
              <Home className="w-4 h-4" />
              {translations.newRequest[language]}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
