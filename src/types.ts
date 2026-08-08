export interface Member {
  id: number; // 1 to 50
  serial: number; // 1 to 50
  name: string; // default "--"
  phone: string; // e.g. "+966512345678" or "0512345678"
  amount: number; // SAR amount (default 0)
  notes?: string;
  updatedAt?: string;
}

export interface AppConfig {
  title: string;
  subTitle: string;
  agencyName: string;
  agencyPhone: string;
  currency: string; // default "SAR"
  targetTotalMembers: number; // default 50
  bismillah: boolean;
  theme: 'light' | 'dark';
}

export type ExportFormat = 'png' | 'jpg' | 'pdf';

export interface SavedHistoryRecord {
  id: string;
  name: string;
  savedAt: string; // e.g. "০৭ আগস্ট ২০২৬, ০৪:১৫ PM"
  savedDate: string; // e.g. "০৭ আগস্ট ২০২৬"
  savedTime: string; // e.g. "০৪:১৫ PM"
  members: Member[];
  config: AppConfig;
  totalPassengers: number;
  totalCollectedSAR: number;
}
