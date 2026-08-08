import React, { useState } from 'react';
import { AppConfig } from '../types';
import { Menu, Save, History, Download, X } from 'lucide-react';

interface HeaderProps {
  config: AppConfig;
  onOpenSettings: () => void;
  onToggleTheme: () => void;
  isDark: boolean;
  onOpenSaveModal: () => void;
  onOpenHistoryModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSaveModal,
  onOpenHistoryModal
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleOpenInstall = () => {
    setIsMenuOpen(false);
    window.dispatchEvent(new CustomEvent('open-pwa-install'));
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 mb-2">
      {/* Minimal Centered Bismillah Header */}
      <div className="text-center py-2">
        <p className="font-serif text-sm sm:text-base text-emerald-900 dark:text-emerald-400 font-medium tracking-widest opacity-90 select-none">
          بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
      </div>

      {/* Top-Right Menu & Install Buttons */}
      <div className="absolute right-4 top-3 sm:right-6 sm:top-3 flex items-center gap-2">
        <button
          onClick={handleOpenInstall}
          className="px-2.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
          title="অ্যাপ ইন্সটল করুন"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">ইন্সটল</span>
        </button>

        <button
          onClick={() => setIsMenuOpen(true)}
          className="p-2 sm:p-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-amber-300 border border-amber-500/40 shadow-sm transition-all active:scale-95 flex items-center justify-center"
          title="মেনু (Menu)"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5 text-amber-300" />
        </button>

        {/* Full-Page Centered Menu Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 z-50 flex items-start sm:items-center justify-center pt-16 sm:pt-0 p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsMenuOpen(false)}
          >
            <div
              className="bg-emerald-950 border-2 border-amber-400 rounded-3xl max-w-sm w-full shadow-2xl p-6 text-white space-y-4 animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-amber-500/30">
                <div className="flex items-center gap-2">
                  <Menu className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-lg text-amber-300">মেনু অপশন (Menu)</h3>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-emerald-800 text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Options */}
              <div className="space-y-3 pt-1">
                {/* Option 1: Install App */}
                <button
                  onClick={handleOpenInstall}
                  className="w-full flex items-center gap-3.5 p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/60 text-left transition-all active:scale-98 group shadow-md"
                >
                  <div className="p-2.5 rounded-xl bg-amber-500 text-emerald-950 font-bold group-hover:scale-105 transition-transform">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-amber-300 transition-colors">
                      Install App (অ্যাপ ইন্সটল)
                    </h4>
                    <p className="text-xs text-emerald-200/80">মোবাইলে বা কম্পিউটারে অ্যাপটি ইন্সটল করুন</p>
                  </div>
                </button>

                {/* Option 2: Save Data */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenSaveModal();
                  }}
                  className="w-full flex items-center gap-3.5 p-4 rounded-2xl bg-emerald-900/80 hover:bg-emerald-800 border border-amber-400/50 hover:border-amber-400 text-left transition-all active:scale-98 group shadow-md"
                >
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-emerald-950 transition-colors">
                    <Save className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                      Save Data (ডাটা সেভ)
                    </h4>
                    <p className="text-xs text-emerald-200/80">পাসওয়ার্ড সুরক্ষায় বর্তমান ডাটা সেভ করুন</p>
                  </div>
                </button>

                {/* Option 3: History */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenHistoryModal();
                  }}
                  className="w-full flex items-center gap-3.5 p-4 rounded-2xl bg-emerald-900/80 hover:bg-emerald-800 border border-amber-400/50 hover:border-amber-400 text-left transition-all active:scale-98 group shadow-md"
                >
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-emerald-950 transition-colors">
                    <History className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                      History (সংরক্ষিত হিস্ট্রি)
                    </h4>
                    <p className="text-xs text-emerald-200/80">পূর্বে সেভ করা সকল রেকর্ড দেখুন ও ম্যানেজ করুন</p>
                  </div>
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};


