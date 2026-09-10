# @koppi/ecoflow-bubble

Bubble chat embebible para **ECOflow** (fork propio de Flowise). Un solo código
fuente, dos artefactos que se actualizan juntos en cada build:

| Artefacto | Uso |
|---|---|
| `dist/ecoflow-bubble.js` (IIFE) | `<script src>` + data-attributes en HTML plano |
| `dist/ecoflow-bubble.mjs` (ESM) | `import` en cualquier bundler |
| `dist/ecoflow-bubble-react.mjs` | `<EcoflowChat />` para React 17/18/19 |

Define el web component **`<ecoflow-chat>`** con Shadow DOM (estilos aislados
del sitio anfitrión). El botón lanzador y la ventana son parte del mismo
componente: la ventana se ancla al botón sola, a cualquier resolución, sin
scripts de reposicionamiento externos.

## HTML plano (drop-in replacement)

```html
<script
    src="https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@main/packages/bubble/dist/ecoflow-bubble.js"
    data-chatflowid="f98edc6a-940e-40d4-88b7-986e8813965a"
    data-api-host="https://ecoflow.koppi.mx"
    data-lottie-animation-path="https://mediastrapi.koppi.mx/uploads/Chatbot_Off_v2_01b544fff6.json"
    data-button-side="right"
    data-button-bottom="10vh"
    data-button-offset-x="20px"
    data-window-title="Terralago"
    data-window-welcome-message="¡Hola! ¿En qué puedo ayudarte?"
    defer
></script>
```

También funciona la configuración por objeto (como el `ecoflow-template.js`
actual) declarando `window.ECOFLOW_CONFIG = { ... }` **antes** del script.

### Compatibilidad con sitios existentes

Los data-attributes legacy del embed anterior se siguen aceptando sin cambios
(`data-theme-Button-Background-Color`, `data-theme-chat-Window-Title`,
`data-lottie-button-bottom`, etc., con cualquier mezcla de mayúsculas).
Migrar un sitio = cambiar el `src` del script; nada más.

## React

```bash
npm install @koppi/ecoflow-bubble
```

```tsx
import { EcoflowChat } from '@koppi/ecoflow-bubble/react'

export function Layout() {
    return (
        <EcoflowChat
            onReady={(el) => console.log('listo', el)}
            config={{
                chatflowId: 'f98edc6a-940e-40d4-88b7-986e8813965a',
                apiHost: 'https://ecoflow.koppi.mx',
                buttonType: 'icon',
                buttonSide: 'left',
                windowTitle: 'Asistente'
            }}
        />
    )
}
```

## Uso declarativo / API imperativa

```html
<ecoflow-chat chatflow-id="..." api-host="..." button-side="left"></ecoflow-chat>
```

```js
const chat = document.querySelector('ecoflow-chat')
chat.open()
chat.close()
chat.toggle()
chat.sendMessage('Hola')
```

## Configuración

Precedencia: propiedad JS `config` > atributos del elemento > `window.ECOFLOW_CONFIG` > defaults.

### Conexión

| Clave | Default | Descripción |
|---|---|---|
| `chatflowId` | — | **Requerido.** ID del chatflow |
| `apiHost` | — | **Requerido.** URL base del servidor ECOflow |

### Botón (`button-*`)

| Clave | Default | Descripción |
|---|---|---|
| `buttonType` | `icon` | `lottie` \| `image` \| `icon` \| `text` |
| `buttonSide` | `right` | `left` \| `right` — mueve botón **y** ventana juntos |
| `buttonBottom` | `20px` | Distancia al borde inferior (acepta `vh`, `%`, px) |
| `buttonOffsetX` | `20px` | Distancia al borde del lado elegido |
| `buttonWidth/Height` | `60px` | Tamaño del botón |
| `buttonBackgroundColor` | `#1b2f55` | Fondo (solo `icon`/`text`); también tiñe el header |
| `buttonText` | `💬` | Contenido para `buttonType: text` |
| `buttonImageSrc` | — | Imagen para `buttonType: image` |
| `buttonAriaLabel` | `Abrir chat` | Accesibilidad |

Lottie: `lottieAnimationPath` activa el botón de animación automáticamente
(mientras no haya `buttonImageSrc`). `lottieLoop` y `lottieAutoplay` (true).

Tooltip: `tooltipEnabled`, `tooltipText`, `tooltipBackgroundColor`,
`tooltipTextColor`, `tooltipFontSize`, `tooltipPadding`,
`tooltipBorderRadius`, `tooltipPositionOffset` (px).

### Ventana (`window-*`)

| Clave | Default | Descripción |
|---|---|---|
| `windowTitle` | `Asistente Virtual` | Título del header |
| `windowWelcomeMessage` | — | Primer mensaje del bot al abrir |
| `windowWidth/Height` | `400`/`500` | Deseados; se ajustan al espacio disponible |
| `windowErrorMessage` | *(texto por defecto)* | Mensaje ante error de red/servidor |
| `windowShowAgentMessages` | `false` | Mostrar actividad del agente (tools) como estados |
| `windowBackgroundColor` | `#ffffff` | Fondo de la ventana |
| `windowFontSize` | `15` | Tamaño base del texto (px) |
| `windowHeaderBackgroundColor` | = botón | Color del header |
| `windowZIndex` | `10000` | z-index de la ventana (`buttonZIndex`: botón) |

La ventana **abre siempre encima del botón**, alineada al borde del lado
elegido, con clamp de tamaño en móvil (<=480px). No necesita ajustes por sitio.

### Mensajes

- Bot: `botMessageBackgroundColor`, `botMessageTextColor`, `botMessageShowAvatar`, `botMessageAvatarSrc`
- Usuario: `userMessageBackgroundColor`, `userMessageTextColor`, `userMessageShowAvatar`, `userMessageAvatarSrc`
- Las respuestas del bot se renderizan como markdown **sanitizado** (DOMPurify, links con `rel="noopener"`).

### Input y footer

- `textInputPlaceholder`, `textInputBackgroundColor`, `textInputTextColor`, `textInputSendButtonColor`, `textInputMaxChars` (1000), `textInputAutoFocus` (true)
- `footerText` ("Powered by"), `footerCompany`, `footerCompanyLink`, `footerTextColor`

### Overrides CSS desde el sitio

El Shadow DOM expone `::part()`:

```css
ecoflow-chat::part(window) { border-radius: 8px; }
ecoflow-chat::part(button) { filter: drop-shadow(0 4px 8px rgba(0,0,0,.3)); }
```

## Desarrollo

```bash
cd packages/bubble
npm install
npm run build   # tsc + vite (IIFE + ESM + React wrapper + tipos)
npm test        # vitest: mapeo de atributos, parser SSE, posicionamiento
```

Demos locales (requieren build previo):

```bash
npx serve packages/bubble/demo
# right.html (lottie, derecha) · left.html (imagen, izquierda) · react.html
```

### Publicación

Los artefactos de `dist/` se versionan en el repo y se sirven por jsDelivr
(`gh/JaxonMediaGroup/EcoflowEmbed@main/packages/bubble/dist/...`), igual que
los `ecoflow-*.min.js` actuales. Cada commit a main actualiza el CDN.

### Seguridad

El widget habla directo con el endpoint público de predicción
(`POST /api/v1/prediction/{chatflowId}`), sin credenciales en el cliente.
El acceso se controla en el servidor del fork (CORS por dominio). Nunca
agregar keys al widget ni a los data-attributes.
