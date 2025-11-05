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
    "pt-BR": "Termo de Uso e Política de Privacidade",
    en: "Terms of Use and Privacy Policy",
    es: "Términos de Uso y Política de Privacidad",
  },
  content: {
    "pt-BR": `  O Canal FalaCOP30 foi pensado especialmente para que sejam encaminhadas ao governo brasileiro manifestações como sugestões, elogios, denúncias, reclamações ou solicitações relacionadas à COP30, sempre com respeito à sua voz e ao compromisso com a transparência e integridade.

O prazo para atendimento das manifestações registradas neste formulário é de 30 dias, prorrogável por igual período.

Antes de iniciar o formulário, orientamos que verifique se já existe canal adequado para encaminhamento da sua demanda em [https://cop30.br/pt-br/servicos-da-cop30/fale-conosco](https://cop30.br/pt-br/servicos-da-cop30/fale-conosco). A utilização adequada dos canais indicados na página mencionada pode trazer maior tempestividade para soluções de casos específicos, como denúncias trabalhistas e problemas com serviços de hospedagem e transporte.

As manifestações registradas nesse formulário serão tratadas na Plataforma Fala.BR. A Plataforma Fala.BR é um canal integrado para encaminhamento de manifestações a órgãos e entidades do poder público brasileiro.

**1. Termo de Uso**
1.1. Aceitação dos Termos
Ao utilizar o FalaCOP30, você concorda com os termos e condições aqui estabelecidos. O acesso ao serviço está condicionado à aceitação integral destes termos, sendo responsabilidade do usuário utilizá-lo de maneira ética e conforme sua finalidade institucional.

1.2. Finalidade e Funcionalidade do Serviço
O FalaCOP30 é um canal pensado especialmente para que sejam encaminhadas ao governo brasileiro manifestações como sugestões, elogios, denúncias, reclamações ou solicitações relacionadas à COP30. O FalaCOP30 providencia o registro formal, na Plataforma Fala.BR, das manifestações recebidas. O FalaCOP30 não substitui o atendimento humano, sendo um recurso complementar para facilitar o contato com os serviços do governo brasileiro.

1.3. Limitações do Serviço
Embora o FalaCOP30 tenha sido projetado para oferecer um atendimento inteligente e atualizado, a Controladoria-Geral da União não garante que todas as informações fornecidas estejam sempre completas, precisas ou livres de erros, especialmente em casos de mudanças normativas ou atualizações nos serviços. Como o FalaCOP30 realiza o registro das demandas na Plataforma Fala.BR, a Controladoria-Geral da União orienta que cidadãos brasileiros utilizem diretamente a Plataforma Fala.BR em [https://falabr.cgu.gov.br](https://falabr.cgu.gov.br).

1.4. Disponibilidade e Estabilidade do Serviço
O funcionamento do FalaCOP30 está sujeito a fatores externos, como:
- Disponibilidade dos servidores e infraestrutura tecnológica;
- Atualizações e melhorias no sistema;
- Manutenção programada ou eventual instabilidade técnica.
A Controladoria-Geral da União não se responsabiliza por indisponibilidades temporárias do serviço, mas se compromete a adotar medidas corretivas sempre que necessário.

1.5. Alterações no Sistema e no Conteúdo
A Controladoria-Geral da União se reserva o direito de modificar, suspender ou descontinuar funcionalidades do FalaCOP30 a qualquer momento, sem necessidade de aviso prévio. Essas mudanças podem incluir ajustes nos conteúdos disponibilizados pelo canal e melhorias na interação com o público.

1.6. Privacidade e Segurança
A utilização do FalaCOP30 está sujeita à Política de Privacidade, garantindo que os dados dos usuários sejam protegidos e tratados conforme a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). O FalaCOP30 não solicita nem armazena informações sensíveis, como dados bancários, senhas ou informações protegidas por sigilo legal.

1.7. Encerramento ou Restrição de Acesso
A Controladoria-Geral da União poderá suspender ou encerrar o serviço do FalaCOP30 a qualquer momento, especialmente em casos de:
- Identificação de mau uso ou tentativas de fraude;
- Atualizações que tornem o serviço obsoleto ou incompatível com novas diretrizes institucionais;
- Razões técnicas ou operacionais que exijam a interrupção do serviço.

1.8. Responsabilidades do Usuário
Ao utilizar o FalaCOP30, o usuário concorda que:
- Não fará uso indevido do serviço, como envio de mensagens abusivas, ofensivas ou tentativas de manipulação do sistema;
- É responsável pelas informações fornecidas durante a interação, devendo garantir que suas dúvidas ou solicitações sejam legítimas e condizentes com os serviços do governo brasileiro.
A Controladoria-Geral da União não se responsabiliza por interpretações equivocadas das informações fornecidas pelo FalaCOP30 ou por eventuais falhas na compreensão das respostas automatizadas.

1.9. Contato e Suporte
Para dúvidas, sugestões ou mais informações sobre o FalaCOP30, você poderá se manifestar pelo próprio Fala.BR: [https://falabr.cgu.gov.br](https://falabr.cgu.gov.br).

**2. Política de Privacidade**
2.1. Introdução
Esta Política de Privacidade descreve como coletamos, utilizamos e protegemos as informações dos usuários ao interagir com o FalaCOP30. O FalaCOP30 é um canal pensado especialmente para que sejam encaminhadas ao governo brasileiro manifestações como sugestões, elogios, denúncias, reclamações ou solicitações relacionadas à COP30. O FalaCOP30 providencia o registro formal, na Plataforma Fala.BR, das manifestações recebidas.

2.2. Coleta de Informações
Ao interagir com o FalaCOP30, podem ser coletadas as seguintes informações:
- Informações fornecidas pelo usuário: como nome, e-mail, país/nacionalidade do usuário e mensagens enviadas durante a conversa.
O FalaCOP30 não solicita nem armazena informações sensíveis como dados bancários, senhas ou informações protegidas por sigilo legal.

2.3. Uso das Informações
Os dados coletados são utilizados para:
- Fornecer suporte e informações aos usuários dos serviços públicos do governo brasileiro;
- Aprimorar a experiência do usuário, analisando padrões de uso e otimizando as interações com o canal;
- Cumprir obrigações legais e regulatórias, quando aplicável;
- Evitar fraudes e garantir segurança no atendimento virtual.
As interações com o FalaCOP30 podem ser analisadas de forma agregada e anônima para fins estatísticos e de melhoria contínua dos serviços.

2.4. Compartilhamento de Informações
A Controladoria-Geral da União não compartilha informações pessoais com terceiros, exceto nos seguintes casos:
- Para cumprimento de obrigações legais ou regulatórias aplicáveis às Ouvidorias Públicas e à Controladoria-Geral da União;
- Quando houver requisição legal por órgãos competentes, conforme legislação vigente;
- Em situações específicas onde o usuário solicitar ou consentir expressamente o compartilhamento de seus dados.

2.5. Segurança das Informações
A Controladoria-Geral da União adota medidas técnicas e organizacionais para proteger as informações coletadas contra acesso não autorizado, perda, alteração ou destruição indevida, incluindo:
- Criptografia de dados em trânsito e armazenamento seguro;
- Controle de acessos e monitoramento de interações;
- Políticas de privacidade e segurança alinhadas à Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).

2.6. Retenção e Exclusão dos Dados
As interações com o FalaCOP30 serão armazenadas pelo período necessário para:
- Melhoria do serviço e análise de atendimentos;
- Cumprimento de obrigações legais ou regulatórias;
- Atendimento a auditorias e fiscalizações, quando aplicável.
Após esse período, os dados serão anonimizados ou excluídos, conforme diretrizes da LGPD.

2.7. Alterações na Política de Privacidade
Esta Política de Privacidade pode ser atualizada a qualquer momento para refletir mudanças nos serviços do FalaCOP30 ou na legislação vigente. Os usuários serão notificados sobre alterações relevantes por meio do sítio eletrônico da COP30.

2.8. Direitos do Usuário
Em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018), os usuários possuem os seguintes direitos:
- Acesso aos seus dados pessoais armazenados pelo FalaCOP30;
- Correção de informações incorretas ou incompletas;
- Solicitação de anonimização, bloqueio ou eliminação de dados quando não forem mais necessários para a finalidade informada;
- Informações sobre o compartilhamento de dados;
- Revogação do consentimento para tratamento de dados, quando aplicável.
Para exercer seus direitos, entre em contato com a Ouvidoria da Controladoria-Geral da União, por meio da Plataforma Fala.BR: [https://falabr.cgu.gov.br](https://falabr.cgu.gov.br).

2.9. Encerramento do Serviço
A Controladoria-Geral da União pode descontinuar ou modificar o FalaCOP30 a qualquer momento, garantindo a comunicação prévia aos usuários pelos canais oficiais.

2.10. Contato
Para dúvidas, sugestões ou solicitações relacionadas à Política de Privacidade do FalaCOP30, entre em contato com a Ouvidoria da Controladoria-Geral da União, por meio da Plataforma Fala.BR: [https://falabr.cgu.gov.br](https://falabr.cgu.gov.br).`,
    en: `  The FalaCOP30 Channel was created to collect suggestions, compliments, reports, complaints, or requests related to COP30 that are sent to the Brazilian government, always respecting your voice and honoring the commitment to transparency and integrity.

The response time for submissions registered in this form is 30 days, which may be extended once for the same period.

Before starting the form, please check whether there is already an appropriate channel for your demand at [https://cop30.br/pt-br/servicos-da-cop30/fale-conosco](https://cop30.br/pt-br/servicos-da-cop30/fale-conosco). Using the channels listed on that page can lead to faster solutions for specific cases, such as labor complaints or issues with lodging and transportation services.

The submissions made through this form will be handled on the Fala.BR Platform, the integrated channel that routes submissions to Brazilian public agencies and entities.

**1. Terms of Use**
1.1. Acceptance of the Terms
By using FalaCOP30, you agree to the terms and conditions presented here. Access to the service requires full acceptance of these terms, and users are responsible for using it ethically and in line with its institutional purpose.

1.2. Purpose and Functionality of the Service
FalaCOP30 is designed to submit suggestions, compliments, reports, complaints, or requests related to COP30 to the Brazilian government. The channel formally records submissions on the Fala.BR Platform. FalaCOP30 does not replace human assistance; it is a complementary resource that facilitates contact with Brazilian government services.

1.3. Service Limitations
Although FalaCOP30 was built to deliver intelligent and up-to-date assistance, the Office of the Comptroller General of Brazil (CGU) cannot guarantee that all information will always be complete, precise, or error-free, especially when regulations or services change. Because FalaCOP30 records demands on the Fala.BR Platform, the CGU recommends that Brazilian citizens use the platform directly at [https://falabr.cgu.gov.br](https://falabr.cgu.gov.br).

1.4. Service Availability and Stability
FalaCOP30 is subject to external factors such as:
- Availability of servers and technological infrastructure;
- System updates and improvements;
- Scheduled maintenance or unexpected technical instability.
The CGU is not responsible for temporary service outages but will adopt corrective measures whenever necessary.

1.5. System and Content Changes
The CGU reserves the right to modify, suspend, or discontinue any FalaCOP30 functionality at any time without prior notice. These changes may include adjustments to the content provided by the channel and enhancements to user interactions.

1.6. Privacy and Security
Use of FalaCOP30 is subject to its Privacy Policy, ensuring that user data is protected and processed in accordance with the Brazilian General Data Protection Law (LGPD – Law No. 13,709/2018). FalaCOP30 does not request or store sensitive information such as banking data, passwords, or data protected by legal privilege.

1.7. Service Termination or Access Restriction
The CGU may suspend or terminate FalaCOP30 at any time, especially in cases of:
- Detection of misuse or fraud attempts;
- Updates that render the service obsolete or incompatible with new institutional guidelines;
- Technical or operational reasons that require service interruption.

1.8. User Responsibilities
By using FalaCOP30, the user agrees to:
- Refrain from misusing the service, including sending abusive or offensive messages or attempting to manipulate the system;
- Provide accurate information during the interaction, ensuring that questions or requests are legitimate and aligned with Brazilian government services.
The CGU is not responsible for misinterpretations of information supplied by FalaCOP30 or for any misunderstanding of automated responses.

1.9. Contact and Support
For questions, suggestions, or more information about FalaCOP30, submit a request through Fala.BR: [https://falabr.cgu.gov.br](https://falabr.cgu.gov.br).

**2. Privacy Policy**
2.1. Introduction
This Privacy Policy explains how we collect, use, and safeguard user information when interacting with FalaCOP30. The channel records, through the Fala.BR Platform, submissions such as suggestions, compliments, reports, complaints, or requests related to COP30.

2.2. Data Collection
When interacting with FalaCOP30, the following information may be collected:
- Data provided by the user, such as name, email, country/nationality, and the messages sent during the conversation.
FalaCOP30 does not request or store sensitive information such as banking data, passwords, or data protected by legal privilege.

2.3. Use of Information
Collected data is used to:
- Provide support and information to users of Brazilian public services;
- Improve user experience by analyzing usage patterns and optimizing interactions with the channel;
- Fulfill legal and regulatory obligations, when applicable;
- Prevent fraud and ensure secure virtual assistance.
Interactions with FalaCOP30 may be analyzed in aggregate and anonymized form for statistical purposes and continuous service improvement.

2.4. Information Sharing
The CGU does not share personal information with third parties except in the following situations:
- To comply with legal or regulatory obligations applicable to Public Ombuds Offices and the CGU;
- When there is a lawful request from competent authorities, in accordance with current legislation;
- When the user expressly requests or authorizes the sharing of their data.

2.5. Information Security
The CGU adopts technical and organizational measures to protect collected information against unauthorized access, loss, alteration, or improper destruction, including:
- Encryption of data in transit and secure storage;
- Access controls and interaction monitoring;
- Privacy and security policies aligned with the LGPD (Law No. 13,709/2018).

2.6. Data Retention and Deletion
Interactions with FalaCOP30 will be stored for the time necessary to:
- Improve the service and analyze assistance records;
- Meet legal or regulatory obligations;
- Comply with audits and inspections, when applicable.
After that period, data will be anonymized or deleted in accordance with LGPD guidelines.

2.7. Privacy Policy Changes
This Privacy Policy may be updated at any time to reflect changes to FalaCOP30 services or applicable legislation. Users will be notified of relevant updates through the official COP30 website.

2.8. User Rights
In accordance with the LGPD (Law No. 13,709/2018), users have the right to:
- Access their personal data stored by FalaCOP30;
- Correct inaccurate or incomplete information;
- Request anonymization, blocking, or deletion of data that is no longer necessary for the stated purpose;
- Obtain information about data sharing;
- Withdraw consent for data processing, when applicable.
To exercise your rights, contact the CGU Ombuds Office via the Fala.BR Platform: [https://falabr.cgu.gov.br](https://falabr.cgu.gov.br).

2.9. Service Termination
The CGU may discontinue or modify FalaCOP30 at any time, ensuring that users are notified in advance through official channels.

2.10. Contact
For questions, suggestions, or requests related to the FalaCOP30 Privacy Policy, contact the CGU Ombuds Office via the Fala.BR Platform: [https://falabr.cgu.gov.br](https://falabr.cgu.gov.br).`,
    es: `  El Canal FalaCOP30 fue concebido para recibir sugerencias, elogios, denuncias, quejas o solicitudes relacionadas con la COP30 dirigidas al gobierno brasileño, siempre respetando su voz y el compromiso con la transparencia y la integridad.

El plazo para atender las manifestaciones registradas en este formulario es de 30 días, prorrogable por igual período.

Antes de comenzar el formulario, le recomendamos verificar si ya existe un canal adecuado para su demanda en [https://cop30.br/pt-br/servicos-da-cop30/fale-conosco](https://cop30.br/pt-br/servicos-da-cop30/fale-conosco). El uso correcto de los canales indicados en esa página puede ofrecer soluciones más rápidas para casos específicos, como denuncias laborales o problemas con servicios de hospedaje y transporte.

Las manifestaciones registradas en este formulario serán tratadas en la Plataforma Fala.BR, un canal integrado para remitir manifestaciones a órganos y entidades del poder público brasileño.

**1. Términos de Uso**
1.1. Aceptación de los Términos
Al utilizar FalaCOP30, usted acepta los términos y condiciones aquí establecidos. El acceso al servicio está condicionado a la aceptación integral de estos términos, siendo responsabilidad del usuario emplearlo de manera ética y conforme a su finalidad institucional.

1.2. Finalidad y Funcionalidad del Servicio
FalaCOP30 está diseñado para enviar sugerencias, elogios, denuncias, quejas o solicitudes relacionadas con la COP30 al gobierno brasileño. El canal registra formalmente las manifestaciones recibidas en la Plataforma Fala.BR. FalaCOP30 no reemplaza la atención humana; es un recurso complementario que facilita el contacto con los servicios del gobierno brasileño.

1.3. Limitaciones del Servicio
Aun cuando FalaCOP30 fue desarrollado para ofrecer un servicio inteligente y actualizado, la Contraloría General de la Unión (CGU) no garantiza que toda la información proporcionada esté siempre completa, precisa o libre de errores, especialmente ante cambios normativos o actualizaciones de los servicios. Como FalaCOP30 registra las demandas en la Plataforma Fala.BR, la CGU orienta a los ciudadanos brasileños a utilizar directamente la plataforma en [https://falabr.cgu.gov.br](https://falabr.cgu.gov.br).

1.4. Disponibilidad y Estabilidad del Servicio
El funcionamiento de FalaCOP30 está sujeto a factores externos, tales como:
- Disponibilidad de servidores e infraestructura tecnológica;
- Actualizaciones y mejoras del sistema;
- Mantenimiento programado o inestabilidad técnica eventual.
La CGU no se responsabiliza por indisponibilidades temporales del servicio, pero se compromete a adoptar medidas correctivas siempre que sea necesario.

1.5. Cambios en el Sistema y en el Contenido
La CGU se reserva el derecho de modificar, suspender o descontinuar funcionalidades de FalaCOP30 en cualquier momento, sin necesidad de aviso previo. Estos cambios pueden incluir ajustes en los contenidos disponibles y mejoras en la interacción con el público.

1.6. Privacidad y Seguridad
El uso de FalaCOP30 está sujeto a la Política de Privacidad, garantizando que los datos de los usuarios se protejan y traten conforme a la Ley General de Protección de Datos (LGPD - Ley nº 13.709/2018). FalaCOP30 no solicita ni almacena información sensible como datos bancarios, contraseñas o datos protegidos por sigilo legal.

1.7. Cierre o Restricción de Acceso
La CGU podrá suspender o finalizar el servicio de FalaCOP30 en cualquier momento, especialmente en casos de:
- Identificación de uso indebido o intentos de fraude;
- Actualizaciones que vuelvan obsoleto el servicio o lo hagan incompatible con nuevas directrices institucionales;
- Razones técnicas u operativas que requieran la interrupción del servicio.

1.8. Responsabilidades del Usuario
Al utilizar FalaCOP30, el usuario se compromete a:
- No hacer un uso indebido del servicio, como el envío de mensajes abusivos u ofensivos o intentos de manipulación del sistema;
- Ser responsable por la información proporcionada durante la interacción, asegurando que sus dudas o solicitudes sean legítimas y coherentes con los servicios del gobierno brasileño.
La CGU no se responsabiliza por interpretaciones equivocadas de la información suministrada por FalaCOP30 ni por fallos en la comprensión de las respuestas automatizadas.

1.9. Contacto y Soporte
Para dudas, sugerencias o más información sobre FalaCOP30, comuníquese a través de Fala.BR: [https://falabr.cgu.gov.br](https://falabr.cgu.gov.br).

**2. Política de Privacidad**
2.1. Introducción
Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos la información de los usuarios al interactuar con FalaCOP30. El canal registra formalmente, por medio de la Plataforma Fala.BR, manifestaciones como sugerencias, elogios, denuncias, quejas o solicitudes relacionadas con la COP30.

2.2. Recolección de Información
Al interactuar con FalaCOP30, se pueden recopilar los siguientes datos:
- Información proporcionada por el usuario, como nombre, correo electrónico, país/nacionalidad y mensajes enviados durante la conversación.
FalaCOP30 no solicita ni almacena información sensible como datos bancarios, contraseñas o datos protegidos por sigilo legal.

2.3. Uso de la Información
Los datos recopilados se utilizan para:
- Brindar soporte e información a los usuarios de los servicios públicos del gobierno brasileño;
- Mejorar la experiencia del usuario, analizando patrones de uso y optimizando las interacciones con el canal;
- Cumplir obligaciones legales y regulatorias, cuando corresponda;
- Prevenir fraudes y garantizar seguridad en la atención virtual.
Las interacciones con FalaCOP30 pueden analizarse de forma agregada y anónima con fines estadísticos y de mejora continua de los servicios.

2.4. Compartición de Información
La CGU no comparte información personal con terceros, salvo en los siguientes casos:
- Para cumplir obligaciones legales o regulatorias aplicables a las Defensorías Públicas y a la CGU;
- Cuando exista una solicitud legal de autoridades competentes, conforme a la legislación vigente;
- En situaciones específicas en las que el usuario solicite o autorice expresamente el compartir de sus datos.

2.5. Seguridad de la Información
La CGU adopta medidas técnicas y organizacionales para proteger la información recolectada contra accesos no autorizados, pérdida, alteración o destrucción indebida, incluyendo:
- Cifrado de datos en tránsito y almacenamiento seguro;
- Controles de acceso y monitoreo de interacciones;
- Políticas de privacidad y seguridad alineadas con la LGPD (Ley nº 13.709/2018).

2.6. Retención y Eliminación de Datos
Las interacciones con FalaCOP30 se almacenarán durante el tiempo necesario para:
- Mejorar el servicio y analizar los atendimientos;
- Cumplir obligaciones legales o regulatorias;
- Atender auditorías y fiscalizaciones, cuando corresponda.
Después de ese período, los datos se anonimizarán o eliminarán según las directrices de la LGPD.

2.7. Cambios en la Política de Privacidad
Esta Política de Privacidad puede actualizarse en cualquier momento para reflejar cambios en los servicios de FalaCOP30 o en la legislación vigente. Los usuarios serán notificados sobre modificaciones relevantes a través del sitio oficial de la COP30.

2.8. Derechos del Usuario
De conformidad con la LGPD (Ley nº 13.709/2018), los usuarios tienen derecho a:
- Acceder a sus datos personales almacenados por FalaCOP30;
- Corregir información incorrecta o incompleta;
- Solicitar la anonimización, bloqueo o eliminación de datos cuando ya no sean necesarios para la finalidad informada;
- Obtener información sobre el intercambio de datos;
- Revocar el consentimiento para el tratamiento de datos, cuando corresponda.
Para ejercer sus derechos, comuníquese con la Defensoría de la CGU a través de la Plataforma Fala.BR: [https://falabr.cgu.gov.br](https://falabr.cgu.gov.br).

2.9. Cierre del Servicio
La CGU puede descontinuar o modificar FalaCOP30 en cualquier momento, garantizando la comunicación previa a los usuarios por los canales oficiales.

2.10. Contacto
Para dudas, sugerencias o solicitudes relacionadas con la Política de Privacidad de FalaCOP30, comuníquese con la Defensoría de la CGU a través de la Plataforma Fala.BR: [https://falabr.cgu.gov.br](https://falabr.cgu.gov.br).`,
  },
  checkboxLabel: {
    "pt-BR": "Li e aceito o Termo de Uso e a Política de Privacidade",
    en: "I have read and accept the Terms of Use and Privacy Policy",
    es: "He leído y acepto los Términos de Uso y la Política de Privacidad",
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
