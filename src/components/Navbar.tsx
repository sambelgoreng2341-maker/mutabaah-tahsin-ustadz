import React from 'react';
import { Plus } from 'lucide-react';
import { UstadzProfile } from '../types/setoran';

interface NavbarProps {
  activeTab: 'catatan' | 'rekap' | 'peta' | 'daftar';
  setActiveTab: (tab: 'catatan' | 'rekap' | 'peta' | 'daftar') => void;
  onOpenInputModal: () => void;
  onOpenUstadzModal: () => void;
  currentUstadz: UstadzProfile;
  totalUstadz: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenInputModal,
  onOpenUstadzModal,
  currentUstadz,
  totalUstadz
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-emerald-950/60 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-6 h-14 sm:h-16">
          {/* Brand Identity / Wordmark */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="relative">
              <img
                src="/assets/aistudio/Logo_IQBS_Only_663a98d6.png"
                alt="Logo IQBS"
                className="h-8 sm:h-10 w-auto object-contain shrink-0 drop-shadow"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = '/favicon.png';
                }}
              />
            </div>
            
            <a
              href="#catatan"
              onClick={(e) => { e.preventDefault(); setActiveTab('catatan'); }}
              className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-left group"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  Mutaba'ah IQBS
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-emerald-300 bg-emerald-950/90 px-1.5 py-0.5 rounded border border-emerald-700/60">
                  Asatidz
                </span>
              </div>
              <span className="hidden sm:inline text-[11px] text-slate-400 font-medium">
                · Tilawah Al-Qur'an
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => setActiveTab('catatan')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'catatan'
                  ? 'text-emerald-400 font-semibold border-emerald-400'
                  : 'border-transparent text-slate-300'
              }`}
            >
              Catatan Bacaan
            </button>
            <button
              onClick={() => setActiveTab('rekap')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'rekap'
                  ? 'text-emerald-400 font-semibold border-emerald-400'
                  : 'border-transparent text-slate-300'
              }`}
            >
              Rekapitulasi & Grafik
            </button>
            <button
              onClick={() => setActiveTab('peta')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'peta'
                  ? 'text-emerald-400 font-semibold border-emerald-400'
                  : 'border-transparent text-slate-300'
              }`}
            >
              Peta 30 Juz
            </button>
            <button
              onClick={() => setActiveTab('daftar')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'daftar'
                  ? 'text-emerald-400 font-semibold border-emerald-400'
                  : 'border-transparent text-slate-300'
              }`}
            >
              <span>Daftar Ustadz</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-bold">
                {totalUstadz}
              </span>
            </button>
          </nav>

          {/* Right Actions: Active Ustadz Switcher + Primary Button (No Extra Status Indicators) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Active Ustadz Switcher */}
            <button
              onClick={onOpenUstadzModal}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700/80 active:scale-95"
              title="Ganti Ustadz aktif / Kelola Asatidz"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                {currentUstadz.name.replace('Ustadz ', '').replace('Ustadzah ', '').charAt(0)}
              </div>
              <span className="max-w-[95px] sm:max-w-[130px] truncate text-slate-200 font-semibold text-[11px] sm:text-xs">
                {currentUstadz.name}
              </span>
              <span className="text-[10px] text-slate-400">▾</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenInputModal}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 active:scale-95"
            >
              <Plus className="w-3.5 sm:w-4 h-3.5 sm:h-4 stroke-[3]" />
              <span className="hidden xs:inline sm:inline">+ Input Bacaan</span>
              <span className="xs:hidden sm:hidden">Input</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
