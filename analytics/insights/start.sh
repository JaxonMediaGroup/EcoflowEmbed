#!/bin/sh
set -e

PORT="${PORT:-5070}"
echo "Starting insights/admin API on :$PORT..."
cd /app/analytics/insights
exec gunicorn --bind "0.0.0.0:$PORT" --workers 2 --threads 2 --timeout 300 \
  --max-requests 200 --max-requests-jitter 20 \
  --access-logfile - --error-logfile - \
  app:app
