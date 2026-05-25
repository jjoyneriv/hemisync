import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Clock } from "lucide-react";
import { researchArticles } from "../data/content";

export default function Research() {
  return (
    <section id="research" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Grounded in Sound, Attention, and Practice
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Learn about meditation, breathwork, sound perception, binaural audio,
            relaxation response, and habit formation.
          </p>
        </motion.div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {researchArticles.map((article, i) => (
            <motion.article
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 group cursor-pointer transition-all duration-300 hover:glow-nebula flex flex-col"
            >
              <div className="w-10 h-10 rounded-lg bg-nebula-500/10 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5 text-nebula-400" />
              </div>
              <span className="text-xs text-aurora-400 font-medium mb-2">
                {article.category}
              </span>
              <h3 className="font-display text-base font-semibold text-white mb-3 leading-snug flex-1">
                {article.title}
              </h3>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </span>
                <ArrowRight className="w-4 h-4 text-nebula-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="/research"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-slate-300 border border-glass-border rounded-full hover:bg-white/5 transition-colors"
          >
            Visit the Research Library
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
