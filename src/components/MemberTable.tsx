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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-emerald-900/20 dark:border-emerald-700/40 shadow-xl overflow-hidden print-area">
      
      {/* Table Header Controls (Search & Quick Filter & Export 3-Dot Menu) */}
      <div className="no-print p-4 sm:p-6 bg-gradient-to-r from-emerald-900/5 via-amber-500/5 to-emerald-900/5 dark:from-emerald-950 dark:via-slate-900 dark:to-emerald-950 border-b border-emerald-800/10 dark:border-emerald-700/30 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="যাত্রীর নাম বা নং দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-emerald-800/20 dark:border-emerald-700/40 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-amber-500 transition-all shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              মুছুন
            </button>
          )}
        </div>

        {/* Filter Tabs, Add Button & 3-Dot Export Menu */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
          
          <div className="inline-flex rounded-xl p-1 bg-emerald-900/10 dark:bg-slate-800 border border-emerald-800/20 dark:border-emerald-700/40 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterMode === 'all'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-800'
              }`}
            >
              সকল ({displayMembers.length})
            </button>
            <button
              onClick={() => setFilterMode('filled')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterMode === 'filled'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-800'
              }`}
            >
              নিবন্ধিত
            </button>
            <button
              onClick={() => setFilterMode('empty')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterMode === 'empty'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-800'
              }`}
            >
              খালি
            </button>
          </div>

          {/* Add Member Button */}
          <button
            onClick={onAddMember}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 border border-amber-400/40"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
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
            <tr className="bg-emerald-900 text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 border-amber-500">
              <th className="py-3.5 px-3 text-center w-14 sm:w-16 border-r border-emerald-800">
                ক্রমিক
              </th>
              <th className="py-3.5 px-4 sm:px-6 border-r border-emerald-800 min-w-[180px]">
                যাত্রীর নাম (Name)
              </th>
              <th className="py-3.5 px-4 sm:px-6 text-center border-r border-emerald-800 w-28 sm:w-36">
                পরিমাণ ({currencySymbol})
              </th>
              <th className="py-3.5 px-3 sm:px-4 text-center border-r border-emerald-800 w-20 sm:w-24">
                ফোন
              </th>
              <th className="py-3.5 px-3 sm:px-4 text-center w-16 sm:w-20 no-print">
                অ্যাকশন
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-900/10 dark:divide-emerald-800/30 text-xs sm:text-sm">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-8 h-8 text-amber-500" />
                    <p className="font-medium text-base">কোনো তথ্য পাওয়া যায়নি</p>
                    <p className="text-xs">ফিল্টার বা সার্চ পরিবর্তন করে দেখুন</p>
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
                    className={`transition-colors hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 ${
                      isEmpty
                        ? 'bg-slate-50/50 dark:bg-slate-900/50 text-slate-400'
                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {/* Serial Number Column */}
                    <td className="py-3 px-2 sm:px-3 text-center font-bold text-emerald-950 dark:text-emerald-400 border-r border-emerald-900/10 dark:border-emerald-800/20 bg-emerald-900/5 dark:bg-emerald-950/20">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-900 text-amber-300 text-xs font-black shadow-inner">
                        {member.serial}
                      </span>
                    </td>

                    {/* Member Name Column - Single Line Crisp Text */}
                    <td className="py-3 px-4 sm:px-6 border-r border-emerald-900/10 dark:border-emerald-800/20">
                      <div className="flex items-center justify-between gap-2 overflow-hidden">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <User className={`w-4 h-4 shrink-0 ${isEmpty ? 'text-slate-300 dark:text-slate-600' : 'text-emerald-700 dark:text-emerald-400'}`} />
                          <button
                            onClick={() => {
                              if (member.phone) {
                                handleCall(member.phone, member.name);
                              } else {
                                onEditMember(member);
                              }
                            }}
                            className={`whitespace-nowrap font-bold text-left overflow-hidden text-ellipsis focus:outline-none ${
                              isEmpty
                                ? 'text-slate-400 dark:text-slate-500 italic font-normal'
                                : 'text-slate-900 dark:text-emerald-200 hover:text-emerald-700 text-sm sm:text-base tracking-wide'
                            }`}
                            title={member.phone ? `কল করুন: ${member.phone}` : 'সম্পাদনা করুন'}
                          >
                            {member.name}
                          </button>
                        </div>

                        {member.notes && (
                          <span className="hidden xl:inline-block px-2 py-0.5 text-[10px] rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/40 shrink-0">
                            {member.notes}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Amount (SAR) Column */}
                    <td className="py-3 px-4 text-center border-r border-emerald-900/10 dark:border-emerald-800/20 font-bold whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-xl text-xs sm:text-sm ${
                          member.amount > 0
                            ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-400/40 shadow-xs font-extrabold'
                            : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 font-medium'
                        }`}
                      >
                        {member.amount.toLocaleString('bn-BD')} {currencySymbol}
                      </span>
                    </td>

                    {/* Phone Column - ONLY Phone Icon (Phone text hidden) */}
                    <td className="py-3 px-2 text-center border-r border-emerald-900/10 dark:border-emerald-800/20">
                      {member.phone ? (
                        <button
                          onClick={() => handleCall(member.phone, member.name)}
                          className="p-2 rounded-full bg-emerald-700 hover:bg-emerald-600 text-amber-300 shadow-sm transition-transform active:scale-90 inline-flex items-center justify-center border border-amber-400/40"
                          title={`ফোন করুন (${member.phone})`}
                        >
                          <Phone className="w-4 h-4 text-amber-300" />
                        </button>
                      ) : (
                        <span className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 inline-flex items-center justify-center cursor-not-allowed">
                          <PhoneOff className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>

                    {/* Action Column - 3-Dot / 3-Line Menu */}
                    <td className="py-3 px-2 text-center relative no-print row-action-menu">
                      <button
                        onClick={() => setActiveMenuId(isMenuOpen ? null : member.id)}
                        className="p-1.5 rounded-lg bg-emerald-900/10 dark:bg-slate-800 hover:bg-amber-500 hover:text-emerald-950 text-slate-700 dark:text-emerald-300 transition-colors shadow-xs"
                        title="অ্যাকশন মেনু (3-Dot)"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Row Action Dropdown Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-2 top-10 w-44 rounded-xl bg-white dark:bg-slate-800 border-2 border-amber-400/80 shadow-2xl z-40 overflow-hidden text-left p-1 text-xs font-medium animate-fadeIn">
                          
                          {/* Call Option */}
                          {member.phone && (
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                handleCall(member.phone, member.name);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-emerald-800 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-600" />
                              <span>কল করুন</span>
                            </button>
                          )}

                          {/* Edit Option */}
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onEditMember(member);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-amber-600" />
                            <span>সম্পাদনা করুন</span>
                          </button>

                          {/* Delete/Reset Option */}
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onDeleteMember(member.id);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors border-t border-slate-100 dark:border-slate-700 mt-1 pt-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
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
      <div className="p-3 sm:p-4 bg-emerald-900/5 dark:bg-emerald-950/40 border-t border-emerald-900/10 dark:border-emerald-800/30 text-center text-xs text-slate-500 dark:text-slate-400">
        অটো-গ্রো টেবিল: নিবন্ধিত যাত্রীর সাথে ২টি অতিরিক্ত খালি ঘর থাকবে • ৩-ডট মেনু ক্লিক করে তথ্য পরিবর্তন বা মুছুন
      </div>

    </div>
  );
};
