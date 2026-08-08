import React, { useState, useEffect } from 'react';
import { Member, AppConfig } from '../types';
import { X, Save, RotateCcw, Settings, UserPlus, Sparkles, AlertTriangle } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingMember: Member | null;
  onSaveMember: (updatedMember: Member) => void;
  config: AppConfig;
  onSaveConfig: (newConfig: AppConfig) => void;
  onResetAllMembers: () => void;
  onSeedSampleMembers: () => void;
  allMembersCount: number;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  editingMember,
  onSaveMember,
  config,
  onSaveConfig,
  onResetAllMembers,
  onSeedSampleMembers,
  allMembersCount = 50
}) => {
  const [activeTab, setActiveTab] = useState<'member' | 'settings'>('member');

  // Member Form State
  const [serial, setSerial] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [amount, setAmount] = useState<number | string>(0);
  const [notes, setNotes] = useState<string>('');

  // Config Form State
  const [title, setTitle] = useState<string>(config.title);
  const [subTitle, setSubTitle] = useState<string>(config.subTitle);
  const [agencyName, setAgencyName] = useState<string>(config.agencyName);
  const [currency, setCurrency] = useState<string>(config.currency);

  useEffect(() => {
    if (editingMember) {
      setActiveTab('member');
      setSerial(editingMember.serial);
      setName(editingMember.name === '--' ? '' : editingMember.name);
      setPhone(editingMember.phone);
      setAmount(editingMember.amount);
      setNotes(editingMember.notes || '');
    } else {
      setSerial(1);
      setName('');
      setPhone('');
      setAmount(0);
      setNotes('');
    }
  }, [editingMember, isOpen]);

  useEffect(() => {
    setTitle(config.title);
    setSubTitle(config.subTitle);
    setAgencyName(config.agencyName);
    setCurrency(config.currency);
  }, [config]);

  if (!isOpen) return null;

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
    
    onSaveMember({
      id: serial, // serial corresponds to 1..50
      serial,
      name: name.trim() || '--',
      phone: phone.trim(),
      amount: numericAmount,
      notes: notes.trim(),
      updatedAt: new Date().toISOString()
    });
    
    onClose();
  };

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...config,
      title: title.trim() || "যাত্রী প্যাকেজ তালিকা",
      subTitle: subTitle.trim(),
      agencyName: agencyName.trim(),
      currency: currency.trim() || "SAR"
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border-2 border-amber-500/60 shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100">
        
        {/* Modal Header */}
        <div className="bg-emerald-900 text-amber-300 p-5 flex items-center justify-between border-b-2 border-amber-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold font-bengali-heading">
              {activeTab === 'member'
                ? editingMember ? `যাত্রী তথ্য সম্পাদনা (সিরিয়াল #${editingMember.serial})` : 'নতুন যাত্রী যোগ / এডিট'
                : 'অ্যাডমিন ও পেজ সেটিংস'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-800 text-amber-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('member')}
            className={`flex-1 py-3 text-center text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'member'
                ? 'border-emerald-700 text-emerald-800 dark:text-amber-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>যাত্রী সদস্য ফর্ম</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 text-center text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-emerald-700 text-emerald-800 dark:text-amber-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>শিরোনাম ও এজেন্সির নাম</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          
          {activeTab === 'member' ? (
            <form onSubmit={handleMemberSubmit} className="space-y-4">
              
              {/* Serial Slot Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  সিরিয়াল নম্বর স্লট (১ থেকে ৫০)
                </label>
                <select
                  value={serial}
                  onChange={(e) => setSerial(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-emerald-800 dark:text-amber-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  {Array.from({ length: allMembersCount }, (_, i) => i + 1).map((s) => (
                    <option key={s} value={s}>
                      ক্রমিক #{s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Member Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  যাত্রীর নাম (Full Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: মুহাম্মদ আব্দুর রহমান"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ফোন নম্বর (সৌদি মোবাইল formatting)
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+966500000000 অথবা 0500000000"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setPhone('+966')}
                    className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-300/40 whitespace-nowrap hover:bg-emerald-200"
                  >
                    +966 যোগ করুন
                  </button>
                </div>
              </div>

              {/* Amount (SAR) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  পরিশোধিত/জমার পরিমাণ (SAR)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-600 dark:text-amber-400">
                    {currency}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  মন্তব্য / বিস্তারিত (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="যেমন: ভিসা প্রসেসিং সম্পন্ন, সম্পূর্ণ পরিশোধিত"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold text-xs shadow-lg transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>

            </form>
          ) : (
            <form onSubmit={handleConfigSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  প্রধান শিরোনাম (Main Title)
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  উপ-শিরোনাম (Sub Title)
                </label>
                <input
                  type="text"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  এজেন্সির নাম (Agency Name)
                </label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  মুদ্রার প্রতীক (Currency Symbol)
                </label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm font-bold"
                />
              </div>

              {/* Danger / Action Zone */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>ডেটা রিসেট অপশন</span>
                </h4>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('আপনি কি সকল ৫০ জন যাত্রীর তথ্য খালি ("--") করতে চান?')) {
                        onResetAllMembers();
                        onClose();
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold border border-rose-300 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>সকল ৫০ টি স্লট খালি করুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSeedSampleMembers();
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold border border-amber-300 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>নমুনা ডেটা লোড করুন (Demo Data)</span>
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold text-xs shadow-lg transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>সেটিংস পরিবর্তন করুন</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
