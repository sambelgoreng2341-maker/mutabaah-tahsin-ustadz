import React from 'react';
import { BookOpen, BarChart3, Users, Plus, BookmarkCheck } from 'lucide-react';

interface MobileTabBarProps {
  activeTab: 'catatan' | 'rekap' | 'peta' | 'daftar';
  setActiveTab: (tab: 'catatan' | 'rekap' | 'peta' | 'daftar') => void;
  onOpenInputModal: () => void;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenInputModal
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 shadow-2xl no-print text-slate-400">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1 sm:px-2 pb-safe">
        {/* Tab 1: Catatan Bacaan */}
        <button
          onClick={() => setActiveTab('catatan')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all relative ${
            activeTab === 'catatan' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          {activeTab === 'catatan' && (
            <span className="absolute top-1 w-6 h-0.5 bg-emerald-400 rounded-full" />
          )}
          <BookOpen className={`w-4 h-4 ${activeTab === 'catatan' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight mt-1">Bacaan</span>
        </button>

        {/* Tab 2: Rekap Grafik */}
        <button
          onClick={() => setActiveTab('rekap')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all relative ${
            activeTab === 'rekap' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          {activeTab === 'rekap' && (
            <span className="absolute top-1 w-6 h-0.5 bg-emerald-400 rounded-full" />
          )}
          <BarChart3 className={`w-4 h-4 ${activeTab === 'rekap' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight mt-1">Rekap</span>
        </button>

        {/* Center Floating Action Button: + Input */}
        <div className="flex items-center justify-center">
          <button
            onClick={onOpenInputModal}
            className="w-12 h-12 rounded-full bg-emerald-400 hover:bg-emerald-300 active:scale-90 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/25 -mt-5 transition-all focus:outline-none ring-4 ring-slate-900"
            aria-label="Input Bacaan Baru"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Tab 3: Peta 30 Juz */}
        <button
          onClick={() => setActiveTab('peta')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all relative ${
            activeTab === 'peta' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          {activeTab === 'peta' && (
            <span className="absolute top-1 w-6 h-0.5 bg-emerald-400 rounded-full" />
          )}
          <BookmarkCheck className={`w-4 h-4 ${activeTab === 'peta' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight mt-1">30 Juz</span>
        </button>

        {/* Tab 4: Daftar Ustadz */}
        <button
          onClick={() => setActiveTab('daftar')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all relative ${
            activeTab === 'daftar' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          {activeTab === 'daftar' && (
            <span className="absolute top-1 w-6 h-0.5 bg-emerald-400 rounded-full" />
          )}
          <Users className={`w-4 h-4 ${activeTab === 'daftar' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight mt-1">Ustadz</span>
        </button>
      </div>
    </nav>
  );
};
