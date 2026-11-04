import React, { useState, useMemo } from 'react';
import { BookOpen, CheckCircle, Clock, Plus, ArrowRight, Users, BookmarkCheck } from 'lucide-react';
import { JUZ_LIST, SURAHS, getSurahByNumber } from '../data/quranData';
import { BacaanItem, UstadzProfile } from '../types/setoran';

interface Peta30JuzProps {
  items: BacaanItem[];
  ustadzList: UstadzProfile[];
  selectedUstadzId: string;
  onSelectUstadz: (id: string) => void;
  onOpenInputForJuz: (juzNumber: number) => void;
}

export const Peta30Juz: React.FC<Peta30JuzProps> = ({
  items,
  ustadzList,
  selectedUstadzId,
  onSelectUstadz,
  onOpenInputForJuz
}) => {
  const [selectedJuzNumber, setSelectedJuzNumber] = useState<number>(1);

  // Filter items by selected ustadz
  const relevantItems = useMemo(() => {
    if (selectedUstadzId === 'all') return items;
    return items.filter(it => it.ustadzId === selectedUstadzId);
  }, [items, selectedUstadzId]);

  // Compute status for each of the 30 Juz
  const juzStatuses = useMemo(() => {
    return JUZ_LIST.map((jInfo) => {
      const entriesInJuz = relevantItems.filter(it => it.juz === jInfo.juz);
      const pagesInJuz = entriesInJuz.reduce((sum, it) => sum + (Number(it.totalPages) || 0), 0);
      const totalExpectedPages = jInfo.endPage - jInfo.startPage + 1;
      
      const isCompleted = pagesInJuz >= totalExpectedPages;
      const isInProgress = pagesInJuz > 0 && !isCompleted;

      return {
        ...jInfo,
        entriesCount: entriesInJuz.length,
        pagesRead: pagesInJuz,
        totalExpectedPages,
        percent: Math.min(100, Math.round((pagesInJuz / totalExpectedPages) * 100)),
        status: isCompleted ? 'completed' : isInProgress ? 'progress' : 'untouched',
        entries: entriesInJuz
      };
    });
  }, [relevantItems]);

  const completedCount = juzStatuses.filter(j => j.status === 'completed').length;
  const inProgressCount = juzStatuses.filter(j => j.status === 'progress').length;
  const untouchedCount = 30 - completedCount - inProgressCount;
  const totalPagesRead = relevantItems.reduce((sum, it) => sum + (Number(it.totalPages) || 0), 0);

  const activeJuz = juzStatuses.find(j => j.juz === selectedJuzNumber) || juzStatuses[0];
  const startSurahObj = getSurahByNumber(activeJuz.startSurah);

  const activeUstadzLabel = selectedUstadzId === 'all'
    ? 'Seluruh Asatidz (Kolektif)'
    : (ustadzList.find(u => u.id === selectedUstadzId)?.name || 'Ustadz');

  return (
    <div className="space-y-6">
      {/* Top Banner & Ustadz Filter */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
            <span>Peta Capaian Tilawah 30 Juz</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Peta Bacaan 30 Juz Al-Qur'an
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Melihat persebaran bacaan Al-Qur'an yang telah dibaca dari Juz 1 sampai Juz 30 (Standar Mushaf Madinah 604 Halaman).
          </p>
        </div>

        {/* Ustadz Filter Dropdown */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 self-start md:self-auto">
          <span className="text-xs text-slate-500 font-medium">Ustadz:</span>
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
      </div>

      {/* Progress Overview Strip */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium block">
              Pencapaian Bacaan: <strong className="text-slate-900">{activeUstadzLabel}</strong>
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-tabular">
                {completedCount}
              </span>
              <span className="text-xs text-slate-500">/ 30 Juz Selesai</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-600 font-medium font-tabular">
                {totalPagesRead} dari 604 halaman
              </span>
            </div>
          </div>

          {/* Status Legends */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
              <span className="text-slate-700 font-semibold">{completedCount} Juz Selesai</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="text-slate-700 font-semibold">{inProgressCount} Sedang Dibaca</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
              <span className="text-slate-700 font-semibold">{untouchedCount} Belum Ada Catatan</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-emerald-600 transition-all duration-500"
            style={{ width: `${(completedCount / 30) * 100}%` }}
            title={`${completedCount} Juz Selesai`}
          />
          <div
            className="h-full bg-amber-500 transition-all duration-500"
            style={{ width: `${(inProgressCount / 30) * 100}%` }}
            title={`${inProgressCount} Juz Sedang Dibaca`}
          />
        </div>

        {/* 30 Juz Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 sm:gap-2.5 pt-2">
          {juzStatuses.map((j) => {
            const isSelected = j.juz === selectedJuzNumber;
            return (
              <button
                key={j.juz}
                onClick={() => setSelectedJuzNumber(j.juz)}
                className={`relative p-2 rounded-xl text-center transition-all flex flex-col items-center justify-center min-h-[62px] border ${
                  isSelected
                    ? 'ring-2 ring-emerald-600 ring-offset-2 border-emerald-600 shadow-md scale-105 z-10'
                    : 'border-slate-200 hover:border-slate-300'
                } ${
                  j.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : j.status === 'progress'
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : 'bg-slate-50 text-slate-600'
                }`}
              >
                <span className="text-xs font-bold leading-tight">Juz {j.juz}</span>
                <span className="text-[10px] text-slate-500 font-tabular mt-0.5">
                  {j.pagesRead > 0 ? `${j.pagesRead} hlm` : `${j.totalExpectedPages} hlm`}
                </span>
                {j.status === 'completed' && (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5" />
                )}
                {j.status === 'progress' && (
                  <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1 rounded mt-0.5">
                    {j.percent}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Juz Detail Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900">
                Detail Bacaan Juz {activeJuz.juz}
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                activeJuz.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                activeJuz.status === 'progress' ? `bg-amber-100 text-amber-800` :
                'bg-slate-100 text-slate-600'
              }`}>
                {activeJuz.status === 'completed' ? 'Tuntas Dibaca' :
                 activeJuz.status === 'progress' ? `Sedang Berjalan (${activeJuz.percent}%)` :
                 'Belum Ada Catatan'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Dimulai dari {startSurahObj?.name} ({startSurahObj?.arabic}) ayat {activeJuz.startAyah} · Halaman {activeJuz.startPage} s/d {activeJuz.endPage} ({activeJuz.totalExpectedPages} Halaman)
            </p>
          </div>

          <button
            onClick={() => onOpenInputForJuz(activeJuz.juz)}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ Catat Bacaan di Juz {activeJuz.juz}</span>
          </button>
        </div>

        {/* Entries list in this Juz */}
        <div className="mt-4">
          <h4 className="text-xs font-bold text-slate-800 mb-2">
            Riwayat Bacaan di Juz {activeJuz.juz} ({activeJuz.entries.length} Catatan)
          </h4>

          {activeJuz.entries.length > 0 ? (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {activeJuz.entries.map((entry) => {
                const sStart = getSurahByNumber(entry.surahStart);
                const sEnd = getSurahByNumber(entry.surahEnd);

                return (
                  <div key={entry.id} className="p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50">
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <strong className="text-emerald-900">{entry.ustadzName}</strong>
                        <span>·</span>
                        <span>{sStart?.name} ({entry.ayahStart}) s/d {sEnd?.name} ({entry.ayahEnd})</span>
                        {entry.waktu && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 capitalize">
                            Ba'da {entry.waktu}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Tanggal: {entry.date} · Halaman {entry.pageStart}-{entry.pageEnd} ({entry.totalPages} Halaman)
                      </div>
                      {entry.catatan && (
                        <p className="text-[11px] text-slate-600 italic mt-0.5">"{entry.catatan}"</p>
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                        +{entry.totalPages} hlm
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
              Belum ada catatan bacaan di Juz {activeJuz.juz} untuk filter ini.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
