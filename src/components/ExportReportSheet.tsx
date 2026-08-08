import React from 'react';
import { Member, AppConfig } from '../types';

interface ExportReportSheetProps {
  members: Member[];
  config: AppConfig;
  totalCollectedSAR: number;
}

export const ExportReportSheet: React.FC<ExportReportSheetProps> = ({
  members,
  config
}) => {
  // Show ONLY filled/active passengers
  const activeMembers = members.filter(
    (m) => m.name && m.name !== '--' && m.name.trim() !== ''
  );
  
  const activeCount = activeMembers.length;
  
  // Calculate total amount for active/filled passengers only
  const activeTotalAmount = activeMembers.reduce(
    (sum, m) => sum + (Number(m.amount) || 0),
    0
  );

  const currentDate = new Date().toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div
      id="clean-export-sheet"
      className="bg-white text-slate-900 font-sans p-6 w-[800px] mx-auto border border-slate-200 shadow-none h-auto overflow-hidden"
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        fontFamily: 'sans-serif'
      }}
    >
      {/* Document Header (Bismillah & Agency Title) */}
      <div className="text-center pb-3 mb-4 border-b-2 border-emerald-800">
        <p className="text-xs font-serif text-emerald-900 tracking-widest mb-1 font-semibold">
          بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
        <h1 className="text-2xl font-black text-emerald-950 tracking-tight mb-1">
          {config.agencyName || 'হাজী ও ওমরাহ এজেন্সি'}
        </h1>
        <h2 className="text-base font-bold text-amber-700 mb-1">
          {config.title || 'যাত্রী তালিকা ও প্যাকেজ জমার বিবরণী'}
        </h2>
        {config.subtitle && (
          <p className="text-xs text-slate-600 mb-1 font-medium">{config.subtitle}</p>
        )}
        <div className="flex items-center justify-center gap-6 text-xs text-slate-500 mt-1 font-medium">
          <span>যোগাযোগ: {config.agencyPhone || '০১৭০০-০০০০০'}</span>
          <span>•</span>
          <span>তারিখ: {currentDate}</span>
        </div>
      </div>

      {/* Summary Box (Google Sheet Header Banner) */}
      <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-300 grid grid-cols-3 text-center text-xs font-bold text-slate-800">
        <div className="border-r border-slate-300 pr-2">
          <span className="text-slate-500 block text-[11px] font-normal">মোট আসন সংখ্যা</span>
          <span className="text-sm text-emerald-900 font-black">{config.targetTotalMembers || 50} জন</span>
        </div>
        <div className="border-r border-slate-300 px-2">
          <span className="text-slate-500 block text-[11px] font-normal">নিবন্ধিত যাত্রী</span>
          <span className="text-sm text-emerald-900 font-black">{activeCount} জন</span>
        </div>
        <div className="pl-2">
          <span className="text-slate-500 block text-[11px] font-normal">সর্বমোট জমার পরিমাণ</span>
          <span className="text-sm text-emerald-800 font-black">
            {activeTotalAmount.toLocaleString('bn-BD')} {config.currency || 'SAR'}
          </span>
        </div>
      </div>

      {/* Clean Spreadsheet Table - Exactly 4 Columns (No Comment / মন্তব্য Column) */}
      <table className="w-full border-collapse border border-slate-400 text-xs text-left">
        <thead>
          <tr className="bg-emerald-900 text-white font-bold text-center border-b-2 border-emerald-950">
            <th className="py-2 px-2 border border-emerald-800 w-12 text-center">ক্রমিক</th>
            <th className="py-2 px-4 border border-emerald-800 text-left">যাত্রীর নাম (Passenger Name)</th>
            <th className="py-2 px-3 border border-emerald-800 w-36 text-center">ফোন নম্বর (Phone)</th>
            <th className="py-2 px-3 border border-emerald-800 w-36 text-right">জমা পরিমাণ ({config.currency || 'SAR'})</th>
          </tr>
        </thead>
        <tbody>
          {activeMembers.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-6 text-center text-slate-400 italic border border-slate-300">
                কোনো নিবন্ধিত যাত্রী তথ্য পাওয়া যায়নি
              </td>
            </tr>
          ) : (
            activeMembers.map((m, index) => {
              const isEven = index % 2 === 0;
              const serialNum = index + 1; // Auto adjustment starting from 1

              return (
                <tr
                  key={m.id || index}
                  className={isEven ? 'bg-white' : 'bg-slate-50'}
                  style={{ backgroundColor: isEven ? '#ffffff' : '#f8fafc' }}
                >
                  {/* Serial Number - Starts from 1 */}
                  <td className="py-2 px-2 border border-slate-300 text-center font-bold text-slate-700">
                    {serialNum}
                  </td>

                  {/* Name */}
                  <td className="py-2 px-4 border border-slate-300 font-semibold text-slate-900">
                    {m.name}
                  </td>

                  {/* Phone - Click to Call enabled */}
                  <td className="py-2 px-3 border border-slate-300 text-center font-mono text-slate-800">
                    {m.phone ? (
                      <a
                        href={`tel:${m.phone.replace(/[^0-9+]/g, '')}`}
                        className="text-emerald-800 font-bold hover:underline cursor-pointer inline-block"
                        title={`ফোন করুন (${m.phone})`}
                      >
                        {m.phone}
                      </a>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>

                  {/* Amount */}
                  <td className="py-2 px-3 border border-slate-300 text-right font-bold text-emerald-900">
                    {m.amount > 0 ? (
                      `${m.amount.toLocaleString('bn-BD')} ${config.currency || 'SAR'}`
                    ) : (
                      <span className="text-slate-400 font-normal">0 {config.currency || 'SAR'}</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        <tfoot>
          <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-400">
            <td colSpan={3} className="py-2.5 px-4 border border-slate-300 text-right text-xs">
              সর্বমোট জমার হিসাব ({activeCount} জন যাত্রী):
            </td>
            <td className="py-2.5 px-3 border border-slate-300 text-right text-xs text-emerald-950 font-black">
              {activeTotalAmount.toLocaleString('bn-BD')} {config.currency || 'SAR'}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Document Footer / Official Signatures */}
      <div className="mt-8 pt-4 border-t border-slate-300 flex items-end justify-between text-xs text-slate-600">
        <div className="text-center w-36">
          <div className="border-b border-slate-400 mb-1 h-6"></div>
          <p className="font-semibold text-slate-800 text-[11px]">প্রস্তুতকারকের স্বাক্ষর</p>
        </div>
        <div className="text-center text-[10px] text-slate-400">
          <p>অটো-জেনারেটেড রিপোর্ট • {config.agencyName}</p>
          <p>মুদ্রণ সময়: {new Date().toLocaleTimeString('bn-BD')}</p>
        </div>
        <div className="text-center w-36">
          <div className="border-b border-slate-400 mb-1 h-6"></div>
          <p className="font-semibold text-slate-800 text-[11px]">পরিচালকের স্বাক্ষর ও সিল</p>
        </div>
      </div>
    </div>
  );
};
