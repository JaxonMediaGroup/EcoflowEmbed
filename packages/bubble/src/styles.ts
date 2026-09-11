/**
 * Hoja de estilos del widget. Se inyecta en el Shadow Root, así que no puede
 * filtrar estilos a la página anfitriona ni recibirlos de ella (salvo las
 * propiedades heredables de fuente/color que definimos como variables).
 * Los `part` expuestos permiten overrides puntuales desde el sitio:
 *   ecoflow-chat::part(button) { ... }
 */
export const WIDGET_CSS = `
*, *::before, *::after { box-sizing: border-box; }

.ecoflow-root {
  all: initial;
  font-family: var(--ec-font);
  font-size: var(--ec-fs);
  color: var(--ec-c-bot);
}

/* ============ Botón lanzador ============ */
.ecoflow-button {
  position: fixed;
  z-index: var(--ec-z-button);
  width: var(--ec-button-w);
  height: var(--ec-button-h);
  border: none;
  padding: 0;
  margin: 0;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.ecoflow-button:focus-visible {
  outline: 2px solid var(--ec-c-send);
  outline-offset: 3px;
  border-radius: 12px;
}
.ecoflow-button--shape {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--ec-c-send);
  color: #fff;
  font-size: calc(var(--ec-fs) * 1.4);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  transition: transform 0.15s ease;
}
.ecoflow-button--shape:hover { transform: scale(1.06); }
.ecoflow-button--shape:active { transform: scale(0.97); }
.ecoflow-button svg { width: 55%; height: 55%; }
.ecoflow-button--media, .ecoflow-button--media > * { width: 100%; height: 100%; }

/* ============ Tooltip ============ */
.ecoflow-tooltip {
  position: absolute;
  bottom: calc(100% + var(--ec-tooltip-offset));
  white-space: nowrap;
  background: var(--ec-tooltip-bg);
  color: var(--ec-tooltip-c);
  font-size: var(--ec-tooltip-fs);
  padding: var(--ec-tooltip-pad);
  border-radius: var(--ec-tooltip-radius);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease 0.1s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}
.ecoflow-button:hover .ecoflow-tooltip,
.ecoflow-button:focus-visible .ecoflow-tooltip { opacity: 1; }

/* ============ Ventana ============ */
.ecoflow-window {
  position: fixed;
  z-index: var(--ec-z-window);
  display: flex;
  flex-direction: column;
  background: var(--ec-bg-window);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.28), 0 2px 8px rgba(0, 0, 0, 0.12);
  animation: ecoflow-pop 0.18s ease-out;
}
@keyframes ecoflow-pop {
  from { opacity: 0; transform: translateY(10px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.ecoflow-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: var(--ec-bg-header);
  color: #fff;
  font-weight: 600;
  flex-shrink: 0;
}
.ecoflow-header-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ecoflow-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #fff;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}
.ecoflow-close:hover { background: rgba(255, 255, 255, 0.18); }
.ecoflow-close svg { width: 16px; height: 16px; }

/* Botones de acción del header (reset comparte base con close) */
.ecoflow-header-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #fff;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}
.ecoflow-header-btn:hover { background: rgba(255, 255, 255, 0.18); }
.ecoflow-header-btn svg { width: 15px; height: 15px; }

/* ============ Mensajes ============ */
.ecoflow-messages {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scrollbar-width: thin;
  scrollbar-color: var(--ec-c-send) var(--ec-bg-window);
}
.ecoflow-messages::-webkit-scrollbar { width: 6px; }
.ecoflow-messages::-webkit-scrollbar-track { background: var(--ec-bg-window); }
.ecoflow-messages::-webkit-scrollbar-thumb {
  background: var(--ec-c-send);
  border: 1px solid var(--ec-bg-window);
  border-radius: 999px;
}
.ecoflow-messages::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--ec-c-send) 82%, black);
}

.ecoflow-msg { display: flex; align-items: flex-end; gap: 8px; }
.ecoflow-msg--user { justify-content: flex-end; }
.ecoflow-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  background: #d8dce6;
}
.ecoflow-bubble {
  max-width: 82%;
  padding: 10px 13px;
  border-radius: 14px;
  line-height: 1.45;
  overflow-wrap: break-word;
  white-space: normal;
}
.ecoflow-bubble--bot {
  background: var(--ec-bg-bot);
  color: var(--ec-c-bot);
  border-bottom-left-radius: 4px;
}
.ecoflow-bubble--user {
  background: var(--ec-bg-user);
  color: var(--ec-c-user);
  border-bottom-right-radius: 4px;
}
.ecoflow-bubble--error {
  background: #fdecea;
  color: #b3261e;
  border-bottom-left-radius: 4px;
}
.ecoflow-msg--agent {
  justify-content: center;
}
.ecoflow-agent-pill {
  font-size: calc(var(--ec-fs) * 0.78);
  color: var(--ec-c-footer);
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 3px 10px;
}

/* Indicador de escritura */
.ecoflow-typing { display: inline-flex; gap: 4px; padding: 12px 14px; }
.ecoflow-typing span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #a7adba;
  animation: ecoflow-bounce 1.2s infinite ease-in-out;
}
.ecoflow-typing span:nth-child(2) { animation-delay: 0.15s; }
.ecoflow-typing span:nth-child(3) { animation-delay: 0.3s; }
@keyframes ecoflow-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-5px); opacity: 1; }
}

/* ============ Markdown dentro de burbujas ============ */
.ecoflow-markdown > *:first-child { margin-top: 0; }
.ecoflow-markdown > *:last-child { margin-bottom: 0; }
.ecoflow-markdown p { margin: 0 0 8px; }
.ecoflow-markdown ul, .ecoflow-markdown ol { margin: 4px 0 8px; padding-left: 18px; }
.ecoflow-markdown li { margin: 2px 0; }
.ecoflow-markdown a { color: inherit; text-decoration: underline; }
.ecoflow-markdown code {
  background: rgba(0, 0, 0, 0.07);
  border-radius: 4px;
  padding: 1px 5px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.92em;
}
.ecoflow-markdown pre {
  background: rgba(0, 0, 0, 0.07);
  border-radius: 8px;
  padding: 10px;
  overflow-x: auto;
  margin: 4px 0 8px;
}
.ecoflow-markdown pre code { background: none; padding: 0; }
.ecoflow-markdown blockquote {
  margin: 4px 0 8px;
  padding-left: 10px;
  border-left: 3px solid rgba(0, 0, 0, 0.15);
}
.ecoflow-markdown table { border-collapse: collapse; margin: 4px 0 8px; max-width: 100%; display: block; overflow-x: auto; }
.ecoflow-markdown th, .ecoflow-markdown td { border: 1px solid rgba(0,0,0,0.15); padding: 4px 8px; }
.ecoflow-markdown img { max-width: 100%; border-radius: 8px; }

/* ============ Sugerencias (follow-up prompts) ============ */
.ecoflow-chips { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 14px 10px; }
.ecoflow-chip {
  border: 1px solid var(--ec-c-send);
  color: var(--ec-c-send);
  background: transparent;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: calc(var(--ec-fs) * 0.88);
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s ease;
}
.ecoflow-chip:hover { background: color-mix(in srgb, var(--ec-c-send) 10%, transparent); }

/* ============ Adjuntos en mensajes ============ */
.ecoflow-attachments { display: flex; flex-direction: column; gap: 6px; }
.ecoflow-attachment-img {
  max-width: 200px;
  max-height: 160px;
  border-radius: 10px;
  object-fit: cover;
  display: block;
}
.ecoflow-attachment-audio {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: calc(var(--ec-fs) * 0.85);
  opacity: 0.85;
}
.ecoflow-attachment-audio svg { width: 14px; height: 14px; }

/* ============ Input ============ */
.ecoflow-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
  background: var(--ec-bg-input);
  flex-wrap: wrap;
}
.ecoflow-preview {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}
.ecoflow-preview img {
  height: 64px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.ecoflow-preview-remove {
  position: absolute;
  left: 54px;
  top: -6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  cursor: pointer;
  padding: 0;
}
.ecoflow-preview-remove svg { width: 11px; height: 11px; }

/* Botones cuadrados de la barra de input (imagen, micrófono) */
.ecoflow-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--ec-c-send);
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition: background 0.15s ease;
}
.ecoflow-icon-btn:hover:not(:disabled) { background: rgba(128, 128, 128, 0.18); }
.ecoflow-icon-btn:disabled { opacity: 0.4; cursor: default; }
.ecoflow-icon-btn svg { width: 18px; height: 18px; }
.ecoflow-icon-btn--recording {
  background: #e5484d;
  color: #fff;
  animation: ecoflow-rec-pulse 1.2s infinite ease-in-out;
}
@keyframes ecoflow-rec-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(229, 72, 77, 0.5); }
  50% { box-shadow: 0 0 0 8px rgba(229, 72, 77, 0); }
}
.ecoflow-input {
  flex: 1;
  min-width: 0;
  border: 1px solid rgba(0, 0, 0, 0.14);
  border-radius: 20px;
  padding: 9px 14px;
  font: inherit;
  color: var(--ec-c-input);
  background: var(--ec-bg-input);
  outline: none;
}
.ecoflow-input:focus { border-color: var(--ec-c-send); }
.ecoflow-input:disabled { opacity: 0.6; }
.ecoflow-send {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background: var(--ec-c-send);
  color: #fff;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition: transform 0.12s ease;
}
.ecoflow-send:hover:not(:disabled) { transform: scale(1.08); }
.ecoflow-send:disabled { opacity: 0.45; cursor: default; }
.ecoflow-send svg { width: 17px; height: 17px; }

/* ============ Footer ============ */
.ecoflow-footer {
  text-align: center;
  font-size: 11px;
  padding: 6px 8px;
  color: var(--ec-c-footer);
  flex-shrink: 0;
}
.ecoflow-footer a { color: inherit; text-decoration: none; font-weight: 600; }
.ecoflow-footer a:hover { text-decoration: underline; }

/* ============ Tema liquid glass ============ */
.ecoflow-window--glass {
  background: color-mix(in srgb, var(--ec-glass-tint) 26%, var(--ec-bg-window));
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
.ecoflow-window--glass .ecoflow-header {
  background: color-mix(in srgb, var(--ec-bg-header) 55%, transparent);
  -webkit-backdrop-filter: blur(24px);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}
.ecoflow-window--glass .ecoflow-input-row {
  background: color-mix(in srgb, var(--ec-glass-tint) 12%, var(--ec-bg-input));
  border-top-color: rgba(255, 255, 255, 0.12);
}
.ecoflow-window--glass .ecoflow-input { border-color: rgba(255, 255, 255, 0.22); }
.ecoflow-window--glass .ecoflow-agent-pill { background: rgba(255, 255, 255, 0.1); }
.ecoflow-window--glass .ecoflow-markdown code { background: rgba(255, 255, 255, 0.14); }
.ecoflow-window--glass .ecoflow-markdown pre { background: rgba(255, 255, 255, 0.1); }
.ecoflow-window--glass .ecoflow-bubble--bot {
  background: var(--ec-glass-bot-bg, color-mix(in srgb, var(--ec-glass-tint) 52%, black));
  color: var(--ec-glass-bot-color, var(--ec-c-bot));
}
.ecoflow-window--glass .ecoflow-bubble--error { background: rgba(179, 38, 30, 0.28); color: #ffb4ab; }
.ecoflow-window--glass .ecoflow-messages {
  background: var(--ec-glass-messages-bg, transparent);
  scrollbar-color: color-mix(in srgb, var(--ec-c-send) 72%, white) transparent;
}
.ecoflow-window--glass .ecoflow-messages::-webkit-scrollbar-track { background: transparent; }
.ecoflow-window--glass .ecoflow-messages::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--ec-c-send) 72%, white);
  border-color: rgba(255, 255, 255, 0.16);
}

@media (prefers-reduced-motion: reduce) {
  .ecoflow-window, .ecoflow-button--shape, .ecoflow-send { animation: none; transition: none; }
  .ecoflow-typing span { animation: none; }
}
`
