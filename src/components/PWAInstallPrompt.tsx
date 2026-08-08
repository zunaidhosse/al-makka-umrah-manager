import React, { useState, useEffect } from 'react';
import { Download, WifiOff, X, Sparkles } from 'lucide-react';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    // Detect standalone display mode (already installed app)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    const isInstalled = localStorage.getItem('pwa_installed') === 'true';
    const isDismissed = localStorage.getItem('pwa_dismissed') === 'true';

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      localStorage.setItem('pwa_installed', 'true');
      setShowModal(false);
      setDeferredPrompt(null);
    };

    // Save native beforeinstallprompt event and show modal ONLY when install is ready
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isStandalone && !isInstalled && !isDismissed) {
        setShowModal(true);
      }
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        localStorage.setItem('pwa_installed', 'true');
        setShowModal(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleLaterClick = () => {
    localStorage.setItem('pwa_dismissed', 'true');
    setShowModal(false);
  };

  return (
    <>
      {/* Offline Alert Bar */}
      {!isOnline && (
        <div className="no-print bg-amber-500 text-emerald-950 px-4 py-2 text-xs sm:text-sm font-bold text-center flex items-center justify-center gap-2 shadow-md z-50 relative">
          <WifiOff className="w-4 h-4" />
          <span>আপনি এখন অফলাইনে আছেন। আপনার সংরক্ষিত ডেটা নিরাপদ রয়েছে।</span>
        </div>
      )}

      {/* PWA Installation Modal - Only render when install prompt is actually available */}
      {showModal && deferredPrompt && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-emerald-950 border-2 border-amber-400 rounded-3xl max-w-sm w-full shadow-2xl p-6 text-white space-y-4 animate-scale-up relative">
            
            {/* Close / Later Button */}
            <button
              onClick={handleLaterClick}
              className="absolute top-4 right-4 p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900 transition-colors"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>

            {/* App Icon Header */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg flex items-center justify-center">
                <img
                  src="./favicon.svg"
                  alt="App Icon"
                  className="w-full h-full rounded-2xl object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-xl font-bold text-amber-300 font-bengali-heading pt-1">
                অ্যাপ ইন্সটল করুন
              </h3>
            </div>

            {/* Modal Body Message */}
            <p className="text-sm text-emerald-100/90 text-center leading-relaxed">
              দ্রুত ব্যবহার ও অফলাইন সুবিধার জন্য অ্যাপটি আপনার ফোনে ইন্সটল করুন।
            </p>

            {/* Action Area */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleLaterClick}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 font-bold text-sm border border-emerald-700 transition-all active:scale-95 text-center"
              >
                পরে (Later)
              </button>

              <button
                onClick={handleInstallClick}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 text-center"
              >
                <Download className="w-4 h-4" />
                <span>ইন্সটল করুন</span>
              </button>
            </div>

            {/* Sub-note */}
            <p className="text-[11px] text-emerald-300/70 text-center flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>অ্যান্ড্রয়েড, আইফোন ও কম্পিউটারে অফলাইনে সচল</span>
            </p>

          </div>
        </div>
      )}
    </>
  );
};

