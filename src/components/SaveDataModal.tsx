import React, { useState } from 'react';
import { Member, AppConfig, SavedHistoryRecord } from '../types';
import { Lock, Save, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SaveDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  config: AppConfig;
  onSaveSuccess: (newRecord: SavedHistoryRecord) => void;
}

export const SaveDataModal: React.FC<SaveDataModalProps> = ({
  isOpen,
  onClose,
  members,
  config,
  onSaveSuccess
}) => {
  const [step, setStep] = useState<'password' | 'form'>('password');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [saveName, setSaveName] = useState('');

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0000') {
      setPasswordError(false);
      setStep('form');
    } else {
      setPasswordError(true);
    }
  };

  const handleSaveData = (e: React.FormEvent) => {
    e.preventDefault();

    const activeMembers = members.filter(
      (m) => m.name && m.name !== '--' && m.name.trim() !== ''
    );
    const totalPassengers = activeMembers.length;
    const totalCollectedSAR = members.reduce(
      (sum, m) => sum + (Number(m.amount) || 0),
      0
    );

    const now = new Date();
    const savedDate = now.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const savedTime = now.toLocaleTimeString('bn-BD', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const defaultName = `প্যাকেজ রেকর্ড (${savedDate})`;

    const newRecord: SavedHistoryRecord = {
      id: `record_${Date.now()}`,
      name: saveName.trim() || defaultName,
      savedAt: `${savedDate}, ${savedTime}`,
      savedDate,
      savedTime,
      members: JSON.parse(JSON.stringify(members)), // deep copy
      config: JSON.parse(JSON.stringify(config)),
      totalPassengers,
      totalCollectedSAR
    };

    onSaveSuccess(newRecord);

    // Reset local state & close
    setStep('password');
    setPassword('');
    setSaveName('');
    setPasswordError(false);
    onClose();
  };

  const handleClose = () => {
    setStep('password');
    setPassword('');
    setSaveName('');
    setPasswordError(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050A30]/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0A1035]/95 rounded-3xl max-w-md w-full shadow-[0_0_40px_rgba(0,255,255,0.4)] border-2 border-[#00FFFF] overflow-hidden text-slate-100 relative">
        
        {/* Subtle Top Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00BFFF] via-[#8A2BE2] via-[#FF4DFF] to-[#39FF14]"></div>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#050A30] via-[#0A1035] to-[#050A30] px-6 py-4 flex items-center justify-between border-b border-[#00BFFF]/30 text-white">
          <div className="flex items-center gap-2.5">
            <Save className="w-5 h-5 text-[#00FFFF] glow-icon-cyan" />
            <h3 className="font-extrabold text-base sm:text-lg neon-text-gradient-primary">
              {step === 'password' ? 'পাসওয়ার্ড যাচাইকরণ' : 'ডাটা সেভ করুন (Save Data)'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl bg-[#050A30] hover:bg-[#8A2BE2]/40 text-cyan-300 hover:text-white transition-colors border border-[#00BFFF]/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 'password' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="text-center py-2">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#00BFFF]/20 border border-[#00BFFF]/50 flex items-center justify-center text-[#00FFFF] shadow-[0_0_15px_rgba(0,191,255,0.4)]">
                  <Lock className="w-7 h-7 glow-icon-blue" />
                </div>
                <p className="text-xs sm:text-sm text-cyan-200/90 font-medium">
                  ডাটা সেভ করতে সিকিউরিটি পাসওয়ার্ড প্রবেশ করান।
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-1.5">
                  পাসওয়ার্ড (Password)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  placeholder="পাসওয়ার্ড লিখুন (0000)"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-[#00BFFF]/50 bg-[#050A30] text-[#00FFFF] text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#00FFFF] shadow-[inset_0_0_10px_rgba(0,191,255,0.2)]"
                />
                {passwordError && (
                  <p className="mt-2 text-xs text-[#FF4DFF] font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-[#FF4DFF]" />
                    <span>ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড '0000' দিয়ে চেষ্টা করুন।</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-[#00BFFF]/30 text-slate-300 hover:text-white hover:bg-[#050A30] text-xs sm:text-sm font-semibold transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00BFFF] via-[#8A2BE2] to-[#FF4DFF] hover:from-[#00FFFF] hover:to-[#FF4DFF] text-white text-xs sm:text-sm font-extrabold shadow-[0_0_15px_rgba(0,191,255,0.5)] transition-all active:scale-95 border border-[#00FFFF]/50"
                >
                  পরবর্তী ধাপ
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSaveData} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#39FF14]/15 border border-[#39FF14]/50 text-xs text-lime-200 space-y-1 shadow-[0_0_15px_rgba(57,255,20,0.2)]">
                <p className="font-bold flex items-center gap-1.5 text-[#39FF14]">
                  <CheckCircle2 className="w-4 h-4 text-[#39FF14]" />
                  <span>পাসওয়ার্ড যাচাই সম্পন্ন হয়েছে</span>
                </p>
                <p>বর্তমান তালিকায় নিবন্ধিত যাত্রী: <strong>{members.filter(m => m.name && m.name !== '--' && m.name.trim()).length} জন</strong></p>
                <p>মোট জমার পরিমাণ: <strong>{members.reduce((sum, m) => sum + (Number(m.amount) || 0), 0).toLocaleString('bn-BD')} SAR</strong></p>
              </div>

              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-1.5">
                  রেকর্ডের নাম (অপশনাল)
                </label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="যেমন: ওমরাহ ব্যাচ ১ - নভেম্বর ২০২৬"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border border-[#00BFFF]/50 bg-[#050A30] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00FFFF] placeholder-cyan-300/30 shadow-[inset_0_0_10px_rgba(0,191,255,0.15)]"
                />
                <p className="mt-1 text-[11px] text-cyan-300/70">
                  সেভ করার পর বর্তমান তালিকা রিসেট হয়ে শূন্য হয়ে যাবে নতুন প্রবেশের জন্য।
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-[#00BFFF]/30 text-slate-300 hover:text-white hover:bg-[#050A30] text-xs sm:text-sm font-semibold transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#39FF14] via-[#7FFF00] to-[#00FFFF] hover:from-[#7FFF00] hover:to-[#39FF14] text-[#050A30] font-black text-xs sm:text-sm shadow-[0_0_15px_rgba(57,255,20,0.5)] transition-all active:scale-95 border border-[#39FF14]"
                >
                  ডাটা সেভ করুন
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
