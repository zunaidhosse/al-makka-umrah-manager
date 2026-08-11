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
      
      {/* Card 1: Total Members (Electric Blue Neon) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A1035]/90 via-[#050A30]/95 to-[#0047FF]/20 border-2 border-[#00BFFF]/60 p-4 sm:p-5 shadow-[0_0_20px_rgba(0,191,255,0.2)] hover:shadow-[0_0_30px_rgba(0,191,255,0.45)] transition-all duration-300 hover:-translate-y-1 group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-bold text-cyan-300 tracking-wide">
              মোট সদস্য সংখ্যা
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-[#00FFFF] mt-1 drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]">
              {formattedTotal} <span className="text-xs font-medium text-cyan-200/80">জন</span>
            </h3>
          </div>
          <div className="p-3 rounded-2xl bg-[#00BFFF]/20 text-[#00FFFF] border border-[#00BFFF]/50 shadow-[0_0_15px_rgba(0,191,255,0.4)] group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6 sm:w-7 sm:h-7 glow-icon-blue" />
          </div>
        </div>
        <div className="mt-3 text-xs text-cyan-200/80 flex items-center gap-1 font-medium">
          <Calendar className="w-3.5 h-3.5 text-[#FFD700] glow-icon-gold" />
          <span>নির্ধারিত প্যাকেজ কোটা: ৫০ জন</span>
        </div>
        <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-[#00BFFF] via-[#00FFFF] to-[#0047FF]"></div>
      </div>

      {/* Card 2: Registered Members (Bright Green Neon) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A1035]/90 via-[#050A30]/95 to-[#39FF14]/15 border-2 border-[#39FF14]/60 p-4 sm:p-5 shadow-[0_0_20px_rgba(57,255,20,0.2)] hover:shadow-[0_0_30px_rgba(57,255,20,0.45)] transition-all duration-300 hover:-translate-y-1 group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-bold text-lime-300 tracking-wide">
              নিবন্ধিত যাত্রী
            </p>
            <h3 className="text-2xl sm:text-3xl font-black neon-text-gradient-green mt-1">
              {formattedActive} <span className="text-xs font-medium text-lime-200/80">জন</span>
            </h3>
          </div>
          <div className="p-3 rounded-2xl bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/50 shadow-[0_0_15px_rgba(57,255,20,0.4)] group-hover:scale-110 transition-transform">
            <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 glow-icon-green" />
          </div>
        </div>
        <div className="mt-3 text-xs text-lime-200/80 flex items-center gap-1 font-medium">
          <Award className="w-3.5 h-3.5 text-[#39FF14]" />
          <span>পূরণ করা স্লট: {Math.round((activeCount / totalTargetMembers) * 100)}%</span>
        </div>
        <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-[#39FF14] via-[#7FFF00] to-[#00FFFF]"></div>
      </div>

      {/* Card 3: Empty Slots (Neon Purple / Pink) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A1035]/90 via-[#050A30]/95 to-[#8A2BE2]/20 border-2 border-[#8A2BE2]/60 p-4 sm:p-5 shadow-[0_0_20px_rgba(138,43,226,0.2)] hover:shadow-[0_0_30px_rgba(255,77,255,0.45)] transition-all duration-300 hover:-translate-y-1 group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-bold text-purple-300 tracking-wide">
              খালি স্লট (অবশিষ্ট)
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-[#FF4DFF] mt-1 drop-shadow-[0_0_10px_rgba(255,77,255,0.6)]">
              {formattedEmpty} <span className="text-xs font-medium text-purple-200/80">টি</span>
            </h3>
          </div>
          <div className="p-3 rounded-2xl bg-[#8A2BE2]/20 text-[#FF4DFF] border border-[#FF4DFF]/50 shadow-[0_0_15px_rgba(255,77,255,0.4)] group-hover:scale-110 transition-transform">
            <UserX className="w-6 h-6 sm:w-7 sm:h-7 glow-icon-pink" />
          </div>
        </div>
        <div className="mt-3 text-xs text-purple-200/80 flex items-center gap-1 font-medium">
          <span>খালি থাকা আসন সংখ্যা</span>
        </div>
        <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-[#8A2BE2] via-[#FF4DFF] to-[#6A0DAD]"></div>
      </div>

      {/* Card 4: Total Collected Amount (Golden Yellow / Orange Gradient Glow) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#8A2BE2]/30 via-[#0A1035]/95 to-[#FF8C00]/25 border-2 border-[#FFD700] p-4 sm:p-5 shadow-[0_0_25px_rgba(255,215,0,0.35)] hover:shadow-[0_0_35px_rgba(255,215,0,0.6)] transition-all duration-300 hover:-translate-y-1 group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-bold text-amber-300 tracking-wide">
              মোট সংগৃহীত অর্থ (SAR)
            </p>
            <h3 className="text-2xl sm:text-3xl font-black neon-text-gradient-gold mt-1">
              {formattedSAR} <span className="text-sm font-bold text-[#FFD700]">{currencySymbol}</span>
            </h3>
          </div>
          <div className="p-3 rounded-2xl bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/60 shadow-[0_0_15px_rgba(255,215,0,0.5)] group-hover:scale-110 transition-transform">
            <Coins className="w-6 h-6 sm:w-7 sm:h-7 glow-icon-gold" />
          </div>
        </div>
        <div className="mt-3 text-xs text-amber-200/90 flex items-center gap-1 font-medium">
          <span>সৌদি রিয়াল সমপরিমাণ জমার হিসাব</span>
        </div>
        <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-[#FFD700] via-[#FF8C00] to-[#FF4DFF]"></div>
      </div>

    </div>
  );
};
