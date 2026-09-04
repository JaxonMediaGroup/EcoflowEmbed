#!/bin/sh
# Recorte semanal de campos pesados de Flowise que inflan el heap del servidor
# cuando la UI o el panel de analytics piden el historial de mensajes sin paginar.
#
#   - chat_message."usedTools": toolInput > 1000 chars y toolOutput > 500 chars
#     se truncan (se conserva el nombre del tool para analytics).
#   - execution."executionData" (ejecuciones > 7 dias): input/output de cada
#     nodo > 300 chars se truncan (la semana reciente queda intacta para debug).
#
# Backups de referencia del recorte inicial (2026-09-02):
#   chat_message_usedtools_bak_20260902, execution_data_bak_20260902
set -eu

container_id="$(
    docker ps \
        --quiet \
        --filter label=com.docker.swarm.service.name=strapi_flowise-postgres \
        | head -n 1
)"

if [ -z "$container_id" ]; then
    echo "Flowise PostgreSQL container is not running" >&2
    exit 1
fi

docker exec "$container_id" \
    psql -v ON_ERROR_STOP=1 -U flowise_user -d flowise <<'SQL'
DO $$
DECLARE r RECORD; trimmed TEXT; hechas INT := 0; fallidas INT := 0;
BEGIN
  FOR r IN SELECT id, "usedTools" FROM chat_message
           WHERE "createdDate" < now() - interval '2 days'
             AND octet_length(COALESCE("usedTools",'')) > 2000 LOOP
    BEGIN
      SELECT COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'tool', t.elem->'tool',
            'toolInput', CASE WHEN octet_length(COALESCE(t.elem->>'toolInput','')) > 1000
                              THEN to_jsonb(left(t.elem->>'toolInput',1000) || '...[truncado]')
                              ELSE t.elem->'toolInput' END,
            'toolOutput', CASE WHEN octet_length(COALESCE(t.elem->>'toolOutput','')) > 500
                               THEN to_jsonb(left(t.elem->>'toolOutput',500) || '...[truncado]')
                               ELSE t.elem->'toolOutput' END
          ) ORDER BY t.ord
        )::text
        FROM jsonb_array_elements(r."usedTools"::jsonb) WITH ORDINALITY AS t(elem, ord)
      ), r."usedTools")
      INTO trimmed;
      UPDATE chat_message SET "usedTools" = trimmed WHERE id = r.id;
      hechas := hechas + 1;
    EXCEPTION WHEN OTHERS THEN
      fallidas := fallidas + 1;
    END;
  END LOOP;
  RAISE NOTICE 'usedTools: % recortadas, % fallidas', hechas, fallidas;
END $$;

DO $$
DECLARE r RECORD; trimmed TEXT; hechas INT := 0; fallidas INT := 0;
BEGIN
  FOR r IN SELECT id, "executionData" FROM execution
           WHERE "createdDate" < now() - interval '7 days'
             AND octet_length(COALESCE("executionData",'')) > 2000 LOOP
    BEGIN
      SELECT COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'nodeId', t.elem->'nodeId',
            'nodeLabel', t.elem->'nodeLabel',
            'status', t.elem->'status',
            'previousNodeIds', t.elem->'previousNodeIds',
            'data', jsonb_build_object(
              'id', t.elem->'data'->'id',
              'name', t.elem->'data'->'name',
              'input', CASE WHEN octet_length(COALESCE(t.elem->'data'->>'input','')) > 300
                            THEN to_jsonb(left(t.elem->'data'->>'input',300) || '...[truncado]')
                            ELSE t.elem->'data'->'input' END,
              'output', CASE WHEN octet_length(COALESCE(t.elem->'data'->>'output','')) > 300
                             THEN to_jsonb(left(t.elem->'data'->>'output',300) || '...[truncado]')
                             ELSE t.elem->'data'->'output' END
            )
          ) ORDER BY t.ord
        )::text
        FROM jsonb_array_elements(r."executionData"::jsonb) WITH ORDINALITY AS t(elem, ord)
      ), r."executionData")
      INTO trimmed;
      UPDATE execution SET "executionData" = trimmed WHERE id = r.id;
      hechas := hechas + 1;
    EXCEPTION WHEN OTHERS THEN
      fallidas := fallidas + 1;
    END;
  END LOOP;
  RAISE NOTICE 'executionData: % recortadas, % fallidas', hechas, fallidas;
END $$;

VACUUM (ANALYZE) chat_message;
VACUUM (ANALYZE) execution;
SQL
