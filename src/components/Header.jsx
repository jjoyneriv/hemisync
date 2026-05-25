import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Activity, ShoppingBag, User, LogOut } from "lucide-react";
import { navLinks } from "../data/content";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, setIsOpen } = useCart();
  const { user, setShowAuth, setAuthMode, setShowDashboard, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cosmic-900/80 backdrop-blur-xl border-b border-glass-border shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-18 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group" aria-label="HemiSync.org home">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nebula-500 to-aurora-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-semibold text-lg text-white">
            HemiSync<span className="text-aurora-400">.org</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 text-slate-300 hover:text-white transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-nebula-500 text-[10px] font-bold text-white flex items-center justify-center leading-none">
                {itemCount}
              </span>
            )}
          </button>
          {user ? (
            <button
              onClick={() => setShowDashboard(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-glass-border hover:bg-white/10 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-nebula-500 to-aurora-500 flex items-center justify-center text-[10px] font-bold text-white">
                {user.avatar}
              </div>
              <span className="text-sm text-white">{user.name.split(" ")[0]}</span>
            </button>
          ) : (
            <button
              onClick={() => { setAuthMode("signup"); setShowAuth(true); }}
              className="inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-nebula-500 to-aurora-500 rounded-full hover:opacity-90 transition-opacity"
            >
              Start Free
            </button>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-cosmic-900/95 backdrop-blur-xl border-b border-glass-border"
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-base text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4">
                <a
                  href="/start"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center px-5 py-3 text-base font-medium text-white bg-gradient-to-r from-nebula-500 to-aurora-500 rounded-full"
                >
                  Start Free
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
