import { BacaanItem, UstadzProfile } from '../types/setoran';

const GAS_URL_KEY = 'mutabaah_iqbs_gas_url';
export const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbzteMjX__eMMOfD9bV66HblzXscuRzO5YcElIdZs-CNhgVbB4i6DeZcUNWPihofV_1UQQ/exec';

export function getSavedGasUrl(): string {
  try {
    const saved = localStorage.getItem(GAS_URL_KEY);
    if (saved && saved.trim().length > 0) return saved.trim();
    // Default to the provided production GAS endpoint
    localStorage.setItem(GAS_URL_KEY, DEFAULT_GAS_URL);
    return DEFAULT_GAS_URL;
  } catch {
    return DEFAULT_GAS_URL;
  }
}

export function saveGasUrl(url: string): void {
  try {
    localStorage.setItem(GAS_URL_KEY, url.trim() || DEFAULT_GAS_URL);
  } catch (e) {
    console.error('Failed to save GAS url', e);
  }
}

export async function pingGasEndpoint(url: string = DEFAULT_GAS_URL): Promise<{ success: boolean; message: string }> {
  if (!url || !url.startsWith('http')) {
    return { success: false, message: 'URL tidak valid. Masukkan URL Web App Google Apps Script.' };
  }

  try {
    const targetUrl = url.includes('?') ? `${url}&action=ping` : `${url}?action=ping`;
    const res = await fetch(targetUrl, { method: 'GET', mode: 'cors' });
    const data = await res.json();
    if (data.status === 'success') {
      return { success: true, message: data.message || 'Koneksi ke Google Sheets berhasil!' };
    }
    return { success: false, message: data.message || 'Gagal tersambung ke Google Sheets.' };
  } catch (err: any) {
    return { success: false, message: 'Gagal terhubung: ' + err.message };
  }
}

export async function fetchFromGas(url: string = DEFAULT_GAS_URL): Promise<{
  success: boolean;
  bacaan?: BacaanItem[];
  ustadz?: UstadzProfile[];
  message?: string;
}> {
  try {
    const targetUrl = url.includes('?') ? `${url}&action=getAll` : `${url}?action=getAll`;
    const res = await fetch(targetUrl, { method: 'GET', mode: 'cors' });
    const data = await res.json();
    if (data.status === 'success') {
      return {
        success: true,
        bacaan: data.bacaan || [],
        ustadz: data.ustadz || []
      };
    }
    return { success: false, message: data.message || 'Gagal mengambil data dari Google Sheets.' };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function syncAllToGas(
  url: string = DEFAULT_GAS_URL,
  bacaan: BacaanItem[],
  ustadz: UstadzProfile[]
): Promise<{ success: boolean; message: string }> {
  try {
    const payload = {
      action: 'syncAll',
      bacaan,
      ustadz
    };

    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8' // GAS accepts text/plain to avoid preflight issues
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.status === 'success') {
      return { success: true, message: data.message || 'Berhasil menyinkronkan data ke Google Sheets!' };
    }
    return { success: false, message: data.message || 'Gagal menyinkronkan data.' };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function saveSingleBacaanToGas(url: string = DEFAULT_GAS_URL, item: BacaanItem): Promise<boolean> {
  if (!url) return false;
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'saveBacaan', item })
    });
    return true;
  } catch (err) {
    console.warn('Background sync to Google Sheets failed:', err);
    return false;
  }
}

export async function deleteSingleBacaanFromGas(url: string = DEFAULT_GAS_URL, id: string): Promise<boolean> {
  if (!url) return false;
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'deleteBacaan', id })
    });
    return true;
  } catch (err) {
    console.warn('Background delete from Google Sheets failed:', err);
    return false;
  }
}
