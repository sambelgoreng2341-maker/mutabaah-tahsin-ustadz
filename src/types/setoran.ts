export type WaktuBacaan = 'shubuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya' | 'bebas';

export interface BacaanItem {
  id: string;
  ustadzId: string;
  ustadzName: string;
  date: string; // YYYY-MM-DD
  waktu: WaktuBacaan;
  surahStart: number;
  ayahStart: number;
  surahEnd: number;
  ayahEnd: number;
  juz: number;
  pageStart: number;
  pageEnd: number;
  totalPages: number;
  catatan?: string;
  createdAt: string;
}

export interface UstadzProfile {
  id: string;
  name: string;
  role?: string; // e.g. "Pengajar Tahfidz", "Guru Bahasa Arab", "Pembina Santri"
  unit?: string; // e.g. "SMP IT", "Pondok Pesantren", "Madrasah Aliyah"
}

export interface MonthlyDayData {
  day: number;
  dateString: string;
  totalPages: number;
  totalEntries: number;
  entries: BacaanItem[];
}

export interface MonthlyRecapStats {
  monthKey: string;
  monthName: string;
  year: number;
  monthIndex: number;
  totalDays: number;
  activeDays: number;
  totalEntries: number;
  totalPages: number;
  totalVerses: number;
  averagePagesPerActiveDay: number;
  dailyData: MonthlyDayData[];
  ustadzRecap: {
    ustadzId: string;
    ustadzName: string;
    role?: string;
    entriesCount: number;
    totalPages: number;
    lastDate: string;
    lastSurah: string;
  }[];
}
