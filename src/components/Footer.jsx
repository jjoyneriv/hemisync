import { Activity } from "lucide-react";
import { footerColumns } from "../data/content";

export default function Footer() {
  return (
    <footer className="border-t border-glass-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4" aria-label="HemiSync.org home">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-nebula-500 to-aurora-500 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-semibold text-white">
                HemiSync<span className="text-aurora-400">.org</span>
              </span>
            </a>
            <p className="text-xs text-slate-500 leading-relaxed">
              Audio-guided experiences for focus, sleep, meditation, and inner exploration.
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white mb-4">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-glass-border">
          <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
            HemiSync.org is an independent wellness and audio education platform.
            Content is for informational and personal development purposes only and
            is not a substitute for medical, psychological, or professional care.
          </p>
          <p className="mt-3 text-xs text-slate-600">
            HemiSync.org is an independent wellness and audio education platform and
            is not affiliated with any similarly named commercial brand unless
            otherwise stated.
          </p>
          <p className="mt-4 text-xs text-slate-600">
            &copy; {new Date().getFullYear()} HemiSync.org. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
