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
      {/* Centered Bismillah Header with Gold/Cyan Glow */}
      <div className="text-center py-2">
        <p className="font-serif text-sm sm:text-base font-bold tracking-widest select-none neon-text-gradient-gold">
          بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
      </div>

      {/* Top-Right Menu & Install Buttons with Rich Neon Gradients */}
      <div className="absolute right-4 top-3 sm:right-6 sm:top-3 flex items-center gap-2.5">
        <button
          onClick={handleOpenInstall}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#39FF14] via-[#7FFF00] to-[#00FFFF] hover:from-[#7FFF00] hover:to-[#39FF14] text-[#050A30] font-black text-xs shadow-[0_0_15px_rgba(57,255,20,0.5)] hover:shadow-[0_0_25px_rgba(127,255,0,0.8)] transition-all active:scale-95 flex items-center gap-1.5 border border-[#39FF14]"
          title="অ্যাপ ইন্সটল করুন"
        >
          <Download className="w-4 h-4 text-[#050A30] stroke-[2.5]" />
          <span className="hidden sm:inline tracking-wider">ইন্সটল</span>
        </button>

        <button
          onClick={() => setIsMenuOpen(true)}
          className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-[#00BFFF] via-[#8A2BE2] to-[#FF4DFF] hover:from-[#00FFFF] hover:to-[#FF4DFF] text-white shadow-[0_0_15px_rgba(138,43,226,0.6)] hover:shadow-[0_0_25px_rgba(255,77,255,0.8)] border border-[#00FFFF]/50 transition-all active:scale-95 flex items-center justify-center"
          title="মেনু (Menu)"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5 text-white glow-icon-blue" />
        </button>

        {/* Full-Page Centered Menu Overlay with Glassmorphism */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 z-50 flex items-start sm:items-center justify-center pt-16 sm:pt-0 p-4 bg-[#050A30]/85 backdrop-blur-md animate-fade-in"
            onClick={() => setIsMenuOpen(false)}
          >
            <div
              className="bg-[#0A1035]/95 border-2 border-[#00FFFF] rounded-3xl max-w-sm w-full shadow-[0_0_40px_rgba(0,255,255,0.4)] p-6 text-white space-y-4 animate-scale-up relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Subtle Top Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00BFFF] via-[#8A2BE2] to-[#FF4DFF]"></div>

              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#00BFFF]/30">
                <div className="flex items-center gap-2">
                  <Menu className="w-5 h-5 text-[#00FFFF] glow-icon-cyan" />
                  <h3 className="font-extrabold text-lg neon-text-gradient-primary">মেনু অপশন (Menu)</h3>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-[#050A30] hover:bg-[#8A2BE2]/40 text-slate-300 hover:text-white transition-colors border border-[#00BFFF]/30"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Options */}
              <div className="space-y-3 pt-1">
                {/* Option 1: Install App */}
                <button
                  onClick={handleOpenInstall}
                  className="w-full flex items-center gap-3.5 p-4 rounded-2xl bg-gradient-to-r from-[#39FF14]/15 to-[#00FFFF]/15 hover:from-[#39FF14]/30 hover:to-[#00FFFF]/30 border-2 border-[#39FF14]/60 text-left transition-all active:scale-98 group shadow-[0_0_15px_rgba(57,255,20,0.2)]"
                >
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#39FF14] to-[#7FFF00] text-[#050A30] font-bold group-hover:scale-105 transition-transform shadow-[0_0_10px_rgba(57,255,20,0.5)]">
                    <Download className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-[#39FF14] transition-colors">
                      Install App (অ্যাপ ইন্সটল)
                    </h4>
                    <p className="text-xs text-cyan-200/80">মোবাইলে বা কম্পিউটারে অ্যাপটি ইন্সটল করুন</p>
                  </div>
                </button>

                {/* Option 2: Save Data */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenSaveModal();
                  }}
                  className="w-full flex items-center gap-3.5 p-4 rounded-2xl bg-gradient-to-r from-[#00BFFF]/15 to-[#8A2BE2]/15 hover:from-[#00BFFF]/30 hover:to-[#8A2BE2]/30 border-2 border-[#00BFFF]/60 text-left transition-all active:scale-98 group shadow-[0_0_15px_rgba(0,191,255,0.2)]"
                >
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#0047FF] text-white font-bold group-hover:scale-105 transition-transform shadow-[0_0_10px_rgba(0,191,255,0.5)]">
                    <Save className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-[#00FFFF] transition-colors">
                      Save Data (ডাটা সেভ)
                    </h4>
                    <p className="text-xs text-cyan-200/80">পাসওয়ার্ড সুরক্ষায় বর্তমান ডাটা সেভ করুন</p>
                  </div>
                </button>

                {/* Option 3: History */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenHistoryModal();
                  }}
                  className="w-full flex items-center gap-3.5 p-4 rounded-2xl bg-gradient-to-r from-[#8A2BE2]/15 to-[#FF4DFF]/15 hover:from-[#8A2BE2]/30 hover:to-[#FF4DFF]/30 border-2 border-[#FF4DFF]/60 text-left transition-all active:scale-98 group shadow-[0_0_15px_rgba(255,77,255,0.2)]"
                >
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#8A2BE2] to-[#FF4DFF] text-white font-bold group-hover:scale-105 transition-transform shadow-[0_0_10px_rgba(255,77,255,0.5)]">
                    <History className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-[#FF4DFF] transition-colors">
                      History (সংরক্ষিত হিস্ট্রি)
                    </h4>
                    <p className="text-xs text-cyan-200/80">পূর্বে সেভ করা সকল রেকর্ড দেখুন ও ম্যানেজ করুন</p>
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


