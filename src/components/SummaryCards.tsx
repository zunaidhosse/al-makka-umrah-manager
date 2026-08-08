import React from 'react';
import { Users, UserCheck, UserX, Coins, Calendar, Award } from 'lucide-react';

interface SummaryCardsProps {
  totalTargetMembers: number; // e.g. 50
  activeCount: number;
  emptyCount: number;
  totalCollectedSAR: number;
  currencySymbol?: string;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalTargetMembers = 50,
  activeCount,
  emptyCount,
  totalCollectedSAR,
  currencySymbol = "SAR"
}) => {
  // Format SAR currency into formatted Bengali locale style or numeric
  const formattedSAR = new Intl.NumberFormat('bn-BD').format(totalCollectedSAR);
  const formattedActive = new Intl.NumberFormat('bn-BD').format(activeCount);
  const formattedEmpty = new Intl.NumberFormat('bn-BD').format(emptyCount);
  const formattedTotal = new Intl.NumberFormat('bn-BD').format(totalTargetMembers);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6">
      
      {/* Card 1: Total Members */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-800/20 dark:border-emerald-700/40 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              মোট সদস্য সংখ্যা
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-900 dark:text-emerald-400 mt-1">
              {formattedTotal} <span className="text-xs font-normal text-slate-500">জন</span>
            </h3>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300/40">
            <Users className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-amber-500" />
          <span>নির্ধারিত প্যাকেজ কোটা: ৫০ জন</span>
        </div>
        <div className="absolute top-0 right-0 w-2 h-full bg-emerald-600"></div>
      </div>

      {/* Card 2: Registered Members */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-500/30 dark:border-amber-500/40 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              নিবন্ধিত যাত্রী
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
              {formattedActive} <span className="text-xs font-normal text-slate-500">জন</span>
            </h3>
          </div>
          <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-300/40">
            <UserCheck className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          <span>পূরণ করা স্লট: {Math.round((activeCount / totalTargetMembers) * 100)}%</span>
        </div>
        <div className="absolute top-0 right-0 w-2 h-full bg-amber-500"></div>
      </div>

      {/* Card 3: Empty Slots */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              খালি স্লট (অবশিষ্ট)
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-700 dark:text-slate-300 mt-1">
              {formattedEmpty} <span className="text-xs font-normal text-slate-500">টি</span>
            </h3>
          </div>
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300/40">
            <UserX className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <span>খালি থাকা আসন সংখ্যা</span>
        </div>
        <div className="absolute top-0 right-0 w-2 h-full bg-slate-400"></div>
      </div>

      {/* Card 4: Total Collected Amount (SAR) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-950 text-white border-2 border-amber-400/70 p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-amber-200">
              মোট সংগৃহীত অর্থ (SAR)
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-300 mt-1 gold-gradient-text">
              {formattedSAR} <span className="text-sm font-bold text-amber-400">{currencySymbol}</span>
            </h3>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/40">
            <Coins className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" />
          </div>
        </div>
        <div className="mt-3 text-xs text-emerald-200/80 flex items-center gap-1">
          <span>সৌদি রিয়াল সমপরিমাণ জমার হিসাব</span>
        </div>
        <div className="absolute top-0 right-0 w-2 h-full gold-gradient-bg"></div>
      </div>

    </div>
  );
};
