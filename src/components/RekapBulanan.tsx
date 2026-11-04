import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  Search, 
  FileSpreadsheet, 
  BarChart2, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Edit3, 
  Trash2,
  Calendar,
  Clock
} from 'lucide-react';
import { BacaanItem, UstadzProfile, MonthlyRecapStats } from '../types/setoran';
import { calculateMonthlyStats, formatIndonesianDate, exportBacaanToCSV } from '../utils/quranUtils';
import { getSurahByNumber } from '../data/quranData';

interface RekapBulananProps {
  items: BacaanItem[];
  ustadzList: UstadzProfile[];
  onEditItem: (item: BacaanItem) => void;
  onDeleteItem: (id: string) => void;
  selectedUstadzId: string;
  onSelectUstadz: (id: string) => void;
}

export const RekapBulanan: React.FC<RekapBulananProps> = ({
  items,
  ustadzList,
  onEditItem,
  onDeleteItem,
  selectedUstadzId,
  onSelectUstadz
}) => {
  // Current active date context: November 2026 (year: 2026, monthIndex: 10)
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(10);
  const [filterWaktu, setFilterWaktu] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Filter items for selected Ustadz
  const relevantItems = useMemo(() => {
    if (selectedUstadzId === 'all') return items;
    return items.filter(it => it.ustadzId === selectedUstadzId);
  }, [items, selectedUstadzId]);

  // Compute monthly stats
  const monthlyStats: MonthlyRecapStats = useMemo(() => {
    return calculateMonthlyStats(relevantItems, ustadzList, selectedYear, selectedMonth);
  }, [relevantItems, ustadzList, selectedYear, selectedMonth]);

  // Waktu bacaan distribution
  const waktuDistribution = useMemo(() => {
    const monthKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
    const mItems = relevantItems.filter(it => it.date.startsWith(monthKey));
    const dist: Record<string, number> = {
      shubuh: 0,
      dzuhur: 0,
      ashar: 0,
      maghrib: 0,
      isya: 0,
      bebas: 0
    };
    mItems.forEach(it => {
      const w = it.waktu || 'bebas';
      dist[w] = (dist[w] || 0) + (Number(it.totalPages) || 1);
    });
    return dist;
  }, [relevantItems, selectedYear, selectedMonth]);

  // Filtered table rows
  const filteredTableItems = useMemo(() => {
    const monthKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
    return relevantItems.filter(item => {
      if (!item.date.startsWith(monthKey)) return false;
      if (filterWaktu !== 'all' && item.waktu !== filterWaktu) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const ustadzName = item.ustadzName.toLowerCase();
        const surahStart = getSurahByNumber(item.surahStart)?.name.toLowerCase() || '';
        const surahEnd = getSurahByNumber(item.surahEnd)?.name.toLowerCase() || '';
        const notes = (item.catatan || '').toLowerCase();
        if (!ustadzName.includes(query) && !surahStart.includes(query) && !surahEnd.includes(query) && !notes.includes(query)) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [relevantItems, selectedYear, selectedMonth, filterWaktu, searchQuery]);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
    setHoveredDay(null);
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
    setHoveredDay(null);
  };

  // Max pages in a single day for SVG scaling (no target line)
  const maxDailyPages = useMemo(() => {
    const highest = Math.max(...monthlyStats.dailyData.map(d => d.totalPages), 8);
    return Math.ceil(highest / 2) * 2;
  }, [monthlyStats]);

  const activeUstadzLabel = selectedUstadzId === 'all'
    ? 'Seluruh Asatidz'
    : (ustadzList.find(u => u.id === selectedUstadzId)?.name || 'Ustadz');

  return (
    <div className="space-y-6">
      {/* Month Selector & Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Left: Month Navigator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
            <button
              onClick={handlePrevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-slate-700 hover:text-emerald-700 transition-colors"
              title="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <div className="px-3 py-1 text-center min-w-[150px]">
              <span className="text-sm font-bold text-slate-900 block leading-tight">
                {monthlyStats.monthName}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {monthlyStats.totalEntries} Catatan Bacaan
              </span>
            </div>
            <button
              onClick={handleNextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-slate-700 hover:text-emerald-700 transition-colors"
              title="Bulan Berikutnya"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedYear(2026);
              setSelectedMonth(10);
            }}
            className="hidden sm:inline-flex px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
          >
            Bulan Ini
          </button>
        </div>

        {/* Right: Ustadz Selector & Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Ustadz Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <span className="text-xs text-slate-500 font-medium">Pencapaian:</span>
            <select
              value={selectedUstadzId}
              onChange={(e) => onSelectUstadz(e.target.value)}
              className="text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
            >
              <option value="all">Semua Ustadz (Kolektif)</option>
              {ustadzList.map((ust) => (
                <option key={ust.id} value={ust.id}>{ust.name}</option>
              ))}
            </select>
          </div>

          {/* Export CSV */}
          <button
            onClick={() => exportBacaanToCSV(filteredTableItems, activeUstadzLabel)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            title="Download CSV untuk Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Ekspor CSV</span>
          </button>

          {/* Print PDF */}
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            title="Cetak Laporan Rekapitulasi"
          >
            <Printer className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden sm:inline">Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards (Real Reading Data, NO TARGETS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Total Halaman Dibaca</span>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-tabular">
              {monthlyStats.totalPages}
            </span>
            <span className="text-xs text-slate-500">halaman</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            ≈ {Math.round((monthlyStats.totalPages / 20) * 10) / 10} Juz ({monthlyStats.totalVerses} ayat)
          </span>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Frekuensi Tilawah</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-tabular">
              {monthlyStats.totalEntries}
            </span>
            <span className="text-xs text-slate-500">kali sesi</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Di {monthlyStats.activeDays} hari berbeda
          </span>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Rata-rata / Hari Aktif</span>
            <Calendar className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-tabular">
              {monthlyStats.averagePagesPerActiveDay}
            </span>
            <span className="text-xs text-slate-500">hlm / hari</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Konsistensi tilawah bulanan
          </span>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Filter Tampilan</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-sm font-bold text-slate-900 truncate mt-1">
            {activeUstadzLabel}
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            {selectedUstadzId === 'all' ? `${ustadzList.length} asatidz tercatat` : 'Pencapaian pribadi'}
          </span>
        </div>
      </div>

      {/* Main Graph: Daily Reading Volume Bar Chart (NO TARGET LINE!) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-700" />
              <span>Grafik Harian Bacaan Al-Qur'an — {monthlyStats.monthName}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Menampilkan volume halaman Al-Qur'an yang dibaca setiap tanggal ({activeUstadzLabel}).
            </p>
          </div>

          <div className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" />
            <span>Volume Halaman Tilawah</span>
          </div>
        </div>

        {/* SVG Daily Chart */}
        <div className="relative w-full overflow-x-auto pb-2">
          <div className="min-w-[620px]">
            <svg
              viewBox={`0 0 ${monthlyStats.totalDays * 22 + 60} 220`}
              className="w-full h-56 select-none"
            >
              {/* Horizontal Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const yVal = 180 - ratio * 150;
                const pageLabel = Math.round(ratio * maxDailyPages);
                return (
                  <g key={idx}>
                    <line
                      x1="45"
                      y1={yVal}
                      x2={monthlyStats.totalDays * 22 + 45}
                      y2={yVal}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                    <text
                      x="35"
                      y={yVal + 3}
                      textAnchor="end"
                      fontSize="9"
                      fill="#94a3b8"
                      className="font-tabular font-medium"
                    >
                      {pageLabel} hlm
                    </text>
                  </g>
                );
              })}

              {/* Bars */}
              {monthlyStats.dailyData.map((d, index) => {
                const x = 50 + index * 22;
                const barHeight = (d.totalPages / maxDailyPages) * 150;
                const isHovered = hoveredDay === d.day;
                const hasData = d.totalPages > 0;

                return (
                  <g
                    key={d.day}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredDay(d.day)}
                    onClick={() => setHoveredDay(d.day)}
                  >
                    {/* Hover Column Background */}
                    <rect
                      x={x - 3}
                      y="15"
                      width="18"
                      height="180"
                      fill={isHovered ? 'rgba(5, 150, 105, 0.1)' : 'transparent'}
                      rx="4"
                    />

                    {/* Bar */}
                    {hasData ? (
                      <rect
                        x={x}
                        y={180 - barHeight}
                        width="12"
                        height={barHeight}
                        fill={isHovered ? '#047857' : '#059669'}
                        rx="3"
                      />
                    ) : (
                      <circle cx={x + 6} cy="178" r="1.5" fill="#cbd5e1" />
                    )}

                    {/* X-axis Day Label */}
                    <text
                      x={x + 6}
                      y="198"
                      textAnchor="middle"
                      fontSize="9"
                      fill={isHovered ? '#047857' : hasData ? '#1e293b' : '#94a3b8'}
                      fontWeight={isHovered || hasData ? '700' : '400'}
                      className="font-tabular"
                    >
                      {d.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Hover / Tap Details Box */}
        {hoveredDay !== null && (
          <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-150">
            {(() => {
              const dayData = monthlyStats.dailyData.find(d => d.day === hoveredDay);
              if (!dayData) return null;

              return (
                <>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">
                      {formatIndonesianDate(dayData.dateString)}
                    </div>
                    <div className="text-slate-600">
                      Total Bacaan: <strong className="text-emerald-800">{dayData.totalPages} Halaman</strong> ({dayData.totalEntries} sesi)
                    </div>
                  </div>

                  {dayData.entries.length > 0 ? (
                    <div className="text-[11px] text-slate-600 max-w-md sm:text-right space-y-0.5">
                      {dayData.entries.map((e, idx) => {
                        const sStart = getSurahByNumber(e.surahStart)?.name;
                        return (
                          <div key={idx} className="truncate">
                            <strong className="text-slate-800">{e.ustadzName}</strong>: {sStart} ({e.ayahStart}-{e.ayahEnd}) · {e.totalPages} hlm
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">Tidak ada catatan bacaan pada tanggal ini.</span>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Distribution by Reading Time */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-emerald-700" />
          <span>Sebaran Waktu Tilawah ({monthlyStats.monthName})</span>
        </h4>
        <p className="text-xs text-slate-500 mb-4">
          Waktu yang paling sering digunakan untuk membaca Al-Qur'an.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { key: 'shubuh', label: 'Ba\'da Shubuh', pages: waktuDistribution.shubuh || 0 },
            { key: 'dzuhur', label: 'Ba\'da Dzuhur', pages: waktuDistribution.dzuhur || 0 },
            { key: 'ashar', label: 'Ba\'da Ashar', pages: waktuDistribution.ashar || 0 },
            { key: 'maghrib', label: 'Ba\'da Maghrib', pages: waktuDistribution.maghrib || 0 },
            { key: 'isya', label: 'Ba\'da Isya', pages: waktuDistribution.isya || 0 },
            { key: 'bebas', label: 'Waktu Bebas', pages: waktuDistribution.bebas || 0 }
          ].map((item) => (
            <div key={item.key} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[11px] text-slate-500 block font-medium">{item.label}</span>
              <strong className="text-lg text-slate-900 font-tabular block mt-1">
                {item.pages}
              </strong>
              <span className="text-[10px] text-slate-400">halaman</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table: Pencapaian Pribadi Masing-masing Ustadz */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Rekapitulasi Pencapaian Pribadi Masing-Masing Ustadz — {monthlyStats.monthName}</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencapaian jumlah halaman bacaan Al-Qur'an yang telah diselesaikan oleh setiap ustadz.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Ustadz</th>
                <th className="py-3 px-3">Tugas / Unit</th>
                <th className="py-3 px-3 text-center">Frekuensi Tilawah</th>
                <th className="py-3 px-3 text-center">Total Halaman</th>
                <th className="py-3 px-4">Bacaan Terakhir</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monthlyStats.ustadzRecap.map((ust) => (
                <tr key={ust.ustadzId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {ust.ustadzName}
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {ust.role || '-'}
                  </td>
                  <td className="py-3 px-3 text-center font-tabular text-slate-800">
                    <span className="font-bold">{ust.entriesCount}</span> kali sesi
                  </td>
                  <td className="py-3 px-3 text-center font-tabular text-slate-900 whitespace-nowrap">
                    <span className="font-extrabold text-emerald-700 text-sm">{ust.totalPages}</span> Halaman
                    <span className="text-[10px] text-slate-400 block">
                      (≈ {Math.round((ust.totalPages / 20) * 10) / 10} Juz)
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <div>{ust.lastSurah}</div>
                    <span className="text-[10px] text-slate-400 font-tabular">{ust.lastDate}</span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectUstadz(ust.ustadzId)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors"
                    >
                      Buka Catatan Pribadi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Daftar Riwayat Catatan Bacaan ({filteredTableItems.length})
            </h4>
            <span className="text-xs text-slate-500">
              Periode {monthlyStats.monthName} · Filter: {activeUstadzLabel}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[170px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari surah / catatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <select
              value={filterWaktu}
              onChange={(e) => setFilterWaktu(e.target.value)}
              className="h-8 px-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="all">Semua Waktu</option>
              <option value="shubuh">Ba'da Shubuh</option>
              <option value="dzuhur">Ba'da Dzuhur</option>
              <option value="ashar">Ba'da Ashar</option>
              <option value="maghrib">Ba'da Maghrib</option>
              <option value="isya">Ba'da Isya</option>
              <option value="bebas">Waktu Bebas</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-3">Ustadz</th>
                <th className="py-3 px-3">Waktu</th>
                <th className="py-3 px-4">Surah & Ayat</th>
                <th className="py-3 px-3 text-center">Juz</th>
                <th className="py-3 px-3 text-center">Halaman</th>
                <th className="py-3 px-4">Catatan / Tadabbur</th>
                <th className="py-3 px-3 text-right no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTableItems.length > 0 ? (
                filteredTableItems.map((item) => {
                  const sStart = getSurahByNumber(item.surahStart);
                  const sEnd = getSurahByNumber(item.surahEnd);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-tabular font-medium text-slate-900 whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                        {item.ustadzName}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded capitalize">
                          {item.waktu ? `Ba'da ${item.waktu}` : 'Tilawah'}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">
                          {sStart?.name} ({item.ayahStart}) {sStart?.number !== sEnd?.number ? `s/d ${sEnd?.name} (${item.ayahEnd})` : `s/d ayat ${item.ayahEnd}`}
                        </div>
                        <div className="text-[10px] text-slate-400 font-arabic">
                          {sStart?.arabic}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-tabular text-slate-800">
                        {item.juz}
                      </td>
                      <td className="py-3 px-3 text-center font-tabular text-slate-800 whitespace-nowrap">
                        <strong className="text-slate-900 font-extrabold">{item.totalPages}</strong> hlm
                        <span className="text-[10px] text-slate-400 block font-normal">
                          ({item.pageStart}-{item.pageEnd})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={item.catatan}>
                        {item.catatan || '-'}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap no-print">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditItem(item)}
                            className="p-1 text-slate-400 hover:text-emerald-700 rounded transition-colors"
                            title="Edit Catatan"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                            title="Hapus Catatan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Tidak ada catatan bacaan dengan filter terpilih di bulan ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Report View (Visible only during printing) */}
      <div className="hidden print:block print-only mt-8 pt-4">
        <div className="flex items-center justify-center gap-4 border-b-2 border-slate-900 pb-4 mb-6">
          <img
            src="/assets/aistudio/Logo_IQBS_Only_663a98d6.png"
            alt="Logo IQBS"
            className="w-16 h-16 object-contain"
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.src = '/favicon.png'; }}
          />
          <div className="text-center">
            <h1 className="text-base font-extrabold uppercase tracking-widest text-slate-900">
              ISLAMIC QUR'ANIC BOARDING SCHOOL (IQBS)
            </h1>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Laporan Rekapitulasi Mutaba'ah Bacaan Al-Qur'an Asatidz
            </h2>
            <p className="text-xs text-slate-600">
              Periode: Bulan {monthlyStats.monthName} · Filter: {activeUstadzLabel}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 border border-slate-300 rounded mb-6 text-center text-xs">
          <div>
            <span className="block text-slate-500">Total Halaman Dibaca</span>
            <strong className="text-base">{monthlyStats.totalPages} Halaman</strong>
          </div>
          <div>
            <span className="block text-slate-500">Total Frekuensi Tilawah</span>
            <strong className="text-base">{monthlyStats.totalEntries} Sesi</strong>
          </div>
          <div>
            <span className="block text-slate-500">Rata-rata Harian</span>
            <strong className="text-base">{monthlyStats.averagePagesPerActiveDay} Hlm / Hari</strong>
          </div>
        </div>

        <div className="flex justify-between items-center mt-12 px-8 text-xs text-center">
          <div>
            <p className="mb-14">Mengetahui, Pimpinan Yayasan / Pondok</p>
            <p className="border-t border-slate-400 pt-1 font-semibold">( ............................................ )</p>
          </div>
          <div>
            <p className="mb-14">Koordinator Mutaba'ah Tilawah</p>
            <p className="border-t border-slate-400 pt-1 font-semibold">( Ustadz Abdullah )</p>
          </div>
        </div>
      </div>
    </div>
  );
};
