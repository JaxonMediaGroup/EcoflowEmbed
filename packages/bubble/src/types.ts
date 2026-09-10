/**
 * Configuración del widget <ecoflow-chat>.
 * Los nombres canónicos son nuevos y planos; los data-attributes legacy
 * (themeChatWindow*, lottie*, themeButton*) se mapean en config/attrs.ts,
 * de modo que un sitio existente funciona sin cambiar nada.
 */
export interface EcoflowChatConfig {
    // ---- Conexión ----
    /** ID del chatflow en el servidor ECOflow */
    chatflowId: string
    /** URL base del servidor (p.ej. https://ecoflow.koppi.mx) */
    apiHost: string

    // ---- Botón ----
    /** Tipo de botón lanzador */
    buttonType: 'lottie' | 'image' | 'icon' | 'text'
    /** Lado del viewport donde vive el botón (y hacia dónde se ancla la ventana) */
    buttonSide: 'left' | 'right'
    /** Distancia desde el borde inferior (CSS length) */
    buttonBottom: string
    /** Distancia desde el borde del lado elegido (CSS length) */
    buttonOffsetX: string
    buttonWidth: string
    buttonHeight: string
    /** Fondo del botón cuando es icon/text (lottie e image lo ignoran) */
    buttonBackgroundColor: string
    buttonZIndex: string
    /** Texto/emoji para buttonType 'text' */
    buttonText: string
    /** URL de imagen para buttonType 'image' */
    buttonImageSrc: string
    /** Título accesible del botón */
    buttonAriaLabel: string

    // ---- Lottie (compat: lottieAnimationPath, lottieButton*) ----
    /** URL del JSON de animación. Si hay valor, buttonType por defecto es 'lottie' */
    lottieAnimationPath: string
    lottieLoop: boolean
    lottieAutoplay: boolean

    // ---- Tooltip ----
    tooltipEnabled: boolean
    tooltipText: string
    tooltipBackgroundColor: string
    tooltipTextColor: string
    tooltipFontSize: string
    tooltipPadding: string
    tooltipBorderRadius: string
    /** Separación entre tooltip y botón en px */
    tooltipPositionOffset: number

    // ---- Ventana de chat ----
    windowTitle: string
    windowWelcomeMessage: string
    windowWidth: number
    windowHeight: number
    windowErrorMessage: string
    /** Mostrar actividad intermedia del agente (tools) como mensajes de estado */
    windowShowAgentMessages: boolean
    windowBackgroundColor: string
    windowFontSize: number
    windowFontFamily: string
    /** Color del header; por defecto hereda buttonBackgroundColor */
    windowHeaderBackgroundColor: string
    windowZIndex: string

    // ---- Mensajes del bot ----
    botMessageBackgroundColor: string
    botMessageTextColor: string
    botMessageShowAvatar: boolean
    botMessageAvatarSrc: string

    // ---- Mensajes del usuario ----
    userMessageBackgroundColor: string
    userMessageTextColor: string
    userMessageShowAvatar: boolean
    userMessageAvatarSrc: string

    // ---- Input ----
    textInputPlaceholder: string
    textInputBackgroundColor: string
    textInputTextColor: string
    textInputSendButtonColor: string
    textInputMaxChars: number
    textInputAutoFocus: boolean

    // ---- Footer ----
    footerText: string
    footerCompany: string
    footerCompanyLink: string
    footerTextColor: string

    // ---- Capacidades del agente (voz / imagen) ----
    /**
     * Micrófono (STT): 'auto' consulta /chatflows-uploads/{id} y se activa solo
     * si el agente lo tiene configurado (p.ej. NIZUC sí, Terralago no).
     * true/false fuerza el comportamiento manualmente.
     */
    voiceInput: boolean | 'auto'
    /** Voz de salida (TTS): 'auto' detecta desde la config del chatflow */
    voiceOutput: boolean | 'auto'
    /** Adjuntar imágenes: 'auto' detecta desde la config del chatflow */
    imageUploads: boolean | 'auto'

    // ---- Conversación ----
    /** Botón de reinicio de conversación en el header */
    showResetButton: boolean
    /** Conservar mensajes y chatId entre recargas de la página (localStorage) */
    persistConversation: boolean

    // ---- Estilo ----
    /** Tema liquid glass: ventana translúcida con blur (como el bundle liquidglass) */
    glass: boolean
    /** Color base del liquid glass; vacío = hereda buttonBackgroundColor */
    glassTintColor: string
}

export interface FileUpload {
    name: string
    mime: string
    /** Data URI base64; ausente en mensajes restaurados sin imagen */
    data?: string
    /** image: se envía al modelo multimodal; audio: el server lo transcribe (STT) */
    type?: 'image' | 'audio' | 'file'
}

export const DEFAULT_CONFIG: EcoflowChatConfig = {
    chatflowId: '',
    apiHost: '',

    buttonType: 'icon',
    buttonSide: 'right',
    buttonBottom: '20px',
    buttonOffsetX: '20px',
    buttonWidth: '60px',
    buttonHeight: '60px',
    buttonBackgroundColor: '#1b2f55',
    buttonZIndex: '10001',
    buttonText: '💬',
    buttonImageSrc: '',
    buttonAriaLabel: 'Abrir chat',

    lottieAnimationPath: '',
    lottieLoop: true,
    lottieAutoplay: true,

    tooltipEnabled: false,
    tooltipText: '¡Haz clic para chatear!',
    tooltipBackgroundColor: '#333333',
    tooltipTextColor: '#ffffff',
    tooltipFontSize: '13px',
    tooltipPadding: '5px 10px',
    tooltipBorderRadius: '8px',
    tooltipPositionOffset: 8,

    windowTitle: 'Asistente Virtual',
    windowWelcomeMessage: '',
    windowWidth: 400,
    windowHeight: 500,
    windowErrorMessage: 'Lo siento, ocurrió un error de conexión. ¿Podrías intentarlo de nuevo?',
    windowShowAgentMessages: false,
    windowBackgroundColor: '#ffffff',
    windowFontSize: 15,
    windowFontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    windowHeaderBackgroundColor: '',
    windowZIndex: '10000',

    botMessageBackgroundColor: '#f0f2f7',
    botMessageTextColor: '#303235',
    botMessageShowAvatar: true,
    botMessageAvatarSrc: '',

    userMessageBackgroundColor: '#1b2f55',
    userMessageTextColor: '#ffffff',
    userMessageShowAvatar: false,
    userMessageAvatarSrc: '',

    textInputPlaceholder: 'Escribe tu pregunta aquí...',
    textInputBackgroundColor: '#ffffff',
    textInputTextColor: '#303235',
    textInputSendButtonColor: '#1b2f55',
    textInputMaxChars: 1000,
    textInputAutoFocus: true,

    footerText: 'Powered by',
    footerCompany: '',
    footerCompanyLink: '',
    footerTextColor: '#9aa0a6',

    voiceInput: 'auto',
    voiceOutput: 'auto',
    imageUploads: 'auto',

    showResetButton: true,
    persistConversation: true,

    glass: false,
    glassTintColor: ''
}

/** Eventos SSE que emite el servidor del fork (utils/SSEStreamer.ts) */
export type SseEventName =
    | 'start'
    | 'token'
    | 'thinking'
    | 'metadata'
    | 'tool'
    | 'usedTools'
    | 'calledTools'
    | 'agentReasoning'
    | 'nextAgent'
    | 'sourceDocuments'
    | 'artifacts'
    | 'fileAnnotations'
    | 'action'
    | 'abort'
    | 'usageMetadata'
    | 'error'
    | 'end'

export interface SseEvent {
    event: SseEventName | string
    data: unknown
}

export interface Message {
    id: string
    role: 'bot' | 'user' | 'agent' | 'error'
    text: string
    followUps?: string[]
    /** Imágenes adjuntas del mensaje del usuario */
    fileUploads?: FileUpload[]
}
