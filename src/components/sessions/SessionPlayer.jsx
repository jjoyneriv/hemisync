import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, Square, RotateCcw, Timer, ChevronDown } from "lucide-react";
import { useSession } from "../../context/SessionContext";

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function SessionPlayer() {
  const {
    activeSession, isRunning, elapsed, targetDuration,
    pauseSession, resumeSession, endSession, showSessionModal, setShowSessionModal,
  } = useSession();
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);

  if (!activeSession) return null;

  const progress = Math.min((elapsed / targetDuration) * 100, 100);
  const remaining = Math.max(targetDuration - elapsed, 0);
  const isComplete = elapsed >= targetDuration;
  const circumference = 2 * Math.PI * 140;
  const strokeOffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {showSessionModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-cosmic-900/95 backdrop-blur-xl z-[70]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[70] flex flex-col items-center justify-center p-6"
          >
            {/* Minimize button */}
            <button
              onClick={() => setShowSessionModal(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronDown className="w-5 h-5" />
            </button>

            {/* Track info */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-10"
            >
              <p className="text-sm text-nebula-400 uppercase tracking-wider mb-2">
                {isComplete ? "Session Complete" : isRunning ? "In Session" : "Paused"}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-display">
                {activeSession.title}
              </h2>
              <p className="text-sm text-slate-400 mt-1">{activeSession.category}</p>
            </motion.div>

            {/* Circular timer */}
            <div className="relative w-72 h-72 md:w-80 md:h-80 mb-10">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 300 300">
                <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                <circle
                  cx="150" cy="150" r="140"
                  fill="none"
                  stroke={isComplete ? "#10b981" : "#6366f1"}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl md:text-6xl font-mono font-bold text-white tracking-tight">
                  {formatTime(remaining)}
                </span>
                <span className="text-xs text-slate-500 mt-2">remaining</span>
                <span className="text-sm text-slate-400 mt-1 font-mono">
                  {formatTime(elapsed)} elapsed
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {isComplete ? (
                <button
                  onClick={endSession}
                  className="flex items-center gap-2 px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full hover:opacity-90 transition-opacity"
                >
                  <RotateCcw className="w-5 h-5" />
                  Finish & Log
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setShowConfirmEnd(true)}
                    className="w-12 h-12 rounded-full border border-glass-border bg-white/5 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
                    aria-label="End session"
                  >
                    <Square className="w-4 h-4" />
                  </button>

                  <button
                    onClick={isRunning ? pauseSession : resumeSession}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-nebula-500 to-aurora-500 flex items-center justify-center text-white shadow-xl shadow-nebula-500/20 hover:opacity-90 transition-opacity"
                    aria-label={isRunning ? "Pause" : "Resume"}
                  >
                    {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                  </button>

                  <div className="w-12 h-12" />
                </>
              )}
            </div>

            {/* Cover art thumbnail */}
            {activeSession.coverSrc && (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                src={activeSession.coverSrc}
                alt=""
                className="absolute bottom-8 left-8 w-16 h-16 rounded-xl object-cover hidden md:block"
              />
            )}

            {/* Confirm end dialog */}
            <AnimatePresence>
              {showConfirmEnd && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-24 glass-card rounded-2xl p-5 text-center max-w-xs"
                >
                  <p className="text-sm text-white mb-3">End this session early?</p>
                  <p className="text-xs text-slate-400 mb-4">
                    {elapsed > 30 ? "Your progress will be saved." : "Session too short to log."}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowConfirmEnd(false)}
                      className="flex-1 px-4 py-2 text-sm text-slate-300 border border-glass-border rounded-lg hover:bg-white/5"
                    >
                      Continue
                    </button>
                    <button
                      onClick={() => { setShowConfirmEnd(false); endSession(); }}
                      className="flex-1 px-4 py-2 text-sm text-white bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30"
                    >
                      End Session
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
