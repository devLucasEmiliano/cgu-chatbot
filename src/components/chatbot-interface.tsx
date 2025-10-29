"use client";

import type React from "react";
import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Send, Globe, ChevronDown, Loader2 } from "lucide-react";
import type { Language, SubmitResult } from "@/src/app/page";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import Image from "next/image";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { COUNTRIES, findCountryCodeByName } from "@/src/lib/cgu/countries";

interface ChatbotInterfaceProps {
  language: Language;
  onComplete: (result: SubmitResult) => void;
  onLanguageChange: (language: Language) => void;
}

interface Message {
  id: string;
  type: "bot" | "user";
  content: string;
  timestamp: Date;
  buttons?: {
    label: string;
    value: string;
    variant?: "default" | "outline" | "secondary";
  }[];
  inputType?: "text" | "textarea" | "email" | "file";
  variant?: "default" | "info";
}

const translations = {
  header: {
    "pt-BR": "Registro de Manifestação",
    en: "Manifestation Registration",
    es: "Registro de Manifestación",
  },
  subtitle: {
    "pt-BR": "Controladoria-Geral da União • Governo Federal do Brasil",
    en: "Office of the Comptroller General • Federal Government of Brazil",
    es: "Contraloría General de la Unión • Gobierno Federal de Brasil",
  },
  placeholder: {
    "pt-BR": "Digite sua resposta...",
    en: "Type your answer...",
    es: "Escriba su respuesta...",
  },
  send: {
    "pt-BR": "Enviar",
    en: "Send",
    es: "Enviar",
  },
  uploadFile: {
    "pt-BR": "Anexar arquivo",
    en: "Attach file",
    es: "Adjuntar archivo",
  },
  skipAttachment: {
    "pt-BR": "Pular anexos",
    en: "Skip attachments",
    es: "Omitir archivos adjuntos",
  },
  uploading: {
    "pt-BR": "Carregando anexos",
    en: "Uploading attachments",
    es: "Cargando adjuntos",
  },
};

type ManifestationTypeKey =
  | "report"
  | "compliment"
  | "complaint"
  | "request"
  | "suggestion";

const manifestationTypeDescriptions: Record<
  ManifestationTypeKey,
  Record<Language, string>
> = {
  report: {
    "pt-BR":
      "Denúncia: para comunicar a ocorrência de um ato ilícito, irregularidade, violação de direitos humanos ou prática de má conduta por agentes públicos.",
    en: "Report: used to communicate suspected illicit acts, irregularities, human rights violations, or misconduct by public agents.",
    es: "Denuncia: se usa para comunicar la ocurrencia de un acto ilícito, irregularidad, violación de derechos humanos o mala conducta de agentes públicos.",
  },
  compliment: {
    "pt-BR":
      "Elogio: para expressar satisfação com um atendimento ou serviço público.",
    en: "Compliment: used to express satisfaction with a public service or assistance received.",
    es: "Elogio: se utiliza para expresar satisfacción con un servicio o atención pública.",
  },
  complaint: {
    "pt-BR":
      "Reclamação: para manifestar insatisfação com um serviço, obra ou atendimento público e solicitar providências.",
    en: "Complaint: used to express dissatisfaction with a public service, work, or assistance and request corrective measures.",
    es: "Queja: se utiliza para manifestar insatisfacción con un servicio, obra o atención pública y solicitar medidas correctivas.",
  },
  request: {
    "pt-BR":
      "Solicitação: para requerer o atendimento ou a prestação de um serviço público.",
    en: "Request: used to ask for the delivery of a public service or specific assistance.",
    es: "Solicitud: se utiliza para requerir la prestación de un servicio público.",
  },
  suggestion: {
    "pt-BR":
      "Sugestão: para apresentar ideias ou propostas de melhoria para serviços ou atendimentos.",
    en: "Suggestion: used to present ideas or proposals to improve services or assistance.",
    es: "Sugerencia: se utiliza para presentar ideas o propuestas de mejora para servicios o atenciones.",
  },
};

const manifestationTypePlaceholders: Record<
  ManifestationTypeKey,
  Record<Language, string>
> = {
  report: {
    "pt-BR": "Escreva aqui sua denúncia em detalhes...",
    en: "Write here your report in detail...",
    es: "Escriba aquí su denuncia en detalle...",
  },
  compliment: {
    "pt-BR": "Escreva aqui seu elogio em detalhes...",
    en: "Write here your compliment in detail...",
    es: "Escriba aquí su elogio en detalle...",
  },
  complaint: {
    "pt-BR": "Escreva aqui sua reclamação em detalhes...",
    en: "Write here your complaint in detail...",
    es: "Escriba aquí su queja en detalle...",
  },
  request: {
    "pt-BR": "Escreva aqui sua solicitação em detalhes...",
    en: "Write here your request in detail...",
    es: "Escriba aquí su solicitud en detalle...",
  },
  suggestion: {
    "pt-BR": "Escreva aqui sua sugestão em detalhes...",
    en: "Write here your suggestion in detail...",
    es: "Escriba aquí su sugerencia en detalle...",
  },
};

const getManifestationDescription = (
  type: string,
  lang: Language
): string | undefined => {
  const descriptions =
    manifestationTypeDescriptions[type as ManifestationTypeKey];
  if (!descriptions) return undefined;
  return descriptions[lang] ?? descriptions["pt-BR"];
};

const getManifestationPlaceholder = (
  type: string | undefined,
  lang: Language
): string => {
  if (!type) {
    return translations.placeholder[lang] ?? translations.placeholder["pt-BR"];
  }
  const placeholders =
    manifestationTypePlaceholders[type as ManifestationTypeKey];
  if (!placeholders) {
    return translations.placeholder[lang] ?? translations.placeholder["pt-BR"];
  }
  return placeholders[lang] ?? translations.placeholder["pt-BR"];
};

const manifestationConfirmationTexts = {
  question: {
    "pt-BR":
      "Deseja prosseguir com este tipo de manifestação ou selecionar outro?",
    en: "Do you want to proceed with this type of manifestation or select another one?",
    es: "¿Desea continuar con este tipo de manifestación o seleccionar otro?",
  },
  proceed: {
    "pt-BR": "Prosseguir",
    en: "Proceed",
    es: "Continuar",
  },
  change: {
    "pt-BR": "Selecionar outro tipo",
    en: "Choose another type",
    es: "Elegir otro tipo",
  },
  changeAck: {
    "pt-BR": "Tudo bem! Vamos escolher outro tipo de manifestação.",
    en: "No problem! Let's choose another type of manifestation.",
    es: "¡Sin problema! Vamos elegir otro tipo de manifestación.",
  },
};

const languages = [
  { code: "pt-BR" as Language, flag: "🇧🇷", name: "Português" },
  { code: "en" as Language, flag: "🇺🇸", name: "English" },
  { code: "es" as Language, flag: "🇪🇸", name: "Español" },
];

type FlowStep =
  | "initial"
  | "manifestationType"
  | "confirmManifestationType"
  | "identificationType"
  | "fullName"
  | "email"
  | "confirmEmail"
  | "unfcccQuestion"
  | "unfcccNumber"
  | "country"
  | "description"
  | "attachmentQuestion"
  | "moreAttachments"
  | "complete";

export function ChatbotInterface({
  language,
  onComplete,
  onLanguageChange,
}: ChatbotInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<FlowStep>("initial");
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<
    { NomeArquivo: string; ConteudoBase64: string; TamanhoArquivo: number }[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<{
    codigo: number;
    descricao: string;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const descriptionPlaceholder = useMemo(
    () =>
      getManifestationPlaceholder(
        typeof formData.manifestationType === "string"
          ? formData.manifestationType
          : undefined,
        language
      ),
    [formData.manifestationType, language]
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Evita executar mensagens iniciais duas vezes em modo Strict (Next.js/React dev)
  const hasInitializedRef = useRef(false);
  // Track asked questions to prevent duplicates
  const askedQuestionsRef = useRef<Set<string>>(new Set());

  // const currentLang = languages.find((lang) => lang.code === language)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Helpers para anexos
  const formatBytes = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    if (mb >= 0.1) return `${mb.toFixed(2)} MB`;
    const kb = bytes / 1024;
    if (kb >= 0.1) return `${kb.toFixed(2)} KB`;
    return `${bytes} B`;
  };
  const totalBytes = attachments.reduce(
    (acc, a) => acc + (a.TamanhoArquivo || 0),
    0
  );
  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Limite de caracteres: replicar cabecalho do backend para calcular espaco restante
  const MAX_CHARS = 7500;
  const computeHeaderLen = () => {
    const linha1 = "Manifestacao recebida no ambito da COP30.";
    const pais = formData.countryName || "Nao Informado";
    const linha2 = `Pais/Naturalidade selecionado: ${pais}`;
    const linha3 = `Linguagem selecionada: ${language || "Nao Informado"}`;
    const unf =
      formData.unfcccNumber && formData.unfcccNumber.trim()
        ? formData.unfcccNumber.trim()
        : "Nao Informado";
    const linha4 = `Numero de inscricao UNFCCC: ${unf}`;
    const header = [linha1, linha2, linha3, linha4].join("\n") + "\n";
    return header.length;
  };
  const headerLen = computeHeaderLen();
  const allowedBody = Math.max(0, MAX_CHARS - headerLen);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-focus input when it appears
  useEffect(() => {
    const currentMessage = messages[messages.length - 1];
    if (currentMessage?.inputType === "textarea" && textareaRef.current) {
      textareaRef.current.focus();
    } else if (currentMessage?.inputType && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages]);

  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    // Mensagem inicial
    addBotMessage(
      language === "pt-BR"
        ? "Olá! Bem-vindo ao sistema de atendimento da COP30."
        : language === "en"
        ? "Hello! Welcome to the COP30 service system."
        : "¡Hola! Bienvenido al sistema de atención de la COP30.",
      0
    );

    // Segunda mensagem apos a primeira (800ms de digitacao + delay)
    setTimeout(() => {
      addBotMessage(
        language === "pt-BR"
          ? "Você já leu e aceitou os Termos de Uso."
          : language === "en"
          ? "You have read and accepted the Terms of Use."
          : "Usted ha leído y aceptado los Términos de Uso.",
        0
      );
    }, 1000);

    // Terceira mensagem apos a segunda (mais 800ms + delay)
    setTimeout(() => {
      addBotMessage(
        language === "pt-BR"
          ? "Você gostaria de Consultar ou Cadastrar uma manifestação?"
          : language === "en"
          ? "Would you like to Consult or Register a manifestation?"
          : "¿Le gustaría Consultar o Registrar una manifestación?",
        0,
        [
          {
            label:
              language === "pt-BR"
                ? "Consultar"
                : language === "en"
                ? "Consult"
                : "Consultar",
            value: "consult",
            variant: "outline" as const,
          },
          {
            label:
              language === "pt-BR"
                ? "Cadastrar"
                : language === "en"
                ? "Register"
                : "Registrar",
            value: "register",
            variant: "default" as const,
          },
        ]
      );
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addBotMessage = (
    content: string,
    delay: number = 500,
    buttons?: {
      label: string;
      value: string;
      variant?: "default" | "outline" | "secondary";
    }[],
    inputType?: "text" | "textarea" | "email" | "file",
    variant: "default" | "info" = "default",
    force: boolean = false
  ) => {
    // Prevent duplicate messages
    const messageKey = `${content}-${currentStep}`;
    if (!force && askedQuestionsRef.current.has(messageKey)) {
      return;
    }
    askedQuestionsRef.current.add(messageKey);

    // Aguarda um pouco antes de mostrar a animacao de digitacao
    setTimeout(() => {
      setIsTyping(true);
    }, delay);

    // Mostra a mensagem apos a animacao de digitacao (minimo 800ms)
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString() + Math.random(),
        type: "bot",
        content,
        timestamp: new Date(),
        buttons,
        inputType,
        variant,
      };

      setMessages((prev) => [...prev, newMessage]);
      setIsTyping(false);
    }, delay + 800);
  };

  const addUserMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString() + Math.random(),
      type: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
  };

  const promptManifestationType = (
    delay: number = 100,
    force: boolean = false
  ) => {
    const question =
      language === "pt-BR"
        ? "Que tipo de manifestação você gostaria de fazer?"
        : language === "en"
        ? "What type of manifestation would you like to make?"
        : "¿Qué tipo de manifestación le gustaría hacer?";

    const options = [
      {
        label:
          language === "pt-BR"
            ? "Denúncia"
            : language === "en"
            ? "Report"
            : "Denuncia",
        value: "report",
        variant: "outline" as const,
      },
      {
        label:
          language === "pt-BR"
            ? "Elogio"
            : language === "en"
            ? "Compliment"
            : "Elogio",
        value: "compliment",
        variant: "outline" as const,
      },
      {
        label:
          language === "pt-BR"
            ? "Reclamação"
            : language === "en"
            ? "Complaint"
            : "Queja",
        value: "complaint",
        variant: "outline" as const,
      },
      {
        label:
          language === "pt-BR"
            ? "Solicitação"
            : language === "en"
            ? "Request"
            : "Solicitud",
        value: "request",
        variant: "outline" as const,
      },
      {
        label:
          language === "pt-BR"
            ? "Sugestão"
            : language === "en"
            ? "Suggestion"
            : "Sugerencia",
        value: "suggestion",
        variant: "outline" as const,
      },
    ];

    setTimeout(() => {
      addBotMessage(question, 0, options, undefined, "default", force);
    }, delay);
  };

  const handleInitialChoice = (choice: string, label: string) => {
    addUserMessage(label);

    if (choice === "consult") {
      window.open(
        "https://falabr.cgu.gov.br/web/manifestacao/consultar",
        "_blank"
      );
      setTimeout(() => {
        addBotMessage(
          language === "pt-BR"
            ? "VocÃª serÃ¡ redirecionado para o portal de consultas. Posso ajudÃ¡-lo com algo mais?"
            : language === "en"
            ? "You will be redirected to the consultation portal. Can I help you with something else?"
            : "SerÃ¡ redirigido al portal de consultas. Â¿Puedo ayudarle con algo mÃ¡s?",
          0,
          [
            {
              label:
                language === "pt-BR"
                  ? "Fazer novo cadastro"
                  : language === "en"
                  ? "Make new registration"
                  : "Hacer nuevo registro",
              value: "register",
              variant: "default" as const,
            },
          ]
        );
      }, 100);
      return;
    }

    if (choice === "register") {
      // Mostrar aviso do Fala.BR para brasileiros
      setTimeout(() => {
        addBotMessage(
          language === "pt-BR"
            ? "Se vocÃª for brasileiro, utilize o serviÃ§o oficial Fala.BR:"
            : language === "en"
            ? "If you are Brazilian, please use the official Fala.BR service:"
            : "Si usted es brasileÃ±o, utilice el servicio oficial Fala.BR:",
          0,
          [
            {
              label:
                language === "pt-BR"
                  ? "Ir para o Fala.BR"
                  : language === "en"
                  ? "Go to Fala.BR"
                  : "Ir a Fala.BR",
              value: "falabr",
              variant: "default" as const,
            },
            {
              label:
                language === "pt-BR"
                  ? "Eu nÃ£o sou Brasileiro"
                  : language === "en"
                  ? "I am not Brazilian"
                  : "No soy BrasileÃ±o",
              value: "continue",
              variant: "outline" as const,
            },
          ]
        );
      }, 100);
      return;
    }

    if (choice === "falabr") {
      window.open("https://falabr.cgu.gov.br", "_blank");
      setTimeout(() => {
        addBotMessage(
          language === "pt-BR"
            ? "VocÃª serÃ¡ redirecionado para o portal Fala.BR. Obrigado por usar nosso serviÃ§o!"
            : language === "en"
            ? "You will be redirected to the Fala.BR portal. Thank you for using our service!"
            : "SerÃ¡ redirigido al portal Fala.BR. Â¡Gracias por usar nuestro servicio!",
          0
        );
      }, 100);
      return;
    }

    if (choice === "continue") {
      setCurrentStep("manifestationType");
      promptManifestationType(100);
    }
  };

  const handleManifestationType = (type: string, label: string) => {
    addUserMessage(label);
    setFormData((prev) => ({ ...prev, manifestationType: type }));
    setCurrentStep("confirmManifestationType");

    const description = getManifestationDescription(type, language);
    const question =
      manifestationConfirmationTexts.question[language] ??
      manifestationConfirmationTexts.question["pt-BR"];
    const proceedLabel =
      manifestationConfirmationTexts.proceed[language] ??
      manifestationConfirmationTexts.proceed["pt-BR"];
    const changeLabel =
      manifestationConfirmationTexts.change[language] ??
      manifestationConfirmationTexts.change["pt-BR"];

    const baseDelay = 120;

    if (description) {
      // Mostra primeiro a descricao com leve atraso para manter a animacao suave
      addBotMessage(description, baseDelay, undefined, undefined, "info", true);
      // Aguarda a primeira mensagem concluir (800ms) antes de iniciar a digitacao da proxima
      addBotMessage(
        question,
        baseDelay + 1100,
        [
          {
            label: proceedLabel,
            value: "proceed",
            variant: "default" as const,
          },
          {
            label: changeLabel,
            value: "change",
            variant: "outline" as const,
          },
        ],
        undefined,
        "default",
        true
      );
    } else {
      addBotMessage(
        question,
        baseDelay,
        [
          {
            label: proceedLabel,
            value: "proceed",
            variant: "default" as const,
          },
          {
            label: changeLabel,
            value: "change",
            variant: "outline" as const,
          },
        ],
        undefined,
        "default",
        true
      );
    }
  };

  const continueAfterManifestationType = (type: string) => {
    if (type === "report") {
      setCurrentStep("identificationType");
      setTimeout(() => {
        // Aviso informativo para denuncias (identificada vs anonima)
        addBotMessage(
          language === "pt-BR"
            ? "Identificada: você poderá receber informações sobre as providências adotadas. Denúncia anônima: não será possível acompanhar ou receber respostas."
            : language === "en"
            ? "Identified: you will be able to receive information about the measures taken. Anonymous report: it will not be possible to track or receive responses."
            : "Identificada: podrá recibir información sobre las medidas adoptadas. Denuncia anónima: no será posible hacer seguimiento ni recibir respuestas.",
          0,
          undefined,
          undefined,
          "info",
          true
        );
      }, 100);
      setTimeout(() => {
        addBotMessage(
          language === "pt-BR"
            ? "Você deseja se identificar ou permanecer anônimo(a)?"
            : language === "en"
            ? "Do you wish to identify yourself or remain anonymous?"
            : "¿Desea identificarse o permanecer anónimo(a)?",
          0,
          [
            {
              label:
                language === "pt-BR"
                  ? "Identificada"
                  : language === "en"
                  ? "Identified"
                  : "Identificada",
              value: "identified",
              variant: "outline" as const,
            },
            {
              label:
                language === "pt-BR"
                  ? "Anônima"
                  : language === "en"
                  ? "Anonymous"
                  : "Anónima",
              value: "anonymous",
              variant: "secondary" as const,
            },
          ],
          undefined,
          "default",
          true
        );
      }, 1000);
    } else {
      // Para outros tipos, vai direto para identificacao
      setCurrentStep("fullName");
      setTimeout(() => {
        addBotMessage(
          language === "pt-BR"
            ? "Qual é seu nome completo?"
            : language === "en"
            ? "What is your full name?"
            : "¿Cuál es su nombre completo?",
          0,
          undefined,
          "text",
          "default",
          true
        );
      }, 100);
    }
  };

  const handleManifestationConfirmation = (value: string, label: string) => {
    addUserMessage(label);

    if (value === "proceed") {
      const selectedType = formData.manifestationType;
      if (selectedType) {
        continueAfterManifestationType(selectedType);
      } else {
        setCurrentStep("manifestationType");
        promptManifestationType(100, true);
      }
      return;
    }

    if (value === "change") {
      setFormData((prev) => {
        const updated = { ...prev };
        delete updated.manifestationType;
        return updated;
      });
      const changeAck =
        manifestationConfirmationTexts.changeAck[language] ??
        manifestationConfirmationTexts.changeAck["pt-BR"];
      setCurrentStep("manifestationType");
      setTimeout(() => {
        addBotMessage(changeAck, 0, undefined, undefined, "info", true);
      }, 100);
      promptManifestationType(900, true);
    }
  };

  const handleIdentificationType = (type: string, label: string) => {
    addUserMessage(label);
    setFormData((prev) => ({ ...prev, identificationType: type }));

    if (type === "identified") {
      setCurrentStep("fullName");
      setTimeout(() => {
        addBotMessage(
          language === "pt-BR"
            ? "Qual Ã© seu nome completo?"
            : language === "en"
            ? "What is your full name?"
            : "Â¿CuÃ¡l es su nombre completo?",
          300,
          undefined,
          "text"
        );
      }, 300);
    } else {
      // Anonimo vai direto para descricao
      setCurrentStep("description");
      setTimeout(() => {
        addBotMessage(
          language === "pt-BR"
            ? "Descreva sua manifestação em detalhes:"
            : language === "en"
            ? "Describe your manifestation in detail:"
            : "Describa su manifestación en detalle:",
          300,
          undefined,
          "textarea"
        );
      }, 300);
    }
  };

  const handleTextInput = (value: string) => {
    addUserMessage(value);

    switch (currentStep) {
      case "fullName":
        setFormData((prev) => ({ ...prev, fullName: value }));
        setCurrentStep("email");
        setTimeout(() => {
          addBotMessage(
            language === "pt-BR"
              ? "Qual é seu e-mail?"
              : language === "en"
              ? "What is your email?"
              : "¿Cuál es su correo electrónico?",
            300,
            undefined,
            "email"
          );
        }, 300);
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          setTimeout(() => {
            addBotMessage(
              language === "pt-BR"
                ? "Por favor, insira um e-mail válido."
                : language === "en"
                ? "Please enter a valid email."
                : "Por favor, ingrese un correo electrónico válido.",
              300,
              undefined,
              "email"
            );
          }, 300);
          return;
        }
        setFormData((prev) => ({ ...prev, email: value }));
        setCurrentStep("confirmEmail");
        setTimeout(() => {
          addBotMessage(
            language === "pt-BR"
              ? "Confirme seu e-mail:"
              : language === "en"
              ? "Confirm your email:"
              : "Confirme su correo electrónico:",
            300,
            undefined,
            "email"
          );
        }, 300);
        break;

      case "confirmEmail":
        if (value !== formData.email) {
          setTimeout(() => {
            addBotMessage(
              language === "pt-BR"
                ? "Os e-mails não coincidem. Por favor, tente novamente."
                : language === "en"
                ? "Emails do not match. Please try again."
                : "Los correos electrónicos no coinciden. Por favor, inténtelo de nuevo.",
              300,
              undefined,
              "email"
            );
          }, 300);
          return;
        }
        setFormData((prev) => ({ ...prev, emailConfirmed: value }));
        setCurrentStep("unfcccQuestion");
        setTimeout(() => {
          addBotMessage(
            language === "pt-BR"
              ? "Você possui afiliação UNFCCC?"
              : language === "en"
              ? "Do you have UNFCCC affiliation?"
              : "¿Tiene afiliación UNFCCC?",
            300,
            [
              {
                label:
                  language === "pt-BR"
                    ? "Sim"
                    : language === "en"
                    ? "Yes"
                    : "Sí",
                value: "yes",
                variant: "outline" as const,
              },
              {
                label:
                  language === "pt-BR"
                    ? "Não"
                    : language === "en"
                    ? "No"
                    : "No",
                value: "no",
                variant: "outline" as const,
              },
            ]
          );
        }, 300);
        break;

      case "unfcccNumber":
        setFormData((prev) => ({ ...prev, unfcccNumber: value }));
        setCurrentStep("country");
        setTimeout(() => {
          addBotMessage(
            language === "pt-BR"
              ? "Qual é seu país/naturalidade? (ex.: Argentina, Espanha, United States)"
              : language === "en"
              ? "What is your country/nationality? (e.g., Argentina, Spain, United States)"
              : "¿Cuál es su país/nacionalidad? (ej.: Argentina, España, United States)",
            300,
            undefined,
            "text"
          );
        }, 300);
        break;

      case "country": {
        const code = findCountryCodeByName(value);
        if (!code) {
          setTimeout(() => {
            addBotMessage(
              language === "pt-BR"
                ? "Não consegui reconhecer o país. Tente novamente usando o nome completo (ex.: Argentina, Espanha, Estados Unidos)."
                : language === "en"
                ? "Could not recognize the country. Please try again with the full name (e.g., Argentina, Spain, United States)."
                : "No pude reconocer el país. Intente nuevamente con el nombre completo (ej.: Argentina, España, United States).",
              300,
              undefined,
              "text"
            );
          }, 300);
          return;
        }
        if (code === 1058) {
          setFormData((prev) => ({
            ...prev,
            countryName: value,
            countryCode: String(code),
          }));
          onComplete({
            success: true,
            data: {},
            meta: { redirectToFalaBr: true },
          });
          return;
        }
        setFormData((prev) => ({
          ...prev,
          countryName: value,
          countryCode: String(code),
        }));
        setCurrentStep("description");
        setTimeout(() => {
          addBotMessage(
            language === "pt-BR"
              ? "Descreva sua manifestação em detalhes:"
              : language === "en"
              ? "Describe your manifestation in detail:"
              : "Describa su manifestación en detalle:",
            300,
            undefined,
            "textarea"
          );
        }, 300);
        break;
      }

      case "description":
        setFormData((prev) => ({ ...prev, description: value }));
        // Pula a pergunta de nacionalidade ja que foi verificado no inicio
        setCurrentStep("attachmentQuestion");
        setTimeout(() => {
          addBotMessage(
            language === "pt-BR"
              ? "Você gostaria de anexar um arquivo à sua solicitação?"
              : language === "en"
              ? "Would you like to attach a file to your request?"
              : "¿Le gustaría adjuntar un archivo a su solicitud?",
            300,
            [
              {
                label:
                  language === "pt-BR"
                    ? "Sim"
                    : language === "en"
                    ? "Yes"
                    : "Sí",
                value: "yes",
                variant: "outline" as const,
              },
              {
                label:
                  language === "pt-BR"
                    ? "Não"
                    : language === "en"
                    ? "No"
                    : "No",
                value: "no",
                variant: "secondary" as const,
              },
            ]
          );
        }, 300);
        break;
    }
  };

  const handleUnfcccQuestion = (answer: string, label: string) => {
    addUserMessage(label);
    setFormData((prev) => ({ ...prev, unfccc: answer }));

    if (answer === "yes") {
      setCurrentStep("unfcccNumber");
      setTimeout(() => {
        addBotMessage(
          language === "pt-BR"
            ? "Qual é seu número de inscrição UNFCCC? (opcional)"
            : language === "en"
            ? "What is your UNFCCC registration number? (optional)"
            : "¿Cuál es su número de inscripción UNFCCC? (opcional)",
          300,
          [
            {
              label:
                language === "pt-BR"
                  ? "Pular"
                  : language === "en"
                  ? "Skip"
                  : "Omitir",
              value: "skip",
              variant: "secondary" as const,
            },
          ],
          "text"
        );
      }, 300);
    } else {
      setCurrentStep("country");
      setTimeout(() => {
        addBotMessage(
          language === "pt-BR"
            ? "Qual Ã© seu paÃ­s/naturalidade? (ex.: Argentina, Espanha, United States)"
            : language === "en"
            ? "What is your country/nationality? (e.g., Argentina, Spain, United States)"
            : "Â¿CuÃ¡l es su paÃ­s/nacionalidad? (ej.: Argentina, EspaÃ±a, United States)",
          300,
          undefined,
          "text"
        );
      }, 300);
    }
  };

  const handleSkipUnfccc = (label: string) => {
    addUserMessage(label);
    setCurrentStep("country");
    setTimeout(() => {
      addBotMessage(
        language === "pt-BR"
          ? "Qual é seu país/naturalidade? (ex.: Argentina, Espanha, United States)"
          : language === "en"
          ? "What is your country/nationality? (e.g., Argentina, Spain, United States)"
          : "¿Cuál es su país/nacionalidad? (ej.: Argentina, España, United States)",
        300,
        undefined,
        "text"
      );
    }, 300);
  };

  const handleAttachmentQuestion = (answer: string, label: string) => {
    addUserMessage(label);

    if (answer === "yes") {
      fileInputRef.current?.click();
    } else {
      completeForm();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Limpeza do input para permitir re-selecao do mesmo arquivo posteriormente
    e.target.value = "";

    if (files.length === 0) return;

    const allowedExt = [
      ".pdf",
      ".doc",
      ".docx",
      ".txt",
      ".xls",
      ".xlsx",
      ".png",
      ".jpg",
      ".jpeg",
      ".mp3",
      ".mp4",
      ".avi",
    ];

    const maxFiles = 10;
    const maxFileBytes = 30 * 1024 * 1024; // 30MB por arquivo
    const maxTotalBytes = 30 * 1024 * 1024; // 30MB no total

    const getExt = (name: string) => {
      const i = name.lastIndexOf(".");
      return i >= 0 ? name.slice(i).toLowerCase() : "";
    };

    const currentTotal = attachments.reduce(
      (acc, a) => acc + a.TamanhoArquivo,
      0
    );
    const currentCount = attachments.length;

    const accepted: File[] = [];
    const rejectedMessages: string[] = [];

    // Filtra por extensao e respeita limites de quantidade e tamanho total
    for (const file of files) {
      const ext = getExt(file.name);
      if (!allowedExt.includes(ext)) {
        rejectedMessages.push(
          language === "pt-BR"
            ? `Tipo nao permitido: ${file.name}`
            : language === "en"
            ? `Not allowed type: ${file.name}`
            : `Tipo no permitido: ${file.name}`
        );
        continue;
      }
      if (file.size > maxFileBytes) {
        rejectedMessages.push(
          language === "pt-BR"
            ? `Arquivo ${file.name} excede 30MB.`
            : language === "en"
            ? `File ${file.name} exceeds 30MB.`
            : `El archivo ${file.name} supera 30MB.`
        );
        continue;
      }
      if (currentCount + accepted.length + 1 > maxFiles) {
        rejectedMessages.push(
          language === "pt-BR"
            ? `Limite de ${maxFiles} arquivos atingido.`
            : language === "en"
            ? `Limit of ${maxFiles} files reached.`
            : `Limite de ${maxFiles} archivos alcanzado.`
        );
        break;
      }
      const projectedTotal =
        currentTotal + accepted.reduce((acc, f) => acc + f.size, 0) + file.size;
      if (projectedTotal > maxTotalBytes) {
        rejectedMessages.push(
          language === "pt-BR"
            ? `Tamanho total excede 30MB ao adicionar ${file.name}.`
            : language === "en"
            ? `Total size exceeds 30MB when adding ${file.name}.`
            : `El tamano total supera 30MB al agregar ${file.name}.`
        );
        continue;
      }
      accepted.push(file);
    }

    if (accepted.length === 0) {
      if (rejectedMessages.length > 0) alert(rejectedMessages.join("\n"));
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const totalBytes = accepted.reduce((acc, file) => acc + file.size, 0);
    const totalBytesForProgress = totalBytes > 0 ? totalBytes : accepted.length;
    let loadedBytes = 0;

    // Converte arquivos aceitos para Base64 com feedback de progresso
    const readAsBase64 = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onprogress = (event) => {
          if (
            !event.lengthComputable ||
            totalBytesForProgress === 0 ||
            file.size === 0
          ) {
            return;
          }
          const currentLoaded = loadedBytes + event.loaded;
          const percent = Math.min(
            99,
            Math.round((currentLoaded / totalBytesForProgress) * 100)
          );
          setUploadProgress(percent);
        };
        reader.onload = () => {
          const incremental =
            totalBytes > 0
              ? file.size
              : totalBytesForProgress / accepted.length;
          loadedBytes += incremental;
          const percent = Math.min(
            100,
            Math.round((loadedBytes / totalBytesForProgress) * 100)
          );
          setUploadProgress(percent);
          resolve((reader.result as string).split(",")[1] || "");
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });

    let hasError = false;

    try {
      const converted: {
        NomeArquivo: string;
        ConteudoBase64: string;
        TamanhoArquivo: number;
      }[] = [];

      for (const file of accepted) {
        converted.push({
          NomeArquivo: file.name,
          ConteudoBase64: await readAsBase64(file),
          TamanhoArquivo: file.size,
        });
      }

      setUploadProgress(100);
      setAttachments((prev) => [...prev, ...converted]);

      addUserMessage(
        `${converted.length} ${
          language === "pt-BR"
            ? "arquivo(s) anexado(s)"
            : language === "en"
            ? "file(s) attached"
            : "archivo(s) adjunto(s)"
        }`
      );

      if (rejectedMessages.length > 0) alert(rejectedMessages.join("\n"));

      setCurrentStep("moreAttachments");
      setTimeout(() => {
        addBotMessage(
          language === "pt-BR"
            ? "Deseja adicionar mais anexos?"
            : language === "en"
            ? "Would you like to add more attachments?"
            : "Â¿Desea aÃ±adir mÃ¡s archivos adjuntos?",
          300,
          [
            {
              label:
                language === "pt-BR"
                  ? "Sim"
                  : language === "en"
                  ? "Yes"
                  : "SÃ­",
              value: "yes",
              variant: "outline" as const,
            },
            {
              label:
                language === "pt-BR"
                  ? "NÃ£o, finalizar"
                  : language === "en"
                  ? "No, finish"
                  : "No, finalizar",
              value: "no",
              variant: "default" as const,
            },
          ]
        );
      }, 300);
    } catch {
      hasError = true;
      alert(
        language === "pt-BR"
          ? "Falha ao processar anexos."
          : language === "en"
          ? "Failed to process attachments."
          : "Error al procesar los archivos adjuntos."
      );
    } finally {
      if (hasError) {
        setIsUploading(false);
        setUploadProgress(0);
      } else {
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 400);
      }
    }
  };

  const handleMoreAttachments = (answer: string, label: string) => {
    addUserMessage(label);

    if (answer === "yes") {
      fileInputRef.current?.click();
    } else {
      completeForm();
    }
  };

  const completeForm = async () => {
    setCurrentStep("complete");
    setTimeout(() => {
      addBotMessage(
        language === "pt-BR"
          ? "Processando sua solicitaÃ§Ã£o..."
          : language === "en"
          ? "Processing your request..."
          : "Procesando su solicitud...",
        300
      );
    }, 300);
    try {
      // Mapeia tipo de manifestacao e formulario aceito pela API CGU
      // 1: Denuncia -> Formulario 4
      // 2: Reclamacao -> Formulario 1
      // 3: Elogio -> Formulario 1
      // 4: Sugestao -> Formulario 1
      // 5: Solicitacao -> Formulario 1
      const tipoMap: Record<
        string,
        { idTipoManifestacao: number; idTipoFormulario: number }
      > = {
        report: { idTipoManifestacao: 1, idTipoFormulario: 4 },
        complaint: { idTipoManifestacao: 2, idTipoFormulario: 1 },
        compliment: { idTipoManifestacao: 3, idTipoFormulario: 1 },
        suggestion: { idTipoManifestacao: 4, idTipoFormulario: 1 },
        request: { idTipoManifestacao: 5, idTipoFormulario: 1 },
      };

      const chosen =
        tipoMap[formData.manifestationType || "request"] || tipoMap["request"];
      const isAnonymous = formData.identificationType === "anonymous";
      const isReport = formData.manifestationType === "report";
      // Regra: usar 1 para denuncia anonima; 4 para os demais casos
      const idTipoIdentificacao = isReport && isAnonymous ? 1 : 4;

      // Montar DTO minimo para o backend com base no tipo escolhido
      const body = {
        tipoChave:
          typeof formData.manifestationType === "string"
            ? formData.manifestationType
            : undefined,
        idTipoFormulario: chosen.idTipoFormulario,
        idTipoManifestacao: chosen.idTipoManifestacao,
        idTipoIdentificacaoManifestante: idTipoIdentificacao,
        textoUsuario: formData.description || "",
        linguagem: language,
        paisNaturalidade: formData.countryName || undefined,
        numeroUnfccc: formData.unfcccNumber || null,
        manifestante: isAnonymous
          ? undefined
          : {
              idPais: formData.countryCode ? Number(formData.countryCode) : 33,
              nome: formData.fullName || "",
              email: formData.email || "",
            },
        anexos: attachments,
      };

      const res = await fetch("/api/manifestacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json: unknown = await res.json();
      const obj =
        json && typeof json === "object"
          ? (json as Record<string, unknown>)
          : {};
      if (res.ok && obj && obj.data && typeof obj.data === "object") {
        const d = obj.data as Record<string, unknown>;
        const result: SubmitResult = {
          success: true,
          data: {
            NumeroProtocolo:
              (d["NumeroProtocolo"] as string) ||
              (d["NumProtocolo"] as string) ||
              (d["protocolo"] as string) ||
              undefined,
            CodigoAcesso: (d["CodigoAcesso"] as string) || undefined,
            DataCadastro: (d["DataCadastro"] as string) || undefined,
            PrazoResposta: (d["PrazoResposta"] as string) || undefined,
          },
          meta: {
            isAnonymousReport: isReport && isAnonymous,
          },
        };
        onComplete(result);
      } else {
        const errMsg =
          (obj && ((obj["error"] as string) || (obj["message"] as string))) ||
          `HTTP ${res.status}`;
        onComplete({ success: false, error: String(errMsg) });
      }
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Erro inesperado ao enviar";
      onComplete({ success: false, error: message });
    }
  };

  const handleButtonClick = (value: string, label: string) => {
    switch (currentStep) {
      case "initial":
        handleInitialChoice(value, label);
        break;
      case "manifestationType":
        handleManifestationType(value, label);
        break;
      case "confirmManifestationType":
        handleManifestationConfirmation(value, label);
        break;
      case "identificationType":
        handleIdentificationType(value, label);
        break;
      case "unfcccQuestion":
        handleUnfcccQuestion(value, label);
        break;
      case "unfcccNumber":
        if (value === "skip") {
          handleSkipUnfccc(label);
        }
        break;
      case "attachmentQuestion":
        handleAttachmentQuestion(value, label);
        break;
      case "moreAttachments":
        handleMoreAttachments(value, label);
        break;
    }
  };

  const handleInputSubmit = () => {
    if (!inputValue.trim()) return;

    handleTextInput(inputValue);
    setInputValue("");
  };

  const currentMessage = messages[messages.length - 1];
  const showInput =
    currentMessage?.inputType &&
    !isTyping &&
    currentMessage.inputType !== "file";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Elementos decorativos de palmeiras */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <Image
          src="/plant-1.svg"
          alt=""
          width={200}
          height={280}
          className="absolute bottom-0 left-0 animate-in fade-in duration-1000"
        />
        <Image
          src="/plant-1.svg"
          alt=""
          width={180}
          height={250}
          className="absolute bottom-0 right-0 scale-x-[-1] animate-in fade-in duration-1000"
          style={{ animationDelay: "200ms" }}
        />
      </div>

      <header className="bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-600 text-white shadow-lg relative z-10 border-b-4 border-emerald-700/50">
        <div className="container max-w-6xl mx-auto px-4 py-5 md:py-6">
          <div className="flex items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-3 md:gap-5 min-w-0">
              {/* Logo COP30 */}
              <div className="w-24 md:w-28 h-14 md:h-16 flex items-center justify-center shrink-0">
                <Image
                  src="/cop30logo-white.svg"
                  alt="COP30 Logo"
                  width={120}
                  height={64}
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight whitespace-pre-wrap">
                  {translations.header[language]}
                </h1>
                <p className="text-xs md:text-sm lg:text-base opacity-90 mt-0.5">
                  {translations.subtitle[language]}
                </p>
              </div>
            </div>

            {/* Language selector */}
            <DropdownMenu open={isLangOpen} onOpenChange={setIsLangOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-white/50 bg-white/20 text-white hover:bg-white/30 hover:text-white transition-all duration-200 px-3 md:px-4 shadow-lg backdrop-blur-sm shrink-0 font-semibold"
                >
                  <Globe className="w-4 h-4 mr-1.5 md:mr-2" />
                  <span className="font-medium tracking-wide text-xs md:text-sm">
                    language === "pt-BR" ? "Você será redirecionado para o
                    portal de consultas. Posso ajudá-lo com algo mais?" :
                    language === "en" ? "en-US" : "Será redirigido al portal de
                    consultas. ¿Puedo ayudarle con algo más?",
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`${
                      language === lang.code
                        ? "bg-teal-50 text-teal-900 font-medium"
                        : "hover:bg-muted"
                    } gap-3 cursor-pointer transition-all duration-200`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto px-3 md:px-4 py-4 md:py-6 relative z-10">
        <Card className="shadow-2xl mb-4 animate-in fade-in duration-500 border-2 rounded-2xl overflow-hidden">
          <ScrollArea className="h-[60vh] md:h-[65vh] p-4 md:p-6 chat-scrollbar">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 animate-in fade-in duration-300 ${
                    message.type === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar
                    className={`${
                      message.type === "bot"
                        ? "bg-teal-100 border-2 border-teal-200"
                        : "bg-teal-500"
                    } transition-all duration-200 shrink-0 w-10 h-10`}
                  >
                    {message.type === "bot" && (
                      <AvatarImage
                        src="/fabi-chatbot.png"
                        alt="Chatbot assistant avatar"
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback
                      className={
                        message.type === "bot"
                          ? "text-teal-700 text-lg"
                          : "text-white text-lg"
                      }
                    >
                      {message.type === "bot" ? "🤖" : "👤"}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className={`flex-1 max-w-[85%] md:max-w-[75%] ${
                      message.type === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 transition-all duration-200 break-words overflow-wrap-anywhere ${
                        message.type === "user"
                          ? "bg-teal-500 text-white shadow-md"
                          : message.variant === "info"
                          ? "bg-blue-50 text-blue-900 border border-blue-200 shadow-sm"
                          : "bg-gray-100 text-gray-900 shadow-sm"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>

                    {message.buttons && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.buttons.map((button, btnIndex) => (
                          <Button
                            key={button.value}
                            onClick={() =>
                              handleButtonClick(button.value, button.label)
                            }
                            variant={button.variant || "outline"}
                            size="sm"
                            className={`rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg animate-in fade-in border-2 font-semibold ${
                              button.variant === "default"
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-emerald-200 hover:text-white"
                                : button.variant === "secondary"
                                ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-amber-200 hover:text-white"
                                : "bg-white hover:bg-teal-600 text-teal-700 border-teal-500 hover:border-teal-600 shadow-teal-100 hover:text-white"
                            }`}
                            style={{
                              animationDelay: `${btnIndex * 80}ms`,
                              animationDuration: "300ms",
                            }}
                          >
                            {button.label}
                          </Button>
                        ))}
                      </div>
                    )}

                    <p
                      className={`text-[11px] text-muted-foreground mt-1 px-1 opacity-60 ${
                        message.type === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString(language, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 animate-in fade-in duration-300">
                  <Avatar className="bg-teal-100 border-2 border-teal-200 w-10 h-10">
                    <AvatarImage
                      src="/fabi-chatbot.png"
                      alt="Chatbot assistant avatar"
                      className="object-cover"
                    />
                    <AvatarFallback className="text-teal-700 text-lg">
                      ð¤
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-2xl px-5 py-4 shadow-sm">
                    <div className="flex gap-1.5">
                      <div
                        className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-typing-dot"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-typing-dot"
                        style={{ animationDelay: "200ms" }}
                      />
                      <div
                        className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-typing-dot"
                        style={{ animationDelay: "400ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </Card>

        {isUploading && (
          <Card
            className="p-4 mb-4 border-2 bg-muted/40 backdrop-blur-sm animate-in fade-in duration-300"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Loader2
                className="w-4 h-4 animate-spin text-primary"
                aria-hidden="true"
              />
              <span>
                {translations.uploading[language]} {`(${uploadProgress}%)`}
              </span>
            </div>
            <div
              className="mt-3 h-2 rounded-full bg-muted overflow-hidden"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={uploadProgress}
              aria-valuetext={`${translations.uploading[language]} ${uploadProgress}%`}
            >
              <div
                className="h-full bg-primary transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
                aria-hidden="true"
              />
            </div>
          </Card>
        )}

        {attachments.length > 0 && (
          <Card className="p-4 mb-4 border-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-sm font-medium">
                language === "pt-BR" ? "Se você for brasileiro, utilize o
                serviço oficial Fala.BR:" : language === "en" ? "Attachments" :
                "Si usted es brasileño, utilice el servicio oficial Fala.BR:",
                {`: ${attachments.length}/10 â¢ `}
                language === "pt-BR" ? "Eu não sou Brasileiro" : language ===
                "en" ? "Total" : "No soy Brasileño",
                {`: ${formatBytes(totalBytes)} / 30 MB`}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="transition-all duration-200 border-teal-500 text-teal-700 hover:bg-teal-600 hover:text-white hover:border-teal-600"
                >
                  language === "pt-BR" ? "Você será redirecionado para o portal
                  Fala.BR. Obrigado por usar nosso serviço!" : language === "en"
                  ? "Add more" : "Será redirigido al portal Fala.BR. ¡Gracias
                  por usar nuestro servicio!",
                </Button>
                <Button
                  size="sm"
                  onClick={() => completeForm()}
                  className="transition-all duration-200 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {language === "pt-BR"
                    ? "Finalizar cadastro"
                    : language === "en"
                    ? "Finish submission"
                    : "Finalizar envio"}
                </Button>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              {attachments.map((a, i) => (
                <div
                  key={`${a.NomeArquivo}-${i}`}
                  className="flex items-center justify-between gap-3 p-2 rounded-md border transition-all duration-200 hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="text-sm truncate" title={a.NomeArquivo}>
                      {a.NomeArquivo}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(a.TamanhoArquivo)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveAttachment(i)}
                    className="transition-all duration-200 border-red-400 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600"
                  >
                    {language === "pt-BR"
                      ? "Remover"
                      : language === "en"
                      ? "Remove"
                      : "Eliminar"}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {showInput && (
          <Card className="p-4 shadow-xl border-2 animate-in fade-in duration-300">
            {currentMessage.inputType === "textarea" ? (
              <div className="flex-1 space-y-3">
                <Textarea
                  ref={textareaRef}
                  value={inputValue}
                  // Impede ultrapassar o limite permitido (ajustado pelo cabecalho)
                  maxLength={allowedBody}
                  onChange={(e) => {
                    const v = e.target.value;
                    setInputValue(
                      v.length > allowedBody ? v.slice(0, allowedBody) : v
                    );
                  }}
                  placeholder={descriptionPlaceholder}
                  className="min-h-[120px] max-h-[300px] resize-y focus:ring-2 focus:ring-primary/20 transition-all duration-200 overflow-y-auto"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      handleInputSubmit();
                    }
                  }}
                />
                {/* Barra de progresso do limite de caracteres considerando o cabecalho */}
                <div>
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-1 transition-all duration-200 ${
                        inputValue.length > allowedBody
                          ? "bg-red-500"
                          : "bg-primary"
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(
                            (inputValue.length / (allowedBody || 1)) * 100
                          )
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-[11px] text-muted-foreground">
                    <span>
                      {language === "pt-BR"
                        ? "Limite de caracteres do texto"
                        : language === "en"
                        ? "Text character limit"
                        : "Limite de caracteres del texto"}
                    </span>
                    <span>
                      {inputValue.length}/{allowedBody}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {language === "pt-BR"
                      ? "Pressione Ctrl+Enter para enviar"
                      : language === "en"
                      ? "Press Ctrl+Enter to send"
                      : "Presione Ctrl+Enter para enviar"}
                  </p>
                  <Button
                    onClick={handleInputSubmit}
                    className="gap-2 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 min-w-[120px] px-6 bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={
                      !inputValue.trim() || inputValue.length > allowedBody
                    }
                  >
                    <Send className="w-4 h-4" />
                    {translations.send[language]}
                  </Button>
                </div>
              </div>
            ) : currentStep === "country" ? (
              <div className="flex gap-2">
                <DropdownMenu
                  open={isCountryOpen}
                  onOpenChange={setIsCountryOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 justify-between h-10 px-3 font-normal"
                    >
                      <span
                        className={
                          selectedCountry
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        {selectedCountry
                          ? selectedCountry.descricao
                          : language === "pt-BR"
                          ? "Selecione seu pais/naturalidade..."
                          : language === "en"
                          ? "Select your country/nationality..."
                          : "Seleccione su pais/nacionalidad..."}
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px]"
                  >
                    <ScrollArea className="h-[280px]">
                      {COUNTRIES.map((country) => (
                        <DropdownMenuItem
                          key={country.codigo}
                          onClick={() => {
                            setSelectedCountry(country);
                            setIsCountryOpen(false);
                          }}
                          className="cursor-pointer"
                        >
                          {country.descricao}
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  onClick={() => {
                    if (selectedCountry) {
                      handleTextInput(selectedCountry.descricao);
                      setSelectedCountry(null);
                    }
                  }}
                  disabled={!selectedCountry}
                  className="transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg shrink-0 gap-2 min-w-[100px] bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {translations.send[language]}
                  </span>
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  type={currentMessage.inputType === "email" ? "email" : "text"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={translations.placeholder[language]}
                  className="flex-1 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleInputSubmit();
                    }
                  }}
                />
                <Button
                  onClick={handleInputSubmit}
                  disabled={!inputValue.trim()}
                  className="transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg shrink-0 gap-2 min-w-[100px] bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {translations.send[language]}
                  </span>
                </Button>
              </div>
            )}
          </Card>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.png,.jpg,.jpeg,.mp3,.mp4,.avi"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
