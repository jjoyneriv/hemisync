import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { gatewayFeatures } from "../data/content";

export default function Gateway() {
  return (
    <section id="experience" className="relative py-20 md:py-28 bg-section-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 text-xs font-medium text-aurora-400 bg-aurora-500/10 border border-aurora-500/20 rounded-full mb-4">
              Featured Program
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Begin with the Gateway Path
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              A structured introduction to breath, attention, sound layering, and
              guided awareness practices.
            </p>

            <ul className="mt-8 space-y-3">
              {gatewayFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-nebula-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-nebula-400" />
                  </div>
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href="/experience"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-nebula-500 to-aurora-500 rounded-full hover:opacity-90 transition-opacity"
            >
              Start the Gateway Path
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card rounded-3xl p-8 md:p-10 glow-aurora">
              <div className="grid grid-cols-2 gap-4">
                {["Breathwork", "Sound Layering", "Visualization", "Deep Rest", "Focus Training", "Progress Tracking"].map(
                  (item, i) => (
                    <div
                      key={item}
                      className="glass-card rounded-xl p-4 text-center"
                    >
                      <div
                        className="w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2"
                        style={{
                          background: `linear-gradient(135deg, ${
                            ["#6366f1", "#a78bfa", "#818cf8", "#4338ca", "#6366f1", "#a78bfa"][i]
                          }20, transparent)`,
                        }}
                      >
                        <span className="text-lg">{["🌬️", "🎵", "👁️", "🌙", "🎯", "📊"][i]}</span>
                      </div>
                      <p className="text-sm text-slate-300">{item}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
