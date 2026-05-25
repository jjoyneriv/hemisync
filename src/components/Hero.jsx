import { motion } from "framer-motion";
import { Play, Headphones } from "lucide-react";

function Orb() {
  return (
    <div className="orb-container animate-float mx-auto">
      <div className="orb-ring" />
      <div className="orb-ring" />
      <div className="orb-ring" />
      <div className="orb-core" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-end gap-[3px] h-12">
          {[18, 28, 36, 28, 40, 32, 24, 36, 20, 30, 38, 26, 34, 22, 30].map((h, i) => (
            <span
              key={i}
              className="waveform-bar"
              style={{ height: `${h}px`, animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SessionCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="glass-card rounded-2xl p-4 max-w-sm mx-auto mt-8"
    >
      <div className="flex items-center gap-3">
        <button className="w-10 h-10 rounded-full bg-gradient-to-br from-nebula-500 to-aurora-500 flex items-center justify-center shrink-0" aria-label="Play session">
          <Play className="w-4 h-4 text-white ml-0.5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">Morning Alignment</p>
          <p className="text-xs text-slate-400">Daily Reset &middot; 10 min</p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-nebula-500/20 text-nebula-300 border border-nebula-500/30">
          Beginner
        </span>
      </div>
      <div className="mt-3 flex items-end gap-[2px] h-8 opacity-60">
        {Array.from({ length: 40 }, (_, i) => (
          <span
            key={i}
            className="waveform-bar"
            style={{
              height: `${8 + Math.sin(i * 0.5) * 16 + Math.random() * 8}px`,
              animationDelay: `${i * 0.05}s`,
              opacity: 0.5 + Math.random() * 0.5,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative pt-28 md:pt-36 pb-20 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-cosmic-gradient" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-nebula-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-aurora-500/8 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Guide Your Mind Into Deeper{" "}
              <span className="text-gradient">Focus, Rest, and Awareness</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 max-w-xl leading-relaxed">
              Explore immersive audio sessions designed to support meditation, sleep,
              concentration, relaxation, and creative flow.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="/start"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-nebula-500 to-aurora-500 rounded-full hover:opacity-90 transition-opacity glow-nebula"
              >
                <Headphones className="w-5 h-5" />
                Start Your Free Session
              </a>
              <a
                href="/library"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-slate-300 border border-glass-border rounded-full hover:bg-white/5 transition-colors"
              >
                Explore the Audio Library
              </a>
            </div>

            <p className="mt-8 text-sm text-slate-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Audio-guided experiences for focus, sleep, meditation, and inner exploration.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <Orb />
            <SessionCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
