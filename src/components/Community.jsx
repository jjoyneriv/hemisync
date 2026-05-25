import { motion } from "framer-motion";
import { Users, Briefcase, Palette, Heart, BedDouble } from "lucide-react";
import { communityGroups } from "../data/content";

const icons = [Users, Briefcase, Palette, Heart, BedDouble];

export default function Community() {
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
            Built for Curious Minds, Creators, and Wellness Practitioners
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {communityGroups.map((group, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card rounded-2xl p-5 text-center"
              >
                <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-br from-nebula-500/20 to-aurora-500/20 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-aurora-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  {group.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {group.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
