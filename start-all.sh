#!/bin/bash
# HemiSync.org — Start All Services
# Usage: bash /opt/hemisync-org/start-all.sh

set -e

export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm use 20

# API keys — set these environment variables before running:
#   export STRIPE_SECRET_KEY="rk_test_..."
#   export ELEVENLABS_API_KEY="sk_..."
export STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY:?Set STRIPE_SECRET_KEY environment variable}"
export ELEVENLABS_API_KEY="${ELEVENLABS_API_KEY:?Set ELEVENLABS_API_KEY environment variable}"

LOGDIR="/tmp/hemisync-logs"
mkdir -p "$LOGDIR"

stop_service() {
  local port=$1
  local pid=$(lsof -ti:$port 2>/dev/null)
  if [ -n "$pid" ]; then
    kill $pid 2>/dev/null
    sleep 1
  fi
}

echo "========================================"
echo "  HemiSync.org — Starting All Services"
echo "========================================"
echo ""

# 1. Stripe API (port 3001)
echo "[1/5] Stripe API server (port 3001)..."
stop_service 3001
node /opt/hemisync-org/server.cjs > "$LOGDIR/stripe.log" 2>&1 &
sleep 2
if curl -sk -o /dev/null -w "" --max-time 3 https://localhost:3001/api/checkout-session/test 2>/dev/null; then
  echo "      ✓ Stripe API running"
else
  echo "      ✗ Stripe API failed — check $LOGDIR/stripe.log"
fi

# 2. Music Store / SoundVault (port 4000)
echo "[2/5] Music Store — SoundVault (port 4000)..."
stop_service 4000
cd /opt/music-store && npx next start -p 4000 > "$LOGDIR/music-store.log" 2>&1 &
sleep 3
if curl -s -o /dev/null -w "" --max-time 3 http://localhost:4000 2>/dev/null; then
  echo "      ✓ Music Store running"
else
  echo "      ✗ Music Store failed — check $LOGDIR/music-store.log"
fi

# 3. Agent Portal (port 3000)
echo "[3/5] Agent Portal (port 3000)..."
stop_service 3000
cd /opt/agent-portal && node_modules/.bin/vite --port 3000 --host 0.0.0.0 > "$LOGDIR/agent-portal.log" 2>&1 &
sleep 2
if curl -s -o /dev/null -w "" --max-time 3 http://localhost:3000 2>/dev/null; then
  echo "      ✓ Agent Portal running"
else
  echo "      ✗ Agent Portal failed — check $LOGDIR/agent-portal.log"
fi

# 4. n8n Workflow Engine (port 5678)
echo "[4/5] n8n Workflow Engine (port 5678)..."
stop_service 5678
N8N_PORT=5678 \
N8N_PROTOCOL=https \
N8N_HOST=0.0.0.0 \
N8N_SSL_KEY=/opt/hemisync-org/certs/key.pem \
N8N_SSL_CERT=/opt/hemisync-org/certs/cert.pem \
n8n start > "$LOGDIR/n8n.log" 2>&1 &
sleep 4
if curl -sk -o /dev/null -w "" --max-time 5 https://localhost:5678 2>/dev/null; then
  echo "      ✓ n8n running"
else
  echo "      ✗ n8n failed — check $LOGDIR/n8n.log"
fi

# 5. HemiSync.org main site (port 443)
echo "[5/5] HemiSync.org (port 443, HTTPS)..."
stop_service 443
cd /opt/hemisync-org && node_modules/.bin/vite --port 443 --host 0.0.0.0 > "$LOGDIR/hemisync.log" 2>&1 &
sleep 3
if curl -sk -o /dev/null -w "" --max-time 3 https://localhost:443 2>/dev/null; then
  echo "      ✓ HemiSync.org running"
else
  echo "      ✗ HemiSync.org failed — check $LOGDIR/hemisync.log"
fi

echo ""
echo "========================================"
echo "  All Services Started"
echo "========================================"
echo ""
echo "  https://hemisync.org            — Main site"
echo "  https://hemisync.org/store      — SoundVault"
echo "  https://hemisync.org:5678       — n8n Workflows"
echo "  http://184.105.230.239:3000     — Agent Portal"
echo ""
echo "  Logs: $LOGDIR/"
echo "  Stop all: bash /opt/hemisync-org/stop-all.sh"
echo ""
