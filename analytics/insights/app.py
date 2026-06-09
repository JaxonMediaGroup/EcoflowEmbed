"""
Chatbot Insights â€” Standalone analytics backend.

Connects to the main Flowise Analytics API (dashboard.py on port 5050)
and serves pre-computed insights to the standalone React frontend.

Can also run independently if you provide FLOWISE_URL + FLOWISE_API_KEY.

Run:  python app.py
Open: http://localhost:5060
"""

import os
import sys
import json
import hmac
import hashlib
import re
from datetime import datetime
from collections import Counter, defaultdict

from flask import Flask, request, jsonify
from flask_cors import CORS
from admin_service import (
    AdminError,
    backup_project,
    create_project,
    diff_project,
    list_projects,
    project_detail,
    publish_project,
    read_audit_log,
    update_project,
    validate_flow,
)

# Load .env — try local first (Docker), then parent (dev)
from dotenv import load_dotenv
_app_dir = os.path.dirname(os.path.abspath(__file__))
_analytics_dir = os.path.join(_app_dir, '..')
if os.path.exists(os.path.join(_app_dir, '.env')):
    load_dotenv(os.path.join(_app_dir, '.env'))
else:
    load_dotenv(os.path.join(_analytics_dir, '.env'))

app = Flask(__name__)

# ── Security: CORS + API key ────────────────────────────────────────────────
# ALLOWED_ORIGINS = comma-separated list of allowed frontend origins
#   e.g. "https://dashboard.koppi.mx,https://admin.koppi.mx"
#   Leave empty or "*" to allow all (dev only!)
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', '*')
_origins = [o.strip() for o in ALLOWED_ORIGINS.split(',') if o.strip()] if ALLOWED_ORIGINS and ALLOWED_ORIGINS != '*' else '*'
CORS(app, origins=_origins, supports_credentials=True)

# API_SECRET = shared secret that frontends must send in X-API-Key header
#   If empty, auth is disabled (dev mode)
API_SECRET = os.getenv('API_SECRET', '')


@app.before_request
def _check_api_key():
    """Reject API requests without a valid X-API-Key header."""
    # Only protect /api/* routes
    if not request.path.startswith('/api/'):
        return
    # Always allow healthcheck
    if request.path == '/api/status':
        return
    # Skip auth if no secret configured (local dev)
    if not API_SECRET:
        return
    # CORS preflight must pass through
    if request.method == 'OPTIONS':
        return
    key = request.headers.get('X-API-Key', '')
    if not key or not hmac.compare_digest(key, API_SECRET):
        return jsonify({'error': 'Unauthorized'}), 401


UPSTREAM_URL = os.getenv('UPSTREAM_URL', 'http://localhost:5050')
CACHE_DIR = os.path.join(os.path.dirname(__file__), '.insights_cache')
AI_CACHE_DIR = os.path.join(os.path.dirname(__file__), '.ai_enrichment_cache')
DATA_DIR = os.path.join(_analytics_dir, 'data')
_dist_dir = os.path.join(os.path.dirname(__file__), 'frontend', 'dist')

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')
OPENAI_MODEL = os.getenv('OPENAI_MODEL', 'gpt-4o-mini')


@app.route('/')
def index():
    index_path = os.path.join(_dist_dir, 'index.html')
    if os.path.exists(index_path):
        with open(index_path, 'r', encoding='utf-8') as f:
            return f.read()
    return '<h1>Chatbot Insights</h1><p>Build the frontend first: <code>cd frontend && npm run build</code></p>'


@app.route('/assets/<path:filename>')
def serve_assets(filename):
    from flask import send_from_directory
    return send_from_directory(os.path.join(_dist_dir, 'assets'), filename)


def _fetch_upstream(days):
    """Fetch data from the main dashboard API."""
    import requests
    r = requests.get(UPSTREAM_URL + '/api/data?days=' + str(days), timeout=120)
    if r.status_code == 202:
        return None
    r.raise_for_status()
    return r.json()


def _cache_path(days):
    os.makedirs(CACHE_DIR, exist_ok=True)
    return os.path.join(CACHE_DIR, f'insights_{days}.json')


def _load_cache(days):
    path = _cache_path(days)
    if not os.path.exists(path):
        return None
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        cached_at = datetime.fromisoformat(data.get('_cached_at', '2000-01-01'))
        if (datetime.now() - cached_at).total_seconds() > 3600:
            return None
        return data
    except Exception:
        return None


def _save_cache(data, days):
    path = _cache_path(days)
    try:
        data['_cached_at'] = datetime.now().isoformat()
        data['_days'] = days
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, default=str)
    except Exception:
        pass


def _normalize_message_rows(raw):
    """Normalize Flowise chatmessage rows and exported Message.json sessions."""
    rows = []
    if not isinstance(raw, list):
        return rows
    for item in raw:
        if isinstance(item, dict) and isinstance(item.get('messages'), list):
            session_id = item.get('sessionId') or item.get('chatId') or item.get('id') or 'unknown'
            for msg in item.get('messages', []):
                role = msg.get('role', '')
                rows.append({
                    'session_id': session_id,
                    'role': 'userMessage' if role in ('user', 'userMessage') else 'apiMessage',
                    'content': msg.get('content', '') or '',
                    'createdDate': msg.get('time') or msg.get('createdDate') or '',
                    'usedTools': msg.get('usedTools') or [],
                })
            continue
        if isinstance(item, dict):
            role = item.get('role') or item.get('type') or ''
            rows.append({
                'session_id': item.get('chatId') or item.get('sessionId') or item.get('id') or 'unknown',
                'role': role,
                'content': item.get('content') or item.get('message') or '',
                'createdDate': item.get('createdDate') or item.get('time') or '',
                'usedTools': item.get('usedTools') or item.get('usedToolsArray') or [],
            })
    return rows


def _message_date(value):
    raw = str(value or '')
    if not raw:
        return None
    try:
        return datetime.fromisoformat(raw[:19].replace('Z', ''))
    except Exception:
        return None


def _is_user(role):
    return role in ('userMessage', 'user', 'human')


def _is_bot(role):
    return role in ('apiMessage', 'assistant', 'bot')


def _detect_gap(text):
    t = (text or '').lower()
    return any(p in t for p in [
        'no tengo informacion', 'no tengo información', 'no cuento con',
        'no dispongo', 'no se menciona', 'no puedo encontrar',
        'no viene en', 'lamentablemente no',
    ])


def _detect_doc_leak(text):
    t = (text or '').lower()
    return any(p in t for p in [
        'segun el documento', 'según el documento', 'de acuerdo al documento',
        'de acuerdo con el documento', 'according to the document',
        'en el documento proporcionado',
    ])


def _detect_offtopic_question(text):
    t = (text or '').lower()
    return any(p in t for p in [
        'resuelve', 'hazme la tarea', 'homework', 'codigo', 'código',
        'python', 'javascript', 'receta', 'poema', 'traduce', 'translate',
        'raiz cuadrada', 'square root', 'biografia', 'biografía',
    ])


def _detect_refusal(text):
    t = (text or '').lower()
    return any(p in t for p in [
        'no puedo ayudar', 'no puedo responder', 'fuera del alcance',
        'no esta relacionado', 'no está relacionado', 'solo puedo ayudar',
        'puedo ayudarte con informacion del proyecto',
    ])


def _tool_names(value):
    names = []
    if isinstance(value, str):
        try:
            value = json.loads(value)
        except Exception:
            value = []
    for item in value or []:
        if isinstance(item, dict):
            name = item.get('tool') or item.get('name') or item.get('toolName')
        else:
            name = str(item)
        if name and name not in names:
            names.append(str(name))
    return names


def _analyze_messages(chatflow_id, chatflow_name, messages):
    rows = _normalize_message_rows(messages)
    sessions = defaultdict(list)
    for row in rows:
        sessions[row.get('session_id') or 'unknown'].append(row)

    total_messages = len(rows)
    user_messages = sum(1 for r in rows if _is_user(r.get('role')))
    bot_messages = sum(1 for r in rows if _is_bot(r.get('role')))
    daily_volume = Counter()
    hourly_heatmap = Counter()
    tool_usage = Counter()
    knowledge_gaps = []
    doc_leaks = []
    off_topic = []
    length_issues = []
    language_mismatches = []
    unanswered_topics = Counter()

    for session_id, convo in sessions.items():
        convo.sort(key=lambda r: r.get('createdDate') or '')
        last_user = None
        for row in convo:
            dt = _message_date(row.get('createdDate'))
            if dt:
                daily_volume[dt.strftime('%Y-%m-%d')] += 1
                hourly_heatmap[f'{dt.weekday()}_{dt.hour}'] += 1
            if _is_user(row.get('role')):
                last_user = row
                if _detect_offtopic_question(row.get('content')):
                    off_topic.append({
                        'date': row.get('createdDate', ''),
                        'agent_name': chatflow_name,
                        'user_question': row.get('content', ''),
                        'bot_response': '',
                        'refused': False,
                    })
            elif _is_bot(row.get('role')):
                content = row.get('content', '') or ''
                for tool in _tool_names(row.get('usedTools')):
                    tool_usage[tool] += 1
                if _detect_gap(content):
                    question = (last_user or {}).get('content', '')
                    knowledge_gaps.append({
                        'date': row.get('createdDate', ''),
                        'user_question': question,
                        'bot_response': content,
                    })
                    if question:
                        unanswered_topics[question] += 1
                if _detect_doc_leak(content):
                    doc_leaks.append({
                        'date': row.get('createdDate', ''),
                        'bot_response': content,
                    })
                if len(content) < 20:
                    length_issues.append({'type': 'too_short', 'date': row.get('createdDate', ''), 'bot_response': content})
                elif len(content) > 1800:
                    length_issues.append({'type': 'too_long', 'date': row.get('createdDate', ''), 'bot_response': content[:500]})
                if off_topic and off_topic[-1].get('bot_response') == '' and last_user:
                    off_topic[-1]['bot_response'] = content
                    off_topic[-1]['refused'] = _detect_refusal(content)

    off_topic_answered = sum(1 for item in off_topic if not item.get('refused'))
    off_topic_refused = sum(1 for item in off_topic if item.get('refused'))
    return {
        'chatflow': chatflow_name,
        'chatflow_name': chatflow_name,
        'chatflow_id': chatflow_id,
        'total_messages': total_messages,
        'total_conversations': len(sessions),
        'user_messages': user_messages,
        'bot_messages': bot_messages,
        'knowledge_gaps': knowledge_gaps,
        'doc_leaks': doc_leaks,
        'language_mismatches': language_mismatches,
        'length_issues': length_issues,
        'off_topic': off_topic,
        'off_topic_answered': off_topic_answered,
        'off_topic_refused': off_topic_refused,
        'daily_volume': dict(daily_volume),
        'hourly_heatmap': dict(hourly_heatmap),
        'tool_usage': dict(tool_usage),
        'unanswered_topics': dict(unanswered_topics),
    }


def _local_message_files():
    os.makedirs(DATA_DIR, exist_ok=True)
    files = []
    for name in sorted(os.listdir(DATA_DIR)):
        path = os.path.join(DATA_DIR, name)
        if os.path.isfile(path) and name.lower().endswith('.json'):
            files.append({
                'filename': name,
                'size_mb': round(os.path.getsize(path) / 1024 / 1024, 2),
            })
    return files


def _load_message_file(filename):
    safe = os.path.basename(filename)
    path = os.path.join(DATA_DIR, safe)
    if not os.path.exists(path):
        raise FileNotFoundError(safe)
    with open(path, 'r', encoding='utf-8-sig') as handle:
        return json.load(handle)


def _build_data_from_local_files():
    results = []
    for file in _local_message_files():
        try:
            raw = _load_message_file(file['filename'])
        except Exception:
            continue
        name = re.sub(r'[-_]?messages?\.json$', '', file['filename'], flags=re.I) or file['filename']
        results.append(_analyze_messages('', name, raw))
    return {'results': results, 'source': 'local_files', 'generated_at': datetime.now().isoformat()}


def _fetch_flowise_data(days):
    import requests as req
    flowise_url = os.getenv('FLOWISE_URL', '').rstrip('/')
    flowise_key = os.getenv('FLOWISE_API_KEY', '')
    if not flowise_url:
        raise RuntimeError('FLOWISE_URL not configured')
    headers = {'Authorization': f'Bearer {flowise_key}', 'Accept': 'application/json'}
    chatflows_resp = req.get(f'{flowise_url}/api/v1/chatflows', headers=headers, timeout=45)
    chatflows_resp.raise_for_status()
    chatflows = chatflows_resp.json()
    if not isinstance(chatflows, list):
        chatflows = []

    start_date = ''
    if days > 0:
        from datetime import timedelta
        start_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%dT00:00:00.000Z')

    results = []
    for cf in chatflows:
        chatflow_id = str(cf.get('id', '')).strip()
        if not chatflow_id:
            continue
        messages = []
        for chat_type in ('EXTERNAL', 'INTERNAL'):
            params = {'chatType': chat_type, 'order': 'ASC'}
            if start_date:
                params['startDate'] = start_date
            try:
                msg_resp = req.get(f'{flowise_url}/api/v1/chatmessage/{chatflow_id}', headers=headers, params=params, timeout=45)
                msg_resp.raise_for_status()
                payload = msg_resp.json()
                if isinstance(payload, list):
                    messages.extend(payload)
            except Exception:
                continue
        results.append(_analyze_messages(chatflow_id, cf.get('name', chatflow_id), messages))
    return {
        'results': results,
        'chatflows_meta': [{'id': cf.get('id', ''), 'name': cf.get('name', '')} for cf in chatflows],
        'source': 'flowise',
        'generated_at': datetime.now().isoformat(),
    }


@app.route('/api/data')
def api_data():
    days = int(request.args.get('days', 30))
    force = request.args.get('force', 'false').lower() == 'true'
    cache_path = os.path.join(CACHE_DIR, f'data_{days}.json')
    os.makedirs(CACHE_DIR, exist_ok=True)
    if not force and os.path.exists(cache_path):
        try:
            with open(cache_path, 'r', encoding='utf-8') as handle:
                cached = json.load(handle)
            cached_at = datetime.fromisoformat(cached.get('_cached_at', '2000-01-01'))
            if (datetime.now() - cached_at).total_seconds() < 3600:
                return jsonify({k: v for k, v in cached.items() if not k.startswith('_')})
        except Exception:
            pass

    try:
        data = _fetch_flowise_data(days)
    except Exception as flowise_error:
        data = _build_data_from_local_files()
        data['fallback_error'] = str(flowise_error)
    try:
        data['_cached_at'] = datetime.now().isoformat()
        with open(cache_path, 'w', encoding='utf-8') as handle:
            json.dump(data, handle, ensure_ascii=False, default=str)
    except Exception:
        pass
    return jsonify({k: v for k, v in data.items() if not k.startswith('_')})


def _compute_insights(raw):
    """Transform raw analytics data into the insights payload."""
    results = raw.get('results', [])

    # â”€â”€ Aggregate stats â”€â”€
    total_messages = sum(r.get('total_messages', 0) for r in results)
    total_conversations = sum(r.get('total_conversations', 0) for r in results)
    total_gaps = sum(len(r.get('knowledge_gaps', [])) for r in results)
    total_leaks = sum(len(r.get('doc_leaks', [])) for r in results)
    total_off_topic_answered = sum(r.get('off_topic_answered', 0) for r in results)
    total_bot_messages = sum(r.get('bot_messages', 0) for r in results)
    active_chatflows = len(results)
    total_issues = total_gaps + total_leaks + total_off_topic_answered
    health_score = max(0, min(100, round(100 * (1 - total_issues / max(total_messages + 1, 1)))))

    # â”€â”€ Knowledge gaps aggregation â”€â”€
    gap_agg = defaultdict(lambda: {
        'count': 0, 'n_chatflows': 0, '_chatflows': set(), 'examples': [], 'latest_date': ''
    })

    for r in results:
        chatflow = r.get('chatflow', '')
        for gap in r.get('knowledge_gaps', []):
            topic = gap.get('user_question', '(desconocida)')
            agg = gap_agg[topic]
            agg['count'] += 1
            agg['_chatflows'].add(chatflow)
            if len(agg['examples']) < 3:
                agg['examples'].append({
                    'question': gap.get('user_question', '(desconocida)'),
                    'response': (gap.get('bot_response', '') or '')[:250],
                    'date': gap.get('date', None),
                })
            d = gap.get('date', '')
            if d and d > agg['latest_date']:
                agg['latest_date'] = d

    # â”€â”€ Build action plan â”€â”€
    action_plan = []
    for topic, info in gap_agg.items():
        count = info['count']
        latest_date = info['latest_date']

        try:
            dt = datetime.fromisoformat(latest_date[:19].replace('Z', ''))
            days_ago = (datetime.now() - dt).days
        except Exception:
            days_ago = 30

        if days_ago <= 7:
            recency_factor = 1.5
        elif days_ago <= 14:
            recency_factor = 1.2
        else:
            recency_factor = 1.0

        impact_score = round(count * recency_factor, 1)

        if impact_score >= 10:
            priority = 'critica'
        elif impact_score >= 5:
            priority = 'alta'
        elif impact_score >= 2:
            priority = 'media'
        else:
            priority = 'baja'

        action_plan.append({
            'topic': topic,
            'count': count,
            'examples': info['examples'],
            'latest_date': latest_date,
            'impact_score': impact_score,
            'priority': priority,
        })

    action_plan.sort(key=lambda x: x['impact_score'], reverse=True)

    # â”€â”€ Daily volume â”€â”€
    daily_counter = Counter()
    for r in results:
        for date, count in r.get('daily_volume', {}).items():
            daily_counter[date] += count

    daily_volume = sorted([{'date': d, 'messages': c} for d, c in daily_counter.items()], key=lambda x: x['date'])
    avg_msgs_per_day = round(total_messages / max(len(daily_volume), 1))

    # â”€â”€ Heatmap â”€â”€
    heatmap = Counter()
    for r in results:
        for k, v in r.get('hourly_heatmap', {}).items():
            heatmap[k] += v
    heatmap = dict(heatmap)

    # â”€â”€ Hourly distribution â”€â”€
    hourly_counts = Counter()
    for k, v in heatmap.items():
        parts = k.split('_')
        if len(parts) == 2:
            h = int(parts[1])
            hourly_counts[h] += v

    hourly_dist = [{'hour': h, 'count': hourly_counts.get(h, 0)} for h in range(24)]

    # â”€â”€ Day of week distribution â”€â”€
    DOW_NAMES = ('Lun', 'Mar', 'MiÃ©', 'Jue', 'Vie', 'SÃ¡b', 'Dom')
    dow_counts = Counter()
    for k, v in heatmap.items():
        parts = k.split('_')
        if len(parts) == 2:
            d = int(parts[0])
            dow_counts[d] += v

    dow_dist = [{'day': DOW_NAMES[d], 'dow': d, 'count': dow_counts.get(d, 0)} for d in range(7)]

    # â”€â”€ Temporal summary â”€â”€
    peak_hour = max(range(24), key=lambda h: hourly_counts.get(h, 0))
    low_hour = min(range(24), key=lambda h: hourly_counts.get(h, 0))
    peak_day_idx = max(range(7), key=lambda d: dow_counts.get(d, 0))
    low_day_idx = min(range(7), key=lambda d: dow_counts.get(d, 0))

    temporal_summary = {
        'peak_hour': peak_hour,
        'peak_hour_count': hourly_counts.get(peak_hour, 0),
        'low_hour': low_hour,
        'low_hour_count': hourly_counts.get(low_hour, 0),
        'peak_day': DOW_NAMES[peak_day_idx],
        'peak_day_count': dow_counts.get(peak_day_idx, 0),
        'low_day': DOW_NAMES[low_day_idx],
        'low_day_count': dow_counts.get(low_day_idx, 0),
    }

    stats = {
        'total_messages': total_messages,
        'total_conversations': total_conversations,
        'active_chatflows': active_chatflows,
        'total_gaps': total_gaps,
        'total_leaks': total_leaks,
        'total_off_topic_answered': total_off_topic_answered,
        'total_issues': total_issues,
        'total_bot_messages': total_bot_messages,
        'health_score': health_score,
        'avg_msgs_per_day': avg_msgs_per_day,
    }

    # â”€â”€ Per-chatflow insights â”€â”€
    chatflows = []
    for r in results:
        cf_name = r.get('chatflow', '')
        cf_id = r.get('chatflow_id', '')
        cf_msgs = r.get('total_messages', 0)
        cf_convs = r.get('total_conversations', 0)
        cf_gaps_raw = r.get('knowledge_gaps', [])
        cf_leaks = len(r.get('doc_leaks', []))
        cf_ota = r.get('off_topic_answered', 0)
        cf_issues = len(cf_gaps_raw) + cf_leaks + cf_ota
        cf_health = max(0, min(100, round(100 * (1 - cf_issues / max(cf_msgs + 1, 1)))))

        # Per-chatflow daily volume
        cf_dv = sorted(
            [{'date': d, 'messages': c} for d, c in r.get('daily_volume', {}).items()],
            key=lambda x: x['date']
        )

        # Per-chatflow action plan
        cf_gap_agg = defaultdict(lambda: {
            'count': 0, 'examples': [], 'latest_date': ''
        })
        for gap in cf_gaps_raw:
            topic = gap.get('user_question', '(desconocida)')
            a = cf_gap_agg[topic]
            a['count'] += 1
            if len(a['examples']) < 3:
                a['examples'].append({
                    'question': gap.get('user_question', '(desconocida)'),
                    'response': (gap.get('bot_response', '') or '')[:250],
                    'date': gap.get('date', None),
                })
            gd = gap.get('date', '')
            if gd and gd > a['latest_date']:
                a['latest_date'] = gd

        cf_plan = []
        for topic, info in cf_gap_agg.items():
            cnt = info['count']
            ld = info['latest_date']
            try:
                dt2 = datetime.fromisoformat(ld[:19].replace('Z', ''))
                da = (datetime.now() - dt2).days
            except Exception:
                da = 30
            rf = 1.5 if da <= 7 else 1.2 if da <= 14 else 1.0
            isc = round(cnt * rf, 1)
            pri = 'critica' if isc >= 10 else 'alta' if isc >= 5 else 'media' if isc >= 2 else 'baja'
            cf_plan.append({
                'topic': topic, 'count': cnt, 'examples': info['examples'],
                'latest_date': ld, 'impact_score': isc, 'priority': pri,
            })
        cf_plan.sort(key=lambda x: x['impact_score'], reverse=True)

        # Per-chatflow heatmap
        cf_heatmap = dict(r.get('hourly_heatmap', {}))

        chatflows.append({
            'id': cf_id,
            'name': cf_name,
            'total_messages': cf_msgs,
            'total_conversations': cf_convs,
            'gaps': len(cf_gaps_raw),
            'health_score': cf_health,
            'daily_volume': cf_dv,
            'action_plan': cf_plan,
            'heatmap': cf_heatmap,
        })

    chatflows.sort(key=lambda x: x['total_messages'], reverse=True)

    return {
        'stats': stats,
        'action_plan': action_plan,
        'daily_volume': daily_volume,
        'heatmap': heatmap,
        'hourly_dist': hourly_dist,
        'dow_dist': dow_dist,
        'temporal_summary': temporal_summary,
        'chatflows': chatflows,
        'generated_at': datetime.now().isoformat(),
    }


@app.route('/api/insights')
def api_insights():
    days = int(request.args.get('days', 30))
    force = request.args.get('force', 'false').lower() == 'true'

    if not force:
        cached = _load_cache(days)
        if cached:
            out = {k: v for k, v in cached.items() if not k.startswith('_')}
            return jsonify(out)

    try:
        raw = _fetch_upstream(days)
    except Exception as e:
        return jsonify({'error': 'Cannot reach upstream: ' + str(e)}), 502

    if raw is None:
        return jsonify({'status': 'loading'}), 202

    if raw.get('status') == 'loading':
        return jsonify({'status': 'loading'}), 202

    insights = _compute_insights(raw)
    _save_cache(insights, days)
    return jsonify(insights)


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# AI Enrichment for Action Plans
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

def _ai_cache_path(chatflow_id, days):
    os.makedirs(AI_CACHE_DIR, exist_ok=True)
    key = hashlib.sha256(f'{chatflow_id}_{days}'.encode()).hexdigest()[:16]
    return os.path.join(AI_CACHE_DIR, f'{key}.json')


def _load_ai_cache(chatflow_id, days):
    path = _ai_cache_path(chatflow_id, days)
    if not os.path.exists(path):
        return None
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        cached_at = datetime.fromisoformat(data.get('_cached_at', '2000-01-01'))
        if (datetime.now() - cached_at).total_seconds() > 86400:  # 24h
            return None
        return data.get('enriched_plan')
    except Exception:
        return None


def _save_ai_cache(chatflow_id, days, enriched_plan):
    path = _ai_cache_path(chatflow_id, days)
    try:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump({
                '_cached_at': datetime.now().isoformat(),
                'chatflow_id': chatflow_id,
                'days': days,
                'enriched_plan': enriched_plan,
            }, f, ensure_ascii=False)
    except Exception:
        pass


def _enrich_action_plan_ai(chatflow_name, action_plan):
    """Use OpenAI to group, categorize and generate recommendations for gaps."""
    if not OPENAI_API_KEY or not action_plan:
        return action_plan

    import openai
    client = openai.OpenAI(api_key=OPENAI_API_KEY)

    # Build a compact representation of gaps for the LLM
    gaps_text = []
    for i, gap in enumerate(action_plan):
        examples_str = ''
        if gap.get('examples'):
            examples_str = ' | Ej: ' + '; '.join(
                (e.get('question', '') or '')[:80] for e in gap['examples'][:2]
            )
        gaps_text.append(
            f'{i+1}. [{gap["priority"]}] (Ã—{gap["count"]}) "{gap["topic"]}"{examples_str}'
        )

    prompt = f"""Eres un analista experto en chatbots inmobiliarios/empresariales.

El chatbot "{chatflow_name}" tiene estas brechas de conocimiento detectadas:

{chr(10).join(gaps_text)}

Para CADA brecha, devuelve un JSON array con objetos que tengan:
- "index": nÃºmero original (1-based)
- "category": categorÃ­a temÃ¡tica corta (ej: "Precios y Cotizaciones", "Amenidades", "UbicaciÃ³n", "Proceso de Compra", "Financiamiento", "Horarios", "DocumentaciÃ³n", "Especificaciones TÃ©cnicas", "Otro")
- "recommendation": recomendaciÃ³n especÃ­fica y accionable en 1-2 oraciones sobre quÃ© informaciÃ³n agregar a la base de conocimiento. SÃ© concreto, no genÃ©rico.
- "grouped_with": array de Ã­ndices si esta brecha es esencialmente la misma pregunta que otra (para agrupar duplicados). VacÃ­o si es Ãºnica.

Responde SOLO el JSON array, sin markdown ni explicaciones."""

    try:
        resp = client.chat.completions.create(
            model=OPENAI_MODEL,
            temperature=0.2,
            response_format={'type': 'json_object'},
            messages=[
                {'role': 'system', 'content': 'Devuelves JSON vÃ¡lido. Siempre responde con {"items": [...]}'},
                {'role': 'user', 'content': prompt},
            ],
            timeout=60,
        )
        raw = json.loads(resp.choices[0].message.content)
        items = raw.get('items', raw if isinstance(raw, list) else [])

        # Map AI results back to action plan
        ai_map = {}
        for item in items:
            idx = item.get('index', 0) - 1
            if 0 <= idx < len(action_plan):
                ai_map[idx] = item

        enriched = []
        for i, gap in enumerate(action_plan):
            g = {**gap}
            if i in ai_map:
                ai = ai_map[i]
                g['ai_category'] = ai.get('category', '')
                g['ai_recommendation'] = ai.get('recommendation', '')
                g['ai_grouped_with'] = ai.get('grouped_with', [])
            enriched.append(g)

        return enriched

    except Exception as e:
        print(f'  âš ï¸ AI enrichment failed: {e}', flush=True)
        return action_plan


@app.route('/api/insights/enrich', methods=['GET', 'POST'])
def api_enrich():
    """Enrich action plan with AI (on-demand). Accepts GET or POST."""
    # Parse params from POST body or GET query
    if request.method == 'POST':
        body = request.get_json(force=True, silent=True) or {}
        chatflow_id = body.get('chatflow_id', '')
        chatflow_name = body.get('chatflow_name', chatflow_id)
        days = int(body.get('days', 30))
        posted_plan = body.get('action_plan', [])
    else:
        chatflow_id = request.args.get('chatflow_id', '')
        chatflow_name = chatflow_id
        days = int(request.args.get('days', 30))
        posted_plan = []

    if not chatflow_id:
        return jsonify({'error': 'chatflow_id required'}), 400

    # Check AI cache first
    cached = _load_ai_cache(chatflow_id, days)
    if cached:
        return jsonify({'enriched_plan': cached})

    # Determine the action plan to enrich
    action_plan = None

    # Option 1: Use the action_plan sent directly in POST body
    if posted_plan:
        action_plan = posted_plan
    else:
        # Option 2: Try from insights cache (GET fallback)
        insights_cached = _load_cache(days)
        if insights_cached:
            chatflows = insights_cached.get('chatflows', [])
            for cf in chatflows:
                if cf.get('id') == chatflow_id or cf.get('name') == chatflow_id:
                    action_plan = cf.get('action_plan', [])
                    chatflow_name = cf.get('name', chatflow_id)
                    break

    if not action_plan:
        return jsonify({'enriched_plan': []}), 200

    enriched = _enrich_action_plan_ai(chatflow_name, action_plan)
    _save_ai_cache(chatflow_id, days, enriched)
    return jsonify({'enriched_plan': enriched})

@app.route('/api/chatflows')
def api_chatflows():
    """Return list of chatflows with id and name from upstream."""
    try:
        import requests
        r = requests.get(UPSTREAM_URL + '/api/data?days=30', timeout=10)
        if r.status_code == 202:
            return jsonify({'status': 'loading'}), 202
        data = r.json()
        meta = data.get('chatflows_meta', [])
        if not meta:
            meta = [{'id': r2.get('chatflow_id', ''), 'name': r2.get('chatflow', '')} for r2 in data.get('results', [])]
        return jsonify({'chatflows': meta})
    except Exception as e:
        return jsonify({'error': str(e)}), 502


def _admin_response(fn, *args, **kwargs):
    try:
        return jsonify(fn(*args, **kwargs))
    except AdminError as e:
        return jsonify({'error': str(e)}), e.status
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/projects')
def api_projects_compat():
    """Compatibility endpoint for the existing Projects page."""
    payload = list_projects()
    projects = []
    for project in payload.get('projects', []):
        projects.append({
            **project,
            'agents': [
                {
                    'id': f"{project.get('id', '')}-{idx}",
                    'label': f"{kind}: {count}",
                    'type': kind,
                    'model': ', '.join(project.get('models', [])),
                }
                for idx, (kind, count) in enumerate((project.get('node_counts') or {}).items())
                if count
            ],
            'embeds': [],
        })
    return jsonify({
        'projects': projects,
        'summary': payload.get('summary', {}),
        'total_embeds': 0,
    })


@app.route('/api/admin/projects', methods=['GET'])
def api_admin_projects():
    return _admin_response(list_projects)


@app.route('/api/admin/projects', methods=['POST'])
def api_admin_create_project():
    body = request.get_json(force=True, silent=True) or {}
    return _admin_response(create_project, body)


@app.route('/api/admin/projects/<path:project_id>', methods=['GET'])
def api_admin_project_detail(project_id):
    return _admin_response(project_detail, project_id)


@app.route('/api/admin/projects/<path:project_id>', methods=['PUT'])
def api_admin_update_project(project_id):
    body = request.get_json(force=True, silent=True) or {}
    return _admin_response(update_project, project_id, body)


@app.route('/api/admin/projects/<path:project_id>/validate', methods=['POST'])
def api_admin_validate_project(project_id):
    detail = project_detail(project_id)
    require_publish_ready = bool((request.get_json(silent=True) or {}).get('require_publish_ready'))
    return jsonify(validate_flow(detail.get('flow'), require_publish_ready=require_publish_ready))


@app.route('/api/admin/projects/<path:project_id>/diff', methods=['POST'])
def api_admin_diff_project(project_id):
    return _admin_response(diff_project, project_id)


@app.route('/api/admin/projects/<path:project_id>/backup', methods=['POST'])
def api_admin_backup_project(project_id):
    body = request.get_json(force=True, silent=True) or {}
    return _admin_response(backup_project, project_id, body.get('reason', 'manual'))


@app.route('/api/admin/projects/<path:project_id>/publish', methods=['POST'])
def api_admin_publish_project(project_id):
    body = request.get_json(force=True, silent=True) or {}
    return _admin_response(publish_project, project_id, body)


@app.route('/api/admin/audit-log', methods=['GET'])
def api_admin_audit_log():
    project = request.args.get('project') or None
    limit = int(request.args.get('limit', 100))
    return jsonify({'items': read_audit_log(project, limit)})


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# Conversations endpoint â€” fetch & analyze per chatflow
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

CONV_CACHE_DIR = os.path.join(os.path.dirname(__file__), '.conv_cache')


def _conv_cache_path(chatflow_id, days):
    os.makedirs(CONV_CACHE_DIR, exist_ok=True)
    key = hashlib.sha256(f'{chatflow_id}_{days}'.encode()).hexdigest()[:16]
    return os.path.join(CONV_CACHE_DIR, f'{key}.json')


def _load_conv_cache(chatflow_id, days):
    path = _conv_cache_path(chatflow_id, days)
    if not os.path.exists(path):
        return None
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        cached_at = datetime.fromisoformat(data.get('_cached_at', '2000-01-01'))
        if (datetime.now() - cached_at).total_seconds() > 3600:
            return None
        return data
    except Exception:
        return None


def _save_conv_cache(chatflow_id, days, payload):
    path = _conv_cache_path(chatflow_id, days)
    try:
        payload['_cached_at'] = datetime.now().isoformat()
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(payload, f, ensure_ascii=False, default=str)
    except Exception:
        pass


def _build_conversations_from_messages(messages):
    """Group raw Flowise messages into conversations with summaries."""
    from collections import defaultdict

    sessions = defaultdict(list)
    for m in messages:
        cid = m.get('chatId') or m.get('sessionId') or 'unknown'
        sessions[cid].append(m)

    conversations = []
    for session_id, msgs in sessions.items():
        msgs.sort(key=lambda x: x.get('createdDate', ''))
        if not msgs:
            continue

        user_msgs = [m for m in msgs if m.get('role') == 'userMessage']
        bot_msgs = [m for m in msgs if m.get('role') == 'apiMessage']

        first_user = user_msgs[0] if user_msgs else None
        first_bot = bot_msgs[0] if bot_msgs else None
        first_time = msgs[0].get('createdDate', '')
        last_time = msgs[-1].get('createdDate', '') if len(msgs) > 1 else first_time

        # Quick quality heuristic
        quality = 'buena'
        quality_score = 4
        has_no_info = False
        for bm in bot_msgs:
            content = (bm.get('content') or '').lower()
            if any(p in content for p in ['no tengo', 'no cuento con', 'no dispongo', 'no se menciona',
                                           'no puedo encontrar', 'no viene en', 'lamentablemente']):
                has_no_info = True
                break

        if not bot_msgs:
            quality = 'sin respuesta'
            quality_score = 1
        elif has_no_info:
            quality = 'con brechas'
            quality_score = 2
        elif len(user_msgs) >= 5:
            quality = 'buena'
            quality_score = 4
        elif len(user_msgs) <= 1:
            quality = 'bounce'
            quality_score = 3

        # Detect intent from first user message
        first_q = (first_user.get('content') or '')[:200] if first_user else ''
        intent = _detect_intent(first_q)

        conversations.append({
            'session_id': session_id,
            'first_message': first_q[:150] if first_q else '(sin mensaje)',
            'first_response': (first_bot.get('content') or '')[:200] if first_bot else '',
            'started_at': first_time,
            'ended_at': last_time,
            'message_count': len(msgs),
            'user_messages': len(user_msgs),
            'bot_messages': len(bot_msgs),
            'quality': quality,
            'quality_score': quality_score,
            'intent': intent,
            'messages': [
                {
                    'role': m.get('role', ''),
                    'content': (m.get('content') or '')[:500],
                    'time': m.get('createdDate', ''),
                }
                for m in msgs
            ],
        })

    conversations.sort(key=lambda c: c['started_at'], reverse=True)
    return conversations


def _detect_intent(text):
    """Simple keyword-based intent detection."""
    t = text.lower()
    patterns = {
        'Precios / CotizaciÃ³n': ['precio', 'costo', 'cuÃ¡nto', 'cuanto cuesta', 'cotiz', 'inversiÃ³n', 'mensualidad'],
        'UbicaciÃ³n': ['ubicaciÃ³n', 'ubicacion', 'dÃ³nde', 'donde estÃ¡', 'direcciÃ³n', 'cÃ³mo llego', 'mapa'],
        'Amenidades': ['amenidad', 'alberca', 'gym', 'gimnasio', 'jardÃ­n', 'roof', 'terraza', 'Ã¡rea comÃºn'],
        'Disponibilidad': ['disponib', 'departamento', 'unidad', 'quedan', 'hay disponib', 'inventario'],
        'Financiamiento': ['financ', 'crÃ©dito', 'credito', 'hipoteca', 'enganche', 'mensualidad', 'banco'],
        'Proceso de compra': ['compra', 'apartado', 'contrato', 'escritura', 'entreg', 'requisito'],
        'Horarios / Contacto': ['horario', 'agendar', 'cita', 'visita', 'telÃ©fono', 'contacto', 'whatsapp'],
        'Especificaciones': ['metro', 'm2', 'recÃ¡mara', 'recamara', 'baÃ±o', 'estacionamiento', 'superficie', 'plano'],
    }
    for intent, keywords in patterns.items():
        if any(k in t for k in keywords):
            return intent
    return 'General'


@app.route('/api/insights/conversations')
def api_conversations():
    """Fetch conversations for a chatflow, with analysis summaries."""
    chatflow_id = request.args.get('chatflow_id', '')
    days = int(request.args.get('days', 30))
    force = request.args.get('force', 'false').lower() == 'true'
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 50))
    search = request.args.get('search', '').lower()
    quality_filter = request.args.get('quality', '')
    intent_filter = request.args.get('intent', '')

    if not chatflow_id:
        return jsonify({'error': 'chatflow_id required'}), 400

    # Check cache
    if not force:
        cached = _load_conv_cache(chatflow_id, days)
        if cached:
            convos = cached.get('conversations', [])
            return _paginate_convos(convos, page, per_page, search, quality_filter, intent_filter)

    # Fetch from upstream Flowise API
    import requests as req
    try:
        start_date = ''
        if days > 0:
            start_date = (datetime.now() - __import__('datetime').timedelta(days=days)).strftime('%Y-%m-%dT00:00:00.000Z')

        # Use the upstream dashboard's data if available, otherwise go direct
        params = {'chatType': 'EXTERNAL', 'order': 'ASC'}
        if start_date:
            params['startDate'] = start_date

        # Try to get Flowise URL/key from upstream config
        flowise_url = os.getenv('FLOWISE_URL', '')
        flowise_key = os.getenv('FLOWISE_API_KEY', '')

        if not flowise_url:
            return jsonify({'error': 'FLOWISE_URL not configured'}), 500

        headers = {'Authorization': f'Bearer {flowise_key}', 'Accept': 'application/json'}
        r_ext = req.get(f'{flowise_url}/api/v1/chatmessage/{chatflow_id}',
                        headers=headers, params=params, timeout=60)
        r_ext.raise_for_status()
        ext_msgs = r_ext.json()

        params['chatType'] = 'INTERNAL'
        r_int = req.get(f'{flowise_url}/api/v1/chatmessage/{chatflow_id}',
                        headers=headers, params=params, timeout=60)
        r_int.raise_for_status()
        int_msgs = r_int.json()

        all_msgs = ext_msgs + int_msgs

    except Exception as e:
        return jsonify({'error': f'Failed to fetch conversations: {e}'}), 502

    conversations = _build_conversations_from_messages(all_msgs)

    # Cache the result
    _save_conv_cache(chatflow_id, days, {
        'chatflow_id': chatflow_id,
        'days': days,
        'conversations': conversations,
    })

    return _paginate_convos(conversations, page, per_page, search, quality_filter, intent_filter)


def _paginate_convos(convos, page, per_page, search, quality_filter, intent_filter):
    """Apply filters and paginate conversations."""
    if search:
        convos = [c for c in convos if search in c.get('first_message', '').lower()
                  or search in c.get('intent', '').lower()]
    if quality_filter:
        convos = [c for c in convos if c.get('quality') == quality_filter]
    if intent_filter:
        convos = [c for c in convos if c.get('intent') == intent_filter]

    total = len(convos)

    # Compute summary stats
    quality_counts = Counter(c.get('quality', '') for c in convos)
    intent_counts = Counter(c.get('intent', '') for c in convos)

    start = (page - 1) * per_page
    end = start + per_page

    # Strip full messages from paginated response (keep them only for detail)
    page_convos = []
    for c in convos[start:end]:
        summary = {k: v for k, v in c.items() if k != 'messages'}
        summary['message_preview'] = c.get('messages', [])[:4]  # First 2 exchanges
        page_convos.append(summary)

    return jsonify({
        'conversations': page_convos,
        'total': total,
        'page': page,
        'pages': max(1, (total + per_page - 1) // per_page),
        'quality_summary': dict(quality_counts),
        'intent_summary': dict(intent_counts),
    })


@app.route('/api/insights/conversation-detail')
def api_conversation_detail():
    """Get full messages for a single conversation."""
    chatflow_id = request.args.get('chatflow_id', '')
    session_id = request.args.get('session_id', '')
    days = int(request.args.get('days', 30))

    if not chatflow_id or not session_id:
        return jsonify({'error': 'chatflow_id and session_id required'}), 400

    cached = _load_conv_cache(chatflow_id, days)
    if cached:
        for c in cached.get('conversations', []):
            if c.get('session_id') == session_id:
                return jsonify({'conversation': c})

    return jsonify({'error': 'Conversation not found. Load conversations first.'}), 404


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# Per-chatflow refresh
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

@app.route('/api/insights/refresh-chatflow')
def api_refresh_chatflow():
    """Refresh data for a single chatflow without re-fetching all."""
    chatflow_id = request.args.get('chatflow_id', '')
    days = int(request.args.get('days', 30))

    if not chatflow_id:
        return jsonify({'error': 'chatflow_id required'}), 400

    import requests as req

    flowise_url = os.getenv('FLOWISE_URL', '')
    flowise_key = os.getenv('FLOWISE_API_KEY', '')
    if not flowise_url:
        return jsonify({'error': 'FLOWISE_URL not configured'}), 500

    try:
        start_date = ''
        if days > 0:
            start_date = (datetime.now() - __import__('datetime').timedelta(days=days)).strftime('%Y-%m-%dT00:00:00.000Z')

        headers = {'Authorization': f'Bearer {flowise_key}', 'Accept': 'application/json'}
        params = {'chatType': 'EXTERNAL', 'order': 'ASC'}
        if start_date:
            params['startDate'] = start_date

        ext = req.get(f'{flowise_url}/api/v1/chatmessage/{chatflow_id}',
                      headers=headers, params=params, timeout=60).json()
        params['chatType'] = 'INTERNAL'
        internal = req.get(f'{flowise_url}/api/v1/chatmessage/{chatflow_id}',
                           headers=headers, params=params, timeout=60).json()
        all_msgs = ext + internal

    except Exception as e:
        return jsonify({'error': f'Failed to fetch: {e}'}), 502

    # Run pattern analysis
    sys.path.insert(0, _app_dir)
    sys.path.insert(0, _analytics_dir)
    from analyzer import analyze_chatflow as _analyze_chatflow

    results = _analyze_chatflow(chatflow_id, all_msgs)
    results['unanswered_topics'] = dict(results.get('unanswered_topics', {}))
    results['tool_usage'] = dict(results.get('tool_usage', {}))
    results['daily_volume'] = dict(results.get('daily_volume', {}))

    # Build conversations
    conversations = _build_conversations_from_messages(all_msgs)
    _save_conv_cache(chatflow_id, days, {
        'chatflow_id': chatflow_id,
        'days': days,
        'conversations': conversations,
    })

    # Rebuild per-chatflow insights
    cf_gaps_raw = results.get('knowledge_gaps', [])
    cf_msgs = results.get('total_messages', 0)
    cf_convs = results.get('total_conversations', 0)
    cf_leaks = len(results.get('doc_leaks', []))
    cf_ota = results.get('off_topic_answered', 0)
    cf_issues = len(cf_gaps_raw) + cf_leaks + cf_ota
    cf_health = max(0, min(100, round(100 * (1 - cf_issues / max(cf_msgs + 1, 1)))))

    cf_dv = sorted(
        [{'date': d, 'messages': c} for d, c in results.get('daily_volume', {}).items()],
        key=lambda x: x['date']
    )

    cf_heatmap = dict(results.get('hourly_heatmap', {}))

    # Build action plan
    cf_gap_agg = defaultdict(lambda: {'count': 0, 'examples': [], 'latest_date': ''})
    for gap in cf_gaps_raw:
        topic = gap.get('user_question', '(desconocida)')
        a = cf_gap_agg[topic]
        a['count'] += 1
        if len(a['examples']) < 3:
            a['examples'].append({
                'question': gap.get('user_question', '(desconocida)'),
                'response': (gap.get('bot_response', '') or '')[:250],
                'date': gap.get('date', None),
            })
        gd = gap.get('date', '')
        if gd and gd > a['latest_date']:
            a['latest_date'] = gd

    cf_plan = []
    for topic, info in cf_gap_agg.items():
        cnt = info['count']
        ld = info['latest_date']
        try:
            dt2 = datetime.fromisoformat(ld[:19].replace('Z', ''))
            da = (datetime.now() - dt2).days
        except Exception:
            da = 30
        rf = 1.5 if da <= 7 else 1.2 if da <= 14 else 1.0
        isc = round(cnt * rf, 1)
        pri = 'critica' if isc >= 10 else 'alta' if isc >= 5 else 'media' if isc >= 2 else 'baja'
        cf_plan.append({
            'topic': topic, 'count': cnt, 'examples': info['examples'],
            'latest_date': ld, 'impact_score': isc, 'priority': pri,
        })
    cf_plan.sort(key=lambda x: x['impact_score'], reverse=True)

    # Get chatflow name
    chatflow_name = chatflow_id
    cached_insights = _load_cache(days)
    if cached_insights:
        for cf in cached_insights.get('chatflows', []):
            if cf.get('id') == chatflow_id:
                chatflow_name = cf.get('name', chatflow_id)
                break

    chatflow_data = {
        'id': chatflow_id,
        'name': chatflow_name,
        'total_messages': cf_msgs,
        'total_conversations': cf_convs,
        'gaps': len(cf_gaps_raw),
        'health_score': cf_health,
        'daily_volume': cf_dv,
        'action_plan': cf_plan,
        'heatmap': cf_heatmap,
    }

    # Invalidate AI enrichment cache for this chatflow
    ai_path = _ai_cache_path(chatflow_id, days)
    if os.path.exists(ai_path):
        os.remove(ai_path)

    return jsonify({
        'chatflow': chatflow_data,
        'conversations_count': len(conversations),
    })


@app.route('/api/messages/files')
def api_message_files():
    return jsonify({'files': _local_message_files()})


@app.route('/api/messages/upload', methods=['POST'])
def api_message_upload():
    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'file required'}), 400
    filename = os.path.basename(file.filename or 'Messages.json')
    if not filename.lower().endswith('.json'):
        return jsonify({'error': 'Only JSON files are supported'}), 400
    os.makedirs(DATA_DIR, exist_ok=True)
    path = os.path.join(DATA_DIR, filename)
    file.save(path)
    return jsonify({'ok': True, 'filename': filename})


@app.route('/api/messages/load')
def api_message_load():
    filename = request.args.get('file', '')
    try:
        raw = _load_message_file(filename)
    except Exception as e:
        return jsonify({'error': str(e)}), 404
    rows = _normalize_message_rows(raw)
    conversations = _build_conversations_from_messages([
        {
            'chatId': row.get('session_id'),
            'sessionId': row.get('session_id'),
            'role': row.get('role'),
            'content': row.get('content'),
            'createdDate': row.get('createdDate'),
        }
        for row in rows
    ])
    analysis = _analyze_messages('', filename, raw)
    return jsonify({
        'filename': filename,
        'total_messages': analysis['total_messages'],
        'total_sessions': analysis['total_conversations'],
        'conversations': conversations,
        'pattern_analysis': analysis,
    })


@app.route('/api/messages/conversations')
def api_message_conversations():
    filename = request.args.get('file', '')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 50))
    search = request.args.get('search', '').lower()
    route_filter = request.args.get('route', '')
    try:
        raw = _load_message_file(filename)
    except Exception as e:
        return jsonify({'error': str(e)}), 404
    rows = _normalize_message_rows(raw)
    conversations = _build_conversations_from_messages([
        {
            'chatId': row.get('session_id'),
            'sessionId': row.get('session_id'),
            'role': row.get('role'),
            'content': row.get('content'),
            'createdDate': row.get('createdDate'),
        }
        for row in rows
    ])
    return _paginate_convos(conversations, page, per_page, search, '', route_filter)


@app.route('/api/messages/analyze', methods=['POST'])
def api_message_analyze():
    body = request.get_json(force=True, silent=True) or {}
    filename = body.get('file', '')
    try:
        raw = _load_message_file(filename)
    except Exception as e:
        return jsonify({'error': str(e)}), 404
    analysis = _analyze_messages('', filename, raw)
    result_dir = os.path.join(DATA_DIR, '.ai_results')
    os.makedirs(result_dir, exist_ok=True)
    result_path = os.path.join(result_dir, hashlib.sha256(filename.encode()).hexdigest()[:16] + '.json')
    with open(result_path, 'w', encoding='utf-8') as handle:
        json.dump(analysis, handle, ensure_ascii=False, default=str)
    return jsonify({'ok': True})


@app.route('/api/messages/analyze-status')
def api_message_analyze_status():
    filename = request.args.get('file', '')
    result_path = os.path.join(DATA_DIR, '.ai_results', hashlib.sha256(filename.encode()).hexdigest()[:16] + '.json')
    if not os.path.exists(result_path):
        return jsonify({'status': 'idle'})
    with open(result_path, 'r', encoding='utf-8') as handle:
        data = json.load(handle)
    return jsonify({'status': 'ready', 'data': data})


@app.route('/api/messages/eda')
def api_message_eda():
    filename = request.args.get('file', '')
    try:
        raw = _load_message_file(filename)
    except Exception as e:
        return jsonify({'error': str(e)}), 404
    analysis = _analyze_messages('', filename, raw)
    total_messages = analysis['total_messages']
    total_sessions = max(analysis['total_conversations'], 1)
    daily = [{'date': k, 'count': v, 'messages': v} for k, v in sorted(analysis['daily_volume'].items())]
    hourly = [{'hour': h, 'count': 0} for h in range(24)]
    dow = [{'dow': d, 'day': ('Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom')[d], 'count': 0} for d in range(7)]
    for key, value in analysis['hourly_heatmap'].items():
        try:
            d, h = [int(x) for x in key.split('_')]
            hourly[h]['count'] += value
            dow[d]['count'] += value
        except Exception:
            pass
    return jsonify({
        'summary': {
            'total_sessions': total_sessions,
            'total_messages': total_messages,
            'avg_daily': round(total_messages / max(len(daily), 1), 1),
            'date_range': {'days': max(len(daily), 1)},
        },
        'msg_stats': {
            'user_length': {'median': 0, 'p25': 0, 'p75': 0},
            'bot_length': {'median': 0, 'p25': 0, 'p75': 0},
            'ratio_bot_user': 0,
        },
        'conv_stats': {
            'msgs_per_conv': {'median': round(total_messages / total_sessions, 1)},
            'user_msgs_per_conv': {'median': round(analysis['user_messages'] / total_sessions, 1)},
            'duration_min': {'median': 0},
            'response_sec': {'median': 0, 'mean': 0},
        },
        'engagement': [
            {'segment': 'Bounce', 'count': 0, 'pct': 0, 'median_duration': 0},
            {'segment': 'Corta', 'count': total_sessions, 'pct': 100, 'median_duration': 0},
            {'segment': 'Media', 'count': 0, 'pct': 0, 'median_duration': 0},
            {'segment': 'Larga', 'count': 0, 'pct': 0, 'median_duration': 0},
        ],
        'heatmap': analysis['hourly_heatmap'],
        'daily_volume': daily,
        'hourly_dist': hourly,
        'dow_dist': dow,
        'tool_usage': {
            'top_tools': [{'tool': k, 'count': v} for k, v in sorted(analysis['tool_usage'].items(), key=lambda x: x[1], reverse=True)],
            'total_distinct': len(analysis['tool_usage']),
            'convos_with_tools': 0,
            'convos_with_tools_pct': 0,
        },
        'distributions': {},
        'quality': {
            'knowledge_gaps': len(analysis['knowledge_gaps']),
            'doc_leaks': len(analysis['doc_leaks']),
            'length_issues': len(analysis['length_issues']),
        },
    })


@app.route('/api/status')
def api_status():
    """Quick check if upstream is ready."""
    try:
        import requests
        r = requests.get(UPSTREAM_URL + '/api/status', timeout=5)
        return jsonify(r.json())
    except Exception as e:
        return jsonify({
            'status': 'ready',
            'mode': 'standalone',
            'upstream_error': str(e),
            'local_files': len(_local_message_files()),
            'flowise_configured': bool(os.getenv('FLOWISE_URL', '')),
        })


@app.route('/api/<path:subpath>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def api_proxy(subpath):
    """Proxy unhandled /api/* requests to the internal dashboard."""
    import requests as req
    url = f'{UPSTREAM_URL}/api/{subpath}'
    excluded_req = {'host', 'x-api-key', 'content-length'}
    try:
        resp = req.request(
            method=request.method,
            url=url,
            params=request.args,
            headers={k: v for k, v in request.headers if k.lower() not in excluded_req},
            data=request.get_data(),
            timeout=120,
        )
        excluded_resp = {'content-encoding', 'content-length', 'transfer-encoding', 'connection'}
        headers = [(k, v) for k, v in resp.raw.headers.items() if k.lower() not in excluded_resp]
        return app.response_class(resp.content, status=resp.status_code, headers=headers)
    except Exception as e:
        return jsonify({'error': f'upstream error: {e}'}), 502


@app.route('/<path:path>')
def spa_catchall(path):
    full = os.path.join(_dist_dir, path)
    if os.path.isfile(full):
        from flask import send_from_directory
        return send_from_directory(_dist_dir, path)

    index_path = os.path.join(_dist_dir, 'index.html')
    if os.path.exists(index_path):
        with open(index_path, 'r', encoding='utf-8') as f:
            return f.read()

    return 'Not found', 404


if __name__ == '__main__':
    port = int(os.getenv('PORT', '5070'))
    print(f'\n  Chatbot Insights starting at http://localhost:{port}')
    print(f'  Upstream: {UPSTREAM_URL}\n')
    app.run(host='0.0.0.0', port=port, debug=True)
