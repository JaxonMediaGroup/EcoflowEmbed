# Panel Central de Administracion de Agentes

## Local

Backend:

```powershell
cd analytics\insights
python app.py
```

El backend local corre en `http://localhost:5070`. Evita `5060`: los navegadores lo bloquean como puerto inseguro.

Frontend:

```powershell
cd analytics\frontend
npm run dev
```

Abre el URL de Vite, normalmente `http://localhost:5173`.

## Produccion

Usa el mismo repositorio, con dos despliegues:

- Frontend: Netlify, base `analytics/frontend`, comando `npm run build`, publish `dist`.
- Backend: EasyPanel/Docker, build context en la raiz del repo, Dockerfile `analytics/insights/Dockerfile`.

Variables que van en el hosting, no en el repo:

- `FLOWISE_URL`
- `FLOWISE_API_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `API_SECRET`
- `ALLOWED_ORIGINS`
- `VITE_API_URL`
- `VITE_API_KEY`

## Publicacion De Agentes

El panel usa este flujo:

1. Editar el JSON local como borrador.
2. Validar el borrador.
3. Revisar diff local vs Flowise.
4. Crear backup.
5. Escribir `PUBLICAR` y confirmar.
6. El backend publica a Flowise y registra la bitacora en `admin_state/audit_log.jsonl`.

## Pendiente Para Control Total

- Roles y login para equipo.
- Clonacion remota completa de chatflows nuevos en Flowise.
- Editor visual de nodos/edges.
- Gestion segura de credenciales Flowise por agente.
- Rollback desde backup con un boton.
- Tests automatizados end-to-end con navegador.
