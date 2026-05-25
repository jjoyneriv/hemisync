import { motion } from "framer-motion";
import { stats } from "../data/content";

export default function Stats() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Designed for Everyday Mental Clarity
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 md:p-8 text-center"
            >
              <p className="font-display text-3xl md:text-4xl font-bold text-gradient">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-slate-500 max-w-2xl mx-auto">
          Results vary by individual. HemiSync.org provides educational wellness
          content and is not medical treatment.
        </p>
      </div>
    </section>
  );
}
