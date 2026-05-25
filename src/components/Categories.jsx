import { motion } from "framer-motion";
import { Moon, Target, Waves, Wind, Sparkles, RotateCcw, ArrowRight } from "lucide-react";
import { categories } from "../data/content";

const iconMap = { Moon, Target, Waves, Wind, Sparkles, RotateCcw };

export default function Categories() {
  return (
    <section id="categories" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Choose the State You Want to Support
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon];
            return (
              <motion.a
                href="#sessions"
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6 md:p-8 group cursor-pointer transition-all duration-300 hover:glow-nebula block"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-nebula-500/20 to-aurora-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-nebula-400" />
                </div>
                <h3 className="font-display text-lg font-semibold text-white mb-2">
                  {cat.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm text-nebula-400 group-hover:text-nebula-300 transition-colors">
                  Explore sessions
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
