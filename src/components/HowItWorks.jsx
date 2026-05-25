import { motion } from "framer-motion";
import { Headphones, ListChecks, Play } from "lucide-react";
import { howItWorksSteps, howItWorksPrinciples } from "../data/content";

const stepIcons = [ListChecks, Headphones, Play];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 md:py-28 bg-section-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            How Audio Guidance Supports Your Practice
          </h2>
          <p className="mt-6 text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Hemi-Sync's claim is that these carefully layered tones help the brain move toward certain states of awareness — relaxation, focus, sleep, meditation, or altered awareness — by encouraging a frequency-following response, where brain activity tends to synchronize somewhat with rhythmic audio stimulation. The Monroe Institute describes this as "hemispheric synchronization," meaning the left and right hemispheres are encouraged to work together more coherently.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <ul className="space-y-4">
              {howItWorksPrinciples.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-nebula-500 shrink-0" />
                  <span className="text-slate-300 leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-xs text-slate-500 border-t border-glass-border pt-4">
              This platform does not diagnose, treat, cure, or prevent medical conditions.
            </p>
          </motion.div>

          <div className="space-y-6">
            {howItWorksSteps.map((step, i) => {
              const Icon = stepIcons[i];
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="glass-card rounded-2xl p-6 flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-nebula-500/20 to-aurora-500/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-nebula-400" />
                  </div>
                  <div>
                    <p className="text-xs text-nebula-400 font-mono mb-1">Step {step.step}</p>
                    <h3 className="font-display text-lg font-semibold text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
