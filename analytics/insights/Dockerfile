# Chatbot Insights/Admin API
#
# Build from the repository root:
#   docker build -f analytics/insights/Dockerfile -t chatbot-insights .
#
# EasyPanel:
#   build context: repository root
#   Dockerfile: analytics/insights/Dockerfile

FROM python:3.12-slim

WORKDIR /app

COPY analytics/insights/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY analytics/insights/app.py ./analytics/insights/app.py
COPY analytics/insights/admin_service.py ./analytics/insights/admin_service.py
COPY analytics/insights/start.sh ./start.sh

COPY analytics/data ./analytics/data
COPY projects.json ./projects.json
COPY projects ./projects
COPY backups_remote_20260603_132418 ./backups_remote_20260603_132418

RUN mkdir -p analytics/insights/.insights_cache analytics/insights/.ai_enrichment_cache analytics/insights/.conv_cache analytics/data/.ai_results admin_state \
    && chmod +x start.sh

ENV ADMIN_REPO_ROOT=/app

RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 5070

CMD ["./start.sh"]
