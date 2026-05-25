#!/bin/bash
set -e

API_KEY="${ELEVENLABS_API_KEY:?Set ELEVENLABS_API_KEY environment variable}"
BASE_DIR="/opt/hemisync-org/public/audio"
PARTS_DIR="$BASE_DIR/parts"
mkdir -p "$PARTS_DIR"

generate_song() {
  local id="$1"
  local prompt="$2"
  local segments=20
  local song_dir="$PARTS_DIR/$id"
  mkdir -p "$song_dir"

  echo "[$id] Generating $segments segments..."

  for i in $(seq -w 1 $segments); do
    local outfile="$song_dir/seg-${i}.mp3"
    if [ -f "$outfile" ] && [ -s "$outfile" ]; then
      echo "  [$id] Segment $i already exists, skipping"
      continue
    fi

    local variant=""
    local seg_num=$((10#$i))
    if [ $seg_num -le 3 ]; then
      variant="Opening introduction phase. Gentle fade in. "
    elif [ $seg_num -le 7 ]; then
      variant="Building development phase. Evolving textures. "
    elif [ $seg_num -le 13 ]; then
      variant="Peak immersion phase. Full depth and richness. "
    elif [ $seg_num -le 17 ]; then
      variant="Sustained deep phase. Maintaining presence. "
    else
      variant="Closing resolution phase. Gentle fade toward silence. "
    fi

    local retries=0
    while [ $retries -lt 3 ]; do
      local http_code
      http_code=$(curl -s -X POST "https://api.elevenlabs.io/v1/sound-generation" \
        -H "xi-api-key: $API_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"text\": \"${variant}${prompt}\", \"duration_seconds\": 30}" \
        --output "$outfile" \
        -w "%{http_code}" 2>/dev/null)

      if [ "$http_code" = "200" ] && [ -s "$outfile" ]; then
        echo "  [$id] Segment $i done (HTTP $http_code)"
        break
      else
        retries=$((retries + 1))
        echo "  [$id] Segment $i failed (HTTP $http_code), retry $retries..."
        rm -f "$outfile"
        sleep 5
      fi
    done
  done

  echo "[$id] Concatenating..."
  local concat_file="$song_dir/concat.txt"
  > "$concat_file"
  for i in $(seq -w 1 $segments); do
    echo "file 'seg-${i}.mp3'" >> "$concat_file"
  done

  ffmpeg -y -f concat -safe 0 -i "$concat_file" \
    -filter_complex "afade=t=in:st=0:d=3,afade=t=out:st=597:d=3" \
    -codec:a libmp3lame -b:a 192k \
    "$BASE_DIR/${id}.mp3" 2>/dev/null

  local duration
  duration=$(ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$BASE_DIR/${id}.mp3" 2>/dev/null)
  echo "[$id] DONE — ${duration}s"
}

# Song prompts
declare -A PROMPTS
PROMPTS[lunar-tide]="Gentle sleep ambient soundscape. Very slow descending warm synth pads, ultra-low frequency drones, soft ocean-like stereo panning, gradual volume reduction. Peaceful, drowsy, hypnotic. No drums, no vocals, no sharp sounds. 50 BPM."
PROMPTS[inner-compass]="Rhythmic focus ambient soundscape. Steady subtle pulse, layered mid-range harmonics, consistent energy, minimal melody, soft stereo patterning. Clear, focused, productive atmosphere. No drums, no vocals. 70 BPM steady."
PROMPTS[violet-flame]="Deep contemplative meditation ambient. Rich violet-hued harmonic overtones, resonant bass drones, spacious cathedral-like reverb, singing bowl tonal qualities, progressive deepening. Sacred, mystical, profound. No drums, no vocals. 50 BPM."
PROMPTS[morning-dew]="Morning awakening ambient soundscape. Gentle warm tones gradually ascending, golden bright synth textures, soft nature-inspired elements, slow energy increase. Uplifting, fresh, clear. No drums, no vocals. 60 BPM."
PROMPTS[starfield]="Creative inspiration ambient soundscape. Evolving shifting textures, unexpected gentle harmonic combinations, wide spatial field, shimmering high sparkle, warm grounding undertones. Imaginative, exploratory, calm. No drums, no vocals. 65 BPM."
PROMPTS[ocean-of-calm]="Ocean-inspired relaxation ambient. Gentle wave-like sound swells, warm low-mid frequencies, ocean stereo movement, predictable soothing patterns, spacious depth. Calming, peaceful, tension-releasing. No drums, no vocals. 55 BPM."
PROMPTS[quantum-rest]="Power recovery ambient soundscape. Quick descending calming phase, sustained deep rest drones, restorative frequencies, gentle ascending re-energizing tones. Restorative, efficient, precise. No drums, no vocals. 50 BPM."
PROMPTS[sacred-geometry]="Sacred geometry harmonic meditation. Mathematically precise harmonic intervals, perfect fifths and octaves, crystalline bell tones, symmetrical stereo field. Balanced, precise, beautiful. No drums, no vocals. 54 BPM."
PROMPTS[infinite-horizon]="Expansive awareness meditation ambient. Progressive spatial widening, ascending harmonic layers, panoramic reverb, crystalline high shimmer, warm bass foundation, breath-synchronized swells. Spacious, clear, infinite, uplifting. No drums, no vocals. 58 BPM."
PROMPTS[aurora-stream]="Northern lights inspired meditation. Flowing ethereal curtains of sound, shimmering high harmonics, deep space atmosphere, gentle color-like tonal shifts, aurora-inspired stereo movement. Magical, awe-inspiring, transcendent. No drums, no vocals. 52 BPM."
PROMPTS[dream-weaver]="Lucid dreaming ambient soundscape. Surreal shifting textures, dreamlike transitions, soft floating pads, gentle unpredictable harmonic shifts, deep warm undertones. Dreamy, surreal, weightless. No drums, no vocals. 48 BPM."
PROMPTS[mindful-pulse]="Active mindfulness meditation. Gentle rhythmic pulse guiding breathing, warm heartbeat-like bass, soft body awareness tones, grounding earthy textures. Present, embodied, alive. No drums, no vocals. 60 BPM."
PROMPTS[zen-garden]="Japanese zen garden meditation. Sparse minimalist tones, occasional bell-like sounds, vast silence between notes, bamboo flute-inspired wind tones, stone garden tranquility. Simple, pure, empty. No drums, no vocals. 45 BPM."
PROMPTS[neural-sync]="Brainwave synchronization ambient. Precise binaural-inspired frequency patterns, alpha wave targeting, focused stereo pulsing, clean clinical tones, digital clarity. Sharp, precise, aligned. No drums, no vocals. 72 BPM."
PROMPTS[twilight-passage]="Evening twilight transition ambient. Day-to-night tonal arc, warm sunset colors fading to cool moonlight tones, gentle descending energy, peaceful closure. Settling, dimming, peaceful. No drums, no vocals. 50 BPM."
PROMPTS[heart-resonance]="Heart-centered emotional balance meditation. Warm chest-resonant frequencies, gentle heartbeat rhythm, compassionate soft tones, emotional warmth, nurturing embrace-like swells. Loving, warm, safe. No drums, no vocals. 58 BPM."
PROMPTS[cosmic-library]="Cosmic knowledge meditation. Ancient wisdom tones, vast library-like reverb, crystalline thought-activating harmonics, golden light frequencies, contemplative depth. Wise, vast, illuminating. No drums, no vocals. 55 BPM."
PROMPTS[silver-thread]="Intuition meditation ambient. Delicate silver-toned harmonics, subtle whisper-like textures, quiet contemplative space, thin ethereal threads of sound, crystalline clarity. Intuitive, subtle, precise. No drums, no vocals. 52 BPM."
PROMPTS[deep-earth]="Deep earth grounding meditation. Low resonant bass drones, warm earthy tones, geological rumble undertones, cave-like reverb, primal stability. Grounded, solid, ancient. No drums, no vocals. 48 BPM."
PROMPTS[crystal-caves]="Crystal cave exploration ambient. Crystalline resonant tones, dripping water echoes, mineral harmonic overtones, vast underground reverb, sparkling reflections. Mysterious, beautiful, deep. No drums, no vocals. 50 BPM."
PROMPTS[solar-winds]="Solar wind energy ambient. Bright radiant frequencies, warm solar glow tones, charged particle shimmer, ascending energy currents, dynamic brightness. Energizing, warm, powerful. No drums, no vocals. 68 BPM."
PROMPTS[midnight-lotus]="Midnight lotus deep meditation. Dark rich velvet tones, lotus-inspired pure bell harmonics, midnight stillness, deep indigo atmosphere, profound silence between tones. Serene, deep, mystical. No drums, no vocals. 42 BPM."
PROMPTS[breath-of-life]="Breathwork companion ambient. Rhythmic breathing-pace swells, gentle inhale-exhale wave patterns, soft air-like textures, life-affirming warmth, oxygen-rich clarity. Alive, rhythmic, nourishing. No drums, no vocals. 56 BPM."
PROMPTS[northern-lights]="Northern lights wonder ambient. Shimmering curtains of harmonic color, dancing luminescent tones, vast arctic sky atmosphere, awe-inspiring spatial movement, magical shimmer. Wondrous, magical, vast. No drums, no vocals. 54 BPM."
PROMPTS[temple-bells]="Temple bells mindfulness meditation. Resonant bell strikes at intervals, long reverberant decay, meditative silence between strikes, warm temple atmosphere, contemplative spacing. Mindful, present, sacred. No drums, no vocals. 40 BPM."
PROMPTS[floating-islands]="Floating islands imagination ambient. Weightless ascending textures, cloud-soft pad layers, whimsical gentle melodies, open sky spaciousness, dream archipelago atmosphere. Weightless, whimsical, free. No drums, no vocals. 62 BPM."
PROMPTS[iron-resolve]="Iron resolve determination ambient. Steady unwavering drone, metallic harmonic strength, industrial precision undertones, focused laser clarity, unbreakable rhythm. Strong, determined, unshakeable. No drums, no vocals. 74 BPM."
PROMPTS[prism-light]="Color spectrum meditation ambient. Prismatic rainbow harmonics shifting through frequency bands, warm light-like tones, spectral shimmer, gentle chromatic movement. Colorful, radiant, joyful. No drums, no vocals. 56 BPM."
PROMPTS[ancient-forest]="Ancient forest nature immersion. Deep woodland atmosphere, distant birdsong-like tones, rustling canopy textures, moss-covered resonance, ancient tree depth. Primordial, peaceful, alive. No drums, no vocals. 50 BPM."
PROMPTS[diamond-mind]="Diamond clarity focus ambient. Ultra-clear crystalline tones, precise sharp harmonics, transparent sonic space, laser-focused frequencies, brilliant high-end shimmer. Crystal clear, sharp, brilliant. No drums, no vocals. 76 BPM."
PROMPTS[tidal-dream]="Deep ocean tidal sleep ambient. Slow massive wave swells, underwater resonance, deep pressure drones, bioluminescent shimmer tones, abyssal calm. Oceanic, vast, enveloping. No drums, no vocals. 44 BPM."
PROMPTS[phoenix-rise]="Phoenix renewal meditation ambient. Rising transformative tones, warm fire-like frequencies ascending, rebirth crescendo swells, ember glow warmth, triumphant resolution. Rising, powerful, renewed. No drums, no vocals. 64 BPM."
PROMPTS[silk-road]="Silk road journey meditation. Exotic harmonic intervals, warm spice-market overtones, caravan rhythm undertones, desert wind textures, ancient trade route mystique. Exotic, warm, adventurous. No drums, no vocals. 58 BPM."
PROMPTS[glacier-peace]="Glacial deep stillness ambient. Vast frozen landscape tones, ice crystal resonance, extreme slow movement, pristine silence, arctic purity. Still, vast, pristine. No drums, no vocals. 40 BPM."
PROMPTS[quantum-field]="Quantum field unified awareness meditation. Superposition harmonic layers, entangled stereo frequencies, probability wave textures, unified field resonance, observer-state stillness. Infinite, unified, mysterious. No drums, no vocals. 52 BPM."
PROMPTS[storm-eye]="Storm eye calm focus ambient. Surrounding turbulence textures with perfectly still center, contrast between chaos and calm, unwavering inner peace frequency. Centered, unshakeable, calm. No drums, no vocals. 66 BPM."
PROMPTS[golden-hour]="Golden hour sunset reflection ambient. Warm amber-gold frequencies, fading daylight tones, nostalgic gentle warmth, peaceful ending energy, gratitude-inducing resonance. Warm, golden, grateful. No drums, no vocals. 54 BPM."

SONG_ID="$1"

if [ -n "$SONG_ID" ]; then
  generate_song "$SONG_ID" "${PROMPTS[$SONG_ID]}"
else
  for id in "${!PROMPTS[@]}"; do
    generate_song "$id" "${PROMPTS[$id]}"
  done
fi
