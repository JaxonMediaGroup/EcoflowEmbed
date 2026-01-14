# 🚀 Guía de Despliegue - ECOflow Embed

## 📋 Pre-requisitos

- [x] Cuenta de GitHub configurada
- [x] Git instalado localmente
- [x] Acceso al repositorio `JaxonMediaGroup/EcoflowEmbed`
- [x] Todos los archivos creados y verificados localmente

---

## 🔄 Pasos de Despliegue

### 1️⃣ Verificar Archivos Locales

Asegúrate de tener todos estos archivos:

```bash
ls -la
```

Debes ver:

```
ecoflow-core.js          # ⚙️ Core del sistema
ecoflow-template.js      # 📝 Plantilla
ecoflow-sls.js          # 👤 Cliente ejemplo
ecoflow-1.js            # (antiguo - opcional mantener)
ecoflow-liquidglass-1.js # (antiguo - opcional mantener)
index_simple.html        # 🌐 Ejemplo simplificado
index_Version2.html      # (antiguo - opcional mantener)
test.html               # 🧪 Testing
README.md               # 📖 Documentación principal
GUIA_CLIENTE.md         # 📘 Guía para clientes
COMPARACION.md          # 📊 Antes vs Después
RESUMEN_EJECUTIVO.md    # 🎯 Este resumen
DEPLOYMENT.md           # 🚀 Esta guía
```

### 2️⃣ Preparar Git

```bash
# Verificar status
git status

# Agregar todos los archivos nuevos
git add ecoflow-core.js
git add ecoflow-template.js
git add ecoflow-sls.js
git add index_simple.html
git add test.html
git add README.md
git add GUIA_CLIENTE.md
git add COMPARACION.md
git add RESUMEN_EJECUTIVO.md
git add DEPLOYMENT.md

# O agregar todos a la vez
git add *.js *.html *.md

# Verificar qué se agregó
git status
```

### 3️⃣ Hacer Commit

```bash
# Commit con mensaje descriptivo
git commit -m "Add: ECOflow Modular System v2.0

- Core system with centralized logic (ecoflow-core.js)
- Template for new clients (ecoflow-template.js)
- Example client configuration (ecoflow-sls.js)
- Simplified HTML examples
- Complete documentation (README, guides, comparison)
- Testing page for verification

This system reduces client integration from 32 lines to 1 line of code."

# Verificar commit
git log -1
```

### 4️⃣ Push a GitHub

```bash
# Push a la rama main
git push origin main

# Si tienes errores, puede necesitar force (¡cuidado!)
# git push -f origin main
```

### 5️⃣ Verificar en GitHub

1. Ve a: `https://github.com/JaxonMediaGroup/EcoflowEmbed`
2. Verifica que todos los archivos estén subidos
3. Revisa que no haya errores en los archivos

### 6️⃣ Esperar jsDelivr Cache

jsDelivr necesita tiempo para cachear los archivos:

- **Tiempo de espera:** 5-15 minutos
- **URL a verificar:**
  - `https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@main/ecoflow-core.js`
  - `https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@main/ecoflow-sls.js`

**Verificación:**

```bash
# Verificar que el archivo esté disponible
curl https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@main/ecoflow-core.js

# Debería devolver el contenido del archivo
```

### 7️⃣ Testing

1. **Abrir test.html localmente:**

   ```bash
   # Windows
   start test.html

   # Mac/Linux
   open test.html
   ```

2. **Verificar que:**

   - ✅ El botón Lottie aparece
   - ✅ El tooltip funciona al pasar el mouse
   - ✅ El chat abre al hacer clic
   - ✅ No hay errores en la consola (F12)

3. **Abrir index_simple.html:**

   ```bash
   # Windows
   start index_simple.html

   # Mac/Linux
   open index_simple.html
   ```

4. **Verificar la integración completa**

---

## ✅ Checklist de Verificación

### Pre-Deploy

- [ ] Todos los archivos creados
- [ ] Archivos revisados sin errores
- [ ] Testing local exitoso
- [ ] Documentación completa

### Deploy

- [ ] Git add ejecutado
- [ ] Commit creado con mensaje descriptivo
- [ ] Push exitoso a GitHub
- [ ] Archivos visibles en GitHub

### Post-Deploy

- [ ] jsDelivr cache actualizado (5-15 min)
- [ ] URL de ecoflow-core.js accesible
- [ ] URL de ecoflow-sls.js accesible
- [ ] test.html funciona correctamente
- [ ] Sin errores en consola del navegador

### Producción

- [ ] Cliente de prueba (SLS) migrado
- [ ] Verificación en sitio real del cliente
- [ ] Feedback del cliente recopilado
- [ ] Documentación compartida con el equipo

---

## 🔧 Troubleshooting

### Problema: Git push rechazado

**Solución:**

```bash
# Primero hacer pull
git pull origin main

# Resolver conflictos si hay

# Luego push
git push origin main
```

### Problema: jsDelivr no actualiza

**Solución 1 - Esperar:**

- Espera 15-30 minutos más

**Solución 2 - Cache purge:**

- Ve a: `https://www.jsdelivr.com/tools/purge`
- Pega la URL del archivo
- Click "Purge cache"

**Solución 3 - Usar commit específico:**

```html
<!-- En lugar de @main, usa el hash del commit -->
<script src="https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@{COMMIT_HASH}/ecoflow-sls.js"></script>
```

Para obtener el commit hash:

```bash
git log -1 --format="%H"
```

### Problema: 404 Not Found

**Causas posibles:**

1. Archivo no subido a GitHub → Verificar en GitHub
2. Nombre de archivo incorrecto → Verificar capitalización
3. jsDelivr no ha cacheado → Esperar más tiempo
4. Ruta incorrecta → Verificar URL completa

**Verificación:**

```bash
# Verificar que el archivo existe en GitHub
curl https://raw.githubusercontent.com/JaxonMediaGroup/EcoflowEmbed/main/ecoflow-core.js
```

### Problema: El chatbot no aparece

**Debug:**

1. Abrir consola del navegador (F12)
2. Buscar errores en rojo
3. Verificar que se cargue:
   - `ECOFLOW_CONFIG` está definido
   - `ecoflow-core.js` se carga
   - Librería Lottie se carga

**Solución:**

```javascript
// En la consola del navegador, verificar:
console.log(window.ECOFLOW_CONFIG);
console.log(typeof window.initECOflowEmbed);
console.log(typeof lottie);
```

---

## 🎯 Migración de Clientes Existentes

### Para migrar cliente de sistema antiguo a nuevo:

#### 1. Crear archivo de configuración

```bash
# Copiar template
cp ecoflow-template.js ecoflow-nombre_cliente.js
```

#### 2. Extraer configuración del HTML antiguo

Del HTML antiguo, extraer valores de atributos `data-*` y convertir:

**Antiguo (HTML):**

```html
data-chatflowid="156a0ea9-c2b4-413e-995f-348a9be512f3"
data-theme-Button-Background-Color="#1b2f55"
```

**Nuevo (JS):**

```javascript
chatflowid: "156a0ea9-c2b4-413e-995f-348a9be512f3",
themeButtonBackgroundColor: "#1b2f55",
```

#### 3. Subir configuración

```bash
git add ecoflow-nombre_cliente.js
git commit -m "Add: Cliente [Nombre] migrado"
git push origin main
```

#### 4. Actualizar HTML del cliente

**Reemplazar:**

```html
<script src="..." data-chatflowid="..." data-theme-...="..." ...></script>
```

**Por:**

```html
<script src="https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@main/ecoflow-nombre_cliente.js"></script>
```

#### 5. Verificar

- Abrir sitio del cliente
- Verificar que el chatbot aparece
- Probar funcionalidad
- Confirmar con cliente

---

## 📊 Monitoreo Post-Deploy

### Métricas a monitorear:

1. **jsDelivr Stats**

   - Visitas: `https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@main/`
   - Estadísticas de uso

2. **Errores de Clientes**

   - Consultar con clientes si hay problemas
   - Revisar logs si los hay

3. **Feedback**
   - Tiempo de integración
   - Facilidad de uso
   - Problemas encontrados

### Herramientas de monitoreo:

```bash
# Ver cuántas veces se ha descargado
curl https://data.jsdelivr.com/v1/package/gh/JaxonMediaGroup/EcoflowEmbed
```

---

## 🎓 Capacitación del Equipo

### Para el equipo de ventas:

**Mensaje clave:**

> "Ahora la integración es súper simple: el cliente solo pega 1 línea de código en su sitio. Nosotros nos encargamos de todo lo demás desde nuestro servidor."

**Demo:**

1. Mostrar [index_simple.html](index_simple.html)
2. Destacar la única línea de script
3. Enfatizar facilidad y profesionalismo

### Para el equipo técnico:

**Capacitación:**

1. Leer [README.md](README.md) completo
2. Practicar crear un cliente nuevo con `ecoflow-template.js`
3. Hacer un deploy de prueba
4. Familiarizarse con troubleshooting

---

## 📅 Plan de Rollout

### Fase 1: Prueba (Semana 1)

- [ ] Deploy inicial
- [ ] Testing completo
- [ ] 1 cliente piloto (SLS)
- [ ] Recopilar feedback

### Fase 2: Migración (Semana 2-3)

- [ ] Migrar 5 clientes existentes
- [ ] Monitorear problemas
- [ ] Ajustar según feedback

### Fase 3: Adopción Completa (Semana 4+)

- [ ] Migrar todos los clientes restantes
- [ ] Nuevos clientes usan solo sistema nuevo
- [ ] Deprecar sistema antiguo

---

## 🎉 Éxito del Deploy

### Señales de éxito:

✅ Todos los archivos en GitHub  
✅ URLs de jsDelivr funcionando  
✅ test.html pasa todos los checks  
✅ Cliente piloto funcionando  
✅ Sin errores en consola  
✅ Equipo capacitado  
✅ Documentación compartida

---

## 📞 Soporte Post-Deploy

### Si surge algún problema:

1. **Revisar documentación:**

   - [README.md](README.md)
   - [GUIA_CLIENTE.md](GUIA_CLIENTE.md)
   - Esta guía (DEPLOYMENT.md)

2. **Verificar:**

   - GitHub commits
   - jsDelivr cache
   - Consola del navegador

3. **Rollback si es necesario:**
   ```bash
   # Volver al commit anterior
   git revert HEAD
   git push origin main
   ```

---

## ✅ Comando Final de Deploy

```bash
# Resumen de comandos para deploy completo:

# 1. Agregar archivos
git add *.js *.html *.md

# 2. Commit
git commit -m "Add: ECOflow Modular System v2.0"

# 3. Push
git push origin main

# 4. Verificar
curl https://cdn.jsdelivr.net/gh/JaxonMediaGroup/EcoflowEmbed@main/ecoflow-core.js

# 5. Test
start test.html  # (o 'open test.html' en Mac/Linux)

# ¡Listo! 🎉
```

---

**🚀 ¡Sistema listo para producción!**

Sigue los pasos de esta guía y tendrás el sistema ECOflow Embed Modular funcionando en producción en menos de 30 minutos.

---

© 2026 Koppi - ECOflow Deployment Guide v1.0
