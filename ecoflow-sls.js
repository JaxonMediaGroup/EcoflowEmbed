// ECOflow - Configuración para SLS (Residences, Yacht & Sail Club)
// Este archivo contiene SOLO las configuraciones específicas del cliente

window.ECOFLOW_CONFIG = {
    // Configuración principal
    chatflowid: "156a0ea9-c2b4-413e-995f-348a9be512f3",
    apiHost: "https://ecoflow.koppi.mx",

    // Lottie Animation
    lottieAnimationPath: "https://mediastrapi.koppi.mx/uploads/Chatbot_Off_v2_01b544fff6.json",
    lottieButtonBottom: "45vh",
    lottieButtonRight: "1px",
    lottieButtonWidth: "80px",
    lottieButtonHeight: "80px",
    lottieButtonZIndex: "10001",

    // Lottie Tooltip
    lottieTooltipEnabled: true,
    lottieTooltipText: "!Pregúntame cualquier cosa!",
    lottieTooltipBackgroundColor: "#ffffff",
    lottieTooltipTextColor: "#000000",
    lottieTooltipFontSize: "18px",
    lottieTooltipPadding: "6px 12px",
    lottieTooltipBorderRadius: "10px",
    lottieTooltipPositionOffset: 0,
    lottieTooltipZIndexOffset: 0,

    // Theme - Botón
    themeButtonBackgroundColor: "#1b2f55",
    themeButtonRight: 10,
    themeButtonBottom: 10,
    themeButtonSize: 0.1,
    themeButtonZIndex: "10001",

    // Theme - Ventana de Chat
    themeChatWindowTitle: "Residences, Yacht & Sail Club",
    themeChatWindowWelcomeMessage: "¡Hola!\nPuedes preguntarme lo que necesites: información sobre nuestros espacios, características, ubicación o cualquier otra duda que tengas.\nEstoy aquí para asistirte y hacer tu experiencia más sencilla.",
    themeChatWindowHeight: 500,
    themeChatWindowWidth: 400,
    themeChatWindowShowAgentMessages: false,
    themeChatWindowBackgroundColor: "rgba(255, 255, 255, 0.05)",

    // Theme - Mensajes del Bot
    themeBotMessageBackgroundColor: "#f7f8ff",
    themeBotMessageTextColor: "#ffffff",
    themeBotMessageShowAvatar: false,

    // Theme - Mensajes del Usuario
    themeUserMessageBackgroundColor: "#1b2f55",
    themeUserMessageTextColor: "#ffffff",
    themeUserMessageShowAvatar: true,
    themeUserMessageAvatarSrc: "https://mediastrapi.koppi.mx/uploads/user_3296_76696dc10f.svg",

    // Theme - Input de Texto
    themeTextInputPlaceholder: "Haz tu pregunta aquí",
    themeTextInputSendButtonColor: "#1b2f55",
    themeTextInputTextColor: "#ffffff",

    // Theme - Footer
    themeFooterText: "POWERED BY",
    themeFooterCompany: "koppi",
    themeFooterCompanyLink: "https://koppi.mx",
    themeFooterTextColor: "#ffffff",

    // Theme - Z-Index
    themeZIndex: "10000"
};

// Cargar el script core (VERSION LOCAL PARA TESTING)
(function() {
    const script = document.createElement('script');
    // script.src = 'https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@main/ecoflow-core.js';
    script.src = 'ecoflow-core.js'; // Usar versión local
    script.defer = true;
    document.head.appendChild(script);
})();
