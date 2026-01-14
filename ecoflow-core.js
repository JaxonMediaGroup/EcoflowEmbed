// ECOflow Core - Script base con toda la lógica completa
// Basado en ecoflow-liquidglass-1.js
// Este archivo contiene TODA la lógica necesaria para el chatbot
(function() {
    'use strict';

    // Esperar a que ECOFLOW_CONFIG esté definido
    function waitForConfig(callback, attempts = 0) {
        if (typeof window.ECOFLOW_CONFIG !== 'undefined') {
            callback(window.ECOFLOW_CONFIG);
        } else if (attempts < 50) {
            setTimeout(() => waitForConfig(callback, attempts + 1), 100);
        } else {
            console.error("ECOflow Core: No se encontró window.ECOFLOW_CONFIG después de 5 segundos.");
        }
    }

    function initECOflowEmbed(clientConfig) {
        // Función auxiliar para obtener valores con defaults
        function getConfigValue(config, key, defaultValue, type = 'string') {
            const value = config[key];
            if (value === undefined || value === null || value === "") {
                return defaultValue;
            }
            if (type === 'boolean') {
                return Boolean(value);
            }
            if (type === 'number') {
                const num = Number(value);
                return isNaN(num) ? defaultValue : num;
            }
            return value;
        }

        const config = {
            // Core
            chatflowid: getConfigValue(clientConfig, 'chatflowid', null),
            apiHost: getConfigValue(clientConfig, 'apiHost', 'https://ecoflow.koppi.mx'),
            chatflowConfig: getConfigValue(clientConfig, 'chatflowConfig', {}),
            observersConfig: getConfigValue(clientConfig, 'observersConfig', {}),

            // Lottie
            lottieAnimationPath: getConfigValue(clientConfig, 'lottieAnimationPath', null),
            lottieButtonId: 'ecoflow-lottie-trigger-' + Date.now(),
            lottieButtonBottom: getConfigValue(clientConfig, 'lottieButtonBottom', '20px'),
            lottieButtonRight: getConfigValue(clientConfig, 'lottieButtonRight', '20px'),
            lottieButtonWidth: getConfigValue(clientConfig, 'lottieButtonWidth', '70px'),
            lottieButtonHeight: getConfigValue(clientConfig, 'lottieButtonHeight', '70px'),
            lottieButtonZIndex: getConfigValue(clientConfig, 'lottieButtonZIndex', '10000'),

            // Lottie Tooltip
            lottieTooltipEnabled: getConfigValue(clientConfig, 'lottieTooltipEnabled', true, 'boolean'),
            lottieTooltipText: getConfigValue(clientConfig, 'lottieTooltipText', 'Abrir Chat'),
            lottieTooltipBackgroundColor: getConfigValue(clientConfig, 'lottieTooltipBackgroundColor', '#333333'),
            lottieTooltipTextColor: getConfigValue(clientConfig, 'lottieTooltipTextColor', '#ffffff'),
            lottieTooltipFontSize: getConfigValue(clientConfig, 'lottieTooltipFontSize', '12px'),
            lottieTooltipPadding: getConfigValue(clientConfig, 'lottieTooltipPadding', '5px 10px'),
            lottieTooltipBorderRadius: getConfigValue(clientConfig, 'lottieTooltipBorderRadius', '4px'),
            lottieTooltipZIndexOffset: getConfigValue(clientConfig, 'lottieTooltipZIndexOffset', 1, 'number'),
            lottieTooltipPositionOffset: getConfigValue(clientConfig, 'lottieTooltipPositionOffset', 8, 'number'),

            // Theme -> Button
            themeButtonBackgroundColor: getConfigValue(clientConfig, 'themeButtonBackgroundColor', '#3B81F6'),
            themeButtonRight: getConfigValue(clientConfig, 'themeButtonRight', 20, 'number'),
            themeButtonBottom: getConfigValue(clientConfig, 'themeButtonBottom', 20, 'number'),
            themeButtonSize: getConfigValue(clientConfig, 'themeButtonSize', 48, 'number'),
            themeButtonDragAndDrop: getConfigValue(clientConfig, 'themeButtonDragAndDrop', true, 'boolean'),
            themeButtonIconColor: getConfigValue(clientConfig, 'themeButtonIconColor', 'white'),
            themeButtonCustomIconSrc: getConfigValue(clientConfig, 'themeButtonCustomIconSrc', ''),
            themeButtonAutoOpen: getConfigValue(clientConfig, 'themeButtonAutoOpen', false, 'boolean'),
            themeButtonOpenDelay: getConfigValue(clientConfig, 'themeButtonOpenDelay', 2, 'number'),
            themeButtonAutoOpenOnMobile: getConfigValue(clientConfig, 'themeButtonAutoOpenOnMobile', false, 'boolean'),
            themeButtonZIndex: getConfigValue(clientConfig, 'themeButtonZIndex', '10001'),

            // Theme -> ChatWindow
            themeChatWindowShowTitle: getConfigValue(clientConfig, 'themeChatWindowShowTitle', true, 'boolean'),
            themeChatWindowShowAgentMessages: getConfigValue(clientConfig, 'themeChatWindowShowAgentMessages', true, 'boolean'),
            themeChatWindowTitle: getConfigValue(clientConfig, 'themeChatWindowTitle', 'Chatbot'),
            themeChatWindowTitleAvatarSrc: getConfigValue(clientConfig, 'themeChatWindowTitleAvatarSrc', ''),
            themeChatWindowWelcomeMessage: getConfigValue(clientConfig, 'themeChatWindowWelcomeMessage', '¡Hola!'),
            themeChatWindowErrorMessage: getConfigValue(clientConfig, 'themeChatWindowErrorMessage', 'Ocurrió un error.'),
            themeChatWindowBackgroundColor: getConfigValue(clientConfig, 'themeChatWindowBackgroundColor', 'rgba(255, 255, 255, 0.05)'),
            themeChatWindowBackgroundImage: getConfigValue(clientConfig, 'themeChatWindowBackgroundImage', ''),
            themeChatWindowHeight: getConfigValue(clientConfig, 'themeChatWindowHeight', 600, 'number'),
            themeChatWindowWidth: getConfigValue(clientConfig, 'themeChatWindowWidth', 400, 'number'),
            themeChatWindowFontSize: getConfigValue(clientConfig, 'themeChatWindowFontSize', 16, 'number'),
            themeChatWindowStarterPrompts: getConfigValue(clientConfig, 'themeChatWindowStarterPrompts', []),
            themeChatWindowStarterPromptFontSize: getConfigValue(clientConfig, 'themeChatWindowStarterPromptFontSize', 15, 'number'),
            themeChatWindowClearChatOnReload: getConfigValue(clientConfig, 'themeChatWindowClearChatOnReload', false, 'boolean'),
            themeChatWindowSourceDocsTitle: getConfigValue(clientConfig, 'themeChatWindowSourceDocsTitle', 'Fuentes:'),
            themeChatWindowRenderHTML: getConfigValue(clientConfig, 'themeChatWindowRenderHTML', true, 'boolean'),

            // Theme -> BotMessage
            themeBotMessageBackgroundColor: getConfigValue(clientConfig, 'themeBotMessageBackgroundColor', '#f7f8ff'),
            themeBotMessageTextColor: getConfigValue(clientConfig, 'themeBotMessageTextColor', '#303235'),
            themeBotMessageShowAvatar: getConfigValue(clientConfig, 'themeBotMessageShowAvatar', true, 'boolean'),
            themeBotMessageAvatarSrc: getConfigValue(clientConfig, 'themeBotMessageAvatarSrc', ''),

            // Theme -> UserMessage
            themeUserMessageBackgroundColor: getConfigValue(clientConfig, 'themeUserMessageBackgroundColor', '#3B81F6'),
            themeUserMessageTextColor: getConfigValue(clientConfig, 'themeUserMessageTextColor', '#ffffff'),
            themeUserMessageShowAvatar: getConfigValue(clientConfig, 'themeUserMessageShowAvatar', true, 'boolean'),
            themeUserMessageAvatarSrc: getConfigValue(clientConfig, 'themeUserMessageAvatarSrc', ''),

            // Theme -> TextInput
            themeTextInputPlaceholder: getConfigValue(clientConfig, 'themeTextInputPlaceholder', 'Escribe tu pregunta'),
            themeTextInputBackgroundColor: getConfigValue(clientConfig, 'themeTextInputBackgroundColor', '#ffffff'),
            themeTextInputTextColor: getConfigValue(clientConfig, 'themeTextInputTextColor', '#303235'),
            themeTextInputSendButtonColor: getConfigValue(clientConfig, 'themeTextInputSendButtonColor', '#3B81F6'),
            themeTextInputMaxChars: getConfigValue(clientConfig, 'themeTextInputMaxChars', 1000, 'number'),
            themeTextInputMaxCharsWarningMessage: getConfigValue(clientConfig, 'themeTextInputMaxCharsWarningMessage', 'Límite de caracteres excedido.'),
            themeTextInputAutoFocus: getConfigValue(clientConfig, 'themeTextInputAutoFocus', true, 'boolean'),
            themeTextInputSendMessageSound: getConfigValue(clientConfig, 'themeTextInputSendMessageSound', false, 'boolean'),
            themeTextInputSendSoundLocation: getConfigValue(clientConfig, 'themeTextInputSendSoundLocation', ''),
            themeTextInputReceiveMessageSound: getConfigValue(clientConfig, 'themeTextInputReceiveMessageSound', false, 'boolean'),
            themeTextInputReceiveSoundLocation: getConfigValue(clientConfig, 'themeTextInputReceiveSoundLocation', ''),

            // Theme -> Feedback
            themeFeedbackColor: getConfigValue(clientConfig, 'themeFeedbackColor', '#303235'),

            // Theme -> DateTime
            themeDateTimeToggleDate: getConfigValue(clientConfig, 'themeDateTimeToggleDate', true, 'boolean'),
            themeDateTimeToggleTime: getConfigValue(clientConfig, 'themeDateTimeToggleTime', true, 'boolean'),

            // Theme -> Footer
            themeFooterTextColor: getConfigValue(clientConfig, 'themeFooterTextColor', '#303235'),
            themeFooterText: getConfigValue(clientConfig, 'themeFooterText', 'Powered by'),
            themeFooterCompany: getConfigValue(clientConfig, 'themeFooterCompany', 'ECOflow'),
            themeFooterCompanyLink: getConfigValue(clientConfig, 'themeFooterCompanyLink', 'https://koppi.mx'),

            // Theme -> Z-Index
            themeZIndex: getConfigValue(clientConfig, 'themeZIndex', '10000'),
        };

        // Validaciones
        if (!config.chatflowid) {
            console.error("ECOflow: 'chatflowid' es requerido.");
            return;
        }
        if (!config.lottieAnimationPath) {
            console.error("ECOflow: 'lottieAnimationPath' es requerido.");
            return;
        }

        mainInit(config);
    }

    function mainInit(config) {
        let lottieTooltipElement = null;

        // Crear botón Lottie
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

        // Crear tooltip si está habilitado
        if (config.lottieTooltipEnabled) {
            lottieTooltipElement = document.createElement('div');
            lottieTooltipElement.id = 'ecoflow-lottie-tooltip-' + Date.now();
            lottieTooltipElement.textContent = config.lottieTooltipText;
            Object.assign(lottieTooltipElement.style, {
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
                pointerEvents: 'none'
            });
            document.body.appendChild(lottieTooltipElement);

            // Eventos del tooltip
            lottieButtonElement.addEventListener('mouseenter', () => {
                const lottieRect = lottieButtonElement.getBoundingClientRect();
                const tooltipRect = lottieTooltipElement.getBoundingClientRect();

                let top = lottieRect.top - tooltipRect.height - config.lottieTooltipPositionOffset;
                if (top < 5) {
                    top = lottieRect.bottom + config.lottieTooltipPositionOffset;
                }

                let left = lottieRect.left + (lottieRect.width / 2) - (tooltipRect.width / 2);
                if (left < 5) left = 5;
                if (left + tooltipRect.width > window.innerWidth - 5) {
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

        // Cargar Lottie si no está cargado
        if (typeof lottie === 'undefined') {
            const lottieCdnScript = document.createElement('script');
            lottieCdnScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';
            lottieCdnScript.onload = () => setupLottieAnimation(lottieButtonElement, config);
            lottieCdnScript.onerror = () => console.error("ECOflow: Falló la carga de Lottie desde CDN.");
            document.head.appendChild(lottieCdnScript);
        } else {
            setupLottieAnimation(lottieButtonElement, config);
        }

        // Cargar e inicializar el chatbot de Flowise
        import('https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js')
            .then(module => {
                const Chatbot = module.default;
                Chatbot.init({
                    chatflowid: config.chatflowid,
                    apiHost: config.apiHost,
                    chatflowConfig: config.chatflowConfig,
                    observersConfig: config.observersConfig,
                    theme: {
                        button: {
                            backgroundColor: config.themeButtonBackgroundColor,
                            right: config.themeButtonRight,
                            bottom: config.themeButtonBottom,
                            size: config.themeButtonSize,
                            dragAndDrop: config.themeButtonDragAndDrop,
                            iconColor: config.themeButtonIconColor,
                            customIconSrc: config.themeButtonCustomIconSrc,
                            autoWindowOpen: {
                                autoOpen: false,
                                openDelay: config.themeButtonOpenDelay,
                                autoOpenOnMobile: config.themeButtonAutoOpenOnMobile
                            }
                        },
                        tooltip: { showTooltip: false },
                        customCSS: `
                            /* Ocultar completamente el botón original de Flowise */
                            [part="button"] {
                                display: none !important;
                                visibility: hidden !important;
                                opacity: 0 !important;
                                pointer-events: none !important;
                                width: 0 !important;
                                height: 0 !important;
                            }

                            /* Contenedor específico del input */
                            .chatbot-container .w-full.px-5.pt-2.pb-1 {
                                border-top: 2px solid rgba(255, 255, 255, 0.2) !important;
                                padding-right: 20px !important;
                                padding-left: 0px !important;
                                background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)) !important;
                                backdrop-filter: blur(20px) saturate(180%) !important;
                                -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
                            }

                            /* Campo de entrada - Liquid Glass */
                            .chatbot-input {
                                border-radius: 24px !important;
                                margin: 10px !important;
                                background: linear-gradient(135deg, 
                                    rgba(255, 255, 255, 0.15) 0%, 
                                    rgba(255, 255, 255, 0.08) 50%, 
                                    rgba(255, 255, 255, 0.12) 100%) !important;
                                backdrop-filter: blur(25px) saturate(200%) brightness(1.1) !important;
                                -webkit-backdrop-filter: blur(25px) saturate(200%) brightness(1.1) !important;
                                border: 1px solid rgba(255, 255, 255, 0.25) !important;
                                box-shadow: 
                                    0 8px 32px rgba(0, 0, 0, 0.12),
                                    inset 0 1px 0 rgba(255, 255, 255, 0.3),
                                    0 0 0 0.5px rgba(255, 255, 255, 0.1) !important;
                                padding: 1px !important;
                                color: white !important;
                                overflow: hidden !important;
                                scrollbar-width: none !important;
                                -ms-overflow-style: none !important;
                                position: relative !important;
                            }

                            /* Efecto de brillo dinámico */
                            .chatbot-input::before {
                                content: '' !important;
                                position: absolute !important;
                                top: 0 !important;
                                left: -100% !important;
                                width: 100% !important;
                                height: 100% !important;
                                background: linear-gradient(90deg, 
                                    transparent, 
                                    rgba(255, 255, 255, 0.2), 
                                    transparent) !important;
                                transition: left 0.5s ease !important;
                                z-index: 1 !important;
                            }

                            .chatbot-input:hover {
                                border-color: rgba(245, 245, 245, 0.6) !important;
                                box-shadow: 
                                    0 16px 50px rgba(0, 0, 0, 0.2),
                                    0 0 0 2px rgba(252, 248, 232, 0.5),
                                    inset 0 1px 0 rgba(255, 255, 255, 0.5) !important;
                                transform: translateY(-1px) !important;
                            }

                            .chatbot-input:focus-within {
                                border-color: rgba(255, 255, 255, 0.8) !important;
                                box-shadow: 
                                    0 20px 60px rgba(0, 0, 0, 0.25),
                                    0 0 0 3px rgba(252, 248, 232, 0.5),
                                    inset 0 1px 0 rgba(255, 255, 255, 0.6) !important;
                                transform: translateY(-2px) !important;
                            }

                            .chatbot-input:hover::before {
                                left: 100% !important;
                            }

                            /* Ocultar scrollbar en WebKit browsers */
                            .chatbot-input::-webkit-scrollbar {
                                display: none !important;
                            }

                            /* Ocultar scrollbar en textarea dentro del input */
                            .chatbot-input textarea {
                                scrollbar-width: none !important;
                                -ms-overflow-style: none !important;
                                background: transparent !important;
                                position: relative !important;
                                z-index: 2 !important;
                            }

                            .chatbot-input textarea::-webkit-scrollbar {
                                display: none !important;
                            }

                            /* Burbujas de mensaje del bot */
                            .chatbot-host-bubble {
                                border-radius: 20px !important;
                                padding: 12px 16px !important;
                                max-width: 85% !important;
                                margin-bottom: 8px !important;
                                background-color: rgba(248, 248, 250, 0) !important;
                                backdrop-filter: blur(10px) !important;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.36) !important;
                                color: white !important;
                                border: 1px solid rgba(255, 255, 255, 0) !important;
                            }

                            /* Burbujas de mensaje del usuario */
                            .chatbot-guest-bubble {
                                border-radius: 20px !important;
                                padding: 12px 16px !important;
                                max-width: 85% !important;
                                margin-bottom: 8px !important;
                                background-color: rgba(248, 248, 250, 0) !important;
                                backdrop-filter: blur(10px) !important;
                                color: white !important;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
                                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                            }

                            /* Contenedor del chat */
                            .chatbot-container {
                                border-radius: 10px !important;
                                overflow: hidden !important;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                                background-color: rgba(0, 0, 0, 0.1) !important;
                                backdrop-filter: blur(15px) !important;
                                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                            }

                            /* Scroll suave */
                            .chat-messages-container {
                                scroll-behavior: smooth !important;
                                background-color: transparent !important;
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
            .catch(err => console.error("ECOflow: Falló la carga del script de Flowise.", err));
    }

    function setupLottieAnimation(lottieButtonElement, config) {
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
                else console.warn('ECOflow: Botón interno no encontrado.');
            } else {
                console.warn('ECOflow: <flowise-chatbot> no encontrado.');
            }
        });
    }

    function tryHidingFlowiseButton(attemptCount) {
        const maxAttempts = 20;
        if (attemptCount >= maxAttempts) {
            console.error("ECOflow: Máximos intentos para ocultar botón original.");
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
            } else {
                setTimeout(() => tryHidingFlowiseButton(attemptCount + 1), 500);
            }
        } else {
            setTimeout(() => tryHidingFlowiseButton(attemptCount + 1), 500);
        }
    }

    // Inicializar cuando el documento esté listo
    function init() {
        waitForConfig(initECOflowEmbed);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
