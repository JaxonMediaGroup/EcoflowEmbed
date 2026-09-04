# Mapa del repositorio

`EcoflowEmbed` contiene la capa operativa de los agentes: sus definiciones, prompts,
scripts de publicación y las variantes del widget embebible. No contiene el código
fuente de Flowise ni una base de datos local.

El fork, la compilación y el entorno local de Flowise viven en el repositorio hermano
[`Ecoflow`](../Ecoflow). La separación permite actualizar el producto base sin mezclarlo
con configuraciones de clientes y evita publicar datos de ejecución.

## Qué se conserva aquí

- `projects/`: definición canónica versionada de cada agente y su plantilla base.
- `scripts/`: automatización de creación, actualización, auditoría, sincronización y QA.
- `ops/`: automatización de infraestructura que debe revisarse antes de incorporarse a
  producción.
- `ecoflow-*.min.js` y `ecoflow-template.js`: artefactos públicos del widget.
- `analytics/`: panel y herramientas analíticas.

## Qué es estrictamente local

- `flowise-local/` y `.flowise-local-data*`: una copia o runtime local de Flowise.
- `.env*`, certificados, llaves y archivos de acceso.
- Backups puntuales de agentes, snapshots del servidor, IDs generados por replay y
  reportes de ejecuciones.

Nada de esa información se debe agregar a Git. Las credenciales se cargan por variables
de entorno o se configuran en el entorno de Flowise; una definición versionada nunca
incluye una clave.

## Flujo de trabajo

1. Crear o editar el JSON canónico en `projects/` mediante los scripts documentados.
2. Ejecutar validación o QA contra el entorno local/QA antes de tocar producción.
3. Guardar resultados de una corrida en `artifacts/` o una ruta ignorada.
4. Revisar `git diff --cached` por secretos, datos de conversación y cambios no
   relacionados antes de publicar.

La guía de creación de agentes está en [AGENTS_GUIDE.md](AGENTS_GUIDE.md); la
clasificación de los scripts está en [scripts/README.md](scripts/README.md).
