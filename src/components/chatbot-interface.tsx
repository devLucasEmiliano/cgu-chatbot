"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Card } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { Send, Globe } from "lucide-react"
import type { Language, SubmitResult } from "@/src/app/page"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"
import Image from "next/image"
import { ScrollArea } from "@/src/components/ui/scroll-area"

interface ChatbotInterfaceProps {
  language: Language
  onComplete: (result: SubmitResult) => void
  onLanguageChange: (language: Language) => void
}

interface Message {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: Date
  buttons?: { label: string; value: string; variant?: "default" | "outline" | "secondary" }[]
  inputType?: "text" | "textarea" | "email" | "file"
  variant?: "default" | "info"
}

const translations = {
  header: {
    "pt-BR": "Registro de Solicitação",
    en: "Request Registration",
    es: "Registro de Solicitud",
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
}

const languages = [
  { code: "pt-BR" as Language, flag: "🇧🇷", name: "Português" },
  { code: "en" as Language, flag: "🇺🇸", name: "English" },
  { code: "es" as Language, flag: "🇪🇸", name: "Español" },
]

type FlowStep = 
  | "initial"
  | "manifestationType"
  | "identificationType"
  | "fullName"
  | "email"
  | "confirmEmail"
  | "unfcccQuestion"
  | "unfcccNumber"
  | "description"
  | "attachmentQuestion"
  | "moreAttachments"
  | "complete"

export function ChatbotInterface({ language, onComplete, onLanguageChange }: ChatbotInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStep, setCurrentStep] = useState<FlowStep>("initial")
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isLangOpen, setIsLangOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  // Evita executar mensagens iniciais duas vezes em modo Strict (Next.js/React dev)
  const hasInitializedRef = useRef(false)
  // Track asked questions to prevent duplicates
  const askedQuestionsRef = useRef<Set<string>>(new Set())

  // const currentLang = languages.find((lang) => lang.code === language)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-focus input when it appears
  useEffect(() => {
    const currentMessage = messages[messages.length - 1]
    if (currentMessage?.inputType === "textarea" && textareaRef.current) {
      textareaRef.current.focus()
    } else if (currentMessage?.inputType && inputRef.current) {
      inputRef.current.focus()
    }
  }, [messages])

  useEffect(() => {
    if (hasInitializedRef.current) return
    hasInitializedRef.current = true

    // Mensagem inicial
    addBotMessage(
      language === "pt-BR"
        ? "Olá! Bem-vindo ao sistema de atendimento da COP30."
        : language === "en"
          ? "Hello! Welcome to the COP30 service system."
          : "¡Hola! Bienvenido al sistema de atención de la COP30.",
      0,
    )

    setTimeout(() => {
      addBotMessage(
        language === "pt-BR"
          ? "Você já leu e aceitou os Termos de Uso."
          : language === "en"
            ? "You have read and accepted the Terms of Use."
            : "Usted ha leído y aceptado los Términos de Uso.",
        800,
      )
    }, 800)

    setTimeout(() => {
      addBotMessage(
        language === "pt-BR"
          ? "Você gostaria de Consultar ou Cadastrar uma manifestação?"
          : language === "en"
            ? "Would you like to Consult or Register a manifestation?"
            : "¿Le gustaría Consultar o Registrar una manifestación?",
        1600,
        [
          {
            label: language === "pt-BR" ? "Consultar" : language === "en" ? "Consult" : "Consultar",
            value: "consult",
            variant: "outline" as const,
          },
          {
            label: language === "pt-BR" ? "Cadastrar" : language === "en" ? "Register" : "Registrar",
            value: "register",
            variant: "default" as const,
          },
        ],
      )
    }, 1600)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addBotMessage = (
    content: string,
    delay: number = 500,
    buttons?: { label: string; value: string; variant?: "default" | "outline" | "secondary" }[],
    inputType?: "text" | "textarea" | "email" | "file",
    variant: "default" | "info" = "default",
  ) => {
    // Prevent duplicate messages
    const messageKey = `${content}-${currentStep}`
    if (askedQuestionsRef.current.has(messageKey)) {
      return
    }
    askedQuestionsRef.current.add(messageKey)

    setIsTyping(true)

    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString() + Math.random(),
        type: "bot",
        content,
        timestamp: new Date(),
        buttons,
        inputType,
        variant,
      }

      setMessages((prev) => [...prev, newMessage])
      setIsTyping(false)
    }, delay)
  }

  const addUserMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString() + Math.random(),
      type: "user",
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
  }

  const handleInitialChoice = (choice: string, label: string) => {
    addUserMessage(label)

    if (choice === "consult") {
      window.open("https://falabr.cgu.gov.br/web/manifestacao/consultar", "_blank")
      setTimeout(() => {
        addBotMessage(
          language === "pt-BR"
            ? "Você será redirecionado para o portal de consultas. Posso ajudá-lo com algo mais?"
            : language === "en"
              ? "You will be redirected to the consultation portal. Can I help you with something else?"
              : "Será redirigido al portal de consultas. ¿Puedo ayudarle con algo más?",
          300,
          [
            {
              label: language === "pt-BR" ? "Fazer novo cadastro" : language === "en" ? "Make new registration" : "Hacer nuevo registro",
              value: "register",
              variant: "default" as const,
            },
          ],
        )
      }, 300)
      return
    }

    if (choice === "register") {
      // Mostrar aviso do Fala.BR para brasileiros
      setTimeout(() => {
        addBotMessage(
          language === "pt-BR"
            ? "Se você for brasileiro, utilize o serviço oficial Fala.BR:"
            : language === "en"
              ? "If you are Brazilian, please use the official Fala.BR service:"
              : "Si usted es brasileño, utilice el servicio oficial Fala.BR:",
          300,
          [
            {
              label: language === "pt-BR" ? "Ir para o Fala.BR" : language === "en" ? "Go to Fala.BR" : "Ir a Fala.BR",
              value: "falabr",
              variant: "default" as const,
            },
            {
              label: language === "pt-BR" ? "Eu não sou Brasileiro" : language === "en" ? "I am not Brazilian" : "No soy Brasileño",
              value: "continue",
              variant: "outline" as const,
            },
          ],
        )
      }, 300)
      return
    }

    if (choice === "falabr") {
      window.open("https://falabr.cgu.gov.br", "_blank")
      setTimeout(() => {
        addBotMessage(
          language === "pt-BR"
            ? "Você será redirecionado para o portal Fala.BR. Obrigado por usar nosso serviço!"
            : language === "en"
              ? "You will be redirected to the Fala.BR portal. Thank you for using our service!"
              : "Será redirigido al portal Fala.BR. ¡Gracias por usar nuestro servicio!",
          300,
        )
      }, 300)
      return
    }

    if (choice === "continue") {
      setCurrentStep("manifestationType")
      setTimeout(() => {
        addBotMessage(
          language === "pt-BR"
            ? "Que tipo de manifestação você gostaria de fazer?"
            : language === "en"
              ? "What type of manifestation would you like to make?"
              : "¿Qué tipo de manifestación le gustaría hacer?",
          300,
          [
            {
              label: language === "pt-BR" ? "Denúncia" : language === "en" ? "Report" : "Denuncia",
              value: "report",
              variant: "outline" as const,
            },
            {
              label: language === "pt-BR" ? "Elogio" : language === "en" ? "Compliment" : "Elogio",
              value: "compliment",
              variant: "outline" as const,
            },
            {
              label: language === "pt-BR" ? "Reclamação" : language === "en" ? "Complaint" : "Queja",
              value: "complaint",
              variant: "outline" as const,
            },
            {
              label: language === "pt-BR" ? "Solicitação" : language === "en" ? "Request" : "Solicitud",
              value: "request",
              variant: "outline" as const,
            },
            {
              label: language === "pt-BR" ? "Sugestão" : language === "en" ? "Suggestion" : "Sugerencia",
              value: "suggestion",
              variant: "outline" as const,
            },
          ],
        )
      }, 300)
    }
  }

  const handleManifestationType = (type: string, label: string) => {
    addUserMessage(label)
    setFormData((prev) => ({ ...prev, manifestationType: type }))

    if (type === "report") {
      setCurrentStep("identificationType")
      setTimeout(() => {
        // Aviso informativo para denuncias (identificada vs anônima)
        addBotMessage(
          language === "pt-BR"
            ? "Identificada: você poderá receber informações sobre as providências adotadas. Denúncia anônima: não será possível acompanhar ou receber respostas."
            : language === "en"
              ? "Identified: you will be able to receive information about the measures taken. Anonymous report: it will not be possible to track or receive responses."
              : "Identificada: podrá recibir información sobre las medidas adoptadas. Denuncia anónima: no será posible hacer seguimiento ni recibir respuestas.",
          150,
          undefined,
          undefined,
          "info",
        )
      }, 150)
      setTimeout(() => {
        addBotMessage(
          language === "pt-BR"
            ? "Você deseja se identificar ou permanecer anônimo(a)?"
            : language === "en"
              ? "Do you wish to identify yourself or remain anonymous?"
              : "¿Desea identificarse o permanecer anónimo(a)?",
          300,
          [
            {
              label: language === "pt-BR" ? "Identificada" : language === "en" ? "Identified" : "Identificada",
              value: "identified",
              variant: "outline" as const,
            },
            {
              label: language === "pt-BR" ? "Anônima" : language === "en" ? "Anonymous" : "Anónima",
              value: "anonymous",
              variant: "secondary" as const,
            },
          ],
        )
      }, 350)
    } else {
      // Para outros tipos, vai direto para identificação
      setCurrentStep("fullName")
      setTimeout(() => {
        addBotMessage(
          language === "pt-BR"
            ? "Qual é seu nome completo?"
            : language === "en"
              ? "What is your full name?"
              : "¿Cuál es su nombre completo?",
          300,
          undefined,
          "text",
        )
      }, 300)
    }
  }

  const handleIdentificationType = (type: string, label: string) => {
    addUserMessage(label)
    setFormData((prev) => ({ ...prev, identificationType: type }))

    if (type === "identified") {
      setCurrentStep("fullName")
      setTimeout(() => {
        addBotMessage(
          language === "pt-BR"
            ? "Qual é seu nome completo?"
            : language === "en"
              ? "What is your full name?"
              : "¿Cuál es su nombre completo?",
          300,
          undefined,
          "text",
        )
      }, 300)
    } else {
      // Anônimo vai direto para descrição
      setCurrentStep("description")
      setTimeout(() => {
        addBotMessage(
          language === "pt-BR"
            ? "Descreva sua solicitação em detalhes:"
            : language === "en"
              ? "Describe your request in detail:"
              : "Describa su solicitud en detalle:",
          300,
          undefined,
          "textarea",
        )
      }, 300)
    }
  }

  const handleTextInput = (value: string) => {
    addUserMessage(value)

    switch (currentStep) {
      case "fullName":
        setFormData((prev) => ({ ...prev, fullName: value }))
        setCurrentStep("email")
        setTimeout(() => {
          addBotMessage(
            language === "pt-BR"
              ? "Qual é seu e-mail?"
              : language === "en"
                ? "What is your email?"
                : "¿Cuál es su correo electrónico?",
            300,
            undefined,
            "email",
          )
        }, 300)
        break

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
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
              "email",
            )
          }, 300)
          return
        }
        setFormData((prev) => ({ ...prev, email: value }))
        setCurrentStep("confirmEmail")
        setTimeout(() => {
          addBotMessage(
            language === "pt-BR"
              ? "Confirme seu e-mail:"
              : language === "en"
                ? "Confirm your email:"
                : "Confirme su correo electrónico:",
            300,
            undefined,
            "email",
          )
        }, 300)
        break

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
              "email",
            )
          }, 300)
          return
        }
        setFormData((prev) => ({ ...prev, emailConfirmed: value }))
        setCurrentStep("unfcccQuestion")
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
                label: language === "pt-BR" ? "Sim" : language === "en" ? "Yes" : "Sí",
                value: "yes",
                variant: "outline" as const,
              },
              {
                label: language === "pt-BR" ? "Não" : language === "en" ? "No" : "No",
                value: "no",
                variant: "outline" as const,
              },
            ],
          )
        }, 300)
        break

      case "unfcccNumber":
        setFormData((prev) => ({ ...prev, unfcccNumber: value }))
        setCurrentStep("description")
        setTimeout(() => {
          addBotMessage(
            language === "pt-BR"
              ? "Descreva sua solicitação em detalhes:"
              : language === "en"
                ? "Describe your request in detail:"
                : "Describa su solicitud en detalle:",
            300,
            undefined,
            "textarea",
          )
        }, 300)
        break

      case "description":
        setFormData((prev) => ({ ...prev, description: value }))
        // Pula a pergunta de nacionalidade já que foi verificado no início
        setCurrentStep("attachmentQuestion")
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
                label: language === "pt-BR" ? "Sim" : language === "en" ? "Yes" : "Sí",
                value: "yes",
                variant: "outline" as const,
              },
              {
                label: language === "pt-BR" ? "Não" : language === "en" ? "No" : "No",
                value: "no",
                variant: "secondary" as const,
              },
            ],
          )
        }, 300)
        break
    }
  }

  const handleUnfcccQuestion = (answer: string, label: string) => {
    addUserMessage(label)
    setFormData((prev) => ({ ...prev, unfccc: answer }))

    if (answer === "yes") {
      setCurrentStep("unfcccNumber")
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
              label: language === "pt-BR" ? "Pular" : language === "en" ? "Skip" : "Omitir",
              value: "skip",
              variant: "secondary" as const,
            },
          ],
          "text",
        )
      }, 300)
    } else {
      setCurrentStep("description")
      setTimeout(() => {
        addBotMessage(
          language === "pt-BR"
            ? "Descreva sua solicitação em detalhes:"
            : language === "en"
              ? "Describe your request in detail:"
              : "Describa su solicitud en detalle:",
          300,
          undefined,
          "textarea",
        )
      }, 300)
    }
  }

  const handleSkipUnfccc = (label: string) => {
    addUserMessage(label)
    setCurrentStep("description")
    setTimeout(() => {
      addBotMessage(
        language === "pt-BR"
          ? "Descreva sua solicitação em detalhes:"
          : language === "en"
            ? "Describe your request in detail:"
            : "Describa su solicitud en detalle:",
        300,
        undefined,
        "textarea",
      )
    }, 300)
  }

  const handleAttachmentQuestion = (answer: string, label: string) => {
    addUserMessage(label)

    if (answer === "yes") {
      fileInputRef.current?.click()
    } else {
      completeForm()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const maxSize = 10 * 1024 * 1024
    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        alert(
          language === "pt-BR"
            ? `O arquivo ${file.name} excede o tamanho máximo de 10MB.`
            : language === "en"
              ? `The file ${file.name} exceeds the maximum size of 10MB.`
              : `El archivo ${file.name} excede el tamaño máximo de 10MB.`,
        )
        return false
      }
      return true
    })

    if (validFiles.length > 0) {
      addUserMessage(
        `${validFiles.length} ${
          language === "pt-BR"
            ? "arquivo(s) anexado(s)"
            : language === "en"
              ? "file(s) attached"
              : "archivo(s) adjunto(s)"
        }`,
      )

      setCurrentStep("moreAttachments")
      setTimeout(() => {
        addBotMessage(
          language === "pt-BR"
            ? "Deseja adicionar mais anexos?"
            : language === "en"
              ? "Would you like to add more attachments?"
              : "¿Desea añadir más archivos adjuntos?",
          300,
          [
            {
              label: language === "pt-BR" ? "Sim" : language === "en" ? "Yes" : "Sí",
              value: "yes",
              variant: "outline" as const,
            },
            {
              label: language === "pt-BR" ? "Não, finalizar" : language === "en" ? "No, finish" : "No, finalizar",
              value: "no",
              variant: "default" as const,
            },
          ],
        )
      }, 300)
    }
  }

  const handleMoreAttachments = (answer: string, label: string) => {
    addUserMessage(label)

    if (answer === "yes") {
      fileInputRef.current?.click()
    } else {
      completeForm()
    }
  }

  const completeForm = async () => {
    setCurrentStep("complete")
    setTimeout(() => {
      addBotMessage(
        language === "pt-BR"
          ? "Processando sua solicitação..."
          : language === "en"
            ? "Processing your request..."
            : "Procesando su solicitud...",
        300,
      )
    }, 300)
    try {
      // Montar DTO mínimo para o backend (exemplo simples baseado nos dados coletados)
      const body = {
        idTipoFormulario: 1,
        idTipoManifestacao: 5,
        idTipoIdentificacaoManifestante: formData.identificationType === "anonymous" ? 3 : 1,
        textoUsuario: formData.description || "",
        linguagem: language,
        manifestante:
          formData.identificationType === "anonymous"
            ? undefined
            : {
                idPais: 33,
                nome: formData.fullName || "",
                email: formData.email || "",
              },
      }

      const res = await fetch("/api/manifestacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const json: unknown = await res.json()
      const obj = (json && typeof json === "object" ? (json as Record<string, unknown>) : {})
      if (res.ok && obj && obj.data && typeof obj.data === "object") {
        const d = obj.data as Record<string, unknown>
        const result: SubmitResult = {
          success: true,
          data: {
            NumeroProtocolo: (d["NumeroProtocolo"] as string) || (d["NumProtocolo"] as string) || (d["protocolo"] as string) || undefined,
            CodigoAcesso: (d["CodigoAcesso"] as string) || undefined,
            DataCadastro: (d["DataCadastro"] as string) || undefined,
            PrazoResposta: (d["PrazoResposta"] as string) || undefined,
          },
        }
        onComplete(result)
      } else {
        const errMsg = (obj && ((obj["error"] as string) || (obj["message"] as string))) || `HTTP ${res.status}`
        onComplete({ success: false, error: String(errMsg) })
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Erro inesperado ao enviar"
      onComplete({ success: false, error: message })
    }
  }

  const handleButtonClick = (value: string, label: string) => {
    switch (currentStep) {
      case "initial":
        handleInitialChoice(value, label)
        break
      case "manifestationType":
        handleManifestationType(value, label)
        break
      case "identificationType":
        handleIdentificationType(value, label)
        break
      case "unfcccQuestion":
        handleUnfcccQuestion(value, label)
        break
      case "unfcccNumber":
        if (value === "skip") {
          handleSkipUnfccc(label)
        }
        break
      case "attachmentQuestion":
        handleAttachmentQuestion(value, label)
        break
      case "moreAttachments":
        handleMoreAttachments(value, label)
        break
    }
  }

  const handleInputSubmit = () => {
    if (!inputValue.trim()) return

    handleTextInput(inputValue)
    setInputValue("")
  }

  const currentMessage = messages[messages.length - 1]
  const showInput =
    currentMessage?.inputType &&
    !isTyping &&
    currentMessage.inputType !== "file"

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Elementos decorativos de palmeiras */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <Image
          src="/plant-1.svg"
          alt=""
          width={200}
          height={280}
          className="absolute bottom-0 left-0 animate-float"
          style={{ animationDelay: "0s" }}
        />
        <Image
          src="/plant-1.svg"
          alt=""
          width={180}
          height={250}
          className="absolute bottom-0 right-0 scale-x-[-1] animate-float"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <header className="bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-900 text-white shadow-lg animate-in fade-in slide-in-from-top-4 duration-700 relative z-10 border-b-4 border-emerald-700/50">
        <div className="container max-w-6xl mx-auto px-4 py-5 md:py-6">
          <div className="flex items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-3 md:gap-5 min-w-0">
              {/* Logo COP30 */}
              <div className="w-24 md:w-28 h-14 md:h-16 flex items-center justify-center shrink-0 animate-in zoom-in duration-500" style={{ animationDelay: "300ms" }}>
                <Image
                  src="/cop30logo.svg"
                  alt="COP30 Logo"
                  width={120}
                  height={64}
                  className="object-contain hover:scale-105 transition-smooth"
                />
              </div>
              <div className="min-w-0 animate-in fade-in slide-in-from-left-4 duration-700" style={{ animationDelay: "500ms" }}>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight whitespace-pre-wrap">{translations.header[language]}</h1>
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
                  className="rounded-full border-white/40 bg-white/15 text-white hover:bg-white/25 hover:scale-105 transition-smooth px-3 md:px-4 shadow-lg backdrop-blur-sm shrink-0 animate-in fade-in zoom-in duration-500"
                  style={{ animationDelay: "700ms" }}
                >
                  <Globe className="w-4 h-4 mr-1.5 md:mr-2" />
                  <span className="font-medium tracking-wide text-xs md:text-sm">
                    {language === "pt-BR" ? "pt-BR" : language === "en" ? "en-US" : "es-ES"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 animate-in fade-in slide-in-from-top-2 duration-200">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code)
                      setIsLangOpen(false)
                    }}
                    className={`${language === lang.code ? "bg-teal-50 text-teal-900 font-medium" : "hover:bg-muted"} gap-3 cursor-pointer transition-smooth`}
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
        <Card
          className="shadow-2xl mb-4 animate-in fade-in zoom-in-95 duration-700 border-2 hover:shadow-3xl transition-smooth rounded-2xl overflow-hidden"
          style={{ animationDelay: "200ms" }}
        >
          <ScrollArea className="h-[60vh] md:h-[65vh] p-4 md:p-6 chat-scrollbar">
            <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-message-in ${
                  message.type === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className={`${
                  message.type === "bot" 
                    ? "bg-gradient-to-br from-primary to-primary/80 shadow-md" 
                    : "bg-gradient-to-br from-muted to-muted/80"
                } transition-smooth shrink-0`}>
                  <AvatarFallback className={message.type === "bot" ? "text-primary-foreground text-lg" : "text-lg"}>
                    {message.type === "bot" ? "🤖" : "👤"}
                  </AvatarFallback>
                </Avatar>

                <div className={`flex-1 max-w-[78%] md:max-w-[70%] ${message.type === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 transition-smooth hover:shadow-lg ${
                      message.type === "user"
                        ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-md"
                        : message.variant === "info"
                          ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 text-emerald-900 border-2 border-emerald-200/50 shadow-sm"
                          : "bg-gradient-to-br from-muted to-muted/80 text-foreground border border-border/50"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  </div>

                  {message.buttons && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.buttons.map((button, btnIndex) => (
                        <Button
                          key={button.value}
                          onClick={() => handleButtonClick(button.value, button.label)}
                          variant={button.variant || "outline"}
                          size="sm"
                          className="rounded-full transition-smooth hover:scale-105 active:scale-95 shadow-sm hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300"
                          style={{ animationDelay: `${btnIndex * 100}ms` }}
                        >
                          {button.label}
                        </Button>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mt-1.5 px-2 opacity-70">
                    {message.timestamp.toLocaleTimeString(language, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Avatar className="bg-gradient-to-br from-primary to-primary/80 shadow-md">
                  <AvatarFallback className="text-primary-foreground text-lg">🤖</AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl px-5 py-4 shadow-sm border border-border/50">
                  <div className="flex gap-1.5">
                    <div
                      className="w-2.5 h-2.5 bg-muted-foreground/70 rounded-full animate-typing-dot"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2.5 h-2.5 bg-muted-foreground/70 rounded-full animate-typing-dot"
                      style={{ animationDelay: "200ms" }}
                    />
                    <div
                      className="w-2.5 h-2.5 bg-muted-foreground/70 rounded-full animate-typing-dot"
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

        {showInput && (
          <Card className="p-4 shadow-xl border-2 animate-in fade-in slide-in-from-bottom-4 duration-300 hover:shadow-2xl transition-smooth">
            {currentMessage.inputType === "textarea" ? (
              <div className="flex-1 space-y-3">
                <Textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={translations.placeholder[language]}
                  className="min-h-[120px] resize-none focus:ring-2 focus:ring-primary/20 transition-smooth"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      handleInputSubmit()
                    }
                  }}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {language === "pt-BR" ? "Pressione Ctrl+Enter para enviar" : language === "en" ? "Press Ctrl+Enter to send" : "Presione Ctrl+Enter para enviar"}
                  </p>
                  <Button 
                    onClick={handleInputSubmit} 
                    className="gap-2 shadow-md hover:shadow-lg transition-smooth hover:scale-105 active:scale-95" 
                    disabled={!inputValue.trim()}
                  >
                    <Send className="w-4 h-4" />
                    {translations.send[language]}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  type={currentMessage.inputType === "email" ? "email" : "text"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={translations.placeholder[language]}
                  className="flex-1 focus:ring-2 focus:ring-primary/20 transition-smooth"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleInputSubmit()
                    }
                  }}
                />
                <Button
                  onClick={handleInputSubmit}
                  size="icon"
                  disabled={!inputValue.trim()}
                  className="transition-smooth hover:scale-110 active:scale-95 shadow-md hover:shadow-lg shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}
          </Card>
        )}

        <input ref={fileInputRef} type="file" multiple onChange={handleFileUpload} className="hidden" />
      </div>
    </div>
  )
}
