# ECOflow Embed - Sistema Modular de Chatbot

Sistema simplificado para integrar chatbots personalizados en sitios web de clientes.

## 🎯 Objetivo

Permitir que los clientes integren el chatbot con **una sola línea de código**, sin necesidad de configurar múltiples atributos `data-*` en el HTML.

## 📁 Estructura del Repositorio

```
EcoflowEmbed/
├── ecoflow-core.js          # ⚙️ Script base con toda la lógica (NO TOCAR)
├── ecoflow-template.js      # 📝 Plantilla para nuevos clientes
├── ecoflow-sls.js          # 👤 Ejemplo: Cliente SLS configurado
├── index_simple.html        # 🌐 Ejemplo de HTML simplificado
└── README.md               # 📖 Esta documentación
```

## 🚀 Uso para Clientes

### Integración Simple (1 línea)

El cliente solo necesita agregar **UNA LÍNEA** en su HTML:

```html
<script src="https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@main/ecoflow-nombre_cliente.js"></script>
```

**Ejemplo real:**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Mi Sitio Web</title>
  </head>
  <body>
    <h1>Bienvenido a mi sitio</h1>

    <!-- Chatbot - Una sola línea -->
    <script src="https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@main/ecoflow-sls.js"></script>
  </body>
</html>
```

¡Eso es todo! El chatbot se cargará automáticamente con todas las configuraciones del cliente.

## 🛠️ Crear un Nuevo Cliente

### Paso 1: Duplicar la Plantilla

1. Copia el archivo `ecoflow-template.js`
2. Renómbralo como `ecoflow-nombre_cliente.js`
   - Ejemplo: `ecoflow-sls.js`
   - Ejemplo: `ecoflow-hotel-marina.js`

### Paso 2: Configurar el Cliente

Abre el archivo `ecoflow-nombre_cliente.js` y modifica solo estos valores:

```javascript
window.ECOFLOW_CONFIG = {
  // ⚠️ REQUERIDO: ID del flujo de chat de Flowise
  chatflowid: "156a0ea9-c2b4-413e-995f-348a9be512f3",

  // ⚠️ REQUERIDO: URL de la animación Lottie
  lottieAnimationPath:
    "https://mediastrapi.koppi.mx/uploads/Chatbot_Off_v2_01b544fff6.json",

  // Personalización visual
  themeChatWindowTitle: "Nombre del Cliente",
  themeChatWindowWelcomeMessage: "¡Hola! ¿En qué puedo ayudarte?",

  // Colores personalizados
  themeButtonBackgroundColor: "#1b2f55",
  themeUserMessageBackgroundColor: "#1b2f55",
  themeTextInputSendButtonColor: "#1b2f55",

  // ... más configuraciones (ver plantilla completa)
};
```

### Paso 3: Subir al Repositorio

1. Haz commit del nuevo archivo `ecoflow-nombre_cliente.js`
2. Sube los cambios a GitHub:
   ```bash
   git add ecoflow-nombre_cliente.js
   git commit -m "Agregar configuración para [Nombre Cliente]"
   git push origin main
   ```

### Paso 4: Compartir con el Cliente

Envía al cliente esta línea de código:

```html
<script src="https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@main/ecoflow-nombre_cliente.js"></script>
```

## 📋 Configuraciones Disponibles

### Configuración Mínima (Requerida)

```javascript
{
    chatflowid: "tu-chatflow-id",
    lottieAnimationPath: "url-de-tu-animacion.json"
}
```

### Configuraciones Completas

Consulta el archivo `ecoflow-template.js` para ver todas las opciones disponibles:

- **Botón Lottie**: Posición, tamaño, animación
- **Tooltip**: Texto, colores, posición
- **Ventana de Chat**: Título, tamaño, colores
- **Mensajes**: Avatares, colores, estilos
- **Input**: Placeholder, colores, límites
- **Footer**: Texto, enlaces, branding

## 🎨 Ejemplos de Clientes

### Cliente 1: SLS (Ejemplo Real)

```javascript
// ecoflow-sls.js
window.ECOFLOW_CONFIG = {
  chatflowid: "156a0ea9-c2b4-413e-995f-348a9be512f3",
  lottieAnimationPath:
    "https://mediastrapi.koppi.mx/uploads/Chatbot_Off_v2_01b544fff6.json",
  themeChatWindowTitle: "Residences, Yacht & Sail Club",
  themeButtonBackgroundColor: "#1b2f55",
  // ... más configuraciones
};
```

**HTML del cliente:**

```html
<script src="https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@main/ecoflow-sls.js"></script>
```

### Cliente 2: Hotel Ejemplo

```javascript
// ecoflow-hotel-ejemplo.js
window.ECOFLOW_CONFIG = {
  chatflowid: "abc123-hotel-id",
  lottieAnimationPath: "https://example.com/hotel-animation.json",
  themeChatWindowTitle: "Hotel Paradise",
  themeButtonBackgroundColor: "#ff6b6b",
  themeUserMessageBackgroundColor: "#ff6b6b",
};
```

**HTML del cliente:**

```html
<script src="https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@main/ecoflow-hotel-ejemplo.js"></script>
```

## 🔧 Ventajas del Sistema

### Para el Cliente

✅ **Súper simple**: Solo una línea de código  
✅ **Sin configuración**: No necesita entender atributos `data-*`  
✅ **Actualizaciones automáticas**: Los cambios se reflejan sin modificar su HTML  
✅ **Fácil de implementar**: Copiar y pegar

### Para el Desarrollador

✅ **Centralizado**: Toda la lógica en `ecoflow-core.js`  
✅ **Mantenible**: Un solo archivo para actualizar funcionalidades  
✅ **Escalable**: Crear nuevos clientes en minutos  
✅ **Organizado**: Cada cliente tiene su archivo de configuración

## 📦 Proceso de Implementación

```
┌─────────────────────────────────────────────────────┐
│ 1. Cliente solicita chatbot                        │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ 2. Duplicar ecoflow-template.js                    │
│    → ecoflow-nombre_cliente.js                     │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ 3. Configurar valores del cliente:                 │
│    - chatflowid                                     │
│    - lottieAnimationPath                            │
│    - colores, textos, etc.                          │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ 4. Subir archivo a GitHub                          │
│    git add ecoflow-nombre_cliente.js                │
│    git commit -m "Add client config"                │
│    git push origin main                             │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ 5. Compartir línea de código con cliente:          │
│    <script src="https://cdn.jsdelivr.net/..."></script> │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ 6. Cliente la pega en su HTML                      │
│    ¡Listo! 🎉                                       │
└─────────────────────────────────────────────────────┘
```

## 🔄 Actualizaciones

### Actualizar el Core (Afecta a todos los clientes)

Si necesitas agregar funcionalidades o corregir bugs:

1. Modifica `ecoflow-core.js`
2. Haz commit y push
3. **Todos los clientes** se actualizarán automáticamente en su próxima carga

### Actualizar un Cliente Específico

Si un cliente necesita cambios en su configuración:

1. Modifica `ecoflow-nombre_cliente.js`
2. Haz commit y push
3. **Solo ese cliente** verá los cambios

## 🌐 CDN y Caché

El sistema usa **jsDelivr CDN** que:

- ✅ Cachea automáticamente los archivos
- ✅ Distribución global rápida
- ✅ Actualización: espera hasta 24 horas o usa versiones

Para forzar actualización inmediata, usa versión específica:

```html
<script src="https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@{COMMIT_HASH}/ecoflow-cliente.js"></script>
```

## 📝 Checklist para Nuevo Cliente

- [ ] Obtener `chatflowid` de Flowise
- [ ] Obtener URL de animación Lottie
- [ ] Duplicar `ecoflow-template.js` → `ecoflow-nombre_cliente.js`
- [ ] Configurar valores del cliente
- [ ] Personalizar colores (mínimo 3: botón, mensaje usuario, botón enviar)
- [ ] Configurar textos (título, mensaje bienvenida, placeholder)
- [ ] Configurar tooltip (si aplica)
- [ ] Configurar footer (branding)
- [ ] Subir a GitHub (commit + push)
- [ ] Enviar línea de script al cliente
- [ ] Verificar en el sitio del cliente

## 🆘 Troubleshooting

### El chatbot no aparece

1. **Verificar consola del navegador** (F12 → Console)
2. **Errores comunes:**
   - `chatflowid es requerido`: Falta configurar el ID
   - `lottieAnimationPath es requerido`: Falta la URL de la animación
   - `404 Not Found`: El archivo del cliente no existe en GitHub

### El botón no se muestra

- Verificar que `lottieAnimationPath` sea válida
- Verificar que la animación Lottie cargue correctamente
- Revisar z-index si hay conflictos con otros elementos

### Colores no se aplican

- Verificar nombres de propiedades en la configuración
- Usar valores hexadecimales: `"#1b2f55"`
- Verificar sintaxis JavaScript (comas, comillas)

## 📞 Soporte

Para preguntas o problemas:

- Revisa este README
- Consulta `ecoflow-template.js` para opciones completas
- Revisa ejemplos en `ecoflow-sls.js`

## 📄 Licencia

© 2026 Koppi - Todos los derechos reservados

---

**Creado por:** Koppi  
**Versión:** 2.0  
**Última actualización:** Enero 2026
