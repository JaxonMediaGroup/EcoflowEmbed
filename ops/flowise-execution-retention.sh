#!/bin/sh
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
    psql -v ON_ERROR_STOP=1 -U flowise_user -d flowise \
    -c 'DELETE FROM execution WHERE "createdDate" < now() - make_interval(days => 30)'

docker exec "$container_id" \
    psql -v ON_ERROR_STOP=1 -U flowise_user -d flowise \
    -c 'VACUUM (ANALYZE) execution'
