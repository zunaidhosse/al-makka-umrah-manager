import React, { useState, useEffect } from 'react';
import { Download, WifiOff, X, Sparkles, Share2, CheckCircle2, Smartphone } from 'lucide-react';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [installedSuccess, setInstalledSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Check if app is running in standalone PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    const isInstalled = localStorage.getItem('pwa_installed') === 'true';
    const isDismissed = localStorage.getItem('pwa_dismissed') === 'true';

    // Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // If not standalone and not installed/dismissed, show modal
    if (!isStandalone && !isInstalled && !isDismissed) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 1200);
      return () => clearTimeout(timer);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isStandalone && !isInstalled && !isDismissed) {
        setShowModal(true);
      }
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      localStorage.setItem('pwa_installed', 'true');
      setInstalledSuccess(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
      setDeferredPrompt(null);
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Global listener for manual trigger from header
    const handleOpenPrompt = () => {
      setShowGuide(false);
      setShowModal(true);
    };
    window.addEventListener('open-pwa-install', handleOpenPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('open-pwa-install', handleOpenPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          localStorage.setItem('pwa_installed', 'true');
          setInstalledSuccess(true);
          setTimeout(() => setShowModal(false), 2000);
        }
        setDeferredPrompt(null);
      } catch (err) {
        setShowGuide(true);
      }
    } else {
      // If deferredPrompt is not available (iOS or browser without native trigger), show guide
      setShowGuide(true);
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

      {/* PWA Installation Modal */}
      {showModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-emerald-950 border-2 border-amber-400 rounded-3xl max-w-sm w-full shadow-2xl p-6 text-white space-y-4 animate-scale-up relative">
            
            {/* Close / Later Button */}
            <button
              onClick={handleLaterClick}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900 transition-colors"
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
                {installedSuccess ? 'ইন্সটল সফল হয়েছে!' : 'অ্যাপ ইন্সটল করুন'}
              </h3>
            </div>

            {/* Success Message */}
            {installedSuccess ? (
              <div className="p-4 bg-emerald-900/90 border border-emerald-500/50 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-amber-400 mx-auto" />
                <p className="text-sm font-bold text-white">
                  অ্যাপটি আপনার হোম স্ক্রিনে যুক্ত হয়েছে!
                </p>
              </div>
            ) : (
              <>
                {/* Modal Body Message */}
                <p className="text-sm text-emerald-100/90 text-center leading-relaxed">
                  দ্রুত ব্যবহার ও অফলাইন সুবিধার জন্য অ্যাপটি আপনার ফোনে ইন্সটল করুন।
                </p>

                {/* Show Instructions if native prompt is not available or triggered */}
                {showGuide && (
                  <div className="p-3.5 bg-emerald-900/90 border border-amber-400/50 rounded-2xl text-xs text-amber-200 space-y-2 text-left animate-fade-in">
                    {isIOS ? (
                      <>
                        <p className="font-bold flex items-center gap-1.5 text-amber-300 text-xs sm:text-sm">
                          <Share2 className="w-4 h-4" />
                          আইফোনে (iOS) ইন্সটল করার নিয়ম:
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-emerald-100">
                          <li>সাফারি (Safari) ব্রাউজারের নিচে <strong>Share (শেয়ার)</strong> বাটনে চাপুন।</li>
                          <li>নিচে স্ক্রোল করে <strong>Add to Home Screen</strong> সিলেক্ট করুন।</li>
                          <li>উপরে <strong>Add</strong> ক্লিক করলেই অ্যাপ ইন্সটল হয়ে যাবে।</li>
                        </ol>
                      </>
                    ) : (
                      <>
                        <p className="font-bold flex items-center gap-1.5 text-amber-300 text-xs sm:text-sm">
                          <Smartphone className="w-4 h-4" />
                          অ্যান্ড্রয়েড/ব্রাউজারে ইন্সটল করার নিয়ম:
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-emerald-100">
                          <li>ব্রাউজারের উপরে ডানকোণে <strong>৩-ডট মেনু (⋮)</strong> চাপুন।</li>
                          <li>মেনু থেকে <strong>Install app</strong> অথবা <strong>Add to Home screen</strong> অপশন নির্বাচন করুন।</li>
                        </ol>
                      </>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-1">
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
              </>
            )}

            {/* Sub-note */}
            <p className="text-[11px] text-emerald-300/70 text-center flex items-center justify-center gap-1 pt-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>অ্যান্ড্রয়েড, আইফোন ও কম্পিউটারে অফলাইনে সচল</span>
            </p>

          </div>
        </div>
      )}
    </>
  );
};


