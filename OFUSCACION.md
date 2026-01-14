# 🔒 Guía de Ofuscación - ECOflow Embed

## 🎯 Objetivo

Ofuscar los archivos de configuración de clientes para que el `chatflowid` y otras configuraciones no sean fácilmente visibles en el repositorio público.

## 📦 Instalación

### 1. Instalar dependencias

```bash
npm install
```

Esto instalará `javascript-obfuscator` necesario para ofuscar el código.

## 🚀 Uso

### Ofuscar todos los archivos de clientes

```bash
npm run obfuscate
```

O manualmente:

```bash
node build.js
```

Esto ofuscará automáticamente todos los archivos `ecoflow-*.js` (excepto `ecoflow-core.js` y `ecoflow-template.js`)

### Ofuscar archivos específicos

```bash
node build.js ecoflow-sls.js
node build.js ecoflow-sls.js ecoflow-hotel.js
```

### Ofuscar todos explícitamente

```bash
npm run obfuscate:all
```

O:

```bash
node build.js --all
```

## 📁 Estructura de Archivos

### Antes de ofuscar:

```
ecoflow-sls.js          ← Archivo original (legible)
```

### Después de ofuscar:

```
ecoflow-sls.js          ← Archivo original (mantener para edición)
ecoflow-sls.min.js      ← Archivo ofuscado (subir a GitHub)
```

## 🔄 Workflow Recomendado

### Para editar configuración de un cliente:

```bash
# 1. Editar archivo original
vim ecoflow-sls.js

# 2. Ofuscar
npm run obfuscate

# 3. Subir SOLO el archivo ofuscado
git add ecoflow-sls.min.js
git commit -m "Update: SLS config"
git push origin main
```

### Para crear nuevo cliente:

```bash
# 1. Duplicar template
cp ecoflow-template.js ecoflow-nuevo-cliente.js

# 2. Editar configuración
vim ecoflow-nuevo-cliente.js

# 3. Ofuscar
node build.js ecoflow-nuevo-cliente.js

# 4. Subir archivo ofuscado
git add ecoflow-nuevo-cliente.min.js
git commit -m "Add: Nuevo Cliente"
git push origin main

# 5. Cliente usa la versión ofuscada
# <script src="https://cdn.jsdelivr.net/gh/.../ecoflow-nuevo-cliente.min.js"></script>
```

## 🔐 Estrategia de Seguridad

### Archivos que DEBEN estar en el repo:

- ✅ `ecoflow-core.js` (lógica, puede ser público)
- ✅ `ecoflow-template.js` (template, puede ser público)
- ✅ `ecoflow-*.min.js` (ofuscados, seguros)

### Archivos que pueden estar OCULTOS:

- ⚠️ `ecoflow-*.js` (originales sin ofuscar)
  - Opción A: Mantenerlos localmente, NO subirlos a GitHub
  - Opción B: Subirlos a un repo privado separado
  - Opción C: Subirlos pero .gitignore los protege

## 🛡️ Niveles de Protección

### Nivel 1: Ofuscación Básica (Actual)

```bash
npm run obfuscate
```

- ✅ Dificulta lectura del código
- ✅ Oculta chatflowid a simple vista
- ⚠️ Puede ser de-ofuscado con esfuerzo

### Nivel 2: Ofuscación + No subir originales

```bash
# En .gitignore agregar:
ecoflow-sls.js
ecoflow-*.js
!ecoflow-core.js
!ecoflow-template.js
!ecoflow-*.min.js
```

- ✅ Originales nunca están en GitHub
- ✅ Solo archivos ofuscados públicos
- ✅ Más seguro

### Nivel 3: Ofuscación + Validación de URL (Recomendado)

Ya lo tienes en ecoflow! 🎉

- ✅ Ofuscación oculta el código
- ✅ Validación de URL previene uso no autorizado
- ✅ Aunque copien el chatflowid, no funcionará en otro dominio

## 📊 Comparación

### Archivo Original (ecoflow-sls.js):

```javascript
window.ECOFLOW_CONFIG = {
  chatflowid: "156a0ea9-c2b4-413e-995f-348a9be512f3",
  apiHost: "https://ecoflow.koppi.mx",
  lottieAnimationPath:
    "https://mediastrapi.koppi.mx/uploads/Chatbot_Off_v2_01b544fff6.json",
  themeButtonBackgroundColor: "#1b2f55",
};
```

**Fácilmente legible** ❌

### Archivo Ofuscado (ecoflow-sls.min.js):

```javascript
var _0x4f2a = [
  "\x77\x69\x6e\x64\x6f\x77",
  "\x45\x43\x4f\x46\x4c\x4f\x57\x5f\x43\x4f\x4e\x46\x49\x47",
];
(function (_0x2d8f05, _0x4b81bb) {
  var _0x4d74cb = function (_0x32719f) {
    while (--_0x32719f) {
      _0x2d8f05["push"](_0x2d8f05["shift"]());
    }
  };
  _0x4d74cb(++_0x4b81bb);
})(_0x4f2a, 0x1f4);
var _0xaf69 = function (_0x2d8f05, _0x4b81bb) {
  _0x2d8f05 = _0x2d8f05 - 0x0;
  var _0x4d74cb = _0x4f2a[_0x2d8f05];
  return _0x4d74cb;
};
window[_0xaf69("0x1")] = {
  chatflowid: _0xaf69("0x0"),
  apiHost: _0xaf69("0x2"),
};
```

**Muy difícil de leer** ✅

## 🎨 Cliente Final

### HTML del cliente:

```html
<!-- Usar archivo ofuscado (.min.js) -->
<script src="https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@main/ecoflow-sls.min.js"></script>
```

## 🔍 Verificación

### Verificar que el archivo ofuscado funciona:

```bash
# 1. Abrir test.html y modificar el script src
# Cambiar de: ecoflow-sls.js
# A: ecoflow-sls.min.js

# 2. Abrir en navegador
start test.html

# 3. Verificar que todo funciona igual
```

## 📋 Checklist de Producción

Antes de subir a producción:

- [ ] Archivo original editado (ecoflow-cliente.js)
- [ ] Archivo ofuscado generado (npm run obfuscate)
- [ ] Archivo ofuscado probado localmente
- [ ] Solo .min.js agregado a git
- [ ] Push a GitHub exitoso
- [ ] jsDelivr actualizado (5-15 min)
- [ ] Cliente prueba en su sitio
- [ ] Sin errores en consola
- [ ] Validación de URL funcionando

## 🆘 Troubleshooting

### El archivo ofuscado no funciona

**Posibles causas:**

1. Error de sintaxis en el original
2. Ofuscación muy agresiva

**Solución:**

```bash
# Reducir nivel de ofuscación en build.js
# Cambiar algunos valores de true a false
# Re-ofuscar
npm run obfuscate
```

### npm install falla

**Solución:**

```bash
# Limpiar cache
npm cache clean --force

# Reinstalar
rm -rf node_modules package-lock.json
npm install
```

### No se genera el archivo .min.js

**Verificar:**

```bash
# 1. Node instalado
node --version

# 2. npm instalado
npm --version

# 3. Dependencias instaladas
ls node_modules/javascript-obfuscator

# 4. Ejecutar con más detalles
node build.js --all
```

## 💡 Tips

1. **Mantén los originales seguros:**

   - Usa un repo privado para originales
   - O mantenerlos solo localmente
   - Haz backups regulares

2. **Documenta cambios:**

   - Anota qué cliente y qué cambios en cada commit
   - Facilita rastrear modificaciones

3. **Testing:**

   - Siempre prueba el .min.js localmente antes de subir
   - Verifica en el sitio del cliente antes de confirmar

4. **Automatización:**
   - Considera GitHub Actions para ofuscar automáticamente
   - Al hacer push de .js, auto-genera y commitea .min.js

## 📈 Próximos Pasos

1. **Ahora:** Ofuscar archivos existentes
2. **Esta semana:** Establecer workflow de ofuscación
3. **Este mes:** Considerar automatización con GitHub Actions

---

## 🎉 Resumen Rápido

```bash
# Instalar
npm install

# Ofuscar todo
npm run obfuscate

# Subir solo ofuscado
git add *.min.js
git commit -m "Update configs"
git push

# Cliente usa
<script src="https://cdn.jsdelivr.net/gh/.../ecoflow-cliente.min.js"></script>
```

🔒 **Resultado:** Código ofuscado + Validación de URL = Protección sólida

---

© 2026 Koppi - Guía de Ofuscación v1.0
