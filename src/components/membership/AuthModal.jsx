import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Eye, EyeOff, Activity } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AuthModal() {
  const { showAuth, setShowAuth, authMode, setAuthMode, login, signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      let result;
      if (authMode === "signup") {
        if (!name.trim()) { setError("Name is required."); setLoading(false); return; }
        result = signup(email, name, password);
      } else {
        result = login(email, password);
      }

      if (result.error) {
        setError(result.error);
      } else {
        reset();
      }
      setLoading(false);
    }, 500);
  };

  return (
    <AnimatePresence>
      {showAuth && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={() => { setShowAuth(false); reset(); }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-cosmic-800 border border-glass-border rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nebula-500 to-aurora-500 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-display font-semibold text-white">
                      HemiSync<span className="text-aurora-400">.org</span>
                    </span>
                  </div>
                  <button onClick={() => { setShowAuth(false); reset(); }} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h2 className="text-xl font-bold text-white mb-1">
                  {authMode === "signup" ? "Create your account" : "Welcome back"}
                </h2>
                <p className="text-sm text-slate-400 mb-6">
                  {authMode === "signup"
                    ? "Start your audio wellness journey today."
                    : "Sign in to access your library and downloads."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
                {authMode === "signup" && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-glass-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-nebula-500/50 transition-colors"
                      required
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-glass-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-nebula-500/50 transition-colors"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-glass-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-nebula-500/50 transition-colors"
                    required
                    minLength={6}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {error && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-sm font-medium text-white bg-gradient-to-r from-nebula-500 to-aurora-500 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? "Please wait..." : (authMode === "signup" ? "Create Account" : "Sign In")}
                </button>

                <p className="text-center text-xs text-slate-500">
                  {authMode === "signup" ? (
                    <>Already have an account?{" "}<button type="button" onClick={() => { setAuthMode("login"); setError(""); }} className="text-nebula-400 hover:text-white">Sign in</button></>
                  ) : (
                    <>Don&apos;t have an account?{" "}<button type="button" onClick={() => { setAuthMode("signup"); setError(""); }} className="text-nebula-400 hover:text-white">Sign up free</button></>
                  )}
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
