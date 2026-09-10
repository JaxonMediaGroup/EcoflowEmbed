import type { CSSProperties } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import { generateChatId, sendPrediction } from './api/client'
import {
    audioBlobToUpload,
    fetchCapabilities,
    fileToDataUri,
    isTtsPlaybackEnabled,
    type AgentCapabilities
} from './api/capabilities'
import { mountLottie } from './lottie'
import { renderMarkdown } from './markdown'
import { computeWindowPlacement, type WindowPlacement } from './position'
import { clearConversation, conversationKey, loadConversation, saveConversation } from './storage'
import type { EcoflowChatConfig, FileUpload, Message } from './types'

let messageSeq = 0
function nextMessageId(): string {
    messageSeq += 1
    return 'msg-' + messageSeq
}

const AGENT_ACTIVITY_LABEL: Record<string, string> = {
    thinking: 'Pensando…',
    tool: 'Usando herramientas…',
    usedTools: 'Usando herramientas…',
    calledTools: 'Ejecutando acciones…',
    agentReasoning: 'Razonando…',
    nextAgent: 'Consultando al agente…'
}

/** Grabación de voz: webm en Chrome/Edge/Firefox, mp4 en Safari */
function pickRecordingMimeType(): string {
    if (typeof MediaRecorder === 'undefined') return ''
    for (const candidate of ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4']) {
        if (MediaRecorder.isTypeSupported(candidate)) return candidate
    }
    return ''
}

function decodeBase64Chunks(chunks: string[]): Uint8Array<ArrayBuffer> {
    const total = chunks.reduce((sum, chunk) => sum + Math.ceil((chunk.length * 3) / 4), 0)
    const bytes = new Uint8Array(total)
    let offset = 0
    for (const chunk of chunks) {
        const part = Uint8Array.from(atob(chunk), (c) => c.charCodeAt(0))
        bytes.set(part, offset)
        offset += part.length
    }
    return bytes.subarray(0, offset)
}

function Icon({ name }: { name: 'chat' | 'close' | 'send' | 'mic' | 'stop' | 'image' | 'reset' }) {
    switch (name) {
        case 'chat':
            return (
                <svg viewBox="0 0 24 24" {...{ fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': true }}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            )
        case 'close':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">
                    <path d="M18 6 6 18M6 6l12 12" />
                </svg>
            )
        case 'mic':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                    <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4" />
                </svg>
            )
        case 'stop':
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
            )
        case 'image':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-4.6-4.6a2 2 0 0 0-2.8 0L5 20" />
                </svg>
            )
        case 'reset':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                    <path d="M3 3v5h5" />
                </svg>
            )
        default:
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M3.4 20.4 21 12 3.4 3.6l-.01 6.53L15 12 3.39 13.87z" />
                </svg>
            )
    }
}

export function themeVars(config: EcoflowChatConfig): CSSProperties {
    return {
        '--ec-font': config.windowFontFamily,
        '--ec-fs': config.windowFontSize + 'px',
        '--ec-bg-window': config.windowBackgroundColor,
        '--ec-bg-header': config.windowHeaderBackgroundColor,
        '--ec-bg-bot': config.botMessageBackgroundColor,
        '--ec-c-bot': config.botMessageTextColor,
        '--ec-bg-user': config.userMessageBackgroundColor,
        '--ec-c-user': config.userMessageTextColor,
        '--ec-bg-input': config.textInputBackgroundColor,
        '--ec-c-input': config.textInputTextColor,
        '--ec-c-send': config.textInputSendButtonColor,
        '--ec-c-footer': config.footerTextColor,
        '--ec-button-w': config.buttonWidth,
        '--ec-button-h': config.buttonHeight,
        '--ec-z-button': config.buttonZIndex,
        '--ec-z-window': config.windowZIndex,
        '--ec-tooltip-bg': config.tooltipBackgroundColor,
        '--ec-tooltip-c': config.tooltipTextColor,
        '--ec-glass-tint': config.glassTintColor || config.buttonBackgroundColor,
        '--ec-tooltip-fs': config.tooltipFontSize,
        '--ec-tooltip-pad': config.tooltipPadding,
        '--ec-tooltip-radius': config.tooltipBorderRadius,
        '--ec-tooltip-offset': config.tooltipPositionOffset + 'px'
    } as CSSProperties
}

function ButtonContent({ config }: { config: EcoflowChatConfig }) {
    const lottieHost = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (config.buttonType !== 'lottie' || !lottieHost.current || !config.lottieAnimationPath) return
        const animation = mountLottie(lottieHost.current, config.lottieAnimationPath, {
            loop: config.lottieLoop,
            autoplay: config.lottieAutoplay
        })
        return () => animation.destroy()
    }, [config.buttonType, config.lottieAnimationPath, config.lottieLoop, config.lottieAutoplay])

    if (config.buttonType === 'lottie') {
        return <div ref={lottieHost} class="ecoflow-button--media" />
    }
    if (config.buttonType === 'image') {
        return <img class="ecoflow-button--media" src={config.buttonImageSrc} alt={config.buttonAriaLabel} />
    }
    if (config.buttonType === 'text') {
        return <span>{config.buttonText}</span>
    }
    return <Icon name="chat" />
}

function Avatar({ src, alt }: { src: string; alt: string }) {
    if (!src) {
        return <div class="ecoflow-avatar" aria-hidden="true" />
    }
    return <img class="ecoflow-avatar" src={src} alt={alt} loading="lazy" />
}

function AttachedFiles({ uploads }: { uploads?: FileUpload[] }) {
    if (!uploads?.length) return null
    return (
        <div class="ecoflow-attachments">
            {uploads.map((file) =>
                file.mime.startsWith('image/') && file.data ? (
                    <img key={file.name} class="ecoflow-attachment-img" src={file.data} alt={file.name} />
                ) : (
                    <span key={file.name} class="ecoflow-attachment-audio">
                        <Icon name="mic" /> Audio
                    </span>
                )
            )}
        </div>
    )
}

function MessageBubble({ message, config }: { message: Message; config: EcoflowChatConfig }) {
    if (message.role === 'agent') {
        return (
            <div class="ecoflow-msg ecoflow-msg--agent">
                <span class="ecoflow-agent-pill">{message.text}</span>
            </div>
        )
    }

    const isUser = message.role === 'user'
    const isError = message.role === 'error'
    const showAvatar =
        !isUser && !isError
            ? config.botMessageShowAvatar
            : isUser
              ? config.userMessageShowAvatar
              : false
    const avatarSrc = isUser ? config.userMessageAvatarSrc : config.botMessageAvatarSrc

    return (
        <div class={`ecoflow-msg${isUser ? ' ecoflow-msg--user' : ''}`}>
            {showAvatar && <Avatar src={avatarSrc} alt={isUser ? 'Usuario' : 'Bot'} />}
            <div
                class={`ecoflow-bubble ecoflow-bubble--${
                    isError ? 'error' : isUser ? 'user' : 'bot'
                }`}
            >
                <AttachedFiles uploads={message.fileUploads} />
                {isUser ? (
                    message.text
                ) : (
                    <div
                        class="ecoflow-markdown"
                        // El HTML ya pasó por DOMPurify en renderMarkdown
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(message.text) }}
                    />
                )}
            </div>
        </div>
    )
}

export interface ChatAppProps {
    host: {
        open: () => void
        close: () => void
        toggle: () => void
        sendMessage: (text: string) => void
    }
    config: EcoflowChatConfig
}

export function ChatApp({ host, config }: ChatAppProps) {
    const storageKey = conversationKey(config.apiHost, config.chatflowId)

    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>(() => {
        if (!config.persistConversation || !config.chatflowId) return []
        return loadConversation(storageKey)?.messages ?? []
    })
    const [streaming, setStreaming] = useState(false)
    const [thinking, setThinking] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [placement, setPlacement] = useState<WindowPlacement | null>(null)
    const [capabilities, setCapabilities] = useState<AgentCapabilities | null>(null)
    const [recording, setRecording] = useState(false)
    const [pendingImage, setPendingImage] = useState<FileUpload | null>(null)
    const [micUnavailable, setMicUnavailable] = useState(false)

    const chatIdRef = useRef<string>('')
    const welcomedRef = useRef(false)
    const buttonRef = useRef<HTMLDivElement>(null)
    const messagesRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const abortRef = useRef<AbortController | null>(null)
    const sendRef = useRef<(text: string, uploads?: FileUpload[]) => void>(() => {})
    const recorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const recorderStreamRef = useRef<MediaStream | null>(null)
    const ttsChunksRef = useRef<string[]>([])
    const ttsFormatRef = useRef<string>('audio/mpeg')
    const ttsAudioRef = useRef<HTMLAudioElement | null>(null)
    const lastUserMessageIdRef = useRef<string>('')

    // Restaurar chatId persistido; sin persistencia o vacío, uno nuevo
    if (!chatIdRef.current) {
        chatIdRef.current =
            (config.persistConversation && loadConversation(storageKey)?.chatId) || generateChatId()
    }
    // Si hay mensajes restaurados, el welcome ya está en el historial
    if (messages.length > 0) welcomedRef.current = true

    // Resolución de capacidades: 'auto' pregunta al server, true/false es manual
    const voiceInputOn =
        config.voiceInput === 'auto' ? (capabilities?.stt ?? false) : config.voiceInput === true
    const imageUploadsOn =
        config.imageUploads === 'auto' ? (capabilities?.imageUploads ?? false) : config.imageUploads === true

    useEffect(() => {
        if (!config.apiHost || !config.chatflowId) return
        let cancelled = false
        fetchCapabilities(config.apiHost, config.chatflowId).then((caps) => {
            if (!cancelled) setCapabilities(caps)
        })
        return () => {
            cancelled = true
        }
    }, [config.apiHost, config.chatflowId])

    // Persistencia: guardar al terminar el streaming y al restaurar/limpiar,
    // nunca token a token (evita serializar en cada frame de streaming)
    useEffect(() => {
        if (!config.persistConversation || streaming || !config.chatflowId) return
        if (messages.length === 0) return
        saveConversation(storageKey, { chatId: chatIdRef.current, messages, savedAt: Date.now() })
    }, [messages, streaming, config.persistConversation, storageKey])

    const openChat = () => {
        setOpen(true)
        if (!welcomedRef.current && config.windowWelcomeMessage) {
            welcomedRef.current = true
            setMessages((prev) => [
                ...prev,
                { id: nextMessageId(), role: 'bot', text: config.windowWelcomeMessage }
            ])
        }
    }

    const stopTts = () => {
        if (ttsAudioRef.current) {
            ttsAudioRef.current.pause()
            if (ttsAudioRef.current.src.startsWith('blob:')) URL.revokeObjectURL(ttsAudioRef.current.src)
            ttsAudioRef.current = null
        }
    }

    const closeChat = () => {
        setOpen(false)
        // corta el stream pendiente; el mensaje parcial se conserva
        abortRef.current?.abort()
        stopTts()
        stopRecording(false)
    }

    const toggleChat = () => (open ? closeChat() : openChat())

    /** Reinicia la conversación: historial nuevo, chatId nuevo, storage limpio */
    const resetConversation = () => {
        abortRef.current?.abort()
        stopTts()
        setMessages([])
        chatIdRef.current = generateChatId()
        if (config.persistConversation) clearConversation(storageKey)
        welcomedRef.current = false
        if (config.windowWelcomeMessage) {
            welcomedRef.current = true
            setMessages([{ id: nextMessageId(), role: 'bot', text: config.windowWelcomeMessage }])
        }
    }

    // API imperativa sobre el elemento: element.open() / .close() / .toggle() / .sendMessage()
    useEffect(() => {
        host.open = openChat
        host.close = closeChat
        host.toggle = toggleChat
        host.sendMessage = (text: string) => {
            openChat()
            sendRef.current(text)
        }
    })

    // Posicionar la ventana anclada al botón al abrir y en cada resize/giro
    useEffect(() => {
        if (!open) return
        const place = () => {
            const button = buttonRef.current
            if (!button) return
            setPlacement(
                computeWindowPlacement(
                    button.getBoundingClientRect(),
                    { width: window.innerWidth, height: window.innerHeight },
                    config.buttonSide,
                    { width: config.windowWidth, height: config.windowHeight }
                )
            )
        }
        place()
        window.addEventListener('resize', place, { passive: true })
        return () => window.removeEventListener('resize', place)
    }, [open, config.buttonSide, config.windowWidth, config.windowHeight])

    // Auto-scroll al último mensaje y autofocus del input
    useEffect(() => {
        const list = messagesRef.current
        if (list) list.scrollTop = list.scrollHeight
    }, [messages, thinking])

    useEffect(() => {
        if (open && config.textInputAutoFocus && !recording) {
            // rAF: esperar a que la ventana termine de montarse
            requestAnimationFrame(() => inputRef.current?.focus())
        }
    }, [open, config.textInputAutoFocus, recording])

    // Escape cierra la ventana
    useEffect(() => {
        if (!open) return
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') closeChat()
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [open])

    // Limpieza al desmontar
    useEffect(
        () => () => {
            stopRecording(false)
            stopTts()
            recorderStreamRef.current?.getTracks().forEach((track) => track.stop())
        },
        []
    )

    const appendToMessage = (id: string, token: string) => {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text: m.text + token } : m)))
    }
    const setMessageFollowUps = (id: string, followUps: string[]) => {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, followUps } : m)))
    }
    const replaceMessageText = (id: string, text: string) => {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text } : m)))
    }

    // ---------- Voz: grabación con MediaRecorder ----------
    const startRecording = async () => {
        if (recording || streaming) return
        const mimeType = pickRecordingMimeType()
        if (!navigator.mediaDevices?.getUserMedia || (mimeType === '' && typeof MediaRecorder === 'undefined')) {
            setMicUnavailable(true)
            return
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            recorderStreamRef.current = stream
            const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
            audioChunksRef.current = []
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data)
            }
            recorder.onstop = () => finishRecording()
            recorderRef.current = recorder
            recorder.start()
            setRecording(true)
        } catch {
            // permiso denegado o sin micrófono: se oculta el control
            setMicUnavailable(true)
        }
    }

    /** Detiene la grabación; con send=true transcribe y envía el audio */
    const stopRecording = (send: boolean) => {
        const recorder = recorderRef.current
        if (!recorder || recorder.state === 'inactive') {
            setRecording(false)
            return
        }
        // onstop dispara finishRecording; el flag viaja en el recorder
        ;(recorder as MediaRecorder & { __send?: boolean }).__send = send
        recorder.stop()
    }

    const finishRecording = async () => {
        setRecording(false)
        recorderStreamRef.current?.getTracks().forEach((track) => track.stop())
        recorderStreamRef.current = null
        const recorder = recorderRef.current
        recorderRef.current = null
        const shouldSend = (recorder as (MediaRecorder & { __send?: boolean }) | null)?.__send !== false
        if (!shouldSend || audioChunksRef.current.length === 0) return

        const blob = new Blob(audioChunksRef.current, { type: audioChunksRef.current[0]?.type || 'audio/webm' })
        audioChunksRef.current = []
        try {
            const data = await fileToDataUri(new File([blob], 'audio', { type: blob.type }))
            sendRef.current('', [{ ...audioBlobToUpload(blob), data, type: 'audio' }])
        } catch {
            // lectura fallida: no hay nada que enviar
        }
    }

    // ---------- Imagen: selección con preview ----------
    const onImageSelected = async (event: Event) => {
        const input = event.target as HTMLInputElement
        const file = input.files?.[0]
        input.value = ''
        if (!file) return
        if (capabilities?.imageTypes.length && !capabilities.imageTypes.includes(file.type)) {
            return
        }
        if (capabilities && file.size > capabilities.imageMaxSizeMb * 1024 * 1024) {
            return
        }
        try {
            const data = await fileToDataUri(file)
            setPendingImage({ name: file.name, mime: file.type, data, type: 'image' })
        } catch {
            // archivo ilegible: se ignora
        }
    }

    // ---------- TTS: replay de los chunks que envía el servidor ----------
    const handleTtsStart = (format: string) => {
        stopTts()
        ttsChunksRef.current = []
        ttsFormatRef.current = format.includes('/') ? format : `audio/${format === 'mp3' ? 'mpeg' : format}`
    }
    const handleTtsChunk = (base64: string) => {
        ttsChunksRef.current.push(base64)
    }
    const handleTtsEnd = () => {
        // En modo auto, el propio evento tts_* es la fuente de verdad: el
        // endpoint de configuración puede no ser público aunque TTS funcione.
        if (!isTtsPlaybackEnabled(config.voiceOutput) || ttsChunksRef.current.length === 0) return
        const bytes = decodeBase64Chunks(ttsChunksRef.current)
        ttsChunksRef.current = []
        const audio = new Audio(URL.createObjectURL(new Blob([bytes], { type: ttsFormatRef.current })))
        ttsAudioRef.current = audio
        audio.onended = () => {
            if (audio.src.startsWith('blob:')) URL.revokeObjectURL(audio.src)
            if (ttsAudioRef.current === audio) ttsAudioRef.current = null
        }
        audio.play().catch(() => {
            // autoplay bloqueado por el navegador: el texto sigue visible
            stopTts()
        })
    }

    // ---------- Envío ----------
    const send = (rawText: string, uploads?: FileUpload[]) => {
        const text = rawText.trim()
        const hasUploads = (uploads?.length ?? 0) > 0
        if ((!text && !hasUploads) || streaming || recording) return
        if (!config.chatflowId || !config.apiHost) return

        setInputValue('')
        setPendingImage(null)
        const userMessage: Message = {
            id: nextMessageId(),
            role: 'user',
            text,
            ...(hasUploads ? { fileUploads: uploads } : {})
        }
        lastUserMessageIdRef.current = userMessage.id
        setMessages((prev) => [...prev, userMessage])
        const botMessageId = nextMessageId()
        setMessages((prev) => [...prev, { id: botMessageId, role: 'bot', text: '' }])
        setStreaming(true)
        setThinking(true)

        const controller = new AbortController()
        abortRef.current = controller

        sendPrediction(
            {
                apiHost: config.apiHost,
                chatflowId: config.chatflowId,
                question: text,
                chatId: chatIdRef.current,
                streaming: true,
                ...(hasUploads ? { uploads } : {})
            },
            {
                onToken: (token) => {
                    setThinking(false)
                    appendToMessage(botMessageId, token)
                },
                onActivity: (activity) => {
                    if (config.windowShowAgentMessages && AGENT_ACTIVITY_LABEL[activity]) {
                        setMessages((prev) => [
                            ...prev,
                            { id: nextMessageId(), role: 'agent', text: AGENT_ACTIVITY_LABEL[activity] }
                        ])
                    }
                },
                onMetadata: (metadata) => {
                    const followUps = metadata['followUpPrompts']
                    if (Array.isArray(followUps)) {
                        setMessageFollowUps(
                            botMessageId,
                            followUps.filter((f): f is string => typeof f === 'string')
                        )
                    }
                    const serverChatId = metadata['chatId']
                    if (typeof serverChatId === 'string' && serverChatId) chatIdRef.current = serverChatId
                    // Audio: el server devuelve la transcripción como question
                    const question = metadata['question']
                    if (typeof question === 'string' && question && !text && lastUserMessageIdRef.current) {
                        replaceMessageText(lastUserMessageIdRef.current, question)
                    }
                },
                onTtsStart: handleTtsStart,
                onTtsChunk: handleTtsChunk,
                onTtsEnd: handleTtsEnd,
                onError: (message) => {
                    setMessages((prev) =>
                        prev
                            .filter((m) => m.id !== botMessageId || m.text !== '')
                            .concat([{ id: nextMessageId(), role: 'error', text: config.windowErrorMessage || message }])
                    )
                },
                onDone: () => {
                    // stream vacío (sin tokens): evita dejar una burbuja en blanco
                    setMessages((prev) => prev.filter((m) => m.id !== botMessageId || m.text !== ''))
                }
            },
            controller.signal
        ).catch(() => {
            if (controller.signal.aborted) return
            setMessages((prev) =>
                prev
                    .filter((m) => m.id !== botMessageId || m.text !== '')
                    .concat([{ id: nextMessageId(), role: 'error', text: config.windowErrorMessage }])
            )
        }).finally(() => {
            setStreaming(false)
            setThinking(false)
            abortRef.current = null
        })
    }
    sendRef.current = send

    const lastFollowUps =
        messages.length > 0 && !streaming && messages[messages.length - 1].role === 'bot'
            ? messages[messages.length - 1].followUps
            : undefined

    const buttonStyle: CSSProperties = { bottom: config.buttonBottom }
    // Anclaje dinámico al lado elegido: left o right según buttonSide
    ;(buttonStyle as Record<string, string>)[config.buttonSide] = config.buttonOffsetX

    const tooltipStyle: CSSProperties = { position: 'absolute' }
    ;(tooltipStyle as Record<string, string>)[config.buttonSide] = '0'

    const windowStyle: CSSProperties | undefined = placement
        ? ({
              left: placement.left !== undefined ? placement.left + 'px' : undefined,
              right: placement.right !== undefined ? placement.right + 'px' : undefined,
              top: placement.top !== undefined ? placement.top + 'px' : undefined,
              bottom: placement.bottom !== undefined ? placement.bottom + 'px' : undefined,
              width: placement.width + 'px',
              height: placement.height + 'px',
              transformOrigin: placement.transformOrigin
          } as CSSProperties)
        : undefined

    const showMic = voiceInputOn && !micUnavailable
    const acceptTypes = capabilities?.imageTypes?.join(',') || 'image/*'

    return (
        <div class="ecoflow-root" style={themeVars(config)}>
            {open && placement && (
                <section
                    class={`ecoflow-window${config.glass ? ' ecoflow-window--glass' : ''}`}
                    part="window"
                    role="dialog"
                    aria-label={config.windowTitle}
                    style={windowStyle}
                >
                    <header class="ecoflow-header" part="header">
                        <div class="ecoflow-header-title">{config.windowTitle}</div>
                        {config.showResetButton && (
                            <button
                                class="ecoflow-header-btn"
                                onClick={resetConversation}
                                aria-label="Reiniciar conversación"
                                title="Reiniciar conversación"
                                type="button"
                            >
                                <Icon name="reset" />
                            </button>
                        )}
                        <button
                            class="ecoflow-header-btn ecoflow-close"
                            onClick={closeChat}
                            aria-label="Cerrar chat"
                            type="button"
                        >
                            <Icon name="close" />
                        </button>
                    </header>

                    <div class="ecoflow-messages" part="messages" ref={messagesRef} aria-live="polite">
                        {messages.map((message) => (
                            <MessageBubble key={message.id} message={message} config={config} />
                        ))}
                        {thinking && (
                            <div class="ecoflow-msg">
                                <div class="ecoflow-bubble ecoflow-bubble--bot ecoflow-typing">
                                    <span />
                                    <span />
                                    <span />
                                </div>
                            </div>
                        )}
                    </div>

                    {lastFollowUps && lastFollowUps.length > 0 && (
                        <div class="ecoflow-chips">
                            {lastFollowUps.map((chip) => (
                                <button key={chip} class="ecoflow-chip" type="button" onClick={() => send(chip)}>
                                    {chip}
                                </button>
                            ))}
                        </div>
                    )}

                    <div class="ecoflow-input-row" part="input">
                        {pendingImage && (
                            <div class="ecoflow-preview">
                                <img src={pendingImage.data} alt={pendingImage.name} />
                                <button
                                    class="ecoflow-preview-remove"
                                    onClick={() => setPendingImage(null)}
                                    aria-label="Quitar imagen"
                                    type="button"
                                >
                                    <Icon name="close" />
                                </button>
                            </div>
                        )}
                        {imageUploadsOn && !recording && (
                            <>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept={acceptTypes}
                                    style={{ display: 'none' }}
                                    onChange={onImageSelected}
                                    aria-hidden="true"
                                    tabIndex={-1}
                                />
                                <button
                                    class="ecoflow-icon-btn"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={streaming || !!pendingImage}
                                    aria-label="Adjuntar imagen"
                                    title="Adjuntar imagen"
                                    type="button"
                                >
                                    <Icon name="image" />
                                </button>
                            </>
                        )}
                        <input
                            ref={inputRef}
                            class="ecoflow-input"
                            type="text"
                            placeholder={config.textInputPlaceholder}
                            maxLength={config.textInputMaxChars}
                            value={inputValue}
                            disabled={streaming || recording}
                            aria-label={config.textInputPlaceholder}
                            onInput={(event) => setInputValue((event.target as HTMLInputElement).value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') send(inputValue, pendingImage ? [pendingImage] : undefined)
                            }}
                        />
                        {showMic && !recording && (
                            <button
                                class="ecoflow-icon-btn"
                                onClick={startRecording}
                                disabled={streaming}
                                aria-label="Hablar"
                                title="Hablar"
                                type="button"
                            >
                                <Icon name="mic" />
                            </button>
                        )}
                        {recording && (
                            <button
                                class="ecoflow-icon-btn ecoflow-icon-btn--recording"
                                onClick={() => stopRecording(true)}
                                aria-label="Detener y enviar"
                                title="Detener y enviar"
                                type="button"
                            >
                                <Icon name="stop" />
                            </button>
                        )}
                        <button
                            class="ecoflow-send"
                            type="button"
                            onClick={() => send(inputValue, pendingImage ? [pendingImage] : undefined)}
                            disabled={streaming || recording || (inputValue.trim() === '' && !pendingImage)}
                            aria-label="Enviar mensaje"
                        >
                            <Icon name="send" />
                        </button>
                    </div>

                    {config.footerCompany && (
                        <footer class="ecoflow-footer" part="footer">
                            {config.footerText}{' '}
                            <a href={config.footerCompanyLink || '#'} target="_blank" rel="noopener noreferrer">
                                {config.footerCompany}
                            </a>
                        </footer>
                    )}
                </section>
            )}

            <div
                ref={buttonRef}
                class={`ecoflow-button${config.buttonType === 'lottie' || config.buttonType === 'image' ? '' : ' ecoflow-button--shape'}`}
                part="button"
                role="button"
                tabIndex={0}
                aria-label={config.buttonAriaLabel}
                style={buttonStyle}
                onClick={toggleChat}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        toggleChat()
                    }
                }}
            >
                <ButtonContent config={config} />
                {config.tooltipEnabled && !open && (
                    <span class="ecoflow-tooltip" style={tooltipStyle}>
                        {config.tooltipText}
                    </span>
                )}
            </div>
        </div>
    )
}
