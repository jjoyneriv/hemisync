import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hemisync-user");
      if (saved) setUser(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("hemisync-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("hemisync-user");
    }
  }, [user]);

  const signup = (email, name, password) => {
    const users = JSON.parse(localStorage.getItem("hemisync-users") || "[]");
    if (users.find((u) => u.email === email)) {
      return { error: "An account with this email already exists." };
    }
    const newUser = {
      id: crypto.randomUUID(),
      email,
      name,
      plan: "free",
      joinedAt: new Date().toISOString(),
      downloads: [],
      favorites: [],
      listenHistory: [],
      totalListenMinutes: 0,
      streak: 0,
      avatar: name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
    };
    users.push({ ...newUser, password });
    localStorage.setItem("hemisync-users", JSON.stringify(users));
    setUser(newUser);
    setShowAuth(false);
    return { success: true };
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("hemisync-users") || "[]");
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      return { error: "Invalid email or password." };
    }
    const { password: _, ...userData } = found;
    setUser(userData);
    setShowAuth(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setShowDashboard(false);
  };

  const updatePlan = (planId) => {
    if (!user) return;
    const updated = { ...user, plan: planId, upgradedAt: new Date().toISOString() };
    setUser(updated);
    const users = JSON.parse(localStorage.getItem("hemisync-users") || "[]");
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updated };
      localStorage.setItem("hemisync-users", JSON.stringify(users));
    }
  };

  const addDownload = (trackId) => {
    if (!user) return;
    const updated = {
      ...user,
      downloads: [...new Set([...user.downloads, trackId])],
    };
    setUser(updated);
  };

  const toggleFavorite = (trackId) => {
    if (!user) return;
    const favs = user.favorites.includes(trackId)
      ? user.favorites.filter((f) => f !== trackId)
      : [...user.favorites, trackId];
    setUser({ ...user, favorites: favs });
  };

  const canDownload = user && (user.plan === "premium" || user.plan === "pro");
  const isPro = user && user.plan === "pro";

  return (
    <AuthContext.Provider value={{
      user, signup, login, logout, updatePlan,
      addDownload, toggleFavorite,
      canDownload, isPro,
      showAuth, setShowAuth, authMode, setAuthMode,
      showDashboard, setShowDashboard,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
