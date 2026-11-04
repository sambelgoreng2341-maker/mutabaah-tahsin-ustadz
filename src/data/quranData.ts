export interface SurahInfo {
  number: number;
  name: string;
  arabic: string;
  ayahCount: number;
  startJuz: number;
  startPage: number;
  revelation: 'Makkiyah' | 'Madaniyah';
}

export interface JuzInfo {
  juz: number;
  startSurah: number;
  startAyah: number;
  startPage: number;
  endPage: number;
}

// Complete 114 Surahs of the Holy Quran
export const SURAHS: SurahInfo[] = [
  { number: 1, name: "Al-Fatihah", arabic: "الفاتحة", ayahCount: 7, startJuz: 1, startPage: 1, revelation: "Makkiyah" },
  { number: 2, name: "Al-Baqarah", arabic: "البقرة", ayahCount: 286, startJuz: 1, startPage: 2, revelation: "Madaniyah" },
  { number: 3, name: "Ali 'Imran", arabic: "آل عمران", ayahCount: 200, startJuz: 3, startPage: 50, revelation: "Madaniyah" },
  { number: 4, name: "An-Nisa'", arabic: "النساء", ayahCount: 176, startJuz: 4, startPage: 77, revelation: "Madaniyah" },
  { number: 5, name: "Al-Ma'idah", arabic: "المائدة", ayahCount: 120, startJuz: 6, startPage: 106, revelation: "Madaniyah" },
  { number: 6, name: "Al-An'am", arabic: "الأنعام", ayahCount: 165, startJuz: 7, startPage: 128, revelation: "Makkiyah" },
  { number: 7, name: "Al-A'raf", arabic: "الأعراف", ayahCount: 206, startJuz: 8, startPage: 151, revelation: "Makkiyah" },
  { number: 8, name: "Al-Anfal", arabic: "الأنفال", ayahCount: 75, startJuz: 9, startPage: 177, revelation: "Madaniyah" },
  { number: 9, name: "At-Taubah", arabic: "التوبة", ayahCount: 129, startJuz: 10, startPage: 187, revelation: "Madaniyah" },
  { number: 10, name: "Yunus", arabic: "يونس", ayahCount: 109, startJuz: 11, startPage: 208, revelation: "Makkiyah" },
  { number: 11, name: "Hud", arabic: "هود", ayahCount: 123, startJuz: 11, startPage: 221, revelation: "Makkiyah" },
  { number: 12, name: "Yusuf", arabic: "يوسف", ayahCount: 111, startJuz: 12, startPage: 235, revelation: "Makkiyah" },
  { number: 13, name: "Ar-Ra'd", arabic: "الرعد", ayahCount: 43, startJuz: 13, startPage: 249, revelation: "Madaniyah" },
  { number: 14, name: "Ibrahim", arabic: "إبراهيم", ayahCount: 52, startJuz: 13, startPage: 255, revelation: "Makkiyah" },
  { number: 15, name: "Al-Hijr", arabic: "الحجر", ayahCount: 99, startJuz: 14, startPage: 262, revelation: "Makkiyah" },
  { number: 16, name: "An-Nahl", arabic: "النحل", ayahCount: 128, startJuz: 14, startPage: 267, revelation: "Makkiyah" },
  { number: 17, name: "Al-Isra'", arabic: "الإسراء", ayahCount: 111, startJuz: 15, startPage: 282, revelation: "Makkiyah" },
  { number: 18, name: "Al-Kahf", arabic: "الكهف", ayahCount: 110, startJuz: 15, startPage: 293, revelation: "Makkiyah" },
  { number: 19, name: "Maryam", arabic: "مريم", ayahCount: 98, startJuz: 16, startPage: 305, revelation: "Makkiyah" },
  { number: 20, name: "Taha", arabic: "طه", ayahCount: 135, startJuz: 16, startPage: 312, revelation: "Makkiyah" },
  { number: 21, name: "Al-Anbiya'", arabic: "الأنبياء", ayahCount: 112, startJuz: 17, startPage: 322, revelation: "Makkiyah" },
  { number: 22, name: "Al-Hajj", arabic: "الحج", ayahCount: 78, startJuz: 17, startPage: 332, revelation: "Madaniyah" },
  { number: 23, name: "Al-Mu'minun", arabic: "المؤمنون", ayahCount: 118, startJuz: 18, startPage: 342, revelation: "Makkiyah" },
  { number: 24, name: "An-Nur", arabic: "النور", ayahCount: 64, startJuz: 18, startPage: 350, revelation: "Madaniyah" },
  { number: 25, name: "Al-Furqan", arabic: "الفرقان", ayahCount: 77, startJuz: 18, startPage: 359, revelation: "Makkiyah" },
  { number: 26, name: "Asy-Syu'ara'", arabic: "الشعراء", ayahCount: 227, startJuz: 19, startPage: 367, revelation: "Makkiyah" },
  { number: 27, name: "An-Naml", arabic: "النمل", ayahCount: 93, startJuz: 19, startPage: 377, revelation: "Makkiyah" },
  { number: 28, name: "Al-Qasas", arabic: "القصص", ayahCount: 88, startJuz: 20, startPage: 385, revelation: "Makkiyah" },
  { number: 29, name: "Al-'Ankabut", arabic: "العنكبوت", ayahCount: 69, startJuz: 20, startPage: 396, revelation: "Makkiyah" },
  { number: 30, name: "Ar-Rum", arabic: "الروم", ayahCount: 60, startJuz: 21, startPage: 404, revelation: "Makkiyah" },
  { number: 31, name: "Luqman", arabic: "لقمان", ayahCount: 34, startJuz: 21, startPage: 411, revelation: "Makkiyah" },
  { number: 32, name: "As-Sajdah", arabic: "السجدة", ayahCount: 30, startJuz: 21, startPage: 415, revelation: "Makkiyah" },
  { number: 33, name: "Al-Ahzab", arabic: "الأحزاب", ayahCount: 73, startJuz: 21, startPage: 418, revelation: "Madaniyah" },
  { number: 34, name: "Saba'", arabic: "سبإ", ayahCount: 54, startJuz: 22, startPage: 428, revelation: "Makkiyah" },
  { number: 35, name: "Fatir", arabic: "فاطر", ayahCount: 45, startJuz: 22, startPage: 434, revelation: "Makkiyah" },
  { number: 36, name: "Yasin", arabic: "يس", ayahCount: 83, startJuz: 22, startPage: 440, revelation: "Makkiyah" },
  { number: 37, name: "As-Saffat", arabic: "الصافات", ayahCount: 182, startJuz: 23, startPage: 446, revelation: "Makkiyah" },
  { number: 38, name: "Sad", arabic: "ص", ayahCount: 88, startJuz: 23, startPage: 453, revelation: "Makkiyah" },
  { number: 39, name: "Az-Zumar", arabic: "الزمر", ayahCount: 75, startJuz: 23, startPage: 458, revelation: "Makkiyah" },
  { number: 40, name: "Ghafir", arabic: "غافر", ayahCount: 85, startJuz: 24, startPage: 467, revelation: "Makkiyah" },
  { number: 41, name: "Fussilat", arabic: "فصلت", ayahCount: 54, startJuz: 24, startPage: 477, revelation: "Makkiyah" },
  { number: 42, name: "Asy-Syura", arabic: "الشورى", ayahCount: 53, startJuz: 25, startPage: 483, revelation: "Makkiyah" },
  { number: 43, name: "Az-Zukhruf", arabic: "الزخرف", ayahCount: 89, startJuz: 25, startPage: 489, revelation: "Makkiyah" },
  { number: 44, name: "Ad-Dukhan", arabic: "الدخان", ayahCount: 59, startJuz: 25, startPage: 496, revelation: "Makkiyah" },
  { number: 45, name: "Al-Jasiyah", arabic: "الجاثية", ayahCount: 37, startJuz: 25, startPage: 499, revelation: "Makkiyah" },
  { number: 46, name: "Al-Ahqaf", arabic: "الأحقاف", ayahCount: 35, startJuz: 26, startPage: 502, revelation: "Makkiyah" },
  { number: 47, name: "Muhammad", arabic: "محمد", ayahCount: 38, startJuz: 26, startPage: 507, revelation: "Madaniyah" },
  { number: 48, name: "Al-Fath", arabic: "الفتح", ayahCount: 29, startJuz: 26, startPage: 511, revelation: "Madaniyah" },
  { number: 49, name: "Al-Hujurat", arabic: "الحجرات", ayahCount: 18, startJuz: 26, startPage: 515, revelation: "Madaniyah" },
  { number: 50, name: "Qaf", arabic: "ق", ayahCount: 45, startJuz: 26, startPage: 518, revelation: "Makkiyah" },
  { number: 51, name: "Az-Zariyat", arabic: "الذاريات", ayahCount: 60, startJuz: 26, startPage: 520, revelation: "Makkiyah" },
  { number: 52, name: "At-Tur", arabic: "الطور", ayahCount: 49, startJuz: 27, startPage: 523, revelation: "Makkiyah" },
  { number: 53, name: "An-Najm", arabic: "النجم", ayahCount: 62, startJuz: 27, startPage: 526, revelation: "Makkiyah" },
  { number: 54, name: "Al-Qamar", arabic: "القمر", ayahCount: 55, startJuz: 27, startPage: 528, revelation: "Makkiyah" },
  { number: 55, name: "Ar-Rahman", arabic: "الرحمن", ayahCount: 78, startJuz: 27, startPage: 531, revelation: "Madaniyah" },
  { number: 56, name: "Al-Waqi'ah", arabic: "الواقعة", ayahCount: 96, startJuz: 27, startPage: 534, revelation: "Makkiyah" },
  { number: 57, name: "Al-Hadid", arabic: "الحديد", ayahCount: 29, startJuz: 27, startPage: 537, revelation: "Madaniyah" },
  { number: 58, name: "Al-Mujadilah", arabic: "المجادلة", ayahCount: 22, startJuz: 28, startPage: 542, revelation: "Madaniyah" },
  { number: 59, name: "Al-Hasyr", arabic: "الحشر", ayahCount: 24, startJuz: 28, startPage: 545, revelation: "Madaniyah" },
  { number: 60, name: "Al-Mumtahanah", arabic: "الممتحنة", ayahCount: 13, startJuz: 28, startPage: 549, revelation: "Madaniyah" },
  { number: 61, name: "As-Saff", arabic: "الصف", ayahCount: 14, startJuz: 28, startPage: 551, revelation: "Madaniyah" },
  { number: 62, name: "Al-Jumu'ah", arabic: "الجمعة", ayahCount: 11, startJuz: 28, startPage: 553, revelation: "Madaniyah" },
  { number: 63, name: "Al-Munafiqun", arabic: "المنافقون", ayahCount: 11, startJuz: 28, startPage: 554, revelation: "Madaniyah" },
  { number: 64, name: "At-Tagabun", arabic: "التغابن", ayahCount: 18, startJuz: 28, startPage: 556, revelation: "Madaniyah" },
  { number: 65, name: "At-Talaq", arabic: "الطلاق", ayahCount: 12, startJuz: 28, startPage: 558, revelation: "Madaniyah" },
  { number: 66, name: "At-Tahrim", arabic: "التحريم", ayahCount: 12, startJuz: 28, startPage: 560, revelation: "Madaniyah" },
  { number: 67, name: "Al-Mulk", arabic: "الملك", ayahCount: 30, startJuz: 29, startPage: 562, revelation: "Makkiyah" },
  { number: 68, name: "Al-Qalam", arabic: "القلم", ayahCount: 52, startJuz: 29, startPage: 564, revelation: "Makkiyah" },
  { number: 69, name: "Al-Haqqah", arabic: "الحاقة", ayahCount: 52, startJuz: 29, startPage: 566, revelation: "Makkiyah" },
  { number: 70, name: "Al-Ma'arij", arabic: "المعارج", ayahCount: 44, startJuz: 29, startPage: 568, revelation: "Makkiyah" },
  { number: 71, name: "Nuh", arabic: "نوح", ayahCount: 28, startJuz: 29, startPage: 570, revelation: "Makkiyah" },
  { number: 72, name: "Al-Jinn", arabic: "الجن", ayahCount: 28, startJuz: 29, startPage: 572, revelation: "Makkiyah" },
  { number: 73, name: "Al-Muzzammil", arabic: "المزمل", ayahCount: 20, startJuz: 29, startPage: 574, revelation: "Makkiyah" },
  { number: 74, name: "Al-Muddassir", arabic: "المدثر", ayahCount: 56, startJuz: 29, startPage: 575, revelation: "Makkiyah" },
  { number: 75, name: "Al-Qiyamah", arabic: "القيامة", ayahCount: 40, startJuz: 29, startPage: 577, revelation: "Makkiyah" },
  { number: 76, name: "Al-Insan", arabic: "الإنسان", ayahCount: 31, startJuz: 29, startPage: 578, revelation: "Madaniyah" },
  { number: 77, name: "Al-Mursalat", arabic: "المرسلات", ayahCount: 50, startJuz: 29, startPage: 580, revelation: "Makkiyah" },
  { number: 78, name: "An-Naba'", arabic: "النبإ", ayahCount: 40, startJuz: 30, startPage: 582, revelation: "Makkiyah" },
  { number: 79, name: "An-Nazi'at", arabic: "النازعات", ayahCount: 46, startJuz: 30, startPage: 583, revelation: "Makkiyah" },
  { number: 80, name: "'Abasa", arabic: "عبس", ayahCount: 42, startJuz: 30, startPage: 585, revelation: "Makkiyah" },
  { number: 81, name: "At-Takwir", arabic: "التكوير", ayahCount: 29, startJuz: 30, startPage: 586, revelation: "Makkiyah" },
  { number: 82, name: "Al-Infitar", arabic: "الانفطار", ayahCount: 19, startJuz: 30, startPage: 587, revelation: "Makkiyah" },
  { number: 83, name: "Al-Mutaffifin", arabic: "المطففين", ayahCount: 36, startJuz: 30, startPage: 587, revelation: "Makkiyah" },
  { number: 84, name: "Al-Insyiqaq", arabic: "الانشقاق", ayahCount: 25, startJuz: 30, startPage: 589, revelation: "Makkiyah" },
  { number: 85, name: "Al-Buruj", arabic: "البروج", ayahCount: 22, startJuz: 30, startPage: 590, revelation: "Makkiyah" },
  { number: 86, name: "At-Tariq", arabic: "الطارق", ayahCount: 17, startJuz: 30, startPage: 591, revelation: "Makkiyah" },
  { number: 87, name: "Al-A'la", arabic: "الأعلى", ayahCount: 19, startJuz: 30, startPage: 591, revelation: "Makkiyah" },
  { number: 88, name: "Al-Ghasyiyah", arabic: "الغاشية", ayahCount: 26, startJuz: 30, startPage: 592, revelation: "Makkiyah" },
  { number: 89, name: "Al-Fajr", arabic: "الفجر", ayahCount: 30, startJuz: 30, startPage: 593, revelation: "Makkiyah" },
  { number: 90, name: "Al-Balad", arabic: "البلد", ayahCount: 20, startJuz: 30, startPage: 594, revelation: "Makkiyah" },
  { number: 91, name: "Asy-Syams", arabic: "الشمس", ayahCount: 15, startJuz: 30, startPage: 595, revelation: "Makkiyah" },
  { number: 92, name: "Al-Lail", arabic: "الليل", ayahCount: 21, startJuz: 30, startPage: 595, revelation: "Makkiyah" },
  { number: 93, name: "Ad-Duha", arabic: "الضحى", ayahCount: 11, startJuz: 30, startPage: 596, revelation: "Makkiyah" },
  { number: 94, name: "Asy-Syarh", arabic: "الشرح", ayahCount: 8, startJuz: 30, startPage: 596, revelation: "Makkiyah" },
  { number: 95, name: "At-Tin", arabic: "التين", ayahCount: 8, startJuz: 30, startPage: 597, revelation: "Makkiyah" },
  { number: 96, name: "Al-'Alaq", arabic: "العلق", ayahCount: 19, startJuz: 30, startPage: 597, revelation: "Makkiyah" },
  { number: 97, name: "Al-Qadr", arabic: "القدر", ayahCount: 5, startJuz: 30, startPage: 598, revelation: "Makkiyah" },
  { number: 98, name: "Al-Bayyinah", arabic: "البينة", ayahCount: 8, startJuz: 30, startPage: 598, revelation: "Madaniyah" },
  { number: 99, name: "Az-Zalzalah", arabic: "الزلزلة", ayahCount: 8, startJuz: 30, startPage: 599, revelation: "Madaniyah" },
  { number: 100, name: "Al-'Adiyat", arabic: "العاديات", ayahCount: 11, startJuz: 30, startPage: 599, revelation: "Makkiyah" },
  { number: 101, name: "Al-Qari'ah", arabic: "القارعة", ayahCount: 11, startJuz: 30, startPage: 600, revelation: "Makkiyah" },
  { number: 102, name: "At-Takasur", arabic: "التكاثر", ayahCount: 8, startJuz: 30, startPage: 600, revelation: "Makkiyah" },
  { number: 103, name: "Al-'Asr", arabic: "العصر", ayahCount: 3, startJuz: 30, startPage: 601, revelation: "Makkiyah" },
  { number: 104, name: "Al-Humazah", arabic: "الهمزة", ayahCount: 9, startJuz: 30, startPage: 601, revelation: "Makkiyah" },
  { number: 105, name: "Al-Fil", arabic: "الفيل", ayahCount: 5, startJuz: 30, startPage: 601, revelation: "Makkiyah" },
  { number: 106, name: "Quraisy", arabic: "قريش", ayahCount: 4, startJuz: 30, startPage: 602, revelation: "Makkiyah" },
  { number: 107, name: "Al-Ma'un", arabic: "الماعون", ayahCount: 7, startJuz: 30, startPage: 602, revelation: "Makkiyah" },
  { number: 108, name: "Al-Kausar", arabic: "الكوثر", ayahCount: 3, startJuz: 30, startPage: 602, revelation: "Makkiyah" },
  { number: 109, name: "Al-Kafirun", arabic: "الكافرون", ayahCount: 6, startJuz: 30, startPage: 603, revelation: "Makkiyah" },
  { number: 110, name: "An-Nasr", arabic: "النصر", ayahCount: 3, startJuz: 30, startPage: 603, revelation: "Madaniyah" },
  { number: 111, name: "Al-Lahab", arabic: "اللهب", ayahCount: 5, startJuz: 30, startPage: 603, revelation: "Makkiyah" },
  { number: 112, name: "Al-Ikhlas", arabic: "الإخلاص", ayahCount: 4, startJuz: 30, startPage: 604, revelation: "Makkiyah" },
  { number: 113, name: "Al-Falaq", arabic: "الفلق", ayahCount: 5, startJuz: 30, startPage: 604, revelation: "Makkiyah" },
  { number: 114, name: "An-Nas", arabic: "الناس", ayahCount: 6, startJuz: 30, startPage: 604, revelation: "Makkiyah" }
];

// 30 Juz boundaries in Medina standard Mushaf
export const JUZ_LIST: JuzInfo[] = [
  { juz: 1, startSurah: 1, startAyah: 1, startPage: 1, endPage: 21 },
  { juz: 2, startSurah: 2, startAyah: 142, startPage: 22, endPage: 41 },
  { juz: 3, startSurah: 2, startAyah: 253, startPage: 42, endPage: 61 },
  { juz: 4, startSurah: 3, startAyah: 93, startPage: 62, endPage: 81 },
  { juz: 5, startSurah: 4, startAyah: 24, startPage: 82, endPage: 101 },
  { juz: 6, startSurah: 4, startAyah: 148, startPage: 102, endPage: 121 },
  { juz: 7, startSurah: 5, startAyah: 82, startPage: 122, endPage: 141 },
  { juz: 8, startSurah: 6, startAyah: 111, startPage: 142, endPage: 161 },
  { juz: 9, startSurah: 7, startAyah: 88, startPage: 162, endPage: 181 },
  { juz: 10, startSurah: 8, startAyah: 41, startPage: 182, endPage: 201 },
  { juz: 11, startSurah: 9, startAyah: 93, startPage: 202, endPage: 221 },
  { juz: 12, startSurah: 11, startAyah: 6, startPage: 222, endPage: 241 },
  { juz: 13, startSurah: 12, startAyah: 53, startPage: 242, endPage: 261 },
  { juz: 14, startSurah: 15, startAyah: 1, startPage: 262, endPage: 281 },
  { juz: 15, startSurah: 17, startAyah: 1, startPage: 282, endPage: 301 },
  { juz: 16, startSurah: 18, startAyah: 75, startPage: 302, endPage: 321 },
  { juz: 17, startSurah: 21, startAyah: 1, startPage: 322, endPage: 341 },
  { juz: 18, startSurah: 23, startAyah: 1, startPage: 342, endPage: 361 },
  { juz: 19, startSurah: 25, startAyah: 21, startPage: 362, endPage: 381 },
  { juz: 20, startSurah: 27, startAyah: 56, startPage: 382, endPage: 401 },
  { juz: 21, startSurah: 29, startAyah: 46, startPage: 402, endPage: 421 },
  { juz: 22, startSurah: 33, startAyah: 31, startPage: 422, endPage: 441 },
  { juz: 23, startSurah: 36, startAyah: 28, startPage: 442, endPage: 461 },
  { juz: 24, startSurah: 39, startAyah: 32, startPage: 462, endPage: 481 },
  { juz: 25, startSurah: 41, startAyah: 47, startPage: 482, endPage: 501 },
  { juz: 26, startSurah: 46, startAyah: 1, startPage: 502, endPage: 521 },
  { juz: 27, startSurah: 51, startAyah: 31, startPage: 522, endPage: 541 },
  { juz: 28, startSurah: 58, startAyah: 1, startPage: 542, endPage: 561 },
  { juz: 29, startSurah: 67, startAyah: 1, startPage: 562, endPage: 581 },
  { juz: 30, startSurah: 78, startAyah: 1, startPage: 582, endPage: 604 }
];

export function getSurahByNumber(num: number): SurahInfo | undefined {
  return SURAHS.find(s => s.number === num);
}

export function getJuzForPage(page: number): number {
  const juz = JUZ_LIST.find(j => page >= j.startPage && page <= j.endPage);
  return juz ? juz.juz : 1;
}
