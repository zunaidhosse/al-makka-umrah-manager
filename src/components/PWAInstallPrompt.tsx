import React, { useState, useEffect } from 'react';
import { Download, WifiOff, X, Sparkles, Share2, CheckCircle2, ExternalLink } from 'lucide-react';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isInIframe, setIsInIframe] = useState<boolean>(false);
  const [fallbackGuide, setFallbackGuide] = useState<boolean>(false);
  const [installedSuccess, setInstalledSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Check if running inside iframe
    const inIframe = window.self !== window.top;
    setIsInIframe(inIframe);

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

    // Show modal if not installed/dismissed
    if (!isStandalone && !isInstalled && !isDismissed) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 1000);
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
    // If inside an iframe (like AI Studio preview), PWA prompts are blocked by browser policy.
    // Open in a new tab where browser allows native PWA installation!
    if (isInIframe) {
      window.open(window.location.href, '_blank');
      return;
    }

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
        console.error('Install prompt error:', err);
        setFallbackGuide(true);
      }
    } else {
      // If native prompt is not captured yet, show direct instruction to tap Add
      setFallbackGuide(true);
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
        <div className="no-print bg-gradient-to-r from-[#FF8C00] via-[#FFD700] to-[#FF8C00] text-[#050A30] px-4 py-2 text-xs sm:text-sm font-black text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.6)] z-50 relative border-b-2 border-[#FFD700]">
          <WifiOff className="w-4 h-4 text-[#050A30]" />
          <span>আপনি এখন অফলাইনে আছেন। আপনার সংরক্ষিত ডেটা নিরাপদ রয়েছে।</span>
        </div>
      )}

      {/* PWA Installation Modal */}
      {showModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050A30]/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0A1035]/95 border-2 border-[#00FFFF] rounded-3xl max-w-sm w-full shadow-[0_0_40px_rgba(0,255,255,0.4)] p-6 text-white space-y-4 animate-scale-up relative overflow-hidden">
            
            {/* Top Glowing Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00BFFF] via-[#8A2BE2] via-[#FF4DFF] to-[#39FF14]"></div>

            {/* Close / Later Button */}
            <button
              onClick={handleLaterClick}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#050A30] text-cyan-300 hover:text-white hover:bg-[#8A2BE2]/40 transition-colors border border-[#00BFFF]/30"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>

            {/* App Icon Header */}
            <div className="flex flex-col items-center text-center space-y-2 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00FFFF] via-[#8A2BE2] to-[#FF4DFF] p-0.5 shadow-[0_0_20px_rgba(0,255,255,0.5)] flex items-center justify-center">
                <img
                  src="./favicon.svg"
                  alt="App Icon"
                  className="w-full h-full rounded-2xl object-cover bg-[#050A30]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-xl font-extrabold neon-text-gradient-primary pt-1">
                {installedSuccess ? 'ইন্সটল সফল হয়েছে!' : 'অ্যাপ ইন্সটল করুন'}
              </h3>
            </div>

            {/* Success Message */}
            {installedSuccess ? (
              <div className="p-4 bg-[#39FF14]/20 border-2 border-[#39FF14] rounded-2xl text-center space-y-2 shadow-[0_0_20px_rgba(57,255,20,0.3)]">
                <CheckCircle2 className="w-10 h-10 text-[#39FF14] mx-auto glow-icon-green" />
                <p className="text-sm font-bold text-white">
                  অ্যাপটি আপনার হোম স্ক্রিনে যুক্ত হয়েছে!
                </p>
              </div>
            ) : (
              <>
                {/* Modal Body Message */}
                <p className="text-sm text-cyan-200/90 text-center leading-relaxed font-medium">
                  দ্রুত ব্যবহার ও অফলাইন সুবিধার জন্য অ্যাপটি আপনার ফোনে ইন্সটল করুন।
                </p>

                {/* Fallback Android Notice */}
                {fallbackGuide && !isIOS && (
                  <div className="p-3.5 bg-[#050A30] border-2 border-[#FFD700] rounded-2xl text-xs text-cyan-100 space-y-2 text-left animate-fade-in shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                    <p className="font-extrabold flex items-center gap-1.5 text-[#FFD700] text-xs sm:text-sm">
                      <Download className="w-4 h-4 text-[#FFD700] glow-icon-gold" />
                      হোম স্ক্রিনে যুক্ত করার সহজ নিয়ম:
                    </p>
                    <p className="text-cyan-200 text-xs leading-relaxed">
                      ক্রোম ব্রাউজারের পপআপে বা ৩-ডট মেনুতে <strong className="text-[#00FFFF]">"Create shortcut"</strong> বা <strong className="text-[#00FFFF]">"Add to Home screen"</strong> ডায়ালগ আসলে <strong className="text-[#39FF14]">"Add"</strong> বা <strong className="text-[#39FF14]">"ইন্সটল"</strong> বাটনে ক্লিক করুন।
                    </p>
                  </div>
                )}

                {/* iOS Instructions (only if iOS) */}
                {isIOS && (
                  <div className="p-3.5 bg-[#050A30] border-2 border-[#00FFFF] rounded-2xl text-xs text-cyan-100 space-y-2 text-left animate-fade-in shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                    <p className="font-extrabold flex items-center gap-1.5 text-[#00FFFF] text-xs sm:text-sm">
                      <Share2 className="w-4 h-4 text-[#00FFFF]" />
                      আইফোনে (iOS) ইন্সটল করার নিয়ম:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-cyan-200">
                      <li>সাফারি (Safari) ব্রাউজারের নিচে <strong className="text-[#FF4DFF]">Share (শেয়ার)</strong> বাটনে চাপুন।</li>
                      <li>নিচে স্ক্রোল করে <strong className="text-[#39FF14]">Add to Home Screen</strong> সিলেক্ট করুন।</li>
                      <li>উপরে <strong className="text-[#00FFFF]">Add</strong> ক্লিক করলেই অ্যাপ ইন্সটল হয়ে যাবে।</li>
                    </ol>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleLaterClick}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#050A30] hover:bg-[#8A2BE2]/30 text-cyan-300 font-bold text-sm border border-[#00BFFF]/40 transition-all active:scale-95 text-center"
                  >
                    পরে (Later)
                  </button>

                  <button
                    onClick={handleInstallClick}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#00BFFF] via-[#8A2BE2] to-[#FF4DFF] hover:from-[#00FFFF] hover:to-[#FF4DFF] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,191,255,0.6)] transition-all active:scale-95 text-center border border-[#00FFFF]/50"
                  >
                    {isInIframe ? (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        <span>নতুন ট্যাবে খুলুন</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>ইন্সটল করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Sub-note */}
            <p className="text-[11px] text-cyan-300/80 text-center flex items-center justify-center gap-1 pt-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>অ্যান্ড্রয়েড, আইফোন ও কম্পিউটারে অফলাইনে সচল</span>
            </p>

          </div>
        </div>
      )}
    </>
  );
};



