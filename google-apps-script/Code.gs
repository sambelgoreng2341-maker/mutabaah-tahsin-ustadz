/**
 * MUTABA'AH TILAWAH IQBS (ASATIDZ) - GOOGLE APPS SCRIPT DATABASE
 * Script ini berfungsi sebagai backend database Google Sheets untuk aplikasi Mutaba'ah Bacaan Al-Qur'an.
 * 
 * PANDUAN PEMASANGAN:
 * 1. Buka spreadsheet baru di Google Sheets (https://sheets.new)
 * 2. Klik menu "Ekstensi" (Extensions) > "Apps Script"
 * 3. Hapus semua kode yang ada di editor, lalu salin dan tempel (paste) seluruh isi file ini
 * 4. Jalankan fungsi "setupSheet" sekali untuk membuat lembar kerja & tabel otomatis:
 *    - Pilih fungsi "setupSheet" di dropdown atas
 *    - Klik tombol "Jalankan" (Run)
 *    - Berikan izin akses (Authorize)
 * 5. Terapkan (Deploy) sebagai Web App:
 *    - Klik tombol biru "Terapkan" (Deploy) > "Penerapan baru" (New deployment)
 *    - Pilih jenis: "Aplikasi Web" (Web app)
 *    - Deskripsi: "Mutaba'ah API v1"
 *    - Jalankan sebagai (Execute as): "Saya" (Me)
 *    - Siapa yang memiliki akses (Who has access): "Siapa saja" (Anyone)
 *    - Klik "Terapkan" (Deploy)
 * 6. Salin "URL Aplikasi Web" (Web App URL) yang berakhiran "/exec" ke aplikasi Mutaba'ah Anda!
 */

// Konfigurasi Nama Sheet
var SHEET_BACAAN = "Catatan_Bacaan";
var SHEET_USTADZ = "Daftar_Ustadz";

/**
 * FUNGSI SETUP OTOMATIS:
 * Jalankan fungsi ini sekali dari editor Apps Script untuk membuat struktur sheet, 
 * warna header elegan, dan data awal otomatis.
 */
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. SETUP SHEET CATATAN BACAAN
  var sheetBacaan = ss.getSheetByName(SHEET_BACAAN);
  if (!sheetBacaan) {
    sheetBacaan = ss.insertSheet(SHEET_BACAAN);
  }
  sheetBacaan.clear();

  var headersBacaan = [
    "ID",
    "Tanggal",
    "Waktu",
    "ID Ustadz",
    "Nama Ustadz",
    "Juz",
    "Surah Mulai",
    "Ayat Mulai",
    "Surah Selesai",
    "Ayat Selesai",
    "Halaman Mulai",
    "Halaman Selesai",
    "Total Halaman",
    "Catatan / Tadabbur",
    "Waktu Input"
  ];

  sheetBacaan.getRange(1, 1, 1, headersBacaan.length)
    .setValues([headersBacaan])
    .setBackground("#065f46") // Hijau Zamrud IQBS
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");

  sheetBacaan.setFrozenRows(1);
  sheetBacaan.setColumnWidth(1, 140); // ID
  sheetBacaan.setColumnWidth(2, 100); // Tanggal
  sheetBacaan.setColumnWidth(3, 90);  // Waktu
  sheetBacaan.setColumnWidth(4, 110); // ID Ustadz
  sheetBacaan.setColumnWidth(5, 180); // Nama Ustadz
  sheetBacaan.setColumnWidth(6, 60);  // Juz
  sheetBacaan.setColumnWidth(7, 100); // Surah Mulai
  sheetBacaan.setColumnWidth(8, 80);  // Ayat Mulai
  sheetBacaan.setColumnWidth(9, 100); // Surah Selesai
  sheetBacaan.setColumnWidth(10, 80); // Ayat Selesai
  sheetBacaan.setColumnWidth(11, 100); // Halaman Mulai
  sheetBacaan.setColumnWidth(12, 100); // Halaman Selesai
  sheetBacaan.setColumnWidth(13, 100); // Total Halaman
  sheetBacaan.setColumnWidth(14, 250); // Catatan
  sheetBacaan.setColumnWidth(15, 160); // Timestamp

  // Sample data Catatan Bacaan
  var sampleBacaan = [
    [
      "bacaan-nov-4-1", "2026-11-04", "shubuh", "ustadz-1", "Ustadz Abdullah",
      2, 2, 142, 2, 176, 22, 26, 5,
      "Ba'da shubuh, tadabbur ayat tentang peralihan kiblat.",
      new Date().toISOString()
    ],
    [
      "bacaan-nov-4-2", "2026-11-04", "ashar", "ustadz-2", "Ustadz Ahmad Fauzan",
      15, 18, 1, 18, 50, 293, 299, 7,
      "Tilawah sore di kantor asatidz.",
      new Date().toISOString()
    ],
    [
      "bacaan-nov-3-1", "2026-11-03", "shubuh", "ustadz-1", "Ustadz Abdullah",
      1, 2, 77, 2, 141, 12, 21, 10,
      "Menuntaskan akhir Juz 1 dengan tartil.",
      new Date().toISOString()
    ]
  ];
  sheetBacaan.getRange(2, 1, sampleBacaan.length, sampleBacaan[0].length).setValues(sampleBacaan);

  // 2. SETUP SHEET DAFTAR USTADZ
  var sheetUstadz = ss.getSheetByName(SHEET_USTADZ);
  if (!sheetUstadz) {
    sheetUstadz = ss.insertSheet(SHEET_USTADZ);
  }
  sheetUstadz.clear();

  var headersUstadz = ["ID Ustadz", "Nama Lengkap", "Tugas / Bidang", "Unit / Bagian"];
  sheetUstadz.getRange(1, 1, 1, headersUstadz.length)
    .setValues([headersUstadz])
    .setBackground("#0f172a") // Slate Navy
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");

  sheetUstadz.setFrozenRows(1);
  sheetUstadz.setColumnWidth(1, 120);
  sheetUstadz.setColumnWidth(2, 220);
  sheetUstadz.setColumnWidth(3, 200);
  sheetUstadz.setColumnWidth(4, 180);

  // Sample data Ustadz
  var sampleUstadz = [
    ["ustadz-1", "Ustadz Abdullah", "Pengajar Tahfidz & Al-Qur'an", "Pondok Pesantren"],
    ["ustadz-2", "Ustadz Ahmad Fauzan", "Guru Bahasa Arab & Fiqih", "Madrasah Aliyah"],
    ["ustadz-3", "Ustadz Muhammad Rayhan", "Pembina Asrama & Tahsin", "Pondok Pesantren"],
    ["ustadz-4", "Ustadz Zaid bin Tsabit", "Pengajar Hadits", "SMP IT"],
    ["ustadz-5", "Ustadz Umar Faruq", "Kepala Bagian Pengasuhan", "Pondok Pesantren"],
    ["ustadz-6", "Ustadzah Fatimah Azzahra", "Pengajar Tahfidz Putri", "Pondok Putri"]
  ];
  sheetUstadz.getRange(2, 1, sampleUstadz.length, sampleUstadz[0].length).setValues(sampleUstadz);

  // Hapus Sheet1 default jika ada
  var sheet1 = ss.getSheetByName("Sheet1") || ss.getSheetByName("Sheet 1");
  if (sheet1 && ss.getSheets().length > 1) {
    try { ss.deleteSheet(sheet1); } catch (e) {}
  }

  Logger.log("Setup Spreadsheet Mutaba'ah Tilawah IQBS Berhasil Selesai!");
}

/**
 * Endpoint GET: Mengambil data bacaan dan ustadz
 */
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

    // Ambil data bacaan
    var dataBacaan = [];
    var rowsBacaan = sheetBacaan.getDataRange().getValues();
    for (var i = 1; i < rowsBacaan.length; i++) {
      var row = rowsBacaan[i];
      if (row[0]) {
        dataBacaan.push({
          id: String(row[0]),
          date: formatDateString(row[1]),
          waktu: String(row[2] || "bebas"),
          ustadzId: String(row[3] || ""),
          ustadzName: String(row[4] || ""),
          juz: Number(row[5]) || 1,
          surahStart: Number(row[6]) || 1,
          ayahStart: Number(row[7]) || 1,
          surahEnd: Number(row[8]) || 1,
          ayahEnd: Number(row[9]) || 1,
          pageStart: Number(row[10]) || 1,
          pageEnd: Number(row[11]) || 1,
          totalPages: Number(row[12]) || 1,
          catatan: String(row[13] || ""),
          createdAt: String(row[14] || new Date().toISOString())
        });
      }
    }

    // Ambil data ustadz
    var dataUstadz = [];
    var rowsUstadz = sheetUstadz.getDataRange().getValues();
    for (var j = 1; j < rowsUstadz.length; j++) {
      var uRow = rowsUstadz[j];
      if (uRow[0]) {
        dataUstadz.push({
          id: String(uRow[0]),
          name: String(uRow[1] || ""),
          role: String(uRow[2] || ""),
          unit: String(uRow[3] || "")
        });
      }
    }

    return createJsonResponse({
      status: "success",
      bacaan: dataBacaan,
      ustadz: dataUstadz,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * Endpoint POST: Menambah, mengubah, atau menyinkronkan data dari web app
 */
function doPost(e) {
  try {
    var rawData = e.postData ? e.postData.contents : "{}";
    var payload = JSON.parse(rawData);
    var action = payload.action;

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetBacaan = ss.getSheetByName(SHEET_BACAAN);
    var sheetUstadz = ss.getSheetByName(SHEET_USTADZ);

    if (!sheetBacaan || !sheetUstadz) {
      setupSheet();
      sheetBacaan = ss.getSheetByName(SHEET_BACAAN);
      sheetUstadz = ss.getSheetByName(SHEET_USTADZ);
    }

    // Aksi 1: Tambah / Update 1 Bacaan
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
        item.id,
        item.date,
        item.waktu || "bebas",
        item.ustadzId,
        item.ustadzName,
        item.juz,
        item.surahStart,
        item.ayahStart,
        item.surahEnd,
        item.ayahEnd,
        item.pageStart,
        item.pageEnd,
        item.totalPages,
        item.catatan || "",
        item.createdAt || new Date().toISOString()
      ];

      if (foundRow > 0) {
        sheetBacaan.getRange(foundRow, 1, 1, rowValues.length).setValues([rowValues]);
      } else {
        sheetBacaan.appendRow(rowValues);
      }

      return createJsonResponse({ status: "success", message: "Catatan bacaan berhasil disimpan!" });
    }

    // Aksi 2: Hapus 1 Bacaan
    if (action === "deleteBacaan") {
      var deleteId = String(payload.id);
      var allRows = sheetBacaan.getDataRange().getValues();
      for (var k = 1; k < allRows.length; k++) {
        if (String(allRows[k][0]) === deleteId) {
          sheetBacaan.deleteRow(k + 1);
          return createJsonResponse({ status: "success", message: "Catatan bacaan berhasil dihapus!" });
        }
      }
      return createJsonResponse({ status: "error", message: "ID tidak ditemukan" });
    }

    // Aksi 3: Sinkronisasi Penuh (Sync All Data)
    if (action === "syncAll") {
      if (payload.bacaan && Array.isArray(payload.bacaan)) {
        // Kosongkan dan tulis ulang data bacaan
        var headersB = sheetBacaan.getRange(1, 1, 1, 15).getValues()[0];
        sheetBacaan.clear();
        sheetBacaan.getRange(1, 1, 1, headersB.length).setValues([headersB])
          .setBackground("#065f46").setFontColor("#ffffff").setFontWeight("bold");

        var rowsToInsert = payload.bacaan.map(function(b) {
          return [
            b.id,
            b.date,
            b.waktu || "bebas",
            b.ustadzId,
            b.ustadzName,
            b.juz || 1,
            b.surahStart || 1,
            b.ayahStart || 1,
            b.surahEnd || 1,
            b.ayahEnd || 1,
            b.pageStart || 1,
            b.pageEnd || 1,
            b.totalPages || 1,
            b.catatan || "",
            b.createdAt || new Date().toISOString()
          ];
        });

        if (rowsToInsert.length > 0) {
          sheetBacaan.getRange(2, 1, rowsToInsert.length, rowsToInsert[0].length).setValues(rowsToInsert);
        }
      }

      if (payload.ustadz && Array.isArray(payload.ustadz)) {
        var headersU = sheetUstadz.getRange(1, 1, 1, 4).getValues()[0];
        sheetUstadz.clear();
        sheetUstadz.getRange(1, 1, 1, headersU.length).setValues([headersU])
          .setBackground("#0f172a").setFontColor("#ffffff").setFontWeight("bold");

        var uRows = payload.ustadz.map(function(u) {
          return [u.id, u.name, u.role || "", u.unit || ""];
        });

        if (uRows.length > 0) {
          sheetUstadz.getRange(2, 1, uRows.length, uRows[0].length).setValues(uRows);
        }
      }

      return createJsonResponse({ status: "success", message: "Sinkronisasi seluruh data berhasil!" });
    }

    return createJsonResponse({ status: "error", message: "Aksi tidak dikenali" });

  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * Helper: Format Tanggal ke YYYY-MM-DD
 */
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

/**
 * Helper: Response JSON dengan CORS
 */
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
