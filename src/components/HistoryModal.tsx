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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-emerald-900/20 dark:border-emerald-700/30 overflow-hidden text-slate-800 dark:text-slate-100">
        
        {/* Modal Header */}
        <div className="bg-emerald-900 dark:bg-emerald-950 px-6 py-4 flex items-center justify-between border-b border-amber-500/40 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base sm:text-lg">
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
            className="p-1.5 rounded-lg hover:bg-emerald-800 text-slate-300 hover:text-white transition-colors"
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
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>তালিকায় ফিরে যান</span>
              </button>

              {/* Record Summary Banner */}
              <div className="p-4 rounded-2xl bg-emerald-900/5 dark:bg-emerald-950/50 border border-emerald-900/20 dark:border-emerald-700/30">
                <h4 className="text-base font-bold text-emerald-950 dark:text-emerald-200 mb-1">
                  {selectedRecord.name}
                </h4>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedRecord.savedAt}</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold text-emerald-800 dark:text-emerald-300">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedRecord.totalPassengers} জন যাত্রী</span>
                  </span>
                  <span className="flex items-center gap-1 font-black text-amber-700 dark:text-amber-400">
                    <Wallet className="w-3.5 h-3.5" />
                    <span>{selectedRecord.totalCollectedSAR.toLocaleString('bn-BD')} {selectedRecord.config?.currency || 'SAR'}</span>
                  </span>
                </div>
              </div>

              {/* Passengers Table Inside Record View */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                      <th className="py-2.5 px-3 border-b border-slate-200 dark:border-slate-700 text-center w-12">#</th>
                      <th className="py-2.5 px-3 border-b border-slate-200 dark:border-slate-700">যাত্রীর নাম</th>
                      <th className="py-2.5 px-3 border-b border-slate-200 dark:border-slate-700 text-center">ফোন</th>
                      <th className="py-2.5 px-3 border-b border-slate-200 dark:border-slate-700 text-right">জমা পরিমাণ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRecord.members
                      .filter((m) => m.name && m.name !== '--' && m.name.trim() !== '')
                      .map((m, idx) => (
                        <tr
                          key={m.id || idx}
                          className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                        >
                          <td className="py-2 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                          <td className="py-2 px-3 font-semibold text-slate-900 dark:text-slate-100">{m.name}</td>
                          <td className="py-2 px-3 text-center font-mono">
                            {m.phone ? (
                              <a
                                href={`tel:${m.phone.replace(/[^0-9+]/g, '')}`}
                                className="text-emerald-700 dark:text-emerald-400 hover:underline font-bold"
                              >
                                {m.phone}
                              </a>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-emerald-800 dark:text-emerald-400">
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
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm transition-all"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          ) : (
            /* Records List View */
            records.length === 0 ? (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500 space-y-3">
                <History className="w-12 h-12 mx-auto opacity-40" />
                <p className="text-sm font-medium">কোনো সেভ করা ইতিহাস পাওয়া যায়নি।</p>
                <p className="text-xs text-slate-400">টপ মেনু থেকে "Save Data" নির্বাচন করে ডাটা সেভ করতে পারেন।</p>
              </div>
            ) : (
              <div className="space-y-3">
                {records.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-emerald-600/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div
                      className="cursor-pointer flex-1 space-y-1"
                      onClick={() => setSelectedRecord(rec)}
                    >
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                        {rec.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{rec.savedAt}</span>
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-800 dark:text-emerald-400">
                          {rec.totalPassengers} জন যাত্রী
                        </span>
                        <span>•</span>
                        <span className="font-bold text-amber-700 dark:text-amber-400">
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
                        className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
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
                        className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 transition-colors"
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
