import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileTabBar } from './components/MobileTabBar';
import { JurnalSetoran } from './components/JurnalSetoran';
import { RekapBulanan } from './components/RekapBulanan';
import { Peta30Juz } from './components/Peta30Juz';
import { FormSetoranModal } from './components/FormSetoranModal';
import { KelolaUstadzModal } from './components/KelolaUstadzModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { ApkInstallBanner } from './components/ApkInstallBanner';
import { INITIAL_USTADZ, INITIAL_BACAAN } from './data/initialData';
import { BacaanItem, UstadzProfile } from './types/setoran';
import { Users, Plus, BookOpen, CheckCircle2, Award, Database } from 'lucide-react';
import { JUZ_LIST } from './data/quranData';
import { 
  getSavedGasUrl, 
  saveSingleBacaanToGas, 
  deleteSingleBacaanFromGas,
  fetchFromGas 
} from './services/googleSheetsService';

export default function App() {
  const [items, setItems] = useState<BacaanItem[]>(() => {
    try {
      const saved = localStorage.getItem('ustadz_tilawah_items');
      return saved ? JSON.parse(saved) : INITIAL_BACAAN;
    } catch {
      return INITIAL_BACAAN;
    }
  });

  const [ustadzList, setUstadzList] = useState<UstadzProfile[]>(() => {
    try {
      const saved = localStorage.getItem('ustadz_profiles_list');
      return saved ? JSON.parse(saved) : INITIAL_USTADZ;
    } catch {
      return INITIAL_USTADZ;
    }
  });

  const [currentUstadzId, setCurrentUstadzId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('ustadz_active_id');
      return saved || INITIAL_USTADZ[0].id;
    } catch {
      return INITIAL_USTADZ[0].id;
    }
  });

  const [selectedFilterUstadzId, setSelectedFilterUstadzId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'catatan' | 'rekap' | 'peta' | 'daftar'>('catatan');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<BacaanItem | null>(null);
  const [isUstadzModalOpen, setIsUstadzModalOpen] = useState<boolean>(false);
  const [isGasModalOpen, setIsGasModalOpen] = useState<boolean>(false);
  const [targetUstadzForInput, setTargetUstadzForInput] = useState<string | undefined>(undefined);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Initial Fetch from Google Sheets endpoint if available
  useEffect(() => {
    let isMounted = true;
    const gasUrl = getSavedGasUrl();
    if (gasUrl) {
      setIsSyncing(true);
      fetchFromGas(gasUrl)
        .then(res => {
          if (isMounted && res.success) {
            if (res.bacaan && res.bacaan.length > 0) {
              setItems(res.bacaan);
            }
            if (res.ustadz && res.ustadz.length > 0) {
              setUstadzList(res.ustadz);
            }
          }
        })
        .catch(err => {
          console.warn('Initial GAS fetch failed:', err);
        })
        .finally(() => {
          if (isMounted) setIsSyncing(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ustadz_tilawah_items', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save items', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem('ustadz_profiles_list', JSON.stringify(ustadzList));
    } catch (e) {
      console.error('Failed to save ustadz list', e);
    }
  }, [ustadzList]);

  useEffect(() => {
    try {
      localStorage.setItem('ustadz_active_id', currentUstadzId);
    } catch (e) {
      console.error('Failed to save active ustadz id', e);
    }
  }, [currentUstadzId]);

  const currentUstadz = ustadzList.find(u => u.id === currentUstadzId) || ustadzList[0] || {
    id: 'default',
    name: 'Ustadz Abdullah',
    role: 'Pengajar Tahfidz'
  };

  const handleSaveBacaan = (newItem: BacaanItem, newUstadzName?: string) => {
    if (newUstadzName) {
      const newU: UstadzProfile = {
        id: newItem.ustadzId,
        name: newUstadzName,
        role: 'Pengajar'
      };
      setUstadzList(prev => [...prev, newU]);
      setCurrentUstadzId(newU.id);
    }

    setItems(prev => {
      const existsIndex = prev.findIndex(it => it.id === newItem.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = newItem;
        return updated;
      }
      return [newItem, ...prev];
    });

    // Auto-sync ke Google Sheets secara otomatis di latar belakang
    const gasUrl = getSavedGasUrl();
    if (gasUrl) {
      setIsSyncing(true);
      saveSingleBacaanToGas(gasUrl, newItem)
        .catch(err => {
          console.warn('Latar belakang auto-sync ke Google Sheets:', err);
        })
        .finally(() => {
          setIsSyncing(false);
        });
    }

    setEditingItem(null);
  };

  const handleDeleteBacaan = (id: string) => {
    if (window.confirm('Hapus catatan bacaan ini?')) {
      setItems(prev => prev.filter(it => it.id !== id));
      const gasUrl = getSavedGasUrl();
      if (gasUrl) {
        setIsSyncing(true);
        deleteSingleBacaanFromGas(gasUrl, id)
          .catch(err => console.warn('Latar belakang delete dari Google Sheets:', err))
          .finally(() => setIsSyncing(false));
      }
    }
  };

  const handleEditBacaan = (item: BacaanItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleInputForUstadz = (ustadzId: string) => {
    setTargetUstadzForInput(ustadzId);
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleOpenInputForJuz = (juzNumber: number) => {
    const jInfo = JUZ_LIST.find(j => j.juz === juzNumber);
    const mockPreFill: BacaanItem = {
      id: `bacaan-${Date.now()}`,
      ustadzId: selectedFilterUstadzId === 'all' ? currentUstadzId : selectedFilterUstadzId,
      ustadzName: (ustadzList.find(u => u.id === (selectedFilterUstadzId === 'all' ? currentUstadzId : selectedFilterUstadzId))?.name) || 'Ustadz',
      date: new Date().toISOString().split('T')[0],
      waktu: 'shubuh',
      surahStart: jInfo ? jInfo.startSurah : 1,
      ayahStart: jInfo ? jInfo.startAyah : 1,
      surahEnd: jInfo ? jInfo.startSurah : 1,
      ayahEnd: 20,
      juz: juzNumber,
      pageStart: jInfo ? jInfo.startPage : 1,
      pageEnd: jInfo ? jInfo.startPage + 1 : 2,
      totalPages: 2,
      catatan: '',
      createdAt: new Date().toISOString()
    };
    setEditingItem(mockPreFill);
    setIsFormOpen(true);
  };

  const handleResetData = () => {
    setItems(INITIAL_BACAAN);
    setUstadzList(INITIAL_USTADZ);
    setCurrentUstadzId(INITIAL_USTADZ[0].id);
    setSelectedFilterUstadzId('all');
    localStorage.removeItem('ustadz_tilawah_items');
    localStorage.removeItem('ustadz_profiles_list');
    localStorage.removeItem('ustadz_active_id');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Banner explaining APK / PWA installability */}
      <ApkInstallBanner />

      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenInputModal={() => {
          setEditingItem(null);
          setTargetUstadzForInput(currentUstadzId);
          setIsFormOpen(true);
        }}
        onOpenUstadzModal={() => setIsUstadzModalOpen(true)}
        currentUstadz={currentUstadz}
        totalUstadz={ustadzList.length}
        isSyncing={isSyncing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12">
        {activeTab === 'catatan' && (
          <JurnalSetoran
            items={items}
            ustadzList={ustadzList}
            onOpenInputModal={() => {
              setEditingItem(null);
              setTargetUstadzForInput(currentUstadzId);
              setIsFormOpen(true);
            }}
            onEditItem={handleEditBacaan}
            onDeleteItem={handleDeleteBacaan}
            onNavigateToRekap={() => setActiveTab('rekap')}
            selectedUstadzId={selectedFilterUstadzId}
            onSelectUstadz={(id) => setSelectedFilterUstadzId(id)}
          />
        )}

        {activeTab === 'rekap' && (
          <RekapBulanan
            items={items}
            ustadzList={ustadzList}
            onEditItem={handleEditBacaan}
            onDeleteItem={handleDeleteBacaan}
            selectedUstadzId={selectedFilterUstadzId}
            onSelectUstadz={(id) => setSelectedFilterUstadzId(id)}
          />
        )}

        {activeTab === 'peta' && (
          <Peta30Juz
            items={items}
            ustadzList={ustadzList}
            selectedUstadzId={selectedFilterUstadzId}
            onSelectUstadz={(id) => setSelectedFilterUstadzId(id)}
            onOpenInputForJuz={handleOpenInputForJuz}
          />
        )}

        {activeTab === 'daftar' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-700" />
                  <span>Daftar Para Ustadz & Capaian Tilawah ({ustadzList.length})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Mencatat dan memantau pencapaian pribadi bacaan Al-Qur'an masing-masing ustadz.
                </p>
              </div>

              <button
                onClick={() => setIsUstadzModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Kelola / Tambah Ustadz</span>
              </button>
            </div>

            {/* Ustadz Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ustadzList.map((ust) => {
                const uItems = items.filter(it => it.ustadzId === ust.id);
                const uPages = uItems.reduce((sum, it) => sum + (Number(it.totalPages) || 0), 0);
                const uLastItem = [...uItems].sort((a, b) => b.date.localeCompare(a.date))[0];
                const isActive = ust.id === currentUstadzId;

                return (
                  <div
                    key={ust.id}
                    className={`bg-white rounded-2xl p-5 border shadow-xs transition-all flex flex-col justify-between ${
                      isActive ? 'border-emerald-600 ring-1 ring-emerald-600/40 shadow-sm' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm">
                          {ust.name.replace('Ustadz ', '').replace('Ustadzah ', '').charAt(0)}
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          {ust.unit || 'Pesantren'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{ust.name}</h4>
                      <p className="text-xs text-slate-400">{ust.role || 'Pengajar'}</p>

                      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Frekuensi Tilawah</span>
                          <strong className="text-slate-800">{uItems.length} Kali Sesi</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Total Dibaca</span>
                          <strong className="text-emerald-700">{uPages} Halaman</strong>
                        </div>
                      </div>

                      {uLastItem && (
                        <div className="mt-3 p-2 bg-slate-50 rounded-lg text-[11px] text-slate-600">
                          <span className="text-slate-400 block">Bacaan Terakhir:</span>
                          <span className="font-semibold text-slate-800">{uLastItem.date}</span> · {uLastItem.totalPages} hlm
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedFilterUstadzId(ust.id);
                          setActiveTab('peta');
                        }}
                        className="w-1/2 py-2 text-center text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                      >
                        Peta Juz
                      </button>
                      <button
                        onClick={() => handleInputForUstadz(ust.id)}
                        className="w-1/2 py-2 text-center text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Input Bacaan</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-slate-800">
            <img
              src="/assets/aistudio/Logo_IQBS_Only_663a98d6.png"
              alt="Logo IQBS"
              className="w-5 h-5 object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.src = '/favicon.png'; }}
            />
            <span>Islamic Qur'anic Boarding School (IQBS) · Mutaba'ah Asatidz</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <span className={`w-2 h-2 rounded-full inline-block ${isSyncing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
            <span>Database Google Sheets Terhubung Otomatis</span>
          </div>
        </div>
      </footer>

      {/* Mobile Tab Bar */}
      <MobileTabBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenInputModal={() => {
          setEditingItem(null);
          setTargetUstadzForInput(currentUstadzId);
          setIsFormOpen(true);
        }}
      />

      {/* Form Input Bacaan Modal */}
      <FormSetoranModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
          setTargetUstadzForInput(undefined);
        }}
        onSave={handleSaveBacaan}
        initialData={editingItem}
        ustadzList={ustadzList}
        defaultUstadzId={targetUstadzForInput || currentUstadzId}
      />

      {/* Kelola Ustadz Modal */}
      <KelolaUstadzModal
        isOpen={isUstadzModalOpen}
        onClose={() => setIsUstadzModalOpen(false)}
        ustadzList={ustadzList}
        currentUstadzId={currentUstadzId}
        onSelectUstadz={(id) => setCurrentUstadzId(id)}
        onAddUstadz={(newU) => setUstadzList(prev => [...prev, newU])}
        onUpdateUstadz={(upU) => setUstadzList(prev => prev.map(u => u.id === upU.id ? upU : u))}
        onDeleteUstadz={(delId) => {
          setUstadzList(prev => prev.filter(u => u.id !== delId));
          if (currentUstadzId === delId && ustadzList.length > 1) {
            const next = ustadzList.find(u => u.id !== delId);
            if (next) setCurrentUstadzId(next.id);
          }
        }}
        onResetData={handleResetData}
      />

      {/* Google Sheets Database Modal */}
      <GoogleSheetsModal
        isOpen={isGasModalOpen}
        onClose={() => setIsGasModalOpen(false)}
        items={items}
        ustadzList={ustadzList}
        onDataPulledFromSheets={(newBacaan, newUstadz) => {
          setItems(newBacaan);
          setUstadzList(newUstadz);
        }}
      />
    </div>
  );
}
