import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Clock, Headphones, ArrowRight, Search } from "lucide-react";
import { products } from "../data/products";
import { bonusProduct } from "../data/products";

const allProducts = [
  { id: "deep-resonance", title: "Deep Resonance", subtitle: "Guided Meditation", category: "Meditation", duration: "0:30", description: "A deeply immersive meditation journey through progressive stages of relaxation and expanded awareness.", coverSrc: "/images/cover-deep-resonance.svg", tags: ["Meditation", "Binaural", "Deep Focus"] },
  { id: "celestial-drift", title: "Celestial Drift", subtitle: "Ambient Sound Journey", category: "Sleep", duration: "2:00", description: "A two-minute ambient sound journey designed to carry you through progressive stages of sonic immersion.", coverSrc: "/images/cover-celestial-drift.svg", tags: ["Sleep", "Ambient", "Cosmic"] },
  ...products.map(p => ({ id: p.id, title: p.title, subtitle: p.subtitle, category: p.category, duration: p.duration, description: p.description, coverSrc: p.coverSrc, tags: p.tags })),
  { id: bonusProduct.id, title: bonusProduct.title, subtitle: bonusProduct.subtitle, category: bonusProduct.category, duration: bonusProduct.duration, description: bonusProduct.description, coverSrc: bonusProduct.coverSrc, tags: bonusProduct.tags },
];

const categoryColors = {
  Focus: { badge: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30", glow: "hover:shadow-cyan-500/10" },
  Sleep: { badge: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30", glow: "hover:shadow-indigo-500/10" },
  Relaxation: { badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", glow: "hover:shadow-emerald-500/10" },
  Creativity: { badge: "text-amber-400 bg-amber-500/10 border-amber-500/30", glow: "hover:shadow-amber-500/10" },
  "Daily Reset": { badge: "text-rose-400 bg-rose-500/10 border-rose-500/30", glow: "hover:shadow-rose-500/10" },
  Meditation: { badge: "text-violet-400 bg-violet-500/10 border-violet-500/30", glow: "hover:shadow-violet-500/10" },
};

const allCategories = ["All", ...new Set(allProducts.map(p => p.category))];

export default function AudioLibrary() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = allProducts.filter(p => {
    if (activeCategory !== "All" && p.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return `${p.title} ${p.subtitle} ${p.category} ${p.description} ${p.tags.join(" ")}`.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <section id="library" className="relative py-20 md:py-28 bg-section-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Browse the Full Collection
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            {allProducts.length} handcrafted audio sessions spanning sleep, focus, meditation, relaxation, and creativity. Each track is designed for headphones and ready to play.
          </p>
        </motion.div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-glass-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-nebula-500/50 transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-nebula-500 text-white shadow-lg shadow-nebula-500/20"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-6">{filtered.length} session{filtered.length !== 1 ? "s" : ""} found</p>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {filtered.map((product, i) => {
            const colors = categoryColors[product.category] || categoryColors.Meditation;
            return (
              <motion.a
                href={`#product-${product.id}`}
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
                className={`glass-card rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 hover:border-white/15 hover:shadow-xl ${colors.glow}`}
              >
                {/* Cover Image */}
                <div className="relative aspect-square overflow-hidden bg-cosmic-800">
                  <img
                    src={product.coverSrc}
                    alt={`${product.title} cover art`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border ${colors.badge}`}>
                      {product.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-display text-sm font-semibold text-white group-hover:text-nebula-300 transition-colors truncate">
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{product.subtitle}</p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-glass-border">
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {product.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Headphones className="w-3 h-3" />
                        Stereo
                      </span>
                    </div>
                    <span className="text-[10px] text-nebula-400 group-hover:text-nebula-300 flex items-center gap-0.5">
                      View
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500">No sessions match your search.</p>
          </div>
        )}
      </div>
    </section>
  );
}
