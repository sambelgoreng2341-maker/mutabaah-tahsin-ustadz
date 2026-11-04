import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Database, 
  RefreshCw, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle,
  Code2,
  FileSpreadsheet,
  Download,
  Upload
} from 'lucide-react';
import { 
  getSavedGasUrl, 
  saveGasUrl, 
  pingGasEndpoint, 
  fetchFromGas, 
  syncAllToGas 
} from '../services/googleSheetsService';
import { BacaanItem, UstadzProfile } from '../types/setoran';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: BacaanItem[];
  ustadzList: UstadzProfile[];
  onDataPulledFromSheets: (bacaan: BacaanItem[], ustadz: UstadzProfile[]) => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  items,
  ustadzList,
  onDataPulledFromSheets
}) => {
  const [activeTab, setActiveTab] = useState<'koneksi' | 'kode' | 'panduan'>('koneksi');
  const [gasUrl, setGasUrl] = useState<string>('');
  const [testingStatus, setTestingStatus] = useState<{ loading: boolean; success?: boolean; message?: string }>({ loading: false });
  const [syncStatus, setSyncStatus] = useState<{ loading: boolean; message?: string }>({ loading: false });
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setGasUrl(getSavedGasUrl());
      setTestingStatus({ loading: false });
      setSyncStatus({ loading: false });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveUrl = () => {
    saveGasUrl(gasUrl);
    handleTestConnection();
  };

  const handleTestConnection = async () => {
    if (!gasUrl.trim()) return;
    setTestingStatus({ loading: true });
    const res = await pingGasEndpoint(gasUrl.trim());
    setTestingStatus({ loading: false, success: res.success, message: res.message });
  };

  const handleUploadToSheets = async () => {
    if (!gasUrl.trim()) {
      alert('Silakan masukkan dan simpan URL Web App Google Apps Script terlebih dahulu.');
      return;
    }
    setSyncStatus({ loading: true, message: 'Mengunggah data ke Google Sheets...' });
    const res = await syncAllToGas(gasUrl.trim(), items, ustadzList);
    setSyncStatus({ loading: false, message: res.message });
  };

  const handlePullFromSheets = async () => {
    if (!gasUrl.trim()) {
      alert('Silakan masukkan dan simpan URL Web App Google Apps Script terlebih dahulu.');
      return;
    }
    setSyncStatus({ loading: true, message: 'Mengambil data dari Google Sheets...' });
    const res = await fetchFromGas(gasUrl.trim());
    setSyncStatus({ loading: false, message: res.message || 'Selesai mengambil data.' });

    if (res.success && res.bacaan && res.ustadz) {
      onDataPulledFromSheets(res.bacaan, res.ustadz);
      alert(`Berhasil mengunduh ${res.bacaan.length} catatan bacaan dan ${res.ustadz.length} ustadz dari Google Sheets!`);
    }
  };

  const gasCodeString = `/**
 * MUTABA'AH TILAWAH IQBS (ASATIDZ) - GOOGLE APPS SCRIPT DATABASE
 * Script backend Google Sheets untuk mencatat & merekap bacaan Al-Qur'an.
 */

var SHEET_BACAAN = "Catatan_Bacaan";
var SHEET_USTADZ = "Daftar_Ustadz";

// 1. FUNGSI SETUP SHEET OTOMATIS
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Tab Catatan Bacaan
  var sheetBacaan = ss.getSheetByName(SHEET_BACAAN) || ss.insertSheet(SHEET_BACAAN);
  sheetBacaan.clear();

  var headersBacaan = [
    "ID", "Tanggal", "Waktu", "ID Ustadz", "Nama Ustadz", "Juz",
    "Surah Mulai", "Ayat Mulai", "Surah Selesai", "Ayat Selesai",
    "Halaman Mulai", "Halaman Selesai", "Total Halaman", "Catatan / Tadabbur", "Waktu Input"
  ];

  sheetBacaan.getRange(1, 1, 1, headersBacaan.length)
    .setValues([headersBacaan])
    .setBackground("#065f46") // Hijau Zamrud IQBS
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");

  sheetBacaan.setFrozenRows(1);

  // Tab Daftar Ustadz
  var sheetUstadz = ss.getSheetByName(SHEET_USTADZ) || ss.insertSheet(SHEET_USTADZ);
  sheetUstadz.clear();

  var headersUstadz = ["ID Ustadz", "Nama Lengkap", "Tugas / Bidang", "Unit / Bagian"];
  sheetUstadz.getRange(1, 1, 1, headersUstadz.length)
    .setValues([headersUstadz])
    .setBackground("#0f172a") // Navy
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");

  sheetUstadz.setFrozenRows(1);
  Logger.log("Setup Berhasil Selesai!");
}

// 2. ENDPOINT GET (Ambil Data)
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "getAll";

  if (action === "ping") {
    return createJsonResponse({ status: "success", message: "Koneksi Google Sheets berhasil aktif!" });
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetBacaan = ss.getSheetByName(SHEET_BACAAN);
    var sheetUstadz = ss.getSheetByName(SHEET_USTADZ);

    if (!sheetBacaan || !sheetUstadz) {
      setupSheet();
      sheetBacaan = ss.getSheetByName(SHEET_BACAAN);
      sheetUstadz = ss.getSheetByName(SHEET_USTADZ);
    }

    var dataBacaan = [];
    var rowsB = sheetBacaan.getDataRange().getValues();
    for (var i = 1; i < rowsB.length; i++) {
      var r = rowsB[i];
      if (r[0]) {
        dataBacaan.push({
          id: String(r[0]),
          date: formatDateString(r[1]),
          waktu: String(r[2] || "bebas"),
          ustadzId: String(r[3] || ""),
          ustadzName: String(r[4] || ""),
          juz: Number(r[5]) || 1,
          surahStart: Number(r[6]) || 1,
          ayahStart: Number(r[7]) || 1,
          surahEnd: Number(r[8]) || 1,
          ayahEnd: Number(r[9]) || 1,
          pageStart: Number(r[10]) || 1,
          pageEnd: Number(r[11]) || 1,
          totalPages: Number(r[12]) || 1,
          catatan: String(r[13] || ""),
          createdAt: String(r[14] || new Date().toISOString())
        });
      }
    }

    var dataUstadz = [];
    var rowsU = sheetUstadz.getDataRange().getValues();
    for (var j = 1; j < rowsU.length; j++) {
      var u = rowsU[j];
      if (u[0]) {
        dataUstadz.push({
          id: String(u[0]),
          name: String(u[1] || ""),
          role: String(u[2] || ""),
          unit: String(u[3] || "")
        });
      }
    }

    return createJsonResponse({
      status: "success",
      bacaan: dataBacaan,
      ustadz: dataUstadz
    });
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

// 3. ENDPOINT POST (Simpan & Sinkron Data)
function doPost(e) {
  try {
    var rawData = e.postData ? e.postData.contents : "{}";
    var payload = JSON.parse(rawData);
    var action = payload.action;

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetBacaan = ss.getSheetByName(SHEET_BACAAN) || ss.insertSheet(SHEET_BACAAN);
    var sheetUstadz = ss.getSheetByName(SHEET_USTADZ) || ss.insertSheet(SHEET_USTADZ);

    if (action === "saveBacaan") {
      var item = payload.item;
      var rows = sheetBacaan.getDataRange().getValues();
      var foundRow = -1;

      for (var i = 1; i < rows.length; i++) {
        if (String(rows[i][0]) === String(item.id)) {
          foundRow = i + 1;
          break;
        }
      }

      var rowValues = [
        item.id, item.date, item.waktu || "bebas", item.ustadzId, item.ustadzName,
        item.juz, item.surahStart, item.ayahStart, item.surahEnd, item.ayahEnd,
        item.pageStart, item.pageEnd, item.totalPages, item.catatan || "",
        item.createdAt || new Date().toISOString()
      ];

      if (foundRow > 0) {
        sheetBacaan.getRange(foundRow, 1, 1, rowValues.length).setValues([rowValues]);
      } else {
        sheetBacaan.appendRow(rowValues);
      }
      return createJsonResponse({ status: "success", message: "Disimpan di Google Sheets!" });
    }

    if (action === "syncAll") {
      if (payload.bacaan && Array.isArray(payload.bacaan)) {
        var hB = sheetBacaan.getRange(1, 1, 1, 15).getValues()[0];
        sheetBacaan.clear();
        sheetBacaan.getRange(1, 1, 1, hB.length).setValues([hB]).setBackground("#065f46").setFontColor("#fff").setFontWeight("bold");
        var rowsToInsert = payload.bacaan.map(function(b) {
          return [
            b.id, b.date, b.waktu || "bebas", b.ustadzId, b.ustadzName, b.juz || 1,
            b.surahStart || 1, b.ayahStart || 1, b.surahEnd || 1, b.ayahEnd || 1,
            b.pageStart || 1, b.pageEnd || 1, b.totalPages || 1, b.catatan || "",
            b.createdAt || new Date().toISOString()
          ];
        });
        if (rowsToInsert.length > 0) {
          sheetBacaan.getRange(2, 1, rowsToInsert.length, rowsToInsert[0].length).setValues(rowsToInsert);
        }
      }

      if (payload.ustadz && Array.isArray(payload.ustadz)) {
        var hU = sheetUstadz.getRange(1, 1, 1, 4).getValues()[0];
        sheetUstadz.clear();
        sheetUstadz.getRange(1, 1, 1, hU.length).setValues([hU]).setBackground("#0f172a").setFontColor("#fff").setFontWeight("bold");
        var uRows = payload.ustadz.map(function(u) {
          return [u.id, u.name, u.role || "", u.unit || ""];
        });
        if (uRows.length > 0) {
          sheetUstadz.getRange(2, 1, uRows.length, uRows[0].length).setValues(uRows);
        }
      }
      return createJsonResponse({ status: "success", message: "Sinkronisasi berhasil!" });
    }

    return createJsonResponse({ status: "error", message: "Aksi tidak dikenali" });
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

function formatDateString(val) {
  if (!val) return "";
  if (val instanceof Date) {
    var y = val.getFullYear();
    var m = ("0" + (val.getMonth() + 1)).slice(-2);
    var d = ("0" + val.getDate()).slice(-2);
    return y + "-" + m + "-" + d;
  }
  return String(val).split("T")[0];
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(gasCodeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Database className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold">
                Integrasi Database Google Sheets (GSS / GAS)
              </h2>
              <p className="text-[11px] text-slate-400">
                Hubungkan catatan bacaan Al-Qur'an langsung ke Google Spreadsheet Anda
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('koneksi')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'koneksi'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Koneksi & Sinkronisasi</span>
          </button>
          <button
            onClick={() => setActiveTab('kode')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'kode'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Kode Apps Script (Code.gs)</span>
          </button>
          <button
            onClick={() => setActiveTab('panduan')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'panduan'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Panduan Setup Sheet</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
          {/* TAB 1: KONEKSI & SYNC */}
          {activeTab === 'koneksi' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-700" />
                  <span>Koneksi Cloud Google Sheets Real-Time</span>
                </p>
                <p className="text-emerald-900/90 leading-relaxed">
                  Dengan memasukkan URL Web App Google Apps Script di bawah ini, data catatan bacaan dan profil ustadz dapat disinkronkan secara aman ke Google Spreadsheet madrasah/pesantren Anda.
                </p>
              </div>

              {/* URL Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  URL Web App Google Apps Script (berakhiran /exec)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    value={gasUrl}
                    onChange={(e) => setGasUrl(e.target.value)}
                    className="flex-1 h-9 px-3 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={handleSaveUrl}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Simpan & Tes
                  </button>
                </div>
              </div>

              {/* Status Message */}
              {testingStatus.loading && (
                <div className="p-2.5 bg-slate-100 rounded-lg text-xs text-slate-600 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  <span>Sedang menguji koneksi ke Google Sheets...</span>
                </div>
              )}

              {!testingStatus.loading && testingStatus.message && (
                <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  testingStatus.success 
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                    : 'bg-rose-100 text-rose-900 border border-rose-300'
                }`}>
                  {testingStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                  )}
                  <span>{testingStatus.message}</span>
                </div>
              )}

              {/* Sync Actions */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">
                  Aksi Sinkronisasi Data
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleUploadToSheets}
                    disabled={syncStatus.loading}
                    className="p-3 bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-xl text-left transition-all group"
                  >
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                      <Upload className="w-4 h-4" />
                      <span>Kirim ke Google Sheets</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Unggah {items.length} catatan bacaan dan {ustadzList.length} ustadz dari aplikasi ke spreadsheet.
                    </p>
                  </button>

                  <button
                    onClick={handlePullFromSheets}
                    disabled={syncStatus.loading}
                    className="p-3 bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-xl text-left transition-all group"
                  >
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                      <Download className="w-4 h-4" />
                      <span>Ambil dari Google Sheets</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Tarik data terbaru dari spreadsheet ke aplikasi web ini.
                    </p>
                  </button>
                </div>

                {syncStatus.loading && (
                  <div className="p-2.5 bg-slate-100 rounded-lg text-xs text-slate-600 flex items-center gap-2 mt-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    <span>{syncStatus.message}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: KODE APPS SCRIPT (CODE.GS) */}
          {activeTab === 'kode' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Kode Google Apps Script (Code.gs)
                </span>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Seluruh Kode</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto max-h-[380px] leading-relaxed">
                  <code>{gasCodeString}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: PANDUAN SETUP SPREADSHEET */}
          {activeTab === 'panduan' && (
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 text-sm">
                Langkah Mudah Setup Google Spreadsheet & Apps Script:
              </h4>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block mb-1">
                    1. Buat Spreadsheet Baru di Google Sheets
                  </strong>
                  Buka browser Anda dan kunjungi{' '}
                  <a
                    href="https://sheets.new"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 font-semibold underline inline-flex items-center gap-0.5"
                  >
                    sheets.new <ExternalLink className="w-3 h-3" />
                  </a>
                  . Beri nama spreadsheet, misalnya: <em>"Database Mutabaah Tilawah IQBS"</em>.
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block mb-1">
                    2. Buka Apps Script
                  </strong>
                  Di menu atas Google Sheets, klik menu <strong>Ekstensi (Extensions)</strong> &gt; <strong>Apps Script</strong>.
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block mb-1">
                    3. Tempel Kode & Jalankan Setup
                  </strong>
                  Hapus kode bawaan di editor, lalu salin dan tempel kode dari tab <strong>"Kode Apps Script"</strong> di atas. Di dropdown fungsi bagian atas, pilih <code>setupSheet</code> lalu klik tombol <strong>Jalankan (Run)</strong>. Berikan izin akses (Authorize) saat diminta. Sheet <em>Catatan_Bacaan</em> dan <em>Daftar_Ustadz</em> akan otomatis dibuat rapi!
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block mb-1">
                    4. Terapkan sebagai Aplikasi Web (Web App)
                  </strong>
                  <ul className="list-disc list-inside space-y-1 mt-1 text-slate-600">
                    <li>Klik tombol biru <strong>Terapkan (Deploy)</strong> di pojok kanan atas &gt; pilih <strong>Penerapan baru (New deployment)</strong>.</li>
                    <li>Pilih jenis roda gigi: <strong>Aplikasi Web (Web App)</strong>.</li>
                    <li>Jalankan sebagai: <strong>Saya (Me)</strong>.</li>
                    <li>Siapa yang memiliki akses: <strong>Siapa saja (Anyone)</strong>.</li>
                    <li>Klik <strong>Terapkan (Deploy)</strong>.</li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block mb-1">
                    5. Salin URL Web App ke Aplikasi Ini
                  </strong>
                  Salin <strong>URL Aplikasi Web</strong> yang berakhiran <code>/exec</code>, buka tab <strong>"Koneksi & Sinkronisasi"</strong> di modal ini, lalu tempelkan dan klik <strong>Simpan & Tes</strong>!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-3 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
