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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-emerald-900/20 dark:border-emerald-700/30 overflow-hidden text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="bg-emerald-900 dark:bg-emerald-950 px-6 py-4 flex items-center justify-between border-b border-amber-500/40 text-white">
          <div className="flex items-center gap-2.5">
            <Save className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base sm:text-lg">
              {step === 'password' ? 'পাসওয়ার্ড যাচাইকরণ' : 'ডাটা সেভ করুন (Save Data)'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-emerald-800 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 'password' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="text-center py-2">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Lock className="w-7 h-7" />
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  ডাটা সেভ করতে সিকিউরিটি পাসওয়ার্ড প্রবেশ করান।
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                {passwordError && (
                  <p className="mt-2 text-xs text-rose-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড '0000' দিয়ে চেষ্টা করুন।</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
                >
                  পরবর্তী ধাপ
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSaveData} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>পাসওয়ার্ড যাচাই সম্পন্ন হয়েছে</span>
                </p>
                <p>বর্তমান তালিকায় নিবন্ধিত যাত্রী: <strong>{members.filter(m => m.name && m.name !== '--' && m.name.trim()).length} জন</strong></p>
                <p>মোট জমার পরিমাণ: <strong>{members.reduce((sum, m) => sum + (Number(m.amount) || 0), 0).toLocaleString('bn-BD')} SAR</strong></p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  রেকর্ডের নাম (অপশনাল)
                </label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="যেমন: ওমরাহ ব্যাচ ১ - নভেম্বর ২০২৬"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  সেভ করার পর বর্তমান তালিকা রিসেট হয়ে শূন্য হয়ে যাবে নতুন প্রবেশের জন্য।
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
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
