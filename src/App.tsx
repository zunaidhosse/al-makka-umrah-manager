import React, { useState, useEffect } from 'react';
import { Member, AppConfig, SavedHistoryRecord } from './types';
import { DEFAULT_APP_CONFIG, generateDefaultMembers, SAMPLE_MEMBERS_DATA } from './data/initialMembers';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { MemberTable } from './components/MemberTable';
import { AdminModal } from './components/AdminModal';
import { SaveDataModal } from './components/SaveDataModal';
import { HistoryModal } from './components/HistoryModal';
import { ExportControls } from './components/ExportControls';
import { ExportReportSheet } from './components/ExportReportSheet';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { Heart, RefreshCw, ShieldCheck } from 'lucide-react';

const LOCAL_STORAGE_MEMBERS_KEY = 'yatri_package_members_v1';
const LOCAL_STORAGE_CONFIG_KEY = 'yatri_package_config_v1';
const LOCAL_STORAGE_HISTORY_KEY = 'yatri_package_history_v1';

export default function App() {
  // Load initial config from LocalStorage or Default
  const [config, setConfig] = useState<AppConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CONFIG_KEY);
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.error("Error reading saved config:", err);
    }
    return DEFAULT_APP_CONFIG;
  });

  // Load initial 50 members from LocalStorage or Generate Default 50 empty members
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_MEMBERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure exact 50 members array length
          if (parsed.length === 50) return parsed;
          // Pad or trim to 50
          const default50 = generateDefaultMembers(50);
          parsed.forEach((m: Member, idx: number) => {
            if (idx < 50) default50[idx] = m;
          });
          return default50;
        }
      }
    } catch (err) {
      console.error("Error reading saved members:", err);
    }
    return generateDefaultMembers(50);
  });

  // Load History Records from LocalStorage
  const [historyRecords, setHistoryRecords] = useState<SavedHistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.error("Error reading saved history:", err);
    }
    return [];
  });

  const [isDark, setIsDark] = useState<boolean>(config.theme === 'dark');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Auto-save Config
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CONFIG_KEY, JSON.stringify(config));
    } catch (err) {
      console.error("Failed to save config:", err);
    }
  }, [config]);

  // Auto-save Members
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_MEMBERS_KEY, JSON.stringify(members));
    } catch (err) {
      console.error("Failed to save members:", err);
    }
  }, [members]);

  // Auto-save History Records
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(historyRecords));
    } catch (err) {
      console.error("Failed to save history:", err);
    }
  }, [historyRecords]);

  // Apply Dark Mode Class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleToggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    setConfig((prev) => ({ ...prev, theme: nextDark ? 'dark' : 'light' }));
  };

  // Calculate Summary metrics
  const activeCount = members.filter((m) => m.name !== '--' && m.name.trim() !== '').length;
  const emptyCount = members.length - activeCount;
  const totalCollectedSAR = members.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);

  // Open modal for editing or finding first empty slot
  const handleOpenAddMember = () => {
    const firstEmpty = members.find((m) => m.name === '--' || !m.name.trim());
    setEditingMember(firstEmpty || members[0]);
    setIsAdminModalOpen(true);
  };

  const handleOpenEditMember = (member: Member) => {
    setEditingMember(member);
    setIsAdminModalOpen(true);
  };

  // Save single member slot
  const handleSaveMember = (updatedMember: Member) => {
    setMembers((prev) =>
      prev.map((m) => (m.serial === updatedMember.serial ? updatedMember : m))
    );
  };

  // Reset single member slot to default ("--", 0 SAR)
  const handleDeleteMember = (id: number) => {
    if (confirm(`ক্রমিক #${id} এর যাত্রীর বিবরণ মুছতে বা রিসেট করতে নিশ্চিত?`)) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === id || m.serial === id
            ? { ...m, name: '--', phone: '', amount: 0, notes: '' }
            : m
        )
      );
    }
  };

  // Bulk reset all 50 members
  const handleResetAllMembers = () => {
    setMembers(generateDefaultMembers(50));
  };

  // Seed sample Islamic members
  const handleSeedSampleMembers = () => {
    const fresh50 = generateDefaultMembers(50);
    SAMPLE_MEMBERS_DATA.forEach((sample, idx) => {
      if (idx < 50) {
        fresh50[idx] = {
          id: idx + 1,
          serial: idx + 1,
          name: sample.name || '--',
          phone: sample.phone || '',
          amount: sample.amount || 0,
          notes: sample.notes || ''
        };
      }
    });
    setMembers(fresh50);
  };

  // Save Current Data to History & Reset Active List
  const handleSaveSuccess = (newRecord: SavedHistoryRecord) => {
    setHistoryRecords((prev) => [newRecord, ...prev]);
    // Clear current passenger list and reset to default empty 50 rows
    setMembers(generateDefaultMembers(50));
    alert("ডাটা সফলভাবে সেভ করা হয়েছে এবং নতুন এন্ট্রির জন্য বর্তমান তালিকা ক্লিয়ার করা হয়েছে!");
  };

  // Restore Record from History
  const handleRestoreRecord = (record: SavedHistoryRecord) => {
    if (record.members && Array.isArray(record.members)) {
      setMembers(record.members);
      if (record.config) setConfig(record.config);
      alert(`'${record.name}' রেকর্ডটি সফলভাবে মূল তালিকায় রিস্টোর করা হয়েছে!`);
    }
  };

  // Delete Record from History
  const handleDeleteRecord = (recordId: string) => {
    setHistoryRecords((prev) => prev.filter((r) => r.id !== recordId));
  };

  return (
    <div className="min-h-screen neon-body-bg text-slate-100 flex flex-col font-sans transition-colors duration-200 relative overflow-hidden">
      
      {/* Background Floating Light Glow Orbs */}
      <div className="glowing-orb-1"></div>
      <div className="glowing-orb-2"></div>
      <div className="glowing-orb-3"></div>

      {/* PWA Bar */}
      <PWAInstallPrompt />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10">
        
        {/* Export Container Identifier Wrapper with Glassmorphism & Neon Border Glow */}
        <div id="exportable-package-dashboard" className="p-3 sm:p-5 rounded-3xl bg-[#0A1035]/80 backdrop-blur-xl border-2 border-[#00BFFF]/40 shadow-[0_0_35px_rgba(0,191,255,0.25)] relative overflow-hidden">
          
          {/* Subtle Top Gradient Line Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00BFFF] via-[#8A2BE2] via-[#FF4DFF] via-[#39FF14] to-[#FFD700]"></div>

          {/* Header Component */}
          <Header
            config={config}
            onOpenSettings={() => {
              setEditingMember(null);
              setIsAdminModalOpen(true);
            }}
            onToggleTheme={handleToggleTheme}
            isDark={isDark}
            onOpenSaveModal={() => setIsSaveModalOpen(true)}
            onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
          />

          {/* Summary Cards Component */}
          <SummaryCards
            totalTargetMembers={config.targetTotalMembers || 50}
            activeCount={activeCount}
            emptyCount={emptyCount}
            totalCollectedSAR={totalCollectedSAR}
            currencySymbol={config.currency}
          />

          {/* Member Table Component (50 Rows) */}
          <MemberTable
            members={members}
            onAddMember={handleOpenAddMember}
            onEditMember={handleOpenEditMember}
            onDeleteMember={handleDeleteMember}
            currencySymbol={config.currency}
            exportFileName={config.title ? config.title.replace(/\s+/g, '_') : 'যাত্রী_প্যাকেজ_তালিকা'}
          />

        </div>

        {/* Footer info */}
        <footer className="no-print mt-8 py-6 text-center text-xs text-cyan-300/70 border-t border-[#00BFFF]/20 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 font-medium text-cyan-300">
            <ShieldCheck className="w-4 h-4 text-[#39FF14] glow-icon-green" />
            <span className="neon-text-gradient-primary font-bold">যাত্রী প্যাকেজ তালিকা • হাজী ও ওমরাহ ম্যানেজমেন্ট সিস্টেম</span>
          </div>
          <p className="text-slate-400">© {new Date().getFullYear()} {config.agencyName} • অফলাইন সাপোর্ট ও স্থানীয় অটো-সেভ সুবিধা যুক্ত</p>
        </footer>

      </div>

      {/* Admin & Member Editor Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        editingMember={editingMember}
        onSaveMember={handleSaveMember}
        config={config}
        onSaveConfig={setConfig}
        onResetAllMembers={handleResetAllMembers}
        onSeedSampleMembers={handleSeedSampleMembers}
        allMembersCount={config.targetTotalMembers || 50}
      />

      {/* Save Data Modal (Password 0000 Protected) */}
      <SaveDataModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        members={members}
        config={config}
        onSaveSuccess={handleSaveSuccess}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        records={historyRecords}
        onDeleteRecord={handleDeleteRecord}
      />

      {/* Offscreen Clean Professional Google-Sheet Export Template */}
      <div
        id="clean-export-sheet-wrapper"
        className="fixed -left-[9999px] top-0 pointer-events-none opacity-100 z-[-100]"
        aria-hidden="true"
      >
        <ExportReportSheet
          members={members}
          config={config}
          totalCollectedSAR={totalCollectedSAR}
        />
      </div>

      {/* PWA Install Prompt & Offline Notification */}
      <PWAInstallPrompt />

    </div>
  );
}

