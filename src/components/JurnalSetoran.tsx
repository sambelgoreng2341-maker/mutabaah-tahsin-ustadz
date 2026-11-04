import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Users, 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  CheckCircle2,
  Filter,
  ArrowRight
} from 'lucide-react';
import { BacaanItem, UstadzProfile, WaktuBacaan } from '../types/setoran';
import { formatIndonesianDate } from '../utils/quranUtils';
import { getSurahByNumber } from '../data/quranData';

interface JurnalSetoranProps {
  items: BacaanItem[];
  ustadzList: UstadzProfile[];
  onOpenInputModal: () => void;
  onEditItem: (item: BacaanItem) => void;
  onDeleteItem: (id: string) => void;
  onNavigateToRekap: () => void;
  selectedUstadzId: string;
  onSelectUstadz: (id: string) => void;
}

export const JurnalSetoran: React.FC<JurnalSetoranProps> = ({
  items,
  ustadzList,
  onOpenInputModal,
  onEditItem,
  onDeleteItem,
  onNavigateToRekap,
  selectedUstadzId,
  onSelectUstadz
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterWaktu, setFilterWaktu] = useState<string>('all');

  const todayStr = '2026-11-04';
  const todayFormatted = formatIndonesianDate(todayStr);

  const currentMonthPrefix = '2026-11';

  // Filtered by selected ustadz
  const ustadzItems = useMemo(() => {
    if (selectedUstadzId === 'all') return items;
    return items.filter(it => it.ustadzId === selectedUstadzId);
  }, [items, selectedUstadzId]);

  // Current month stats
  const monthItems = useMemo(() => {
    return ustadzItems.filter(it => it.date.startsWith(currentMonthPrefix));
  }, [ustadzItems]);

  const totalMonthPages = useMemo(() => {
    return monthItems.reduce((sum, it) => sum + (Number(it.totalPages) || 0), 0);
  }, [monthItems]);

  const totalActiveUstadz = useMemo(() => {
    return new Set(items.filter(it => it.date.startsWith(currentMonthPrefix)).map(it => it.ustadzId)).size;
  }, [items]);

  // Filtered entries for table/feed
  const filteredItems = useMemo(() => {
    return ustadzItems.filter(item => {
      if (filterWaktu !== 'all' && item.waktu !== filterWaktu) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const uName = item.ustadzName.toLowerCase();
        const sStart = getSurahByNumber(item.surahStart)?.name.toLowerCase() || '';
        const sEnd = getSurahByNumber(item.surahEnd)?.name.toLowerCase() || '';
        const cat = (item.catatan || '').toLowerCase();
        if (!uName.includes(q) && !sStart.includes(q) && !sEnd.includes(q) && !cat.includes(q)) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [ustadzItems, filterWaktu, searchQuery]);

  const activeUstadzObj = ustadzList.find(u => u.id === selectedUstadzId);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 border border-slate-800/80 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Brand & Date Group */}
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            <img
              src="/assets/aistudio/Logo_IQBS_Only_663a98d6.png"
              alt="Logo IQBS"
              className="w-11 h-11 sm:w-14 sm:h-14 object-contain shrink-0 drop-shadow mt-0.5 sm:mt-0"
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.src = '/favicon.png'; }}
            />
            <div className="space-y-1.5 min-w-0">
              {/* Date Badge Pill */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-700/60 text-[11px] sm:text-xs font-semibold text-emerald-300">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{todayFormatted}</span>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Mutaba'ah Asatidz
                </span>
              </div>

              {/* Title */}
              <h2 className="text-base sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Catatan Bacaan Al-Qur'an Ustadz
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-300 hidden sm:block">
                Pencatatan capaian tilawah harian pribadi masing-masing ustadz IQBS.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-1 sm:pt-0 shrink-0">
            <button
              onClick={onOpenInputModal}
              className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Input Bacaan Al-Qur'an</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards (Real statistics, NO TARGETS) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Halaman */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Total Halaman Dibaca</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-tabular">
              {totalMonthPages}
            </span>
            <span className="text-xs text-slate-500">halaman bulan ini</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            {selectedUstadzId === 'all' ? 'Seluruh asatidz' : `Pencapaian ${activeUstadzObj?.name || 'Ustadz'}`}
          </span>
        </div>

        {/* Frekuensi Bacaan */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Frekuensi Tilawah</span>
            <BookOpen className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-tabular">
              {monthItems.length}
            </span>
            <span className="text-xs text-slate-500">kali sesi</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            ≈ {Math.round((totalMonthPages / 20) * 10) / 10} Juz diselesaikan
          </span>
        </div>

        {/* Ustadz yang Aktif */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Ustadz yang Menyetor Bacaan</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-tabular">
              {totalActiveUstadz}
            </span>
            <span className="text-xs text-slate-500">/ {ustadzList.length} asatidz</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Bulan {new Date(2026, 10, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Main Reading Entries Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Riwayat Bacaan Al-Qur'an ({filteredItems.length})
            </h3>
            <button
              onClick={onNavigateToRekap}
              className="md:hidden text-xs font-semibold text-emerald-700 flex items-center gap-1"
            >
              <span>Rekap Grafik</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[170px] flex-1 sm:flex-none">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari surah / ustadz..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Filter Ustadz */}
            <select
              value={selectedUstadzId}
              onChange={(e) => onSelectUstadz(e.target.value)}
              className="h-8 px-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-bold focus:outline-none"
            >
              <option value="all">Semua Ustadz</option>
              {ustadzList.map(ust => (
                <option key={ust.id} value={ust.id}>{ust.name}</option>
              ))}
            </select>

            {/* Filter Waktu */}
            <select
              value={filterWaktu}
              onChange={(e) => setFilterWaktu(e.target.value)}
              className="h-8 px-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 font-medium focus:outline-none"
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

        {/* Entries List */}
        {filteredItems.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredItems.map((item) => {
              const sStart = getSurahByNumber(item.surahStart);
              const sEnd = getSurahByNumber(item.surahEnd);

              return (
                <div
                  key={item.id}
                  className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    {/* Badge Icon */}
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      <BookOpen className="w-4 h-4 stroke-[2.2]" />
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      {/* Line 1: Ustadz name, waktu, tanggal */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {item.ustadzName}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded capitalize">
                          {item.waktu ? `Ba'da ${item.waktu}` : 'Tilawah'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-tabular">
                          {item.date}
                        </span>
                      </div>

                      {/* Line 2: Surah & Ayat */}
                      <div className="text-xs text-slate-700 flex flex-wrap items-center gap-1.5">
                        <span className="font-semibold text-slate-900">
                          {sStart?.name} ({item.ayahStart}) {sStart?.number !== sEnd?.number ? `s/d ${sEnd?.name} (${item.ayahEnd})` : `s/d ayat ${item.ayahEnd}`}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-emerald-800 font-medium">Juz {item.juz}</span>
                        <span className="text-slate-400">·</span>
                        <span className="font-bold text-slate-900">{item.totalPages} Halaman</span>
                        <span className="text-slate-400">({item.pageStart}-{item.pageEnd})</span>
                      </div>

                      {/* Line 3: Catatan / Tadabbur */}
                      {item.catatan && (
                        <p className="text-xs text-slate-600 italic bg-slate-50 p-1.5 rounded border border-slate-200/60 max-w-2xl">
                          "{item.catatan}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      onClick={() => onEditItem(item)}
                      className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded transition-colors"
                      title="Edit Bacaan"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                      title="Hapus Bacaan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">Belum ada catatan bacaan dengan filter ini.</p>
            <p className="text-xs text-slate-400">Klik tombol di bawah untuk mencatat bacaan Al-Qur'an.</p>
            <button
              onClick={onOpenInputModal}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Input Bacaan Al-Qur'an</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
