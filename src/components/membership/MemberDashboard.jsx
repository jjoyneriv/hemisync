import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Heart, Clock, Crown, Star, Zap, Settings, LogOut, Music, BarChart3, Calendar } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { products, bonusProduct } from "../../data/products";

const allTracks = [...products, bonusProduct];

export default function MemberDashboard() {
  const { user, logout, canDownload, isPro, showDashboard, setShowDashboard, addDownload, toggleFavorite } = useAuth();
  const [activeTab, setActiveTab] = useState("library");

  if (!showDashboard || !user) return null;

  const favoritesTracks = allTracks.filter((t) => user.favorites.includes(t.id));
  const downloadedTracks = allTracks.filter((t) => user.downloads.includes(t.id));
  const planIcon = user.plan === "pro" ? Crown : user.plan === "premium" ? Star : Zap;
  const PlanIcon = planIcon;

  const handleDownload = (track) => {
    if (!canDownload) return;
    addDownload(track.id);
    const link = document.createElement("a");
    link.href = track.audioSrc;
    link.download = `${track.title} - HemiSync.org.mp3`;
    link.click();
  };

  const tabs = [
    { id: "library", label: "Library", icon: Music },
    { id: "downloads", label: "Downloads", icon: Download },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        onClick={() => setShowDashboard(false)}
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed inset-4 md:inset-8 lg:inset-12 z-[60] bg-cosmic-900 border border-glass-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-glass-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nebula-500 to-aurora-500 flex items-center justify-center text-white text-sm font-bold">
              {user.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <div className="flex items-center gap-1.5">
                <PlanIcon className="w-3 h-3 text-aurora-400" />
                <span className="text-xs text-aurora-400 capitalize">{user.plan} Member</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={logout} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
            <button onClick={() => setShowDashboard(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar tabs */}
          <div className="w-48 border-r border-glass-border p-3 space-y-1 hidden md:block">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    activeTab === tab.id
                      ? "text-white bg-nebula-500/10 border border-nebula-500/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Mobile tabs */}
          <div className="md:hidden flex border-b border-glass-border w-full">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                    activeTab === tab.id ? "text-white border-b-2 border-nebula-500" : "text-slate-500"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6">
            {activeTab === "library" && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Your Library</h3>
                <p className="text-sm text-slate-400 mb-6">
                  {canDownload ? `${allTracks.length} tracks available for download` : "Upgrade to Premium to download tracks"}
                </p>

                {!canDownload && (
                  <div className="glass-card rounded-xl p-4 mb-6 border-l-4 border-l-nebula-500">
                    <p className="text-sm text-slate-300">Upgrade to <span className="text-nebula-400 font-medium">Premium</span> or <span className="text-aurora-400 font-medium">Pro</span> for unlimited downloads.</p>
                  </div>
                )}

                <div className="space-y-2">
                  {allTracks.map((track) => (
                    <div key={track.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                      <img src={track.coverSrc} alt={track.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{track.title}</p>
                        <p className="text-xs text-slate-500">{track.category} &middot; {track.duration}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFavorite(track.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.favorites.includes(track.id) ? "text-rose-400" : "text-slate-600 hover:text-slate-300"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${user.favorites.includes(track.id) ? "fill-current" : ""}`} />
                        </button>
                        <button
                          onClick={() => handleDownload(track)}
                          disabled={!canDownload}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            canDownload
                              ? user.downloads.includes(track.id)
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-nebula-500/10 text-nebula-400 hover:bg-nebula-500/20"
                              : "bg-white/5 text-slate-600 cursor-not-allowed"
                          }`}
                        >
                          <Download className="w-3.5 h-3.5" />
                          {user.downloads.includes(track.id) ? "Downloaded" : "Download"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "downloads" && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Download History</h3>
                <p className="text-sm text-slate-400 mb-6">{downloadedTracks.length} tracks downloaded</p>
                {downloadedTracks.length === 0 ? (
                  <div className="text-center py-12">
                    <Download className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No downloads yet. Browse the library to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {downloadedTracks.map((track) => (
                      <div key={track.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                        <img src={track.coverSrc} alt={track.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{track.title}</p>
                          <p className="text-xs text-slate-500">{track.category} &middot; {track.duration}</p>
                        </div>
                        <button onClick={() => handleDownload(track)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-slate-300 hover:bg-white/10 transition-colors">
                          <Download className="w-3.5 h-3.5" />
                          Re-download
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "favorites" && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Favorites</h3>
                <p className="text-sm text-slate-400 mb-6">{favoritesTracks.length} tracks saved</p>
                {favoritesTracks.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No favorites yet. Tap the heart icon on any track.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {favoritesTracks.map((track) => (
                      <div key={track.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                        <img src={track.coverSrc} alt={track.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{track.title}</p>
                          <p className="text-xs text-slate-500">{track.category}</p>
                        </div>
                        <button onClick={() => toggleFavorite(track.id)} className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors">
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">Account Settings</h3>
                <div className="space-y-6 max-w-lg">
                  <div className="glass-card rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-white mb-3">Profile</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Name</span>
                        <span className="text-white">{user.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Email</span>
                        <span className="text-white">{user.email}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Member since</span>
                        <span className="text-white">{new Date(user.joinedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-white mb-3">Current Plan</h4>
                    <div className="flex items-center gap-3">
                      <PlanIcon className="w-5 h-5 text-aurora-400" />
                      <div>
                        <p className="text-sm font-medium text-white capitalize">{user.plan}</p>
                        <p className="text-xs text-slate-500">
                          {canDownload ? "Unlimited downloads active" : "Upgrade for unlimited downloads"}
                        </p>
                      </div>
                    </div>
                    {!canDownload && (
                      <a href="#membership" onClick={() => setShowDashboard(false)} className="mt-3 inline-block text-xs text-nebula-400 hover:text-white transition-colors">
                        View upgrade options →
                      </a>
                    )}
                  </div>

                  <div className="glass-card rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-white mb-3">Stats</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-white font-mono">{user.downloads.length}</p>
                        <p className="text-xs text-slate-500">Downloads</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-white font-mono">{user.favorites.length}</p>
                        <p className="text-xs text-slate-500">Favorites</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-white font-mono">{user.streak}</p>
                        <p className="text-xs text-slate-500">Day Streak</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
