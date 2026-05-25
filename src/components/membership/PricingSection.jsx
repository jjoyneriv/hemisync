import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Crown, Star, Zap } from "lucide-react";
import { plans, memberStats } from "../../data/membership";
import { useAuth } from "../../context/AuthContext";

const planIcons = { free: Zap, premium: Star, pro: Crown };

export default function PricingSection() {
  const [annual, setAnnual] = useState(true);
  const { user, setShowAuth, setAuthMode, updatePlan, canDownload } = useAuth();

  const handleSelectPlan = (plan) => {
    if (!user) {
      setAuthMode("signup");
      setShowAuth(true);
      return;
    }
    if (plan.id === "free") {
      updatePlan("free");
      return;
    }
    updatePlan(plan.id);
  };

  return (
    <section id="membership" className="relative py-20 md:py-28">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-nebula-500/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 text-xs font-medium text-nebula-400 bg-nebula-500/10 border border-nebula-500/20 rounded-full mb-4">
            Membership
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Unlock Your Full Audio Journey
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            Choose a plan that fits your practice. Members get unlimited access to our entire library of meditation, focus, sleep, and wellness audio.
          </p>

          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm ${!annual ? "text-white" : "text-slate-500"}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-nebula-500" : "bg-white/10"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${annual ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
            <span className={`text-sm ${annual ? "text-white" : "text-slate-500"}`}>
              Annual <span className="text-emerald-400 text-xs font-medium">Save 17%</span>
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => {
            const Icon = planIcons[plan.id];
            const price = plan.id === "free" ? 0 : (annual ? plan.priceYearly : plan.priceMonthly);
            const isCurrentPlan = user && user.plan === plan.id;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative rounded-2xl p-6 md:p-8 flex flex-col ${
                  plan.popular
                    ? "glass-card border-nebula-500/40 glow-nebula"
                    : "glass-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-semibold text-white bg-gradient-to-r from-nebula-500 to-aurora-500 rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    plan.popular ? "bg-nebula-500/20" : "bg-white/5"
                  }`}>
                    <Icon className={`w-5 h-5 ${plan.popular ? "text-nebula-400" : "text-slate-400"}`} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">{plan.name}</h3>
                  </div>
                </div>

                <div className="mb-4">
                  {plan.id === "free" ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white">Free</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white">${annual ? Math.round(price / 12) : price}</span>
                      <span className="text-sm text-slate-500">/month</span>
                    </div>
                  )}
                  {plan.id !== "free" && annual && (
                    <p className="text-xs text-slate-500 mt-1">Billed ${price}/year</p>
                  )}
                </div>

                <p className="text-sm text-slate-400 mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                  {plan.limitations.map((l) => (
                    <li key={l} className="flex items-start gap-2 text-sm text-slate-500">
                      <X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                      {l}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrentPlan}
                  className={`w-full py-3 text-sm font-medium rounded-full transition-all ${
                    isCurrentPlan
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default"
                      : plan.popular
                        ? "text-white bg-gradient-to-r from-nebula-500 to-aurora-500 hover:opacity-90 glow-nebula"
                        : "text-slate-300 border border-glass-border hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {isCurrentPlan ? "Current Plan" : plan.cta}
                </button>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {Object.entries(memberStats).map(([key, value]) => (
            <div key={key} className="text-center">
              <p className="text-xl font-bold text-gradient font-display">{value}</p>
              <p className="text-xs text-slate-500 mt-1">
                {key === "totalMembers" && "Members"}
                {key === "activeListeners" && "Active Listeners"}
                {key === "sessionsPlayed" && "Sessions Played"}
                {key === "avgRating" && "Average Rating"}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
