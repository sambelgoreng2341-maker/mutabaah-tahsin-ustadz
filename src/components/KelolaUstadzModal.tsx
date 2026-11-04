import React, { useState } from 'react';
import { X, UserPlus, Trash2, Edit2, RotateCcw, Users } from 'lucide-react';
import { UstadzProfile } from '../types/setoran';

interface KelolaUstadzModalProps {
  isOpen: boolean;
  onClose: () => void;
  ustadzList: UstadzProfile[];
  currentUstadzId: string;
  onSelectUstadz: (id: string) => void;
  onAddUstadz: (newUstadz: UstadzProfile) => void;
  onUpdateUstadz: (updatedUstadz: UstadzProfile) => void;
  onDeleteUstadz: (id: string) => void;
  onResetData: () => void;
}

export const KelolaUstadzModal: React.FC<KelolaUstadzModalProps> = ({
  isOpen,
  onClose,
  ustadzList,
  currentUstadzId,
  onSelectUstadz,
  onAddUstadz,
  onUpdateUstadz,
  onDeleteUstadz,
  onResetData
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Pengajar Tahfidz & Al-Qur\'an');
  const [unit, setUnit] = useState('Pondok Pesantren');

  if (!isOpen) return null;

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setName('');
    setRole('Pengajar Tahfidz');
    setUnit('Pondok Pesantren');
  };

  const handleStartEdit = (ustadz: UstadzProfile) => {
    setEditingId(ustadz.id);
    setIsAdding(false);
    setName(ustadz.name);
    setRole(ustadz.role || '');
    setUnit(ustadz.unit || '');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formattedName = name.trim().startsWith('Ustadz') || name.trim().startsWith('Ustadzah')
      ? name.trim()
      : `Ustadz ${name.trim()}`;

    if (editingId) {
      const existing = ustadzList.find(u => u.id === editingId);
      if (existing) {
        onUpdateUstadz({
          ...existing,
          name: formattedName,
          role: role.trim(),
          unit: unit.trim()
        });
      }
      setEditingId(null);
    } else {
      const newU: UstadzProfile = {
        id: `ustadz-${Date.now()}`,
        name: formattedName,
        role: role.trim() || 'Pengajar',
        unit: unit.trim() || 'Pesantren'
      };
      onAddUstadz(newU);
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold">Daftar Asatidz (Para Ustadz)</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Add or Edit Form */}
          {(isAdding || editingId) ? (
            <form onSubmit={handleSave} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  {editingId ? 'Edit Data Ustadz' : 'Tambah Ustadz Baru'}
                </span>
                <button
                  type="button"
                  onClick={() => { setIsAdding(false); setEditingId(null); }}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Batal
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Nama Lengkap Ustadz / Ustadzah</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Ustadz Salman Al-Farisi"
                  className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Tugas / Bidang</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Pengajar Tahfidz"
                    className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Unit / Bagian</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="Pondok Pesantren"
                    className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-xs"
                >
                  Simpan Ustadz
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={handleStartAdd}
              className="w-full py-2.5 px-3 border border-dashed border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Tambah Ustadz / Pengajar Baru</span>
            </button>
          )}

          {/* List of Ustadz */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Daftar Ustadz ({ustadzList.length})
            </label>
            <div className="space-y-1.5">
              {ustadzList.map((ust) => {
                const isActive = ust.id === currentUstadzId;
                return (
                  <div
                    key={ust.id}
                    onClick={() => onSelectUstadz(ust.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isActive 
                        ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        isActive ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {ust.name.replace('Ustadz ', '').replace('Ustadzah ', '').charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{ust.name}</span>
                          {isActive && (
                            <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100 px-1.5 rounded">
                              Aktif
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {ust.role || 'Pengajar'} {ust.unit ? `· ${ust.unit}` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleStartEdit(ust)}
                        className="p-1.5 text-slate-400 hover:text-emerald-700 rounded transition-colors"
                        title="Edit Ustadz"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {ustadzList.length > 1 && (
                        <button
                          onClick={() => onDeleteUstadz(ust.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Hapus Ustadz"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reset Demo Data Button */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Kembalikan ke data contoh</span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Muat ulang data contoh asatidz?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data Contoh</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
