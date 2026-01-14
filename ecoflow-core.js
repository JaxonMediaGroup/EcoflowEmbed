// ECOflow Core - Script base con toda la lógica
// Este archivo NO debe ser modificado para cada cliente
(function() {
    'use strict';

    // Función para obtener configuración con valores predeterminados
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

    // Función principal de inicialización
    window.initECOflowEmbed = function(clientConfig) {
        if (!clientConfig) {
            console.error("ECOflow: No se proporcionó configuración del cliente.");
            return;
        }

        // Combinar configuración del cliente con valores predeterminados
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
            themeButtonSize: getConfigValue(clientConfig, 'themeButtonSize', 0.1, 'number'),
            themeButtonZIndex: getConfigValue(clientConfig, 'themeButtonZIndex', '10001'),

            // Theme -> ChatWindow
            themeChatWindowShowTitle: getConfigValue(clientConfig, 'themeChatWindowShowTitle', true, 'boolean'),
            themeChatWindowShowAgentMessages: getConfigValue(clientConfig, 'themeChatWindowShowAgentMessages', true, 'boolean'),
            themeChatWindowTitle: getConfigValue(clientConfig, 'themeChatWindowTitle', 'Chatbot'),
            themeChatWindowTitleAvatarSrc: getConfigValue(clientConfig, 'themeChatWindowTitleAvatarSrc', ''),
            themeChatWindowWelcomeMessage: getConfigValue(clientConfig, 'themeChatWindowWelcomeMessage', '¡Hola!'),
            themeChatWindowErrorMessage: getConfigValue(clientConfig, 'themeChatWindowErrorMessage', 'Ocurrió un error.'),
            themeChatWindowBackgroundColor: getConfigValue(clientConfig, 'themeChatWindowBackgroundColor', '#ffffff'),
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

        // Cargar dependencias necesarias
        loadDependencies(config);
    };

    function loadDependencies(config) {
        // Cargar Lottie si no está cargado
        if (typeof lottie === 'undefined') {
            const lottieScript = document.createElement('script');
            lottieScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';
            lottieScript.onload = () => initChatbot(config);
            document.head.appendChild(lottieScript);
        } else {
            initChatbot(config);
        }
    }

    let lottieTooltipElement = null;
    let lottieAnimation = null;
    let isPlaying = false;

    function createLottieTooltip(config) {
        if (!config.lottieTooltipEnabled || !config.lottieTooltipText) return null;

        const el = document.createElement('div');
        el.id = 'ecoflow-lottie-tooltip-' + Date.now();
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
            pointerEvents: 'none'
        });
        document.body.appendChild(el);
        return el;
    }

    function initChatbot(config) {
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

        // Crear tooltip
        if (config.lottieTooltipEnabled) {
            lottieTooltipElement = createLottieTooltip(config);
            
            if (lottieTooltipElement) {
                lottieButtonElement.addEventListener('mouseenter', () => {
                    const lottieRect = lottieButtonElement.getBoundingClientRect();
                    const tooltipRect = lottieTooltipElement.getBoundingClientRect();
                    
                    lottieTooltipElement.style.bottom = (window.innerHeight - lottieRect.top + config.lottieTooltipPositionOffset) + 'px';
                    lottieTooltipElement.style.right = (window.innerWidth - lottieRect.right + lottieRect.width / 2 - tooltipRect.width / 2) + 'px';
                    lottieTooltipElement.style.visibility = 'visible';
                    lottieTooltipElement.style.opacity = '1';
                });

                lottieButtonElement.addEventListener('mouseleave', () => {
                    lottieTooltipElement.style.visibility = 'hidden';
                    lottieTooltipElement.style.opacity = '0';
                });
            }
        }

        // Cargar animación Lottie
        lottieAnimation = lottie.loadAnimation({
            container: lottieButtonElement,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: config.lottieAnimationPath
        });

        lottieAnimation.addEventListener('DOMLoaded', () => {
            lottieAnimation.goToAndStop(0, true);
        });

        // Eventos del botón
        lottieButtonElement.addEventListener('click', () => {
            if (isPlaying) {
                lottieAnimation.setDirection(-1);
                lottieAnimation.play();
            } else {
                lottieAnimation.setDirection(1);
                lottieAnimation.play();
            }
            isPlaying = !isPlaying;
            toggleChatWindow();
        });

        // Inicializar chatbot de Flowise
        initFlowiseChatbot(config);
    }

    function initFlowiseChatbot(config) {
        // Crear el chatbot usando la API de Flowise
        window.Chatbot = {
            initFull: function(configObj) {
                // Crear el iframe o contenedor del chat
                const chatWindow = document.createElement('div');
                chatWindow.id = 'ecoflow-chat-window';
                chatWindow.style.cssText = `
                    position: fixed;
                    bottom: ${parseInt(config.themeButtonBottom) + 80}px;
                    right: ${config.themeButtonRight}px;
                    width: ${config.themeChatWindowWidth}px;
                    height: ${config.themeChatWindowHeight}px;
                    border-radius: 10px;
                    box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
                    z-index: ${config.themeZIndex};
                    display: none;
                    flex-direction: column;
                    background: ${config.themeChatWindowBackgroundColor};
                    overflow: hidden;
                `;

                // Crear iframe para el chatbot
                const iframe = document.createElement('iframe');
                iframe.src = `${config.apiHost}/chatbot/${config.chatflowid}`;
                iframe.style.cssText = `
                    width: 100%;
                    height: 100%;
                    border: none;
                `;
                
                chatWindow.appendChild(iframe);
                document.body.appendChild(chatWindow);

                // Función para toggle
                window.toggleChatWindow = function() {
                    if (chatWindow.style.display === 'none' || !chatWindow.style.display) {
                        chatWindow.style.display = 'flex';
                    } else {
                        chatWindow.style.display = 'none';
                    }
                };
            }
        };

        // Inicializar el chatbot
        window.Chatbot.initFull(config);
    }

    // Auto-inicializar si existe configuración en window
    if (window.ECOFLOW_CONFIG) {
        window.initECOflowEmbed(window.ECOFLOW_CONFIG);
    }
})();
