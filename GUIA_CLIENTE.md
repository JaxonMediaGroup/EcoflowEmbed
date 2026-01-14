# 🚀 Guía Rápida - Integración del Chatbot

## Para el Cliente

### Paso 1: Copiar el Código

Copia esta línea de código:

```html
<script src="https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@main/ecoflow-TU_NOMBRE_CLIENTE.js"></script>
```

### Paso 2: Pegar en tu HTML

Pega el código **antes de la etiqueta de cierre `</body>`** en tu archivo HTML:

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Mi Sitio Web</title>
  </head>
  <body>
    <!-- Tu contenido aquí -->
    <h1>Bienvenido</h1>
    <p>Contenido de tu sitio...</p>

    <!-- 👇 PEGA EL SCRIPT AQUÍ (antes del </body>) -->
    <script src="https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@main/ecoflow-TU_NOMBRE_CLIENTE.js"></script>
  </body>
</html>
```

### ¡Listo! 🎉

El chatbot aparecerá automáticamente en la esquina inferior derecha de tu sitio.

---

## Preguntas Frecuentes

### ¿Dónde pego el código?

- **Antes de `</body>`** en todas las páginas donde quieras el chatbot
- Si usas WordPress: en el footer o usando un plugin de scripts
- Si usas un constructor de sitios: en la sección de "Scripts personalizados" o "Footer"

### ¿Funciona en todas las páginas?

Sí, pero debes agregar el script en cada página donde quieras que aparezca el chatbot.

**Recomendación:** Si tienes un archivo de plantilla común (header.php, footer.php, etc.), agrégalo ahí una sola vez.

### ¿Puedo personalizar la posición del botón?

Sí, contacta a tu proveedor para ajustar:

- Posición (derecha, izquierda, arriba, abajo)
- Tamaño del botón
- Colores
- Textos
- Y más...

### ¿Funciona en móviles?

Sí, el chatbot es totalmente responsive y se adapta automáticamente a dispositivos móviles.

### ¿Afecta la velocidad de mi sitio?

No, el script se carga de forma asíncrona y no bloquea la carga de tu página.

---

## Ejemplos de Integración

### WordPress (Theme Footer)

Edita `footer.php` de tu theme y agrega antes de `</body>`:

```php
<!-- Chatbot -->
<script src="https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@main/ecoflow-TU_NOMBRE_CLIENTE.js"></script>
<?php wp_footer(); ?>
</body>
</html>
```

### HTML Estático

```html
<!DOCTYPE html>
<html>
  <body>
    <!-- Contenido -->

    <script src="https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@main/ecoflow-TU_NOMBRE_CLIENTE.js"></script>
  </body>
</html>
```

### React / Next.js

En `_app.js` o en tu componente principal:

```jsx
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@main/ecoflow-TU_NOMBRE_CLIENTE.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <Component {...pageProps} />;
}
```

### Shopify

1. Ve a **Online Store → Themes**
2. Click en **Actions → Edit code**
3. Abre `theme.liquid`
4. Busca `</body>` y pega el script antes de esa etiqueta

```liquid
<!-- Chatbot -->
<script src="https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@main/ecoflow-TU_NOMBRE_CLIENTE.js"></script>
</body>
```

---

## Soporte

Si tienes problemas o preguntas, contacta a tu proveedor de servicios.

---

**Powered by Koppi** 🚀
