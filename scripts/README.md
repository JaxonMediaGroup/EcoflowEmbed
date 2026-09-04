# Scripts operativos

Este directorio se mantiene como la capa de operación de los agentes. Antes de ejecutar
un script que escriba en Flowise, usa primero su modo local o de simulación y confirma
el flujo objetivo.

## Crear y actualizar agentes

- `agent_factory.py`: camino estándar. Genera desde la plantilla Volterra, valida la
  topología y puede actualizar módulos y modelos existentes. Usa `--local-only` para
  generar sin publicar y `--dry-run` para inspeccionar una actualización.
- `create_flowise_chatflow.py`, `create_*` y `build_*`: generadores para casos o
  plantillas particulares. Son referencia histórica; los agentes nuevos deben preferir
  la fábrica estándar hasta que se incorporen al kit común de `Ecoflow`.

## Sincronización y auditoría

- `sync_remote_chatflows.py`: descarga un inventario para revisión local.
- `audit_agents.py`, `check_models.py`, `verify_patches.py` y `verify_industrial.py`:
  inspecciones estáticas de configuración.
- `rebase_projects_from_snapshot.py` y `dedup_agent_messages.py`: mantenimiento de
  snapshots; revisar su entrada y salida antes de ejecutarlos.

## Pruebas de calidad

- `test_document_leak.py`, `spot_check.py` y los archivos `nizuc_*`: suites y utilidades
  de QA. NIZUC es una suite de referencia, no la única cobertura requerida.
- Resultados efímeros, historiales insertados y reportes nuevos deben ir en rutas
  ignoradas, no junto con las definiciones canónicas.

## Publicación y credenciales

Los scripts de `push`, `upload`, `update-flowise-tools` y `restore-credentials` pueden
modificar recursos remotos. Requieren una variable de entorno con permisos mínimos y no
deben tener una URL de producción como comportamiento implícito en las herramientas
nuevas. Nunca copies una API key, token, archivo `.env` o valor de credencial de Flowise
en un JSON versionado.

El desarrollo de compatibilidad, el entorno local y las herramientas nuevas se hacen en
el repositorio hermano [`Ecoflow`](../../Ecoflow). Esta carpeta conserva la operación y
el catálogo hasta completar esa migración.
