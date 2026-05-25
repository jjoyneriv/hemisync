import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [activeSession, setActiveSession] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [targetDuration, setTargetDuration] = useState(600);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [streak, setStreak] = useState(0);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hemisync-session-history");
      if (saved) setSessionHistory(JSON.parse(saved));
      const savedStreak = localStorage.getItem("hemisync-streak");
      if (savedStreak) setStreak(JSON.parse(savedStreak));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("hemisync-session-history", JSON.stringify(sessionHistory));
  }, [sessionHistory]);

  useEffect(() => {
    localStorage.setItem("hemisync-streak", JSON.stringify(streak));
  }, [streak]);

  const startSession = useCallback((track, duration) => {
    setActiveSession(track);
    setTargetDuration(duration);
    setElapsed(0);
    setIsRunning(true);
    setShowSessionModal(true);

    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(track.audioSrc);
    audioRef.current = audio;
    audio.loop = true;
    audio.play().catch(() => {});

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
  }, []);

  const pauseSession = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (audioRef.current) audioRef.current.pause();
  }, []);

  const resumeSession = useCallback(() => {
    setIsRunning(true);
    if (audioRef.current) audioRef.current.play().catch(() => {});
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
  }, []);

  const endSession = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (activeSession && elapsed > 30) {
      const entry = {
        id: crypto.randomUUID(),
        trackId: activeSession.id,
        trackTitle: activeSession.title,
        category: activeSession.category,
        duration: elapsed,
        targetDuration,
        completedAt: new Date().toISOString(),
        completed: elapsed >= targetDuration * 0.9,
      };
      setSessionHistory((prev) => [entry, ...prev]);

      const today = new Date().toDateString();
      const lastSession = sessionHistory[0];
      if (!lastSession || new Date(lastSession.completedAt).toDateString() !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (lastSession && new Date(lastSession.completedAt).toDateString() === yesterday) {
          setStreak((s) => s + 1);
        } else if (!lastSession || new Date(lastSession.completedAt).toDateString() !== today) {
          setStreak(1);
        }
      }
    }

    setActiveSession(null);
    setIsRunning(false);
    setElapsed(0);
  }, [activeSession, elapsed, targetDuration, sessionHistory]);

  useEffect(() => {
    if (elapsed >= targetDuration && isRunning) {
      pauseSession();
    }
  }, [elapsed, targetDuration, isRunning, pauseSession]);

  const todaysSessions = sessionHistory.filter(
    (s) => new Date(s.completedAt).toDateString() === new Date().toDateString()
  );
  const todaysMinutes = Math.round(todaysSessions.reduce((sum, s) => sum + s.duration, 0) / 60);
  const totalMinutes = Math.round(sessionHistory.reduce((sum, s) => sum + s.duration, 0) / 60);
  const totalSessions = sessionHistory.length;

  return (
    <SessionContext.Provider value={{
      activeSession, isRunning, elapsed, targetDuration,
      startSession, pauseSession, resumeSession, endSession,
      sessionHistory, streak, todaysSessions, todaysMinutes, totalMinutes, totalSessions,
      showSessionModal, setShowSessionModal,
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
