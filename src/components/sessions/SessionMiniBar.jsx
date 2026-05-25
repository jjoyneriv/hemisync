import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ChevronUp } from "lucide-react";
import { useSession } from "../../context/SessionContext";

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function SessionMiniBar() {
  const { activeSession, isRunning, elapsed, targetDuration, pauseSession, resumeSession, showSessionModal, setShowSessionModal } = useSession();

  if (!activeSession || showSessionModal) return null;

  const remaining = Math.max(targetDuration - elapsed, 0);
  const progress = Math.min((elapsed / targetDuration) * 100, 100);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-[55] bg-cosmic-800/95 backdrop-blur-xl border-t border-glass-border"
      >
        <div className="h-0.5 bg-white/5">
          <div className="h-full bg-gradient-to-r from-nebula-500 to-aurora-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {activeSession.coverSrc && (
              <img src={activeSession.coverSrc} alt="" className="w-9 h-9 rounded-lg object-cover" />
            )}
            <div>
              <p className="text-sm font-medium text-white">{activeSession.title}</p>
              <p className="text-[10px] text-slate-500">{formatTime(remaining)} remaining</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={isRunning ? pauseSession : resumeSession}
              className="w-9 h-9 rounded-full bg-nebula-500/20 flex items-center justify-center text-nebula-400 hover:bg-nebula-500/30 transition-colors"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              onClick={() => setShowSessionModal(true)}
              className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
