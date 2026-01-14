// ECOflow - Plantilla de configuración para nuevos clientes
// DUPLICA este archivo y renómbralo como: ecoflow-nombre_cliente.js

window.ECOFLOW_CONFIG = {
    // ========================================
    // CONFIGURACIÓN PRINCIPAL (REQUERIDO)
    // ========================================
    chatflowid: "TU_CHATFLOW_ID_AQUI", // REQUERIDO: ID del flujo de chat
    apiHost: "https://ecoflow.koppi.mx", // URL del servidor API

    // ========================================
    // ANIMACIÓN LOTTIE (REQUERIDO)
    // ========================================
    lottieAnimationPath: "URL_DE_TU_ANIMACION_LOTTIE.json", // REQUERIDO: URL de la animación
    lottieButtonBottom: "20px",          // Posición desde abajo
    lottieButtonRight: "20px",           // Posición desde la derecha
    lottieButtonWidth: "70px",           // Ancho del botón
    lottieButtonHeight: "70px",          // Alto del botón
    lottieButtonZIndex: "10001",         // Z-index del botón

    // ========================================
    // TOOLTIP DEL BOTÓN LOTTIE
    // ========================================
    lottieTooltipEnabled: true,                    // Mostrar tooltip al pasar el mouse
    lottieTooltipText: "¡Haz clic para chatear!",  // Texto del tooltip
    lottieTooltipBackgroundColor: "#333333",       // Color de fondo
    lottieTooltipTextColor: "#ffffff",             // Color del texto
    lottieTooltipFontSize: "12px",                 // Tamaño de fuente
    lottieTooltipPadding: "5px 10px",              // Padding interno
    lottieTooltipBorderRadius: "4px",              // Bordes redondeados
    lottieTooltipPositionOffset: 8,                // Separación del botón (en px)
    lottieTooltipZIndexOffset: 0,                  // Offset del z-index respecto al botón

    // ========================================
    // BOTÓN TRADICIONAL (Si no usas Lottie)
    // ========================================
    themeButtonBackgroundColor: "#3B81F6",  // Color de fondo del botón
    themeButtonRight: 20,                   // Posición desde la derecha
    themeButtonBottom: 20,                  // Posición desde abajo
    themeButtonSize: 48,                    // Tamaño del botón
    themeButtonZIndex: "10001",             // Z-index del botón

    // ========================================
    // VENTANA DE CHAT
    // ========================================
    themeChatWindowTitle: "Asistente Virtual",                  // Título de la ventana
    themeChatWindowWelcomeMessage: "¡Hola! ¿En qué puedo ayudarte?",  // Mensaje de bienvenida
    themeChatWindowHeight: 600,                                 // Alto de la ventana
    themeChatWindowWidth: 400,                                  // Ancho de la ventana
    themeChatWindowShowAgentMessages: true,                     // Mostrar mensajes del agente
    themeChatWindowBackgroundColor: "#ffffff",                  // Color de fondo
    themeChatWindowFontSize: 16,                                // Tamaño de fuente
    themeChatWindowShowTitle: true,                             // Mostrar título

    // ========================================
    // MENSAJES DEL BOT
    // ========================================
    themeBotMessageBackgroundColor: "#f7f8ff",  // Color de fondo del mensaje
    themeBotMessageTextColor: "#303235",        // Color del texto
    themeBotMessageShowAvatar: true,            // Mostrar avatar del bot
    themeBotMessageAvatarSrc: "",               // URL del avatar (opcional)

    // ========================================
    // MENSAJES DEL USUARIO
    // ========================================
    themeUserMessageBackgroundColor: "#3B81F6",  // Color de fondo del mensaje
    themeUserMessageTextColor: "#ffffff",        // Color del texto
    themeUserMessageShowAvatar: true,            // Mostrar avatar del usuario
    themeUserMessageAvatarSrc: "",               // URL del avatar (opcional)

    // ========================================
    // INPUT DE TEXTO
    // ========================================
    themeTextInputPlaceholder: "Escribe tu pregunta aquí...",  // Placeholder del input
    themeTextInputBackgroundColor: "#ffffff",                  // Color de fondo
    themeTextInputTextColor: "#303235",                        // Color del texto
    themeTextInputSendButtonColor: "#3B81F6",                  // Color del botón de enviar
    themeTextInputMaxChars: 1000,                              // Máximo de caracteres
    themeTextInputAutoFocus: true,                             // Auto-focus al abrir

    // ========================================
    // FOOTER
    // ========================================
    themeFooterText: "Powered by",           // Texto del footer
    themeFooterCompany: "Tu Empresa",        // Nombre de la empresa
    themeFooterCompanyLink: "https://tuempresa.com",  // Link de la empresa
    themeFooterTextColor: "#303235",         // Color del texto

    // ========================================
    // Z-INDEX GENERAL
    // ========================================
    themeZIndex: "10000"  // Z-index base de la ventana de chat
};

// Cargar el script core (NO MODIFICAR)
(function() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@main/ecoflow-core.js';
    script.defer = true;
    document.head.appendChild(script);
})();
