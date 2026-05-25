import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials } from "../data/content";

export default function Testimonials() {
  return (
    <section className="relative py-20 md:py-28 bg-section-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Listeners Are Building Better Daily Rituals
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 flex flex-col"
            >
              <Quote className="w-8 h-8 text-nebula-500/40 mb-3 shrink-0" />
              <p className="text-slate-300 text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-glass-border">
                <p className="text-sm font-medium text-white">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
