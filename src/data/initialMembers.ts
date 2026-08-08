import { Member, AppConfig } from '../types';

export const DEFAULT_APP_CONFIG: AppConfig = {
  title: "যাত্রী প্যাকেজ তালিকা",
  subTitle: "পবিত্র হজ ও ওমরাহ কাফেলা যাত্রীদের হিসাব ও তালিকা",
  agencyName: "আল-মক্কা আল-মদিনা ট্রাভেলস অ্যান্ড ট্যুরস",
  agencyPhone: "+966 50 000 0000",
  currency: "SAR",
  targetTotalMembers: 50,
  bismillah: true,
  theme: 'light'
};

export const generateDefaultMembers = (count = 50): Member[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    serial: i + 1,
    name: "--",
    phone: "",
    amount: 0,
    notes: ""
  }));
};

export const SAMPLE_MEMBERS_DATA: Partial<Member>[] = [
  { serial: 1, name: "মুহাম্মদ আব্দুর রহমান", phone: "+966501234567", amount: 15000, notes: "সম্পূর্ণ পরিশোধিত" },
  { serial: 2, name: "আলহাজ্ব মোঃ ইব্রাহিম হোসেন", phone: "+966509876543", amount: 12500, notes: "বকেয়া ২৫০০" },
  { serial: 3, name: "মোসাম্মাৎ খাদিজা বেগম", phone: "+966503334444", amount: 15000, notes: "ভিসা প্রসেসিং সম্পন্ন" },
  { serial: 4, name: "মাওলানা ওসমান গনি", phone: "+966505556667", amount: 10000, notes: "অগ্রিম পরিশোধ" },
  { serial: 5, name: "মোঃ ইউসুফ আলী", phone: "+966507778889", amount: 15000, notes: "সম্পূর্ণ পরিশোধিত" }
];
