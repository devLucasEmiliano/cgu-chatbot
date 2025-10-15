"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Card } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { Send, Globe } from "lucide-react"
import type { Language } from "@/src/app/page"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"

interface ChatbotInterfaceProps {
  language: Language
  onComplete: (protocol: string) => void
  onLanguageChange: (language: Language) => void
}

interface Message {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: Date
  buttons?: { label: string; value: string; variant?: "default" | "outline" | "secondary" }[]
  inputType?: "text" | "textarea" | "email" | "file" | "country"
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

const countries = [
  { code: "BR", name: { "pt-BR": "Brasil", en: "Brazil", es: "Brasil" } },
  { code: "US", name: { "pt-BR": "Estados Unidos", en: "United States", es: "Estados Unidos" } },
  { code: "ES", name: { "pt-BR": "Espanha", en: "Spain", es: "España" } },
  { code: "AR", name: { "pt-BR": "Argentina", en: "Argentina", es: "Argentina" } },
  { code: "MX", name: { "pt-BR": "México", en: "Mexico", es: "México" } },
  { code: "CO", name: { "pt-BR": "Colômbia", en: "Colombia", es: "Colombia" } },
  { code: "CL", name: { "pt-BR": "Chile", en: "Chile", es: "Chile" } },
  { code: "PE", name: { "pt-BR": "Peru", en: "Peru", es: "Perú" } },
  { code: "OTHER", name: { "pt-BR": "Outro", en: "Other", es: "Otro" } },
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
  | "nationality"
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

  const currentLang = languages.find((lang) => lang.code === language)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
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
          ? "Você gostaria de Consultar ou Cadastrar uma manifestação?"
          : language === "en"
            ? "Would you like to Consult or Register a manifestation?"
            : "¿Le gustaría Consultar o Registrar una manifestación?",
        800,
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
    }, 800)
  }, [language])

  const addBotMessage = (
    content: string,
    delay: number = 500,
    buttons?: { label: string; value: string; variant?: "default" | "outline" | "secondary" }[],
    inputType?: "text" | "textarea" | "email" | "file" | "country",
  ) => {
    setIsTyping(true)

    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString() + Math.random(),
        type: "bot",
        content,
        timestamp: new Date(),
        buttons,
        inputType,
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
    } else {
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
      }, 300)
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
        setCurrentStep("nationality")
        setTimeout(() => {
          addBotMessage(
            language === "pt-BR"
              ? "Qual é sua nacionalidade?"
              : language === "en"
                ? "What is your nationality?"
                : "¿Cuál es su nacionalidad?",
            300,
            undefined,
            "country",
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

  const handleCountrySelect = (country: string, label: string) => {
    addUserMessage(label)
    setFormData((prev) => ({ ...prev, nationality: country }))

    if (country === "BR") {
      setTimeout(() => {
        addBotMessage(
          language === "pt-BR"
            ? "Como você é brasileiro(a), recomendamos usar o canal oficial Fala.BR. Você será redirecionado."
            : language === "en"
              ? "As you are Brazilian, we recommend using the official Fala.BR channel. You will be redirected."
              : "Como usted es brasileño(a), recomendamos usar el canal oficial Fala.BR. Será redirigido.",
          300,
        )
      }, 300)

      setTimeout(() => {
        window.open("https://falabr.cgu.gov.br", "_blank")
      }, 3000)
      return
    }

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

  const completeForm = () => {
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

    setTimeout(() => {
      const protocol = `COP30-${Date.now().toString().slice(-8)}`
      onComplete(protocol)
    }, 2000)
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
      case "nationality":
        handleCountrySelect(value, label)
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
    currentMessage.inputType !== "file" &&
    currentMessage.inputType !== "country"

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-accent text-accent-foreground shadow-lg animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl">🌱</span>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{translations.header[language]}</h1>
                <p className="text-xs opacity-90 font-light tracking-wide">{translations.subtitle[language]}</p>
              </div>
            </div>

            <DropdownMenu open={isLangOpen} onOpenChange={setIsLangOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 hover:scale-105 transition-all duration-300 border-2 bg-background/50"
                >
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="font-medium">{currentLang?.flag}</span>
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
                    className={`gap-3 cursor-pointer transition-all duration-200 ${
                      language === lang.code ? "bg-primary/10 font-medium" : ""
                    }`}
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

      <div className="container max-w-4xl mx-auto px-4 py-6">
        <Card
          className="shadow-2xl mb-4 animate-in fade-in zoom-in-95 duration-700"
          style={{ animationDelay: "200ms" }}
        >
          <div className="h-[500px] md:h-[600px] overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                  message.type === "user" ? "flex-row-reverse" : "flex-row"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Avatar className={`${message.type === "bot" ? "bg-primary" : "bg-muted"} transition-all duration-300`}>
                  <AvatarFallback className={message.type === "bot" ? "text-primary-foreground" : ""}>
                    {message.type === "bot" ? "🤖" : "👤"}
                  </AvatarFallback>
                </Avatar>

                <div className={`flex-1 max-w-[80%] ${message.type === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 transition-all duration-300 hover:shadow-md ${
                      message.type === "bot" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  </div>

                  {message.buttons && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.buttons.map((button) => (
                        <Button
                          key={button.value}
                          onClick={() => handleButtonClick(button.value, button.label)}
                          variant={button.variant || "outline"}
                          size="sm"
                          className="rounded-full transition-all duration-300 hover:scale-105"
                        >
                          {button.label}
                        </Button>
                      ))}
                    </div>
                  )}

                  {message.inputType === "country" && !isTyping && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {countries.map((country) => (
                        <Button
                          key={country.code}
                          onClick={() => handleButtonClick(country.code, country.name[language])}
                          variant="outline"
                          size="sm"
                          className="rounded-full transition-all duration-300 hover:scale-105"
                        >
                          {country.name[language]}
                        </Button>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mt-1 px-2">
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
                <Avatar className="bg-primary">
                  <AvatarFallback className="text-primary-foreground">🤖</AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </Card>

        {showInput && (
          <Card className="p-4 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
            {currentMessage.inputType === "textarea" ? (
              <div className="flex-1 space-y-2">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={translations.placeholder[language]}
                  className="min-h-[100px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      handleInputSubmit()
                    }
                  }}
                />
                <Button onClick={handleInputSubmit} className="w-full gap-2" disabled={!inputValue.trim()}>
                  <Send className="w-4 h-4" />
                  {translations.send[language]}
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  type={currentMessage.inputType === "email" ? "email" : "text"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={translations.placeholder[language]}
                  className="flex-1"
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
                  className="transition-all duration-300 hover:scale-105"
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
