#!/bin/bash
# HemiSync.org — Stop All Services

echo "Stopping all services..."

for port in 443 3000 3001 4000 5678; do
  pid=$(lsof -ti:$port 2>/dev/null)
  if [ -n "$pid" ]; then
    kill $pid 2>/dev/null
    echo "  Stopped port $port (PID $pid)"
  else
    echo "  Port $port — not running"
  fi
done

sleep 1
echo "All services stopped."
