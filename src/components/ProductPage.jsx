import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  ShoppingCart,
  Heart,
  Share2,
  Headphones,
  Clock,
  BarChart3,
  ChevronRight,
  Star,
  Download,
  Volume2,
  Check,
  ChevronDown,
  CheckCircle,
} from "lucide-react";
import { useCart } from "../context/CartContext";

const product = {
  title: "Deep Resonance",
  subtitle: "Guided Meditation",
  artist: "HemiSync.org Audio Lab",
  price: { mp3: 9.99 },
  category: "Meditation",
  tags: ["Binaural", "Ambient", "Deep Focus", "Sleep", "Inner Journey"],
  duration: "30:00",
  tracks: [
    { num: 1, title: "Arrival — Breath Awareness", duration: "5:00" },
    { num: 2, title: "Descent — Body Scan & Release", duration: "6:00" },
    { num: 3, title: "Stillness — Frequency Immersion", duration: "8:00" },
    { num: 4, title: "Expansion — Open Awareness", duration: "6:00" },
    { num: 5, title: "Return — Gentle Reintegration", duration: "5:00" },
  ],
  description:
    "Embark on a deeply immersive meditation journey designed to guide you through progressive stages of relaxation, inner stillness, and expanded awareness. Deep Resonance uses carefully layered ambient soundscapes, warm evolving synth pads, soft low-frequency drones, and subtle stereo pulsing to create a sonic environment that supports natural hemispheric balance.",
  details: [
    "Warm evolving synth pads with gentle harmonic overtones",
    "Soft low-frequency drones for grounding and depth",
    "Subtle stereo pulsing inspired by binaural sound research",
    "Slow breathing-like swells at 50–65 BPM",
    "Spacious reverb and minimal melodic movement",
    "No drums, no vocals, no sharp sounds, no sudden changes",
  ],
  benefits: [
    "Support deep meditation and inner stillness",
    "Encourage natural relaxation before sleep",
    "Enhance focus during deep work sessions",
    "Create a calming environment for reflection",
    "Build a consistent daily audio practice",
  ],
  instructions:
    "For best results, use high-quality stereo headphones in a quiet, comfortable space. Close your eyes, settle into a relaxed position, and allow the audio to guide your attention inward. Sessions can be used for meditation, sleep preparation, deep focus, or creative exploration. Start with one session per day and adjust based on your comfort.",
  relatedProducts: [
    { title: "Evening Reset", category: "Sleep", duration: "22 min", cover: "🌙" },
    { title: "Morning Alignment", category: "Daily Reset", duration: "10 min", cover: "☀️" },
    { title: "Creative Signal", category: "Creativity", duration: "20 min", cover: "✨" },
  ],
  reviews: [
    { name: "Maria T.", rating: 5, text: "This is exactly what I needed for my evening meditation. The sound design is incredibly immersive." },
    { name: "Kevin R.", rating: 5, text: "I use this during deep work blocks. The subtle pulsing keeps me in flow without being distracting." },
    { name: "Aisha D.", rating: 4, text: "Beautiful soundscape. I'd love a longer version — 30 minutes goes by too fast." },
  ],
};

function WaveformVisualizer({ isPlaying }) {
  return (
    <div className="flex items-end gap-[2px] h-10">
      {Array.from({ length: 50 }, (_, i) => (
        <span
          key={i}
          className="waveform-bar"
          style={{
            height: `${6 + Math.sin(i * 0.4) * 14 + Math.random() * 10}px`,
            animationDelay: `${i * 0.05}s`,
            animationPlayState: isPlaying ? "running" : "paused",
            opacity: 0.5 + Math.random() * 0.5,
          }}
        />
      ))}
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${s <= rating ? "text-gold-500 fill-gold-500" : "text-slate-600"}`}
        />
      ))}
    </div>
  );
}

function AccordionSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-glass-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-white">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pb-5"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

export default function ProductPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem, isInCart } = useCart();
  const inCart = isInCart("deep-resonance");
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <section id="product-deep-resonance" className="relative py-24 md:py-32">
      <audio ref={audioRef} src="/audio/hemisync-meditation-01.mp3" preload="metadata" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <ChevronRight className="w-3 h-3" />
          <a href="/library" className="hover:text-white transition-colors">Library</a>
          <ChevronRight className="w-3 h-3" />
          <a href="/categories/meditation" className="hover:text-white transition-colors">Meditation</a>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-400">Deep Resonance</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left Column — Cover Art & Player */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Cover Art */}
            <div className="relative rounded-3xl overflow-hidden glow-nebula group">
              <img
                src="/images/cover-deep-resonance.svg"
                alt="Deep Resonance — Guided Meditation cover art featuring cosmic orbs, sound waves, and sacred geometry on a deep space background"
                className="w-full aspect-square object-cover"
              />
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors"
                aria-label={isPlaying ? "Pause preview" : "Play preview"}
              >
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {isPlaying ? (
                    <Pause className="w-7 h-7 text-white" />
                  ) : (
                    <Play className="w-7 h-7 text-white ml-1" />
                  )}
                </div>
              </button>
            </div>

            {/* Audio Player */}
            <div className="mt-6 glass-card rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-nebula-500 to-aurora-500 flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white truncate">Preview — Deep Resonance</span>
                    <span className="text-xs text-slate-500 ml-2 tabular-nums">
                      {formatTime(currentTime)} / {formatTime(duration || 30)}
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full bg-white/10 cursor-pointer overflow-hidden"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const pct = (e.clientX - rect.left) / rect.width;
                      if (audioRef.current) audioRef.current.currentTime = pct * (duration || 30);
                    }}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-nebula-500 to-aurora-500 transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <Volume2 className="w-4 h-4 text-slate-500 shrink-0" />
              </div>
              <div className="mt-4">
                <WaveformVisualizer isPlaying={isPlaying} />
              </div>
            </div>
          </motion.div>

          {/* Right Column — Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Category & Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 text-xs font-medium text-aurora-400 bg-aurora-500/10 border border-aurora-500/20 rounded-full">
                {product.category}
              </span>
              {product.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs text-slate-400 bg-white/5 border border-glass-border rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
              {product.title}
            </h2>
            <p className="mt-1 text-lg text-aurora-400">{product.subtitle}</p>
            <p className="mt-2 text-sm text-slate-400">
              By <span className="text-slate-300">{product.artist}</span>
            </p>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-4">
              <StarRating rating={5} />
              <span className="text-sm text-slate-400">
                {product.reviews.length} reviews
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1 text-sm text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {product.duration}
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1 text-sm text-slate-400">
                <Headphones className="w-3.5 h-3.5" />
                Stereo
              </span>
            </div>

            {/* Description */}
            <p className="mt-6 text-slate-300 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-8 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-white">${product.price.mp3.toFixed(2)}</span>
              <span className="text-sm text-slate-500">MP3 Digital Download</span>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => addItem({ id: "deep-resonance", ...product })}
                disabled={inCart}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-medium rounded-full transition-all ${
                  inCart
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default"
                    : "text-white bg-gradient-to-r from-nebula-500 to-aurora-500 hover:opacity-90 glow-nebula"
                }`}
              >
                {inCart ? <><CheckCircle className="w-5 h-5" />In Cart</> : <><ShoppingCart className="w-5 h-5" />Add to Cart</>}
              </button>
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                  wishlisted
                    ? "border-rose-500/50 bg-rose-500/10 text-rose-400"
                    : "border-glass-border bg-glass text-slate-400 hover:text-white"
                }`}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
              </button>
              <button
                className="w-12 h-12 rounded-full border border-glass-border bg-glass text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Instant Download Note */}
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400">
              <Download className="w-4 h-4" />
              <span>Instant digital download after purchase</span>
            </div>

            {/* Accordion Details */}
            <div className="mt-8 border-t border-glass-border">
              <AccordionSection title="Sound Design" defaultOpen={true}>
                <ul className="space-y-2">
                  {product.details.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-slate-400">
                      <Check className="w-4 h-4 text-nebula-400 shrink-0 mt-0.5" />
                      {d}
                    </li>
                  ))}
                </ul>
              </AccordionSection>

              <AccordionSection title="Benefits">
                <ul className="space-y-2">
                  {product.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-slate-400">
                      <Check className="w-4 h-4 text-aurora-400 shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </AccordionSection>

              <AccordionSection title="Listening Instructions">
                <p className="text-sm text-slate-400 leading-relaxed">
                  {product.instructions}
                </p>
              </AccordionSection>
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <h3 className="font-display text-2xl font-bold text-white mb-8">
            Listener Reviews
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {product.reviews.map((review) => (
              <div key={review.name} className="glass-card rounded-2xl p-6">
                <StarRating rating={review.rating} />
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                  &ldquo;{review.text}&rdquo;
                </p>
                <p className="mt-4 text-sm font-medium text-white">{review.name}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Related Products */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <h3 className="font-display text-2xl font-bold text-white mb-8">
            You Might Also Like
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {product.relatedProducts.map((rp) => {
              const slug = rp.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
              return (
              <a
                key={rp.title}
                href={`#product-${slug}`}
                className="glass-card rounded-2xl overflow-hidden group cursor-pointer transition-all hover:glow-nebula"
              >
                <img src={`/images/cover-${slug}.svg`} alt={rp.title} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="p-4">
                <h4 className="font-display text-base font-semibold text-white group-hover:text-nebula-300 transition-colors">
                  {rp.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {rp.category} &middot; {rp.duration}
                </p>
                </div>
              </a>
              );
            })}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <p className="mt-16 text-xs text-slate-600 text-center max-w-2xl mx-auto">
          This content is for informational and personal development purposes only
          and is not a substitute for medical, psychological, or professional care.
          HemiSync.org is an independent platform and is not affiliated with any
          similarly named commercial brand unless otherwise stated.
        </p>
      </div>
    </section>
  );
}
