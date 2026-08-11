import React, { useState, useRef, useEffect } from 'react';
import { Member } from '../types';
import { Phone, PhoneOff, Edit2, Trash2, Search, PlusCircle, User, AlertCircle, MoreVertical, Menu } from 'lucide-react';
import { ExportControls } from './ExportControls';

interface MemberTableProps {
  members: Member[];
  onAddMember: () => void;
  onEditMember: (member: Member) => void;
  onDeleteMember: (id: number) => void;
  currencySymbol?: string;
  exportFileName?: string;
}

export const MemberTable: React.FC<MemberTableProps> = ({
  members,
  onAddMember,
  onEditMember,
  onDeleteMember,
  currencySymbol = "SAR",
  exportFileName = "যাত্রী_প্যাকেজ_তালিকা"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'filled' | 'empty'>('all');
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  // Close active dropdown menu when clicking outside
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.row-action-menu')) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, []);

  // Find the index of the last filled member
  const lastFilledIndex = members.findLastIndex(
    (m) => m.name && m.name !== '--' && m.name.trim() !== ''
  );

  // Calculate visible rows count: filled count + 2 extra empty rows (minimum 2 rows)
  const visibleRowCount = Math.min(
    members.length,
    Math.max(2, lastFilledIndex + 1 + 2)
  );

  // When searching, search all members; otherwise show visible rows only
  const displayMembers = searchTerm.trim() !== ''
    ? members
    : members.slice(0, visibleRowCount);

  // Filter members based on search and selected filter tab
  const filteredMembers = displayMembers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm) ||
      m.serial.toString().includes(searchTerm) ||
      (m.notes && m.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    const isFilled = m.name !== '--' && m.name.trim() !== '';
    if (filterMode === 'filled') return isFilled;
    if (filterMode === 'empty') return !isFilled;
    return true;
  });

  const handleCall = (phone: string, name: string) => {
    if (!phone || phone.trim() === '') {
      alert(`"${name}" এর কোনো ফোন নম্বর যুক্ত করা হয়নি। অনুগ্রহ করে সম্পাদনা করে ফোন নম্বর লিখুন।`);
      return;
    }
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    window.location.href = `tel:${cleanPhone}`;
  };

  return (
    <div className="bg-[#0A1035]/85 rounded-2xl border-2 border-[#00BFFF]/40 shadow-[0_0_30px_rgba(0,191,255,0.2)] overflow-hidden print-area">
      
      {/* Table Header Controls (Search & Quick Filter & Export 3-Dot Menu) */}
      <div className="no-print p-4 sm:p-6 bg-gradient-to-r from-[#050A30] via-[#0A1035] to-[#050A30] border-b border-[#00BFFF]/30 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00FFFF] glow-icon-cyan" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="যাত্রীর নাম বা নং দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#00BFFF]/50 bg-[#0A1035] text-cyan-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-[#00FFFF] transition-all shadow-[inset_0_0_10px_rgba(0,191,255,0.15)] placeholder-cyan-300/40"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#FF4DFF] hover:text-white font-bold"
            >
              মুছুন
            </button>
          )}
        </div>

        {/* Filter Tabs, Add Button & 3-Dot Export Menu */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
          
          <div className="inline-flex rounded-xl p-1 bg-[#050A30] border border-[#00BFFF]/40 text-xs shadow-inner">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterMode === 'all'
                  ? 'bg-gradient-to-r from-[#00BFFF] to-[#0047FF] text-white shadow-[0_0_10px_rgba(0,191,255,0.6)]'
                  : 'text-cyan-200/80 hover:text-white'
              }`}
            >
              সকল ({displayMembers.length})
            </button>
            <button
              onClick={() => setFilterMode('filled')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterMode === 'filled'
                  ? 'bg-gradient-to-r from-[#39FF14] to-[#7FFF00] text-[#050A30] shadow-[0_0_10px_rgba(57,255,20,0.6)]'
                  : 'text-cyan-200/80 hover:text-white'
              }`}
            >
              নিবন্ধিত
            </button>
            <button
              onClick={() => setFilterMode('empty')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterMode === 'empty'
                  ? 'bg-gradient-to-r from-[#8A2BE2] to-[#FF4DFF] text-white shadow-[0_0_10px_rgba(255,77,255,0.6)]'
                  : 'text-cyan-200/80 hover:text-white'
              }`}
            >
              খালি
            </button>
          </div>

          {/* Add Member Button */}
          <button
            onClick={onAddMember}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00BFFF] via-[#8A2BE2] to-[#FF4DFF] hover:from-[#00FFFF] hover:to-[#FF4DFF] text-white font-extrabold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,191,255,0.5)] hover:shadow-[0_0_25px_rgba(255,77,255,0.8)] transition-all active:scale-95 border border-[#00FFFF]/50"
          >
            <PlusCircle className="w-4 h-4 text-[#00FFFF] glow-icon-cyan" />
            <span>➕ নতুন যাত্রী</span>
          </button>

          {/* Export Options inside 3-Dot Dropdown Menu */}
          <ExportControls
            targetElementId="clean-export-sheet"
            fileName={exportFileName}
          />

        </div>
      </div>

      {/* Main Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-[#0047FF] via-[#8A2BE2] to-[#FF4DFF] text-white text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 border-[#00FFFF]">
              <th className="py-3.5 px-3 text-center w-14 sm:w-16 border-r border-[#00BFFF]/30">
                ক্রমিক
              </th>
              <th className="py-3.5 px-4 sm:px-6 border-r border-[#00BFFF]/30 min-w-[180px]">
                যাত্রীর নাম (Name)
              </th>
              <th className="py-3.5 px-4 sm:px-6 text-center border-r border-[#00BFFF]/30 w-28 sm:w-36">
                পরিমাণ ({currencySymbol})
              </th>
              <th className="py-3.5 px-3 sm:px-4 text-center border-r border-[#00BFFF]/30 w-20 sm:w-24">
                ফোন
              </th>
              <th className="py-3.5 px-3 sm:px-4 text-center w-16 sm:w-20 no-print">
                অ্যাকশন
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#00BFFF]/20 text-xs sm:text-sm">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-cyan-200/60">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-8 h-8 text-[#FFD700] glow-icon-gold" />
                    <p className="font-bold text-base text-[#00FFFF]">কোনো তথ্য পাওয়া যায়নি</p>
                    <p className="text-xs text-slate-400">ফিল্টার বা সার্চ পরিবর্তন করে দেখুন</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => {
                const isEmpty = member.name === '--' || !member.name.trim();
                const isMenuOpen = activeMenuId === member.id;

                return (
                  <tr
                    key={member.id}
                    className={`transition-colors hover:bg-[#8A2BE2]/25 ${
                      isEmpty
                        ? 'bg-[#050A30]/40 text-slate-400'
                        : 'bg-[#0A1035]/60 text-slate-100'
                    }`}
                  >
                    {/* Serial Number Column */}
                    <td className="py-3 px-2 sm:px-3 text-center font-bold text-cyan-300 border-r border-[#00BFFF]/20 bg-[#050A30]/60">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#00BFFF] to-[#8A2BE2] text-white text-xs font-black shadow-[0_0_10px_rgba(0,191,255,0.5)]">
                        {member.serial}
                      </span>
                    </td>

                    {/* Member Name Column - Single Line Crisp Text */}
                    <td className="py-3 px-4 sm:px-6 border-r border-[#00BFFF]/20">
                      <div className="flex items-center justify-between gap-2 overflow-hidden">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <User className={`w-4 h-4 shrink-0 ${isEmpty ? 'text-slate-500' : 'text-[#00FFFF] glow-icon-cyan'}`} />
                          <button
                            onClick={() => {
                              if (member.phone) {
                                handleCall(member.phone, member.name);
                              } else {
                                onEditMember(member);
                              }
                            }}
                            className={`whitespace-nowrap font-bold text-left overflow-hidden text-ellipsis focus:outline-none transition-colors ${
                              isEmpty
                                ? 'text-slate-500 italic font-normal'
                                : 'text-white hover:text-[#00FFFF] text-sm sm:text-base tracking-wide drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]'
                            }`}
                            title={member.phone ? `কল করুন: ${member.phone}` : 'সম্পাদনা করুন'}
                          >
                            {member.name}
                          </button>
                        </div>

                        {member.notes && (
                          <span className="hidden xl:inline-block px-2 py-0.5 text-[10px] rounded-md bg-[#8A2BE2]/30 text-[#FF4DFF] border border-[#FF4DFF]/40 shrink-0 font-bold shadow-[0_0_8px_rgba(255,77,255,0.3)]">
                            {member.notes}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Amount (SAR) Column */}
                    <td className="py-3 px-4 text-center border-r border-[#00BFFF]/20 font-bold whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-xl text-xs sm:text-sm ${
                          member.amount > 0
                            ? 'bg-gradient-to-r from-[#39FF14]/20 to-[#7FFF00]/20 text-[#39FF14] border border-[#39FF14]/60 shadow-[0_0_10px_rgba(57,255,20,0.3)] font-black'
                            : 'bg-[#050A30]/60 text-slate-500 border border-slate-700 font-medium'
                        }`}
                      >
                        {member.amount.toLocaleString('bn-BD')} {currencySymbol}
                      </span>
                    </td>

                    {/* Phone Column - ONLY Phone Icon (Phone text hidden) */}
                    <td className="py-3 px-2 text-center border-r border-[#00BFFF]/20">
                      {member.phone ? (
                        <button
                          onClick={() => handleCall(member.phone, member.name)}
                          className="p-2 rounded-full bg-gradient-to-r from-[#39FF14] to-[#7FFF00] hover:from-[#7FFF00] hover:to-[#39FF14] text-[#050A30] shadow-[0_0_12px_rgba(57,255,20,0.6)] transition-transform active:scale-90 inline-flex items-center justify-center border border-[#39FF14]"
                          title={`ফোন করুন (${member.phone})`}
                        >
                          <Phone className="w-4 h-4 text-[#050A30] stroke-[2.5]" />
                        </button>
                      ) : (
                        <span className="p-2 rounded-full bg-[#050A30]/60 text-slate-600 inline-flex items-center justify-center cursor-not-allowed border border-slate-800">
                          <PhoneOff className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>

                    {/* Action Column - 3-Dot / 3-Line Menu */}
                    <td className="py-3 px-2 text-center relative no-print row-action-menu">
                      <button
                        onClick={() => setActiveMenuId(isMenuOpen ? null : member.id)}
                        className="p-1.5 rounded-lg bg-[#050A30] hover:bg-[#00BFFF] hover:text-[#050A30] text-[#00FFFF] transition-all shadow-[0_0_10px_rgba(0,191,255,0.3)] border border-[#00BFFF]/40"
                        title="অ্যাকশন মেনু (3-Dot)"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Row Action Dropdown Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-2 top-10 w-48 rounded-2xl bg-[#0A1035] border-2 border-[#00FFFF] shadow-[0_0_25px_rgba(0,255,255,0.5)] z-40 overflow-hidden text-left p-1.5 text-xs font-bold animate-fadeIn">
                          
                          {/* Call Option */}
                          {member.phone && (
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                handleCall(member.phone, member.name);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#39FF14] hover:bg-[#39FF14]/20 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-[#39FF14]" />
                              <span>কল করুন</span>
                            </button>
                          )}

                          {/* Edit Option */}
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onEditMember(member);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#00FFFF] hover:bg-[#00BFFF]/20 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#00FFFF]" />
                            <span>সম্পাদনা করুন</span>
                          </button>

                          {/* Delete/Reset Option */}
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onDeleteMember(member.id);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#FF4DFF] hover:bg-[#FF4DFF]/20 transition-colors border-t border-[#00BFFF]/30 mt-1 pt-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-[#FF4DFF]" />
                            <span>তথ্য মুছুন / রিসেট</span>
                          </button>

                        </div>
                      )}
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Note */}
      <div className="p-3 sm:p-4 bg-[#050A30]/80 border-t border-[#00BFFF]/30 text-center text-xs text-cyan-200/80 font-medium">
        অটো-গ্রো টেবিল: নিবন্ধিত যাত্রীর সাথে ২টি অতিরিক্ত খালি ঘর থাকবে • ৩-ডট মেনু ক্লিক করে তথ্য পরিবর্তন বা মুছুন
      </div>

    </div>
  );
};
