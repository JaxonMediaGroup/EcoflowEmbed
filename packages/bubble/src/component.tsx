import type { CSSProperties } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import { generateChatId, sendPrediction } from './api/client'
import { mountLottie } from './lottie'
import { renderMarkdown } from './markdown'
import { computeWindowPlacement, type WindowPlacement } from './position'
import type { EcoflowChatConfig, Message } from './types'

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

function Icon({ name }: { name: 'chat' | 'close' | 'send' }) {
    if (name === 'chat') {
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        )
    }
    if (name === 'close') {
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
            </svg>
        )
    }
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3.4 20.4 21 12 3.4 3.6l-.01 6.53L15 12 3.39 13.87z" />
        </svg>
    )
}

function themeVars(config: EcoflowChatConfig): CSSProperties {
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
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [streaming, setStreaming] = useState(false)
    const [thinking, setThinking] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [placement, setPlacement] = useState<WindowPlacement | null>(null)

    const chatIdRef = useRef<string>('')
    const welcomedRef = useRef(false)
    const buttonRef = useRef<HTMLDivElement>(null)
    const messagesRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const abortRef = useRef<AbortController | null>(null)
    // latest send() accesible desde el host sin re-registrar el API bridge
    const sendRef = useRef<(text: string) => void>(() => {})

    if (!chatIdRef.current) chatIdRef.current = generateChatId()

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

    const closeChat = () => {
        setOpen(false)
        // corta el stream pendiente; el mensaje parcial se conserva
        abortRef.current?.abort()
    }

    const toggleChat = () => (open ? closeChat() : openChat())

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
        if (open && config.textInputAutoFocus) {
            // rAF: esperar a que la ventana termine de montarse
            requestAnimationFrame(() => inputRef.current?.focus())
        }
    }, [open, config.textInputAutoFocus])

    // Escape cierra la ventana
    useEffect(() => {
        if (!open) return
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') closeChat()
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [open])

    const appendToMessage = (id: string, token: string) => {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text: m.text + token } : m)))
    }
    const setMessageFollowUps = (id: string, followUps: string[]) => {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, followUps } : m)))
    }

    const send = (rawText: string) => {
        const text = rawText.trim()
        if (!text || streaming) return
        if (!config.chatflowId || !config.apiHost) return

        setInputValue('')
        setMessages((prev) => [...prev, { id: nextMessageId(), role: 'user', text }])
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
                streaming: true
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
                },
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

    return (
        <div class="ecoflow-root" style={themeVars(config)}>
            {open && placement && (
                <section
                    class="ecoflow-window"
                    part="window"
                    role="dialog"
                    aria-label={config.windowTitle}
                    style={windowStyle}
                >
                    <header class="ecoflow-header" part="header">
                        <div class="ecoflow-header-title">{config.windowTitle}</div>
                        <button class="ecoflow-close" onClick={closeChat} aria-label="Cerrar chat" type="button">
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
                        <input
                            ref={inputRef}
                            class="ecoflow-input"
                            type="text"
                            placeholder={config.textInputPlaceholder}
                            maxLength={config.textInputMaxChars}
                            value={inputValue}
                            disabled={streaming}
                            aria-label={config.textInputPlaceholder}
                            onInput={(event) => setInputValue((event.target as HTMLInputElement).value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') send(inputValue)
                            }}
                        />
                        <button
                            class="ecoflow-send"
                            type="button"
                            onClick={() => send(inputValue)}
                            disabled={streaming || inputValue.trim() === ''}
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
