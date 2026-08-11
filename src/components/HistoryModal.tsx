import React, { useState } from 'react';
import { SavedHistoryRecord } from '../types';
import { History, Eye, Trash2, X, Calendar, Users, Wallet, ArrowLeft } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: SavedHistoryRecord[];
  onDeleteRecord: (recordId: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  records,
  onDeleteRecord
}) => {
  const [selectedRecord, setSelectedRecord] = useState<SavedHistoryRecord | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#050A30]/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0A1035]/95 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-[0_0_40px_rgba(0,255,255,0.4)] border-2 border-[#00FFFF] overflow-hidden text-slate-100 relative">
        
        {/* Subtle Top Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00BFFF] via-[#8A2BE2] via-[#FF4DFF] to-[#39FF14]"></div>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#050A30] via-[#0A1035] to-[#050A30] px-6 py-4 flex items-center justify-between border-b border-[#00BFFF]/30 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-[#FF4DFF] glow-icon-pink" />
            <h3 className="font-extrabold text-base sm:text-lg neon-text-gradient-primary">
              {selectedRecord ? 'সংরক্ষিত রেকর্ডের বিবরণ' : 'সংরক্ষিত ইতিহাস (Saved History)'}
            </h3>
          </div>
          <button
            onClick={() => {
              if (selectedRecord) {
                setSelectedRecord(null);
              } else {
                onClose();
              }
            }}
            className="p-1.5 rounded-xl bg-[#050A30] hover:bg-[#8A2BE2]/40 text-cyan-300 hover:text-white transition-colors border border-[#00BFFF]/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {selectedRecord ? (
            /* Detailed View of Single Record */
            <div className="space-y-4">
              <button
                onClick={() => setSelectedRecord(null)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00FFFF] hover:underline"
              >
                <ArrowLeft className="w-4 h-4 text-[#00FFFF]" />
                <span>তালিকায় ফিরে যান</span>
              </button>

              {/* Record Summary Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#050A30] to-[#0A1035] border-2 border-[#00BFFF]/60 shadow-[0_0_15px_rgba(0,191,255,0.25)]">
                <h4 className="text-base font-black text-[#00FFFF] mb-1">
                  {selectedRecord.name}
                </h4>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-cyan-200">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#00BFFF]" />
                    <span>{selectedRecord.savedAt}</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold text-[#39FF14]">
                    <Users className="w-3.5 h-3.5 text-[#39FF14]" />
                    <span>{selectedRecord.totalPassengers} জন যাত্রী</span>
                  </span>
                  <span className="flex items-center gap-1 font-black text-[#FFD700] glow-icon-gold">
                    <Wallet className="w-3.5 h-3.5" />
                    <span>{selectedRecord.totalCollectedSAR.toLocaleString('bn-BD')} {selectedRecord.config?.currency || 'SAR'}</span>
                  </span>
                </div>
              </div>

              {/* Passengers Table Inside Record View */}
              <div className="overflow-x-auto rounded-2xl border border-[#00BFFF]/40 bg-[#050A30]">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#0047FF] via-[#8A2BE2] to-[#FF4DFF] text-white font-black">
                      <th className="py-2.5 px-3 border-b border-[#00BFFF]/30 text-center w-12">#</th>
                      <th className="py-2.5 px-3 border-b border-[#00BFFF]/30">যাত্রীর নাম</th>
                      <th className="py-2.5 px-3 border-b border-[#00BFFF]/30 text-center">ফোন</th>
                      <th className="py-2.5 px-3 border-b border-[#00BFFF]/30 text-right">জমা পরিমাণ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRecord.members
                      .filter((m) => m.name && m.name !== '--' && m.name.trim() !== '')
                      .map((m, idx) => (
                        <tr
                          key={m.id || idx}
                          className="border-b border-[#00BFFF]/20 hover:bg-[#8A2BE2]/20"
                        >
                          <td className="py-2 px-3 text-center font-bold text-cyan-300">{idx + 1}</td>
                          <td className="py-2 px-3 font-semibold text-white">{m.name}</td>
                          <td className="py-2 px-3 text-center font-mono">
                            {m.phone ? (
                              <a
                                href={`tel:${m.phone.replace(/[^0-9+]/g, '')}`}
                                className="text-[#39FF14] hover:underline font-bold"
                              >
                                {m.phone}
                              </a>
                            ) : (
                              <span className="text-slate-500">-</span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-right font-black text-[#39FF14]">
                            {(m.amount || 0).toLocaleString('bn-BD')} {selectedRecord.config?.currency || 'SAR'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons inside Record View */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 rounded-xl bg-[#050A30] hover:bg-[#8A2BE2]/40 text-cyan-200 font-bold text-xs sm:text-sm border border-[#00BFFF]/30 transition-all"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          ) : (
            /* Records List View */
            records.length === 0 ? (
              <div className="py-12 text-center text-cyan-200/60 space-y-3">
                <History className="w-12 h-12 mx-auto text-[#FF4DFF] opacity-60 glow-icon-pink" />
                <p className="text-sm font-bold text-[#00FFFF]">কোনো সেভ করা ইতিহাস পাওয়া যায়নি।</p>
                <p className="text-xs text-slate-400">টপ মেনু থেকে "Save Data" নির্বাচন করে ডাটা সেভ করতে পারেন।</p>
              </div>
            ) : (
              <div className="space-y-3">
                {records.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl border-2 border-[#00BFFF]/40 bg-[#050A30]/80 hover:border-[#00FFFF] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_15px_rgba(0,191,255,0.15)] hover:shadow-[0_0_25px_rgba(0,255,255,0.3)]"
                  >
                    <div
                      className="cursor-pointer flex-1 space-y-1"
                      onClick={() => setSelectedRecord(rec)}
                    >
                      <h4 className="font-extrabold text-sm sm:text-base text-white hover:text-[#00FFFF] transition-colors">
                        {rec.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-cyan-200">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#00BFFF]" />
                          <span>{rec.savedAt}</span>
                        </span>
                        <span>•</span>
                        <span className="font-bold text-[#39FF14]">
                          {rec.totalPassengers} জন যাত্রী
                        </span>
                        <span>•</span>
                        <span className="font-black text-[#FFD700]">
                          {rec.totalCollectedSAR.toLocaleString('bn-BD')} {rec.config?.currency || 'SAR'}
                        </span>
                      </div>
                    </div>

                    {/* Quick Item Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {/* View Button */}
                      <button
                        onClick={() => setSelectedRecord(rec)}
                        title="বিবরণ দেখুন"
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#0047FF] text-white font-bold text-xs flex items-center gap-1 border border-[#00FFFF]/50 shadow-[0_0_10px_rgba(0,191,255,0.4)]"
                      >
                        <Eye className="w-3.5 h-3.5 text-white" />
                        <span className="hidden sm:inline">দেখুন</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          if (confirm(`আপনি কি '${rec.name}' রেকর্ডটি স্থায়ীভাবে মুছে ফেলতে নিশ্চিত?`)) {
                            onDeleteRecord(rec.id);
                          }
                        }}
                        title="মুছে ফেলুন"
                        className="p-1.5 rounded-xl bg-[#FF4DFF]/20 hover:bg-[#FF4DFF]/40 text-[#FF4DFF] border border-[#FF4DFF]/50 transition-colors shadow-[0_0_10px_rgba(255,77,255,0.3)]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )
          )}

        </div>

      </div>
    </div>
  );
};
