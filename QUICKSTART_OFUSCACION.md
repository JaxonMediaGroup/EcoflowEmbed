# 🔒 Sistema de Ofuscación - Inicio Rápido

## ✅ ¿Qué hemos hecho?

1. ✅ Instalado `javascript-obfuscator`
2. ✅ Creado script de ofuscación (`build.js`)
3. ✅ Ofuscado `ecoflow-sls.js` → `ecoflow-sls.min.js`
4. ✅ Actualizado HTML para usar versión ofuscada

## 🚀 Comandos Rápidos

### Ofuscar archivo actual (SLS)
```bash
npm run obfuscate
```

### Ofuscar archivo específico
```bash
node build.js ecoflow-nuevo-cliente.js
```

### Ofuscar todos los clientes
```bash
npm run obfuscate:all
```

## 📝 Workflow Diario

### Editar configuración de cliente:

```bash
# 1. Editar archivo original
code ecoflow-sls.js

# 2. Ofuscar
npm run obfuscate

# 3. Verificar que funciona
start test.html

# 4. Subir SOLO el ofuscado
git add ecoflow-sls.min.js
git commit -m "Update: SLS config"
git push
```

### Crear nuevo cliente:

```bash
# 1. Copiar template
cp ecoflow-template.js ecoflow-hotel.js

# 2. Editar
code ecoflow-hotel.js

# 3. Ofuscar
node build.js ecoflow-hotel.js

# 4. Subir
git add ecoflow-hotel.min.js
git commit -m "Add: Hotel cliente"
git push
```

## 🔐 Protección Actual

### Cliente ve en el HTML:
```html
<script src="https://cdn.jsdelivr.net/gh/.../ecoflow-sls.min.js"></script>
```

### Si abre el archivo, ve:
```javascript
var _0x4f2a=['\x77\x69\x6e\x64\x6f\x77','\x45\x43\x4f'];
(function(_0x2d8f05,_0x4b81bb){var _0x4d74cb=function...
// Código ofuscado - muy difícil de leer
```

### Protección real:
- ✅ Código ofuscado (difícil de leer)
- ✅ Validación de URL en ecoflow (solo dominios autorizados)
- ✅ Aunque copien el chatflowid, NO funcionará en otro dominio

## 📁 Estructura de Archivos

```
ecoflow-sls.js          ← Original (editar aquí)
ecoflow-sls.min.js      ← Ofuscado (subir a GitHub)
```

## 🎯 Para Subir a GitHub

```bash
# Subir SOLO archivos ofuscados
git add *.min.js
git add ecoflow-core.js
git add ecoflow-template.js
git add *.html
git add *.md
git commit -m "Add: Sistema con ofuscación"
git push
```

## ⚠️ NO Subir a GitHub

```bash
# Archivos originales sin ofuscar (opcional)
# Si quieres más seguridad, agregar a .gitignore:

# ecoflow-sls.js
# ecoflow-*.js
# !ecoflow-core.js
# !ecoflow-template.js
# !ecoflow-*.min.js
```

## 🧪 Testing

### Local (antes de subir):
```bash
# Abrir test.html
start test.html

# Verificar:
# ✅ Botón Lottie aparece
# ✅ Tooltip funciona
# ✅ Chat abre
# ✅ Sin errores en consola (F12)
```

### En producción (después de subir):
```bash
# Esperar 5-15 min para jsDelivr
# Abrir sitio del cliente
# Verificar funcionamiento
```

## 📊 Ventajas

| Aspecto | Sin Ofuscar | Con Ofuscar |
|---------|-------------|-------------|
| chatflowid visible | ✅ Sí, fácil | ❌ Muy difícil |
| Cliente modifica config | ✅ Sí, fácil | ❌ Muy difícil |
| Alguien copia ID | ⚠️ Sí, funcional | ⚠️ Sí, pero bloqueado por URL |
| Seguridad general | ⭐⭐ | ⭐⭐⭐⭐ |

## 🎉 Resumen

**Antes:**
```javascript
// En ecoflow-sls.js (visible)
chatflowid: "156a0ea9-c2b4-413e-995f-348a9be512f3"
```

**Después:**
```javascript
// En ecoflow-sls.min.js (ofuscado)
var _0x4f2a=['\x31\x35\x36\x61\x30\x65\x61\x39']; // ...
```

**Resultado:**
- 🔒 Código protegido
- 🛡️ Validación de URL activa
- ✅ Cliente solo ve código ofuscado
- ✅ Fácil de mantener (editar original, ofuscar, subir)

---

## 📚 Más Info

- Ver [OFUSCACION.md](OFUSCACION.md) para guía completa
- Ver [README.md](README.md) para documentación general

---

© 2026 Koppi - Sistema ECOflow con Ofuscación
