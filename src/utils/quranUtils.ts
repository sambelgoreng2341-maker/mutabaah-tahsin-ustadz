import { SURAHS, JUZ_LIST, getSurahByNumber } from '../data/quranData';
import { BacaanItem, MonthlyRecapStats, MonthlyDayData, UstadzProfile } from '../types/setoran';

export function estimatePages(
  surahStart: number,
  ayahStart: number,
  surahEnd: number,
  ayahEnd: number
): { pageStart: number; pageEnd: number; totalPages: number; juz: number } {
  const sStart = getSurahByNumber(surahStart) || SURAHS[0];
  const sEnd = getSurahByNumber(surahEnd) || sStart;

  const startRatio = (ayahStart - 1) / Math.max(sStart.ayahCount, 1);
  const nextSurahStart = SURAHS.find(s => s.number === sStart.number + 1);
  const sStartPagesSpan = nextSurahStart ? (nextSurahStart.startPage - sStart.startPage) : (604 - sStart.startPage + 1);
  const pageStart = Math.min(604, Math.max(1, Math.round(sStart.startPage + startRatio * Math.max(1, sStartPagesSpan))));

  const endRatio = ayahEnd / Math.max(sEnd.ayahCount, 1);
  const nextSurahEnd = SURAHS.find(s => s.number === sEnd.number + 1);
  const sEndPagesSpan = nextSurahEnd ? (nextSurahEnd.startPage - sEnd.startPage) : (604 - sEnd.startPage + 1);
  const pageEnd = Math.min(604, Math.max(pageStart, Math.round(sEnd.startPage + endRatio * Math.max(1, sEndPagesSpan))));

  const totalPages = Math.max(1, pageEnd - pageStart + 1);
  const matchedJuz = JUZ_LIST.find(j => pageStart >= j.startPage && pageStart <= j.endPage);
  const juz = matchedJuz ? matchedJuz.juz : sStart.startJuz;

  return { pageStart, pageEnd, totalPages, juz };
}

export function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function formatMonthYear(year: number, monthIndex: number): string {
  const date = new Date(year, monthIndex, 1);
  return date.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric'
  });
}

export function calculateMonthlyStats(
  items: BacaanItem[],
  ustadzList: UstadzProfile[],
  year: number,
  monthIndex: number
): MonthlyRecapStats {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const monthStr = String(monthIndex + 1).padStart(2, '0');
  const monthKey = `${year}-${monthStr}`;

  const monthItems = items.filter(item => item.date.startsWith(monthKey));

  const dailyMap: { [day: number]: BacaanItem[] } = {};
  for (let d = 1; d <= daysInMonth; d++) {
    dailyMap[d] = [];
  }

  let totalPages = 0;
  let totalVerses = 0;

  for (const item of monthItems) {
    const day = parseInt(item.date.split('-')[2], 10);
    if (dailyMap[day]) {
      dailyMap[day].push(item);
    }

    const pages = Number(item.totalPages) || 1;
    totalPages += pages;

    if (item.surahStart === item.surahEnd) {
      totalVerses += Math.max(1, item.ayahEnd - item.ayahStart + 1);
    } else {
      totalVerses += 25;
    }
  }

  let activeDays = 0;
  const dailyData: MonthlyDayData[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dayEntries = dailyMap[d] || [];
    const dayPages = dayEntries.reduce((sum, it) => sum + (Number(it.totalPages) || 0), 0);

    if (dayEntries.length > 0) activeDays++;

    dailyData.push({
      day: d,
      dateString: `${year}-${monthStr}-${String(d).padStart(2, '0')}`,
      totalPages: dayPages,
      totalEntries: dayEntries.length,
      entries: dayEntries
    });
  }

  const averagePagesPerActiveDay = activeDays > 0 ? Number((totalPages / activeDays).toFixed(1)) : 0;

  // Recap per individual Ustadz
  const ustadzRecap = ustadzList.map(ust => {
    const uItems = monthItems.filter(it => it.ustadzId === ust.id);
    const uPages = uItems.reduce((sum, it) => sum + (Number(it.totalPages) || 0), 0);
    const sorted = [...uItems].sort((a, b) => b.date.localeCompare(a.date));
    const lastItem = sorted[0];
    const lastSurah = lastItem 
      ? `${getSurahByNumber(lastItem.surahStart)?.name || ''} (${lastItem.ayahStart}-${lastItem.ayahEnd})`
      : '-';

    return {
      ustadzId: ust.id,
      ustadzName: ust.name,
      role: ust.role,
      entriesCount: uItems.length,
      totalPages: uPages,
      lastDate: lastItem ? lastItem.date : '-',
      lastSurah
    };
  });

  return {
    monthKey,
    monthName: formatMonthYear(year, monthIndex),
    year,
    monthIndex,
    totalDays: daysInMonth,
    activeDays,
    totalEntries: monthItems.length,
    totalPages,
    totalVerses,
    averagePagesPerActiveDay,
    dailyData,
    ustadzRecap
  };
}

export function exportBacaanToCSV(items: BacaanItem[], filterLabel: string = 'Semua_Ustadz'): void {
  const headers = [
    'No',
    'Tanggal',
    'Waktu Bacaan',
    'Nama Ustadz',
    'Juz',
    'Surah Mulai',
    'Ayat Mulai',
    'Surah Selesai',
    'Ayat Selesai',
    'Halaman Mulai',
    'Halaman Selesai',
    'Total Halaman',
    'Catatan / Tadabbur'
  ];

  const rows = items.map((item, index) => {
    const sStart = getSurahByNumber(item.surahStart)?.name || `Surah ${item.surahStart}`;
    const sEnd = getSurahByNumber(item.surahEnd)?.name || `Surah ${item.surahEnd}`;
    const waktuLabel = item.waktu ? item.waktu.toUpperCase() : 'BEBAS';

    return [
      index + 1,
      item.date,
      waktuLabel,
      `"${item.ustadzName}"`,
      item.juz,
      `"${sStart}"`,
      item.ayahStart,
      `"${sEnd}"`,
      item.ayahEnd,
      item.pageStart,
      item.pageEnd,
      item.totalPages,
      `"${(item.catatan || '-').replace(/"/g, '""')}"`
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Mutabaah_Bacaan_${filterLabel.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
