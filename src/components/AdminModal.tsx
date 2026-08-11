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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050A30]/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0A1035]/95 rounded-3xl border-2 border-[#00FFFF] shadow-[0_0_40px_rgba(0,255,255,0.4)] overflow-hidden text-slate-100 relative">
        
        {/* Subtle Top Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00BFFF] via-[#8A2BE2] via-[#FF4DFF] to-[#39FF14]"></div>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#050A30] via-[#0A1035] to-[#050A30] text-white p-5 flex items-center justify-between border-b border-[#00BFFF]/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FFD700] glow-icon-gold" />
            <h2 className="text-xl font-black font-bengali-heading neon-text-gradient-primary">
              {activeTab === 'member'
                ? editingMember ? `যাত্রী তথ্য সম্পাদনা (সিরিয়াল #${editingMember.serial})` : 'নতুন যাত্রী যোগ / এডিট'
                : 'অ্যাডমিন ও পেজ সেটিংস'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#050A30] hover:bg-[#8A2BE2]/40 text-cyan-300 hover:text-white transition-colors border border-[#00BFFF]/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#00BFFF]/30 bg-[#050A30]">
          <button
            onClick={() => setActiveTab('member')}
            className={`flex-1 py-3 text-center text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'member'
                ? 'border-[#00FFFF] text-[#00FFFF] bg-[#0A1035] shadow-[0_0_15px_rgba(0,255,255,0.3)]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4 text-[#00BFFF]" />
            <span>যাত্রী সদস্য ফর্ম</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 text-center text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'settings'
                ? 'border-[#FF4DFF] text-[#FF4DFF] bg-[#0A1035] shadow-[0_0_15px_rgba(255,77,255,0.3)]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 text-[#FF4DFF]" />
            <span>শিরোনাম ও এজেন্সির নাম</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          
          {activeTab === 'member' ? (
            <form onSubmit={handleMemberSubmit} className="space-y-4">
              
              {/* Serial Slot Selector */}
              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-1">
                  সিরিয়াল নম্বর স্লট (১ থেকে ৫০)
                </label>
                <select
                  value={serial}
                  onChange={(e) => setSerial(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#00BFFF]/50 bg-[#050A30] font-bold text-[#00FFFF] focus:ring-2 focus:ring-[#00FFFF] focus:outline-none shadow-[inset_0_0_10px_rgba(0,191,255,0.2)]"
                >
                  {Array.from({ length: allMembersCount }, (_, i) => i + 1).map((s) => (
                    <option key={s} value={s} className="bg-[#050A30] text-cyan-200">
                      ক্রমিক #{s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Member Name */}
              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-1">
                  যাত্রীর নাম (Full Name) <span className="text-[#FF4DFF]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: মুহাম্মদ আব্দুর রহমান"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#00BFFF]/50 bg-[#050A30] text-white focus:ring-2 focus:ring-[#00FFFF] focus:outline-none text-sm placeholder-cyan-300/30 shadow-[inset_0_0_10px_rgba(0,191,255,0.15)]"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-1">
                  ফোন নম্বর (সৌদি মোবাইল formatting)
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+966500000000 অথবা 0500000000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#00BFFF]/50 bg-[#050A30] text-white focus:ring-2 focus:ring-[#00FFFF] focus:outline-none text-sm placeholder-cyan-300/30 shadow-[inset_0_0_10px_rgba(0,191,255,0.15)]"
                  />
                  <button
                    type="button"
                    onClick={() => setPhone('+966')}
                    className="px-3 py-1 bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] text-white rounded-xl text-xs font-bold border border-[#00FFFF]/40 whitespace-nowrap hover:scale-105 transition-transform shadow-[0_0_10px_rgba(0,191,255,0.4)]"
                  >
                    +966 যোগ করুন
                  </button>
                </div>
              </div>

              {/* Amount (SAR) */}
              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-1">
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#00BFFF]/50 bg-[#050A30] text-[#39FF14] focus:ring-2 focus:ring-[#39FF14] focus:outline-none text-sm font-black shadow-[inset_0_0_10px_rgba(57,255,20,0.2)]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#FFD700] glow-icon-gold">
                    {currency}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-1">
                  মন্তব্য / বিস্তারিত (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="যেমন: ভিসা প্রসেসিং সম্পন্ন, সম্পূর্ণ পরিশোধিত"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#00BFFF]/50 bg-[#050A30] text-white focus:ring-2 focus:ring-[#00FFFF] focus:outline-none text-sm placeholder-cyan-300/30 shadow-[inset_0_0_10px_rgba(0,191,255,0.15)]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#00BFFF]/30">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-[#050A30]"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#39FF14] via-[#7FFF00] to-[#00FFFF] hover:from-[#7FFF00] hover:to-[#39FF14] text-[#050A30] font-black text-xs shadow-[0_0_15px_rgba(57,255,20,0.5)] hover:shadow-[0_0_25px_rgba(127,255,0,0.8)] transition-all active:scale-95 border border-[#39FF14]"
                >
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>

            </form>
          ) : (
            <form onSubmit={handleConfigSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-1">
                  প্রধান শিরোনাম (Main Title)
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#00BFFF]/50 bg-[#050A30] text-[#00FFFF] focus:ring-2 focus:ring-[#00FFFF] focus:outline-none text-sm font-bold shadow-[inset_0_0_10px_rgba(0,191,255,0.15)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-1">
                  উপ-শিরোনাম (Sub Title)
                </label>
                <input
                  type="text"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#00BFFF]/50 bg-[#050A30] text-white focus:ring-2 focus:ring-[#00FFFF] focus:outline-none text-sm shadow-[inset_0_0_10px_rgba(0,191,255,0.15)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-1">
                  এজেন্সির নাম (Agency Name)
                </label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#00BFFF]/50 bg-[#050A30] text-white focus:ring-2 focus:ring-[#00FFFF] focus:outline-none text-sm shadow-[inset_0_0_10px_rgba(0,191,255,0.15)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-1">
                  মুদ্রার প্রতীক (Currency Symbol)
                </label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#00BFFF]/50 bg-[#050A30] text-[#FFD700] focus:ring-2 focus:ring-[#FFD700] focus:outline-none text-sm font-bold shadow-[inset_0_0_10px_rgba(255,215,0,0.15)]"
                />
              </div>

              {/* Danger / Action Zone */}
              <div className="mt-6 pt-4 border-t border-[#00BFFF]/30 space-y-3">
                <h4 className="text-xs font-bold text-[#FF4DFF] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#FF4DFF]" />
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
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FF4DFF]/20 hover:bg-[#FF4DFF]/30 text-[#FF4DFF] text-xs font-bold border border-[#FF4DFF]/50 transition-colors shadow-[0_0_10px_rgba(255,77,255,0.2)]"
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
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFD700]/20 hover:bg-[#FFD700]/30 text-[#FFD700] text-xs font-bold border border-[#FFD700]/50 transition-colors shadow-[0_0_10px_rgba(255,215,0,0.2)]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>নমুনা ডেটা লোড করুন (Demo Data)</span>
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#00BFFF]/30">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-[#050A30]"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00BFFF] via-[#8A2BE2] to-[#FF4DFF] hover:from-[#00FFFF] hover:to-[#FF4DFF] text-white font-extrabold text-xs shadow-[0_0_15px_rgba(0,191,255,0.5)] hover:shadow-[0_0_25px_rgba(255,77,255,0.8)] transition-all active:scale-95 border border-[#00FFFF]/50"
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
