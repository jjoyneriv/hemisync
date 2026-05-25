import { motion } from "framer-motion";
import { Headphones, Library } from "lucide-react";

export default function FinalCTA() {
  return (
    <section id="cta" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-nebula-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-aurora-500/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight">
            Start Your First Audio Session Today
          </h2>
          <p className="mt-6 text-lg text-slate-300 max-w-xl mx-auto">
            Create a calmer, more focused daily rhythm with guided sound
            experiences.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/start"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-nebula-500 to-aurora-500 rounded-full hover:opacity-90 transition-opacity glow-nebula"
            >
              <Headphones className="w-5 h-5" />
              Start Free
            </a>
            <a
              href="/library"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-slate-300 border border-glass-border rounded-full hover:bg-white/5 transition-colors"
            >
              <Library className="w-5 h-5" />
              Browse Library
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
