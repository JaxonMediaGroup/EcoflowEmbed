// Contenido para flowise-lottie3.2-embed.js
(function() {
    'use strict';

    function getConfig(scriptTag, dataKey, defaultValue, type = 'string') {
        const value = scriptTag.dataset[dataKey]; // dataKey es camelCase: ej. chatFlowId
        if (value === undefined || value === null || value === "") {
            return defaultValue;
        }
        if (type === 'boolean') {
            return value.toLowerCase() === 'true';
        }
        if (type === 'number') {
            const num = Number(value);
            return isNaN(num) ? defaultValue : num;
        }
        if (type === 'json') {
            try {
                return JSON.parse(value);
            } catch (e) {
                console.error(`Flowise Lottie Embed: Error al parsear JSON para ${dataKey}. Usando default. Valor recibido:`, value, e);
                return defaultValue;
            }
        }
        return value;
    }

    let currentScript = document.currentScript;
    if (!currentScript) {
        const scripts = document.getElementsByTagName('script');
        for (let i = scripts.length - 1; i >= 0; i--) {
            if (scripts[i].src && (scripts[i].src.includes('flowise-lottie') || scripts[i].id === 'flowise-lottie-embed-script')) { // Added ID check for robustness
                currentScript = scripts[i];
                break;
            }
        }
    }

    if (!currentScript) {
        console.error("Flowise Lottie Embed: No se pudo encontrar la etiqueta del script. Asegúrate de que tenga un ID 'flowise-lottie-embed-script' o que su 'src' incluya 'flowise-lottie'.");
        return;
    }

    const config = {
        // Core Flowise
        chatflowid: getConfig(currentScript, 'chatflowid', null),
        apiHost: getConfig(currentScript, 'apiHost', 'https://ecoflow.koppi.mx'),
        chatflowConfig: getConfig(currentScript, 'chatflowConfigJson', {}, 'json'), // data-chatflow-config-json
        observersConfig: getConfig(currentScript, 'observersConfigJson', {}, 'json'), // data-observers-config-json

        // Lottie
        lottieAnimationPath: getConfig(currentScript, 'lottieAnimationPath', null),
        lottieButtonId: 'flowise-lottie-trigger-' + Date.now(),
        lottieButtonBottom: getConfig(currentScript, 'lottieButtonBottom', '20px'),
        lottieButtonRight: getConfig(currentScript, 'lottieButtonRight', '20px'),
        lottieButtonWidth: getConfig(currentScript, 'lottieButtonWidth', '70px'),
        lottieButtonHeight: getConfig(currentScript, 'lottieButtonHeight', '70px'),
        lottieButtonZIndex: getConfig(currentScript, 'lottieButtonZIndex', '10000'),

        // Lottie Tooltip (NUEVO)
        lottieTooltipEnabled: getConfig(currentScript, 'lottieTooltipEnabled', true, 'boolean'),            // data-lottie-tooltip-enabled
        lottieTooltipText: getConfig(currentScript, 'lottieTooltipText', 'Abrir Chat'),                    // data-lottie-tooltip-text
        lottieTooltipBackgroundColor: getConfig(currentScript, 'lottieTooltipBackgroundColor', '#333333'),  // data-lottie-tooltip-background-color
        lottieTooltipTextColor: getConfig(currentScript, 'lottieTooltipTextColor', '#ffffff'),              // data-lottie-tooltip-text-color
        lottieTooltipFontSize: getConfig(currentScript, 'lottieTooltipFontSize', '12px'),                  // data-lottie-tooltip-font-size
        lottieTooltipPadding: getConfig(currentScript, 'lottieTooltipPadding', '5px 10px'),                // data-lottie-tooltip-padding
        lottieTooltipBorderRadius: getConfig(currentScript, 'lottieTooltipBorderRadius', '4px'),           // data-lottie-tooltip-border-radius
        lottieTooltipZIndexOffset: getConfig(currentScript, 'lottieTooltipZIndexOffset', 1, 'number'),     // data-lottie-tooltip-z-index-offset (offset from lottie button z-index)
        lottieTooltipPositionOffset: getConfig(currentScript, 'lottieTooltipPositionOffset', 8, 'number'), // data-lottie-tooltip-position-offset (px above button)


        // Theme -> Button (original Flowise button)
        themeButtonBackgroundColor: getConfig(currentScript, 'themeButtonBackgroundColor', '#3B81F6'),
        themeButtonRight: getConfig(currentScript, 'themeButtonRight', 20, 'number'),
        themeButtonBottom: getConfig(currentScript, 'themeButtonBottom', 20, 'number'),
        themeButtonSize: getConfig(currentScript, 'themeButtonSize', 48, 'number'),
        themeButtonDragAndDrop: getConfig(currentScript, 'themeButtonDragAndDrop', true, 'boolean'),
        themeButtonIconColor: getConfig(currentScript, 'themeButtonIconColor', 'white'),
        themeButtonCustomIconSrc: getConfig(currentScript, 'themeButtonCustomIconSrc', ''),
        themeButtonAutoOpen: getConfig(currentScript, 'themeButtonAutoOpen', false, 'boolean'), // Forzado a false si usamos Lottie
        themeButtonOpenDelay: getConfig(currentScript, 'themeButtonOpenDelay', 2, 'number'),
        themeButtonAutoOpenOnMobile: getConfig(currentScript, 'themeButtonAutoOpenOnMobile', false, 'boolean'),
        
        // Theme -> ChatWindow
        themeChatWindowShowTitle: getConfig(currentScript, 'themeChatWindowShowTitle', true, 'boolean'),
        themeChatWindowShowAgentMessages: getConfig(currentScript, 'themeChatWindowShowAgentMessages', true, 'boolean'),
        themeChatWindowTitle: getConfig(currentScript, 'themeChatWindowTitle', 'Chatbot'),
        themeChatWindowTitleAvatarSrc: getConfig(currentScript, 'themeChatWindowTitleAvatarSrc', ''),
        themeChatWindowWelcomeMessage: getConfig(currentScript, 'themeChatWindowWelcomeMessage', '¡Hola!'),
        themeChatWindowErrorMessage: getConfig(currentScript, 'themeChatWindowErrorMessage', 'Ocurrió un error.'),
        themeChatWindowBackgroundColor: getConfig(currentScript, 'themeChatWindowBackgroundColor', '#ffffff'),
        themeChatWindowBackgroundImage: getConfig(currentScript, 'themeChatWindowBackgroundImage', ''),
        themeChatWindowHeight: getConfig(currentScript, 'themeChatWindowHeight', 600, 'number'),
        themeChatWindowWidth: getConfig(currentScript, 'themeChatWindowWidth', 400, 'number'),
        themeChatWindowFontSize: getConfig(currentScript, 'themeChatWindowFontSize', 16, 'number'),
        themeChatWindowStarterPrompts: getConfig(currentScript, 'themeChatWindowStarterPromptsJson', [], 'json'), // data-chat-window-starter-prompts-json
        themeChatWindowStarterPromptFontSize: getConfig(currentScript, 'themeChatWindowStarterPromptFontSize', 15, 'number'),
        themeChatWindowClearChatOnReload: getConfig(currentScript, 'themeChatWindowClearChatOnReload', false, 'boolean'),
        themeChatWindowSourceDocsTitle: getConfig(currentScript, 'themeChatWindowSourceDocsTitle', 'Fuentes:'),
        themeChatWindowRenderHTML: getConfig(currentScript, 'themeChatWindowRenderHtml', true, 'boolean'),
        
        // Theme -> ChatWindow -> BotMessage
        themeBotMessageBackgroundColor: getConfig(currentScript, 'themeBotMessageBackgroundColor', '#f7f8ff'),
        themeBotMessageTextColor: getConfig(currentScript, 'themeBotMessageTextColor', '#303235'),
        themeBotMessageShowAvatar: getConfig(currentScript, 'themeBotMessageShowAvatar', true, 'boolean'),
        themeBotMessageAvatarSrc: getConfig(currentScript, 'themeBotMessageAvatarSrc', ''),
        
        // Theme -> ChatWindow -> UserMessage
        themeUserMessageBackgroundColor: getConfig(currentScript, 'themeUserMessageBackgroundColor', '#3B81F6'),
        themeUserMessageTextColor: getConfig(currentScript, 'themeUserMessageTextColor', '#ffffff'),
        themeUserMessageShowAvatar: getConfig(currentScript, 'themeUserMessageShowAvatar', true, 'boolean'),
        themeUserMessageAvatarSrc: getConfig(currentScript, 'themeUserMessageAvatarSrc', ''),
        
        // Theme -> ChatWindow -> TextInput
        themeTextInputPlaceholder: getConfig(currentScript, 'themeTextInputPlaceholder', 'Escribe tu pregunta'),
        themeTextInputBackgroundColor: getConfig(currentScript, 'themeTextInputBackgroundColor', '#ffffff'),
        themeTextInputTextColor: getConfig(currentScript, 'themeTextInputTextColor', '#303235'),
        themeTextInputSendButtonColor: getConfig(currentScript, 'themeTextInputSendButtonColor', '#3B81F6'),
        themeTextInputMaxChars: getConfig(currentScript, 'themeTextInputMaxChars', 1000, 'number'),
        themeTextInputMaxCharsWarningMessage: getConfig(currentScript, 'themeTextInputMaxCharsWarningMessage', 'Límite de caracteres excedido.'),
        themeTextInputAutoFocus: getConfig(currentScript, 'themeTextInputAutoFocus', true, 'boolean'),
        themeTextInputSendMessageSound: getConfig(currentScript, 'themeTextInputSendMessageSound', false, 'boolean'),
        themeTextInputSendSoundLocation: getConfig(currentScript, 'themeTextInputSendSoundLocation', ''),
        themeTextInputReceiveMessageSound: getConfig(currentScript, 'themeTextInputReceiveMessageSound', false, 'boolean'),
        themeTextInputReceiveSoundLocation: getConfig(currentScript, 'themeTextInputReceiveSoundLocation', ''),
        
        // Theme -> ChatWindow -> Feedback
        themeFeedbackColor: getConfig(currentScript, 'themeFeedbackColor', '#303235'),
        
        // Theme -> ChatWindow -> DateTimeToggle
        themeDateTimeToggleDate: getConfig(currentScript, 'themeDateTimeToggleDate', true, 'boolean'),
        themeDateTimeToggleTime: getConfig(currentScript, 'themeDateTimeToggleTime', true, 'boolean'),
        
        // Theme -> ChatWindow -> Footer
        themeFooterTextColor: getConfig(currentScript, 'themeFooterTextColor', '#303235'),
        themeFooterText: getConfig(currentScript, 'themeFooterText', 'Powered by'),
        themeFooterCompany: getConfig(currentScript, 'themeFooterCompany', 'Flowise'),
        themeFooterCompanyLink: getConfig(currentScript, 'themeFooterCompanyLink', 'https://flowiseai.com'),
    };

    if (!config.chatflowid) {
        console.error("Flowise Lottie Embed: 'data-chatflowid' es requerido.");
        return;
    }
    if (!config.lottieAnimationPath) {
        console.error("Flowise Lottie Embed: 'data-lottie-animation-path' es requerido.");
        return;
    }

    let lottieTooltipElement = null; // Variable para el tooltip

    function createLottieTooltip() {
        if (!config.lottieTooltipEnabled || !config.lottieTooltipText) return null;

        const el = document.createElement('div');
        el.id = 'flowise-lottie-tooltip-' + Date.now();
        el.textContent = config.lottieTooltipText;
        Object.assign(el.style, {
            position: 'fixed',
            visibility: 'hidden',
            opacity: '0',
            backgroundColor: config.lottieTooltipBackgroundColor,
            color: config.lottieTooltipTextColor,
            fontSize: config.lottieTooltipFontSize,
            padding: config.lottieTooltipPadding,
            borderRadius: config.lottieTooltipBorderRadius,
            zIndex: (parseInt(config.lottieButtonZIndex) + config.lottieTooltipZIndexOffset).toString(),
            transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
            whiteSpace: 'nowrap',
            pointerEvents: 'none' // El tooltip no debe interferir con los eventos del ratón
        });
        document.body.appendChild(el);
        return el;
    }


    function mainInit() {
        const lottieButtonElement = document.createElement('div');
        lottieButtonElement.id = config.lottieButtonId;
        lottieButtonElement.style.position = 'fixed';
        lottieButtonElement.style.bottom = config.lottieButtonBottom;
        lottieButtonElement.style.right = config.lottieButtonRight;
        lottieButtonElement.style.width = config.lottieButtonWidth;
        lottieButtonElement.style.height = config.lottieButtonHeight;
        lottieButtonElement.style.cursor = 'pointer';
        lottieButtonElement.style.zIndex = config.lottieButtonZIndex;
        document.body.appendChild(lottieButtonElement);

        // Crear el tooltip si está habilitado
        if (config.lottieTooltipEnabled) {
            lottieTooltipElement = createLottieTooltip();
            if (lottieTooltipElement) {
                lottieButtonElement.addEventListener('mouseenter', () => {
                    const lottieRect = lottieButtonElement.getBoundingClientRect();
                    // Para que getBoundingClientRect() del tooltip devuelva dimensiones correctas,
                    // lo hacemos visible temporalmente pero fuera de la pantalla o transparente.
                    // O simplemente confiamos en que el texto ya está y las dimensiones son calculables.
                    lottieTooltipElement.style.visibility = 'hidden'; // Aseguramos que esté oculto para recalcular
                    lottieTooltipElement.style.opacity = '0';

                    const tooltipRect = lottieTooltipElement.getBoundingClientRect();

                    // Posicionar arriba del botón, centrado horizontalmente
                    let top = lottieRect.top - tooltipRect.height - config.lottieTooltipPositionOffset;
                    if (top < 5) { // Si se sale por arriba, lo ponemos abajo
                        top = lottieRect.bottom + config.lottieTooltipPositionOffset;
                    }

                    let left = lottieRect.left + (lottieRect.width / 2) - (tooltipRect.width / 2);
                    if (left < 5) left = 5; // Evitar que se salga por la izquierda
                    if (left + tooltipRect.width > window.innerWidth - 5) { // Evitar que se salga por la derecha
                        left = window.innerWidth - tooltipRect.width - 5;
                    }
                    
                    lottieTooltipElement.style.top = `${top}px`;
                    lottieTooltipElement.style.left = `${left}px`;
                    
                    lottieTooltipElement.style.visibility = 'visible';
                    lottieTooltipElement.style.opacity = '1';
                });

                lottieButtonElement.addEventListener('mouseleave', () => {
                    lottieTooltipElement.style.visibility = 'hidden';
                    lottieTooltipElement.style.opacity = '0';
                });
            }
        }


        if (typeof lottie === 'undefined') {
            const lottieCdnScript = document.createElement('script');
            lottieCdnScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';
            lottieCdnScript.onload = () => setupLottieAnimation(lottieButtonElement);
            lottieCdnScript.onerror = () => console.error("Flowise Lottie Embed: Falló la carga de Lottie desde CDN.");
            document.head.appendChild(lottieCdnScript);
        } else {
            setupLottieAnimation(lottieButtonElement);
        }

        import('https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js')
            .then(module => {
                const Chatbot = module.default;
                Chatbot.init({
                    chatflowid: config.chatflowid,
                    apiHost: config.apiHost,
                    chatflowConfig: config.chatflowConfig, // Ya parseado como objeto
                    observersConfig: config.observersConfig, // Ya parseado como objeto
                    theme: {
                        button: {
                            backgroundColor: config.themeButtonBackgroundColor,
                            right: config.themeButtonRight,
                            bottom: config.themeButtonBottom,
                            size: config.themeButtonSize,
                            dragAndDrop: config.themeButtonDragAndDrop,
                            iconColor: config.themeButtonIconColor,
                            customIconSrc: config.themeButtonCustomIconSrc,
                            autoWindowOpen: { // Forzado a false porque usamos Lottie
                                autoOpen: false, 
                                openDelay: config.themeButtonOpenDelay,
                                autoOpenOnMobile: config.themeButtonAutoOpenOnMobile
                            }
                        },
                        tooltip: { showTooltip: false }, // Deshabilitar el tooltip original de Flowise si lo tuviera
                        customCSS: `
                /* Header del chat */
                .chatbot-header {
                    background: linear-gradient(90deg, #4e67eb 0%, #3cb371 100%) !important;
                    padding: 16px !important;
                    border-top-left-radius: 10px !important;
                    border-top-right-radius: 10px !important;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }


                /* Campo de entrada */
                .chatbot-input {
                    border-radius: 24px !important;
                    margin: 10px !important;
                    background-color: #f8f9fa !important;
                    border: 1px solid #e9ecef !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
                    padding: 8px !important;
                }

            
                /* Burbujas de mensaje del bot */
                .chatbot-host-bubble {
                    border-radius: 20px !important;
                    padding: 12px 16px !important;
                    max-width: 85% !important;
                    margin-bottom: 8px !important;
                    background-color: #f8f9fa !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important;
                }

                /* Burbujas de mensaje del usuario */
                .chatbot-guest-bubble {
                    border-radius: 20px !important;
                    padding: 12px 16px !important;
                    max-width: 85% !important;
                    margin-bottom: 8px !important;
                 
                    color: white !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
                }

                /* Contenedor del chat */
                .chatbot-container {
                    border-radius: 10px !important;
                    overflow: hidden !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                }

                /* Scroll suave */
                .chat-messages-container {
                    scroll-behavior: smooth !important;
                }
            `,
                        chatWindow: {
                            showTitle: config.themeChatWindowShowTitle,
                            showAgentMessages: config.themeChatWindowShowAgentMessages,
                            title: config.themeChatWindowTitle,
                            titleAvatarSrc: config.themeChatWindowTitleAvatarSrc,
                            welcomeMessage: config.themeChatWindowWelcomeMessage,
                            errorMessage: config.themeChatWindowErrorMessage,
                            backgroundColor: config.themeChatWindowBackgroundColor,
                            backgroundImage: config.themeChatWindowBackgroundImage,
                            height: config.themeChatWindowHeight,
                            width: config.themeChatWindowWidth,
                            fontSize: config.themeChatWindowFontSize,
                            starterPrompts: config.themeChatWindowStarterPrompts, 
                            starterPromptFontSize: config.themeChatWindowStarterPromptFontSize,
                            clearChatOnReload: config.themeChatWindowClearChatOnReload,
                            sourceDocsTitle: config.themeChatWindowSourceDocsTitle,
                            renderHTML: config.themeChatWindowRenderHTML,
                            botMessage: {
                                backgroundColor: config.themeBotMessageBackgroundColor,
                                textColor: config.themeBotMessageTextColor,
                                showAvatar: config.themeBotMessageShowAvatar,
                                avatarSrc: config.themeBotMessageAvatarSrc
                            },
                            userMessage: {
                                backgroundColor: config.themeUserMessageBackgroundColor,
                                textColor: config.themeUserMessageTextColor,
                                showAvatar: config.themeUserMessageShowAvatar,
                                avatarSrc: config.themeUserMessageAvatarSrc
                            },
                            textInput: {
                                placeholder: config.themeTextInputPlaceholder,
                                backgroundColor: config.themeTextInputBackgroundColor,
                                textColor: config.themeTextInputTextColor,
                                sendButtonColor: config.themeTextInputSendButtonColor,
                                maxChars: config.themeTextInputMaxChars,
                                maxCharsWarningMessage: config.themeTextInputMaxCharsWarningMessage,
                                autoFocus: config.themeTextInputAutoFocus,
                                sendMessageSound: config.themeTextInputSendMessageSound,
                                sendSoundLocation: config.themeTextInputSendSoundLocation,
                                receiveMessageSound: config.themeTextInputReceiveMessageSound,
                                receiveSoundLocation: config.themeTextInputReceiveSoundLocation
                            },
                            feedback: {
                                color: config.themeFeedbackColor
                            },
                            dateTimeToggle: {
                                date: config.themeDateTimeToggleDate,
                                time: config.themeDateTimeToggleTime
                            },
                            footer: {
                                textColor: config.themeFooterTextColor,
                                text: config.themeFooterText,
                                company: config.themeFooterCompany,
                                companyLink: config.themeFooterCompanyLink
                            }
                        }
                    }
                });
                setTimeout(() => tryHidingFlowiseButton(0), 300);
            })
            .catch(err => console.error("Flowise Lottie Embed: Falló la carga del script de Flowise.", err));
    }

    function setupLottieAnimation(lottieButtonElement) {
        if (!lottieButtonElement || typeof lottie === 'undefined') return;
        lottie.loadAnimation({
            container: lottieButtonElement,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: config.lottieAnimationPath
        });
        lottieButtonElement.addEventListener('click', () => {
            const flowiseElement = document.querySelector('flowise-chatbot');
            if (flowiseElement && flowiseElement.shadowRoot) {
                const internalButton = flowiseElement.shadowRoot.querySelector('[part="button"]');
                if (internalButton) internalButton.click();
                else console.warn('Flowise Lottie Embed: Botón interno (part="button") no encontrado para clic.');
            } else {
                console.warn('Flowise Lottie Embed: <flowise-chatbot> o shadowRoot no encontrado para clic.');
            }
        });
    }

    function tryHidingFlowiseButton(attemptCount) {
        const maxAttempts = 20;
        if (attemptCount >= maxAttempts) {
            console.error("Flowise Lottie Embed: Máximos intentos para ocultar botón original.");
            return;
        }
        const flowiseElement = document.querySelector('flowise-chatbot');
        if (flowiseElement && flowiseElement.shadowRoot) {
            const internalButton = flowiseElement.shadowRoot.querySelector('[part="button"]');
            if (internalButton) {
                Object.assign(internalButton.style, {
                    display: 'none', visibility: 'hidden', width: '0px', height: '0px',
                    opacity: '0', padding: '0', margin: '0', border: 'none', pointerEvents: 'none'
                });
                console.log("Flowise Lottie Embed: Botón original ocultado vía JS.");
            } else { setTimeout(() => tryHidingFlowiseButton(attemptCount + 1), 500); }
        } else { setTimeout(() => tryHidingFlowiseButton(attemptCount + 1), 500); }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mainInit);
    } else {
        mainInit();
    }
})();