/**
 * Configuración del widget <ecoflow-chat>.
 * Los nombres canónicos son nuevos y planos; los data-attributes legacy
 * (themeChatWindow*, lottie*, themeButton*) se mapean en config/attrs.ts,
 * de modo que un sitio existente funciona sin cambiar nada.
 */
export interface EcoflowChatConfig {
    /** ID del chatflow en el servidor ECOflow */
    chatflowId: string;
    /** URL base del servidor (p.ej. https://ecoflow.koppi.mx) */
    apiHost: string;
    /** Tipo de botón lanzador */
    buttonType: 'lottie' | 'image' | 'icon' | 'text';
    /** Lado del viewport donde vive el botón (y hacia dónde se ancla la ventana) */
    buttonSide: 'left' | 'right';
    /** Distancia desde el borde inferior (CSS length) */
    buttonBottom: string;
    /** Distancia desde el borde del lado elegido (CSS length) */
    buttonOffsetX: string;
    buttonWidth: string;
    buttonHeight: string;
    /** Fondo del botón cuando es icon/text (lottie e image lo ignoran) */
    buttonBackgroundColor: string;
    buttonZIndex: string;
    /** Texto/emoji para buttonType 'text' */
    buttonText: string;
    /** URL de imagen para buttonType 'image' */
    buttonImageSrc: string;
    /** Título accesible del botón */
    buttonAriaLabel: string;
    /** URL del JSON de animación. Si hay valor, buttonType por defecto es 'lottie' */
    lottieAnimationPath: string;
    lottieLoop: boolean;
    lottieAutoplay: boolean;
    tooltipEnabled: boolean;
    tooltipText: string;
    tooltipBackgroundColor: string;
    tooltipTextColor: string;
    tooltipFontSize: string;
    tooltipPadding: string;
    tooltipBorderRadius: string;
    /** Separación entre tooltip y botón en px */
    tooltipPositionOffset: number;
    windowTitle: string;
    windowWelcomeMessage: string;
    windowWidth: number;
    windowHeight: number;
    windowErrorMessage: string;
    /** Mostrar actividad intermedia del agente (tools) como mensajes de estado */
    windowShowAgentMessages: boolean;
    windowBackgroundColor: string;
    windowFontSize: number;
    windowFontFamily: string;
    /** Color del header; por defecto hereda buttonBackgroundColor */
    windowHeaderBackgroundColor: string;
    windowZIndex: string;
    botMessageBackgroundColor: string;
    botMessageTextColor: string;
    botMessageShowAvatar: boolean;
    botMessageAvatarSrc: string;
    userMessageBackgroundColor: string;
    userMessageTextColor: string;
    userMessageShowAvatar: boolean;
    userMessageAvatarSrc: string;
    textInputPlaceholder: string;
    textInputBackgroundColor: string;
    textInputTextColor: string;
    textInputSendButtonColor: string;
    textInputMaxChars: number;
    textInputAutoFocus: boolean;
    footerText: string;
    footerCompany: string;
    footerCompanyLink: string;
    footerTextColor: string;
}
export declare const DEFAULT_CONFIG: EcoflowChatConfig;
/** Eventos SSE que emite el servidor del fork (utils/SSEStreamer.ts) */
export type SseEventName = 'start' | 'token' | 'thinking' | 'metadata' | 'tool' | 'usedTools' | 'calledTools' | 'agentReasoning' | 'nextAgent' | 'sourceDocuments' | 'artifacts' | 'fileAnnotations' | 'action' | 'abort' | 'usageMetadata' | 'error' | 'end';
export interface SseEvent {
    event: SseEventName | string;
    data: unknown;
}
export interface Message {
    id: string;
    role: 'bot' | 'user' | 'agent' | 'error';
    text: string;
    followUps?: string[];
}
