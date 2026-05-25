import { motion } from "framer-motion";
import { Smartphone, Star, Flame, ListMusic } from "lucide-react";
import { appFeatures } from "../data/content";

const featureIcons = [Star, Star, Flame, ListMusic];

export default function AppPromo() {
  return (
    <section id="app" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 text-xs font-medium text-nebula-400 bg-nebula-500/10 border border-nebula-500/20 rounded-full mb-4">
              Mobile App
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Your Audio Practice, Anywhere
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed max-w-lg">
              Save favorites, create playlists, track your progress, and return to
              your preferred states with one tap.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="/app/ios"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-white/10 border border-glass-border rounded-full hover:bg-white/15 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Download for iOS
              </a>
              <a
                href="/app/android"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-white/10 border border-glass-border rounded-full hover:bg-white/15 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.73c.56.33 1.26.25 1.73-.15l8.56-5.47-2.93-2.78-7.36 7.02c-.27.26-.25.66 0 1.38zm-.63-2.73V3c0-.37.12-.72.32-1L11.12 10 3.55 21zM20.16 10.61l-3.28-1.85-3.24 3.09 3.24 3.09 3.28-1.85c.82-.46 1.24-1.28 1.24-2.24s-.42-1.78-1.24-2.24zm-8.4-1.96l2.97-2.82L6.3.62c-.47-.27-1-.33-1.47-.18l6.93 6.21z"/>
                </svg>
                Download for Android
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {appFeatures.map((feature, i) => {
              const Icon = featureIcons[i];
              return (
                <div
                  key={feature.title}
                  className="glass-card rounded-2xl p-5 text-center"
                >
                  <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-br from-nebula-500/20 to-aurora-500/20 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-nebula-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
