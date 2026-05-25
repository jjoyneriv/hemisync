import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Clock, Calendar, Flame, Target, Timer, ChevronRight, Headphones, BarChart3 } from "lucide-react";
import { scheduledSessions, sessionPresets } from "../../data/sessions";
import { products, bonusProduct } from "../../data/products";
import { useSession } from "../../context/SessionContext";
import { useAuth } from "../../context/AuthContext";

const allTracks = [...products, bonusProduct];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const today = dayNames[new Date().getDay()];

const categoryColors = {
  Sleep: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
  Focus: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  Meditation: "text-violet-400 bg-violet-500/10 border-violet-500/30",
  Relaxation: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  Creativity: "text-pink-400 bg-pink-500/10 border-pink-500/30",
  "Daily Reset": "text-amber-400 bg-amber-500/10 border-amber-500/30",
};

export default function SessionsSection() {
  const { startSession, streak, todaysMinutes, totalSessions, totalMinutes, sessionHistory, setShowSessionModal } = useSession();
  const { user, setShowAuth, setAuthMode } = useAuth();
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(600);
  const [showPicker, setShowPicker] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(10);

  const todayScheduled = scheduledSessions.filter((s) => s.days.includes(today));

  const handleStartSession = (track, duration) => {
    if (!user) {
      setAuthMode("signup");
      setShowAuth(true);
      return;
    }
    startSession(track, duration);
  };

  const handleQuickStart = (scheduled) => {
    const track = allTracks.find((t) => t.id === scheduled.trackId);
    if (track) handleStartSession(track, scheduled.duration);
  };

  return (
    <section id="sessions" className="relative py-20 md:py-28 bg-section-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 text-xs font-medium text-nebula-400 bg-nebula-500/10 border border-nebula-500/20 rounded-full mb-4">
            Practice
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Start a Session
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            Choose a track, set your timer, and begin your practice. Every session is logged to help you build consistency.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <div className="glass-card rounded-xl p-4 text-center">
            <Flame className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white font-mono">{streak}</p>
            <p className="text-xs text-slate-500">Day Streak</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <Timer className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white font-mono">{todaysMinutes}</p>
            <p className="text-xs text-slate-500">Minutes Today</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <Target className="w-5 h-5 text-nebula-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white font-mono">{totalSessions}</p>
            <p className="text-xs text-slate-500">Total Sessions</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <BarChart3 className="w-5 h-5 text-aurora-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white font-mono">{totalMinutes}</p>
            <p className="text-xs text-slate-500">Total Minutes</p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Start a Session */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Choose Your Practice</h3>

            {/* Duration presets */}
            <div className="flex flex-wrap gap-2 mb-6">
              {sessionPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    if (preset.id === "custom") {
                      setSelectedDuration(customMinutes * 60);
                    } else {
                      setSelectedDuration(preset.duration);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all ${
                    (preset.duration === selectedDuration || (preset.id === "custom" && customMinutes * 60 === selectedDuration))
                      ? "bg-nebula-500 text-white shadow-lg shadow-nebula-500/20"
                      : "bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  <span>{preset.icon}</span>
                  {preset.id === "custom" ? (
                    <span className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={customMinutes}
                        onChange={(e) => {
                          const v = parseInt(e.target.value) || 10;
                          setCustomMinutes(v);
                          setSelectedDuration(v * 60);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 bg-transparent text-center text-white outline-none"
                      />
                      min
                    </span>
                  ) : (
                    preset.label
                  )}
                </button>
              ))}
            </div>

            {/* Track picker */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {allTracks.slice(0, 12).map((track) => {
                const colors = categoryColors[track.category] || categoryColors.Meditation;
                return (
                  <button
                    key={track.id}
                    onClick={() => handleStartSession(track, selectedDuration)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                  >
                    <img src={track.coverSrc} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate group-hover:text-nebula-300 transition-colors">
                        {track.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${colors}`}>
                          {track.category}
                        </span>
                        <span className="text-[10px] text-slate-500">{track.duration}</span>
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-nebula-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4 text-nebula-400 ml-0.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Right: Today's Schedule + History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-8"
          >
            {/* Today's Schedule */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-nebula-400" />
                Today&apos;s Schedule
              </h3>
              <div className="space-y-3">
                {todayScheduled.map((session) => {
                  const colors = categoryColors[session.category] || categoryColors.Meditation;
                  return (
                    <div key={session.id} className="glass-card rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-mono text-nebula-400">{session.time}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${colors}`}>
                              {session.category}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-white">{session.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{session.description}</p>
                        </div>
                        <button
                          onClick={() => handleQuickStart(session)}
                          className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-nebula-500 to-aurora-500 flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                          aria-label={`Start ${session.title}`}
                        >
                          <Play className="w-4 h-4 ml-0.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent History */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                Recent Practice
              </h3>
              {sessionHistory.length === 0 ? (
                <div className="glass-card rounded-xl p-6 text-center">
                  <Headphones className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No sessions yet. Start your first practice above.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sessionHistory.slice(0, 8).map((entry) => (
                    <div key={entry.id} className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-white/[0.02]">
                      <div className={`w-2 h-2 rounded-full ${entry.completed ? "bg-emerald-400" : "bg-amber-400"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{entry.trackTitle}</p>
                        <p className="text-[10px] text-slate-500">
                          {new Date(entry.completedAt).toLocaleDateString()} &middot; {Math.round(entry.duration / 60)} min
                        </p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        entry.completed ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {entry.completed ? "Completed" : "Partial"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
