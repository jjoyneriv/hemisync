import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Play, Pause, ShoppingCart, Heart, Share2, Headphones, Clock,
  Star, Download, Volume2, Check, ChevronRight, ChevronDown, CheckCircle,
} from "lucide-react";
import { useCart } from "../context/CartContext";

function WaveformVisualizer({ isPlaying, seed = 0 }) {
  return (
    <div className="flex items-end gap-[2px] h-10">
      {Array.from({ length: 50 }, (_, i) => (
        <span
          key={i}
          className="waveform-bar"
          style={{
            height: `${6 + Math.sin(i * 0.35 + seed) * 14 + ((i * 7 + seed * 13) % 10)}px`,
            animationDelay: `${i * 0.05}s`,
            animationPlayState: isPlaying ? "running" : "paused",
            opacity: 0.4 + ((i * 3 + seed * 7) % 6) / 10,
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
        <Star key={s} className={`w-4 h-4 ${s <= rating ? "text-gold-500 fill-gold-500" : "text-slate-600"}`} />
      ))}
    </div>
  );
}

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-glass-border">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left" aria-expanded={open}>
        <span className="text-sm font-semibold text-white">{title}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-5">{children}</motion.div>}
    </div>
  );
}

export default function ProductPageTemplate({ product, altBg = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.id);
  const audioRef = useRef(null);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const t = () => setCurrentTime(a.currentTime);
    const m = () => setDuration(a.duration);
    const e = () => setIsPlaying(false);
    a.addEventListener("timeupdate", t);
    a.addEventListener("loadedmetadata", m);
    a.addEventListener("ended", e);
    return () => { a.removeEventListener("timeupdate", t); a.removeEventListener("loadedmetadata", m); a.removeEventListener("ended", e); };
  }, []);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) a.pause(); else a.play();
    setIsPlaying(!isPlaying);
  };

  const fmt = (s) => { const m = Math.floor(s / 60); return `${m}:${Math.floor(s % 60).toString().padStart(2, "0")}`; };
  const progress = duration ? (currentTime / duration) * 100 : 0;
  const accent = product.accent || "nebula";
  const gradientFrom = product.gradientFrom || "from-nebula-500";
  const gradientTo = product.gradientTo || "to-aurora-500";

  return (
    <section id={`product-${product.id}`} className={`relative py-24 md:py-32 ${altBg ? "bg-section-alt" : ""}`}>
      <audio ref={audioRef} src={product.audioSrc} preload="metadata" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 flex-wrap" aria-label="Breadcrumb">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <ChevronRight className="w-3 h-3" />
          <a href="/library" className="hover:text-white transition-colors">Library</a>
          <ChevronRight className="w-3 h-3" />
          <a href={`/categories/${product.category.toLowerCase()}`} className="hover:text-white transition-colors">{product.category}</a>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-400">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className={`relative rounded-3xl overflow-hidden ${altBg ? "glow-aurora" : "glow-nebula"} group`}>
              <img src={product.coverSrc} alt={`${product.title} — ${product.subtitle} cover art`} className="w-full aspect-square object-cover" />
              <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors" aria-label={isPlaying ? "Pause" : "Play"}>
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {isPlaying ? <Pause className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 text-white ml-1" />}
                </div>
              </button>
            </div>
            <div className="mt-6 glass-card rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <button onClick={togglePlay} className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity`} aria-label={isPlaying ? "Pause" : "Play"}>
                  {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white truncate">{product.title}</span>
                    <span className="text-xs text-slate-500 ml-2 tabular-nums">{fmt(currentTime)} / {fmt(duration || product.durationSeconds || 600)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 cursor-pointer overflow-hidden" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); if (audioRef.current) audioRef.current.currentTime = ((e.clientX - r.left) / r.width) * (duration || product.durationSeconds || 600); }}>
                    <div className={`h-full rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo} transition-all duration-200`} style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <Volume2 className="w-4 h-4 text-slate-500 shrink-0" />
              </div>
              <div className="mt-4"><WaveformVisualizer isPlaying={isPlaying} seed={product.seed || 0} /></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`px-3 py-1 text-xs font-medium ${product.categoryColor || "text-aurora-400 bg-aurora-500/10 border-aurora-500/20"} border rounded-full`}>{product.category}</span>
              {product.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2.5 py-1 text-xs text-slate-400 bg-white/5 border border-glass-border rounded-full">{tag}</span>
              ))}
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">{product.title}</h2>
            <p className={`mt-1 text-lg ${product.subtitleColor || "text-aurora-400"}`}>{product.subtitle}</p>
            <p className="mt-2 text-sm text-slate-400">By <span className="text-slate-300">{product.artist}</span></p>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <StarRating rating={product.rating || 5} />
              <span className="text-sm text-slate-400">{product.reviews.length} reviews</span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1 text-sm text-slate-400"><Clock className="w-3.5 h-3.5" />{product.duration}</span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1 text-sm text-slate-400"><Headphones className="w-3.5 h-3.5" />Stereo</span>
            </div>
            <p className="mt-6 text-slate-300 leading-relaxed">{product.description}</p>
            <div className="mt-8 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-white">${product.price.mp3.toFixed(2)}</span>
              <span className="text-sm text-slate-500">MP3 Digital Download</span>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => addItem(product)}
                disabled={inCart}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-medium rounded-full transition-all ${
                  inCart
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default"
                    : `text-white bg-gradient-to-r ${gradientFrom} ${gradientTo} hover:opacity-90 glow-nebula`
                }`}
              >
                {inCart ? <><CheckCircle className="w-5 h-5" />In Cart</> : <><ShoppingCart className="w-5 h-5" />Add to Cart</>}
              </button>
              <button onClick={() => setWishlisted(!wishlisted)} className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${wishlisted ? "border-rose-500/50 bg-rose-500/10 text-rose-400" : "border-glass-border bg-glass text-slate-400 hover:text-white"}`} aria-label="Wishlist">
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
              </button>
              <button className="w-12 h-12 rounded-full border border-glass-border bg-glass text-slate-400 hover:text-white flex items-center justify-center transition-colors" aria-label="Share"><Share2 className="w-5 h-5" /></button>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400"><Download className="w-4 h-4" /><span>Instant digital download after purchase</span></div>
            <div className="mt-8 border-t border-glass-border">
              <Accordion title="Sound Design" defaultOpen={true}>
                <ul className="space-y-2">{product.details.map((d) => (<li key={d} className="flex items-start gap-2 text-sm text-slate-400"><Check className="w-4 h-4 text-nebula-400 shrink-0 mt-0.5" />{d}</li>))}</ul>
              </Accordion>
              <Accordion title="Benefits">
                <ul className="space-y-2">{product.benefits.map((b) => (<li key={b} className="flex items-start gap-2 text-sm text-slate-400"><Check className="w-4 h-4 text-aurora-400 shrink-0 mt-0.5" />{b}</li>))}</ul>
              </Accordion>
              <Accordion title="Listening Instructions">
                <p className="text-sm text-slate-400 leading-relaxed">{product.instructions}</p>
              </Accordion>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="mt-20">
          <h3 className="font-display text-2xl font-bold text-white mb-8">Listener Reviews</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {product.reviews.map((r) => (
              <div key={r.name} className="glass-card rounded-2xl p-6">
                <StarRating rating={r.rating} />
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                <p className="mt-4 text-sm font-medium text-white">{r.name}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="mt-20">
          <h3 className="font-display text-2xl font-bold text-white mb-8">You Might Also Like</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {product.related.map((rp) => {
              const slug = rp.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
              return (
                <a key={rp.title} href={`#product-${slug}`} className="glass-card rounded-2xl overflow-hidden group cursor-pointer transition-all hover:glow-nebula">
                  <img src={`/images/cover-${slug}.svg`} alt={rp.title} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="p-4">
                    <h4 className="font-display text-base font-semibold text-white group-hover:text-nebula-300 transition-colors">{rp.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{rp.category} &middot; {rp.duration}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </motion.div>

        <p className="mt-16 text-xs text-slate-600 text-center max-w-2xl mx-auto">
          This content is for informational and personal development purposes only and is not a substitute for medical, psychological, or professional care. HemiSync.org is an independent platform and is not affiliated with any similarly named commercial brand unless otherwise stated.
        </p>
      </div>
    </section>
  );
}
