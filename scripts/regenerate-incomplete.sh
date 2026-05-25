#!/bin/bash
# Regenerate incomplete songs when ElevenLabs credits reset
# Run: bash /opt/hemisync-org/scripts/regenerate-incomplete.sh

API_KEY="${ELEVENLABS_API_KEY:?Set ELEVENLABS_API_KEY environment variable}"
cd /opt/hemisync-org

# Check if credits are available
echo "Checking ElevenLabs credit status..."
RESPONSE=$(curl -s -X POST "https://api.elevenlabs.io/v1/sound-generation" \
  -H "xi-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text": "credit check tone", "duration_seconds": 5}' \
  -w "\n%{http_code}" --output /tmp/credit-check.mp3 2>/dev/null)

HTTP_CODE=$(echo "$RESPONSE" | tail -1)

if [ "$HTTP_CODE" != "200" ]; then
  echo "Credits not available yet (HTTP $HTTP_CODE). Try again later."
  exit 1
fi

rm -f /tmp/credit-check.mp3
echo "Credits available! Starting regeneration..."

INCOMPLETE_SONGS=(midnight-lotus breath-of-life northern-lights temple-bells floating-islands iron-resolve)

for song in "${INCOMPLETE_SONGS[@]}"; do
  target="/opt/hemisync-org/public/audio/${song}.mp3"
  dur=$(ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$target" 2>/dev/null)
  dur_int=${dur%.*}

  if [ "${dur_int:-0}" -lt 590 ]; then
    echo "[$song] Currently ${dur_int}s — regenerating missing segments..."
    bash scripts/generate-audio.sh "$song"
  else
    echo "[$song] Already complete (${dur_int}s) — skipping"
  fi
done

echo ""
echo "=== Final status ==="
for song in "${INCOMPLETE_SONGS[@]}"; do
  dur=$(ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "/opt/hemisync-org/public/audio/${song}.mp3" 2>/dev/null)
  printf "  %-20s %6.0fs\n" "$song" "$dur"
done
