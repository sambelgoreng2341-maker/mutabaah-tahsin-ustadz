import React, { useState, useEffect } from 'react';
import { X, Check, BookOpen, User, Calendar, Clock, MessageSquareQuote } from 'lucide-react';
import { SURAHS, getSurahByNumber } from '../data/quranData';
import { BacaanItem, WaktuBacaan, UstadzProfile } from '../types/setoran';
import { estimatePages } from '../utils/quranUtils';

interface FormSetoranModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: BacaanItem, newUstadzName?: string) => void;
  initialData?: BacaanItem | null;
  ustadzList: UstadzProfile[];
  defaultUstadzId?: string;
}

export const FormSetoranModal: React.FC<FormSetoranModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  ustadzList,
  defaultUstadzId
}) => {
  const [ustadzId, setUstadzId] = useState<string>('');
  const [customUstadzName, setCustomUstadzName] = useState<string>('');
  const [isNewUstadz, setIsNewUstadz] = useState<boolean>(false);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [waktu, setWaktu] = useState<WaktuBacaan>('shubuh');
  const [surahStart, setSurahStart] = useState<number>(1);
  const [ayahStart, setAyahStart] = useState<number>(1);
  const [surahEnd, setSurahEnd] = useState<number>(1);
  const [ayahEnd, setAyahEnd] = useState<number>(7);
  const [juz, setJuz] = useState<number>(1);
  const [pageStart, setPageStart] = useState<number>(1);
  const [pageEnd, setPageEnd] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [catatan, setCatatan] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setUstadzId(initialData.ustadzId);
      setIsNewUstadz(false);
      setDate(initialData.date);
      setWaktu(initialData.waktu || 'shubuh');
      setSurahStart(initialData.surahStart);
      setAyahStart(initialData.ayahStart);
      setSurahEnd(initialData.surahEnd);
      setAyahEnd(initialData.ayahEnd);
      setJuz(initialData.juz);
      setPageStart(initialData.pageStart);
      setPageEnd(initialData.pageEnd);
      setTotalPages(initialData.totalPages);
      setCatatan(initialData.catatan || '');
    } else {
      setUstadzId(defaultUstadzId || (ustadzList[0]?.id || ''));
      setIsNewUstadz(false);
      setCustomUstadzName('');
      setDate(new Date().toISOString().split('T')[0]);
      setWaktu('shubuh');
      setSurahStart(1);
      setAyahStart(1);
      setSurahEnd(1);
      setAyahEnd(7);
      setCatatan('');
      recalculatePages(1, 1, 1, 7);
    }
  }, [initialData, defaultUstadzId, ustadzList, isOpen]);

  const recalculatePages = (sStart: number, aStart: number, sEnd: number, aEnd: number) => {
    const calc = estimatePages(sStart, aStart, sEnd, aEnd);
    setPageStart(calc.pageStart);
    setPageEnd(calc.pageEnd);
    setTotalPages(calc.totalPages);
    setJuz(calc.juz);
  };

  const handleStartSurahChange = (sNum: number) => {
    setSurahStart(sNum);
    const surah = getSurahByNumber(sNum);
    const maxAyah = surah ? surah.ayahCount : 7;
    setAyahStart(1);

    if (surahEnd < sNum) {
      setSurahEnd(sNum);
      setAyahEnd(Math.min(maxAyah, 20));
      recalculatePages(sNum, 1, sNum, Math.min(maxAyah, 20));
    } else {
      recalculatePages(sNum, 1, surahEnd, ayahEnd);
    }
  };

  const handleEndSurahChange = (sNum: number) => {
    setSurahEnd(sNum);
    const surah = getSurahByNumber(sNum);
    const maxAyah = surah ? surah.ayahCount : 7;
    setAyahEnd(maxAyah);
    recalculatePages(surahStart, ayahStart, sNum, maxAyah);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalUstadzId = ustadzId;
    let finalUstadzName = '';
    let newCreatedName: string | undefined = undefined;

    if (isNewUstadz) {
      if (!customUstadzName.trim()) return;
      finalUstadzId = `ustadz-${Date.now()}`;
      finalUstadzName = customUstadzName.trim().startsWith('Ustadz') || customUstadzName.trim().startsWith('Ustadzah')
        ? customUstadzName.trim()
        : `Ustadz ${customUstadzName.trim()}`;
      newCreatedName = finalUstadzName;
    } else {
      const found = ustadzList.find(s => s.id === ustadzId);
      finalUstadzName = found ? found.name : 'Ustadz';
    }

    const newItem: BacaanItem = {
      id: initialData ? initialData.id : `bacaan-${Date.now()}`,
      ustadzId: finalUstadzId,
      ustadzName: finalUstadzName,
      date,
      waktu,
      surahStart,
      ayahStart,
      surahEnd,
      ayahEnd,
      juz,
      pageStart,
      pageEnd,
      totalPages: Math.max(1, Number(totalPages)),
      catatan: catatan.trim(),
      createdAt: initialData ? initialData.createdAt : new Date().toISOString()
    };

    onSave(newItem, newCreatedName);
    onClose();
  };

  if (!isOpen) return null;

  const currentStartSurah = getSurahByNumber(surahStart);
  const currentEndSurah = getSurahByNumber(surahEnd);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/aistudio/Logo_IQBS_Only_663a98d6.png"
              alt="Logo IQBS"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0"
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.src = '/favicon.png'; }}
            />
            <div>
              <h2 className="text-sm sm:text-base font-bold leading-tight">
                {initialData ? 'Edit Catatan Bacaan' : 'Input Bacaan Al-Qur\'an Ustadz'}
              </h2>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                Pencatatan mutaba'ah tilawah pribadi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Ustadz Selector */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nama Ustadz</span>
              </label>
              <button
                type="button"
                onClick={() => setIsNewUstadz(!isNewUstadz)}
                className="text-[11px] text-emerald-700 font-semibold hover:underline"
              >
                {isNewUstadz ? '← Pilih dari daftar' : '+ Tambah Ustadz Baru'}
              </button>
            </div>

            {isNewUstadz ? (
              <input
                type="text"
                required
                placeholder="Contoh: Ustadz Salman Al-Farisi"
                value={customUstadzName}
                onChange={(e) => setCustomUstadzName(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            ) : (
              <select
                value={ustadzId}
                onChange={(e) => setUstadzId(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                {ustadzList.map((ust) => (
                  <option key={ust.id} value={ust.id}>
                    {ust.name} {ust.role ? `— (${ust.role})` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Tanggal & Waktu Bacaan */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>Tanggal</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>Waktu Tilawah</span>
              </label>
              <select
                value={waktu}
                onChange={(e) => setWaktu(e.target.value as WaktuBacaan)}
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="shubuh">Ba'da Shubuh</option>
                <option value="dzuhur">Ba'da Dzuhur</option>
                <option value="ashar">Ba'da Ashar</option>
                <option value="maghrib">Ba'da Maghrib</option>
                <option value="isya">Ba'da Isya / Malam</option>
                <option value="bebas">Waktu Bebas / Istirahat</option>
              </select>
            </div>
          </div>

          {/* Detail Surah & Ayat */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Rentang Bacaan Al-Qur'an</span>
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Juz {juz}
              </span>
            </div>

            {/* Dari Surah & Ayat */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-8">
                <label className="block text-[11px] text-slate-600 mb-1">Mulai Surah</label>
                <select
                  value={surahStart}
                  onChange={(e) => handleStartSurahChange(Number(e.target.value))}
                  className="w-full h-9 px-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {SURAHS.map((s) => (
                    <option key={s.number} value={s.number}>
                      {s.number}. {s.name} ({s.arabic}) - {s.ayahCount} ayat
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-4">
                <label className="block text-[11px] text-slate-600 mb-1">Ayat Mulai</label>
                <input
                  type="number"
                  min={1}
                  max={currentStartSurah?.ayahCount || 286}
                  value={ayahStart}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setAyahStart(val);
                    recalculatePages(surahStart, val, surahEnd, ayahEnd);
                  }}
                  className="w-full h-9 px-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono text-center focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Sampai Surah & Ayat */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-8">
                <label className="block text-[11px] text-slate-600 mb-1">Sampai Surah</label>
                <select
                  value={surahEnd}
                  onChange={(e) => handleEndSurahChange(Number(e.target.value))}
                  className="w-full h-9 px-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {SURAHS.filter(s => s.number >= surahStart).map((s) => (
                    <option key={s.number} value={s.number}>
                      {s.number}. {s.name} ({s.arabic})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-4">
                <label className="block text-[11px] text-slate-600 mb-1">Ayat Akhir</label>
                <input
                  type="number"
                  min={1}
                  max={currentEndSurah?.ayahCount || 286}
                  value={ayahEnd}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setAyahEnd(val);
                    recalculatePages(surahStart, ayahStart, surahEnd, val);
                  }}
                  className="w-full h-9 px-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono text-center focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Mushaf Page Inputs */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200">
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Halaman Mulai</label>
                <input
                  type="number"
                  min={1}
                  max={604}
                  value={pageStart}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPageStart(val);
                    setTotalPages(Math.max(1, pageEnd - val + 1));
                  }}
                  className="w-full h-8 px-2 text-xs bg-white border border-slate-300 rounded font-mono text-center text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Halaman Akhir</label>
                <input
                  type="number"
                  min={1}
                  max={604}
                  value={pageEnd}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPageEnd(val);
                    setTotalPages(Math.max(1, val - pageStart + 1));
                  }}
                  className="w-full h-8 px-2 text-xs bg-white border border-slate-300 rounded font-mono text-center text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5 font-bold text-slate-900">Total Halaman</label>
                <input
                  type="number"
                  min={1}
                  value={totalPages}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTotalPages(val);
                    setPageEnd(pageStart + val - 1);
                  }}
                  className="w-full h-8 px-2 text-xs bg-emerald-50 border border-emerald-300 rounded font-mono font-bold text-center text-emerald-950"
                />
              </div>
            </div>
          </div>

          {/* Catatan / Tadabbur */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <MessageSquareQuote className="w-3.5 h-3.5 text-slate-500" />
              <span>Catatan / Refleksi Bacaan (Opsional)</span>
            </label>
            <textarea
              rows={2}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: Tilawah rutin ba'da shubuh, tadabbur ayat tentang sabar dan syukur."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 -mx-5 -mb-5 p-3.5 sm:p-4 bg-white/95 backdrop-blur-xs border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Simpan Catatan Bacaan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
