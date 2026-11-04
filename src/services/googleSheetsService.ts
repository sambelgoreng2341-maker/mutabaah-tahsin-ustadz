import { BacaanItem, UstadzProfile } from '../types/setoran';

const GAS_URL_KEY = 'mutabaah_iqbs_gas_url';
const SYNC_QUEUE_KEY = 'mutabaah_offline_sync_queue';
export const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbzteMjX__eMMOfD9bV66HblzXscuRzO5YcElIdZs-CNhgVbB4i6DeZcUNWPihofV_1UQQ/exec';

export interface QueuedAction {
  id: string;
  type: 'saveBacaan' | 'deleteBacaan';
  item?: BacaanItem;
  targetId?: string;
  timestamp: number;
}

export function getSavedGasUrl(): string {
  try {
    const saved = localStorage.getItem(GAS_URL_KEY);
    if (saved && saved.trim().length > 0) return saved.trim();
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

// ---------------------------------------------------------------------------
// OFFLINE QUEUE: Simpan di perangkat (localStorage) sebelum kirim ke Sheets
// ---------------------------------------------------------------------------
export function getSyncQueue(): QueuedAction[] {
  try {
    const raw = localStorage.getItem(SYNC_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSyncQueue(queue: QueuedAction[]): void {
  try {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to save sync queue', e);
  }
}

export function enqueueSyncAction(action: Omit<QueuedAction, 'id' | 'timestamp'>): void {
  const current = getSyncQueue();
  const newAction: QueuedAction = {
    ...action,
    id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now()
  };
  current.push(newAction);
  saveSyncQueue(current);
}

let isProcessingQueue = false;

/**
 * Memproses antrean yang tersimpan di memori perangkat secara diam-diam di background.
 * Jika internet lag/putus, antrean tetap aman di perangkat dan akan dicoba lagi nanti.
 */
export async function flushSyncQueue(url: string = DEFAULT_GAS_URL): Promise<void> {
  if (isProcessingQueue) return;
  if (!navigator.onLine) return; // Tunggu koneksi aktif

  const queue = getSyncQueue();
  if (queue.length === 0) return;

  isProcessingQueue = true;

  try {
    const remainingQueue: QueuedAction[] = [];

    for (const item of queue) {
      let success = false;

      if (item.type === 'saveBacaan' && item.item) {
        success = await rawSendToGas(url, { action: 'saveBacaan', item: item.item });
      } else if (item.type === 'deleteBacaan' && item.targetId) {
        success = await rawSendToGas(url, { action: 'deleteBacaan', id: item.targetId });
      }

      if (!success) {
        // Jika gagal karena timeout/lag, simpan kembali sisa antrean
        remainingQueue.push(item);
      }
    }

    saveSyncQueue(remainingQueue);
  } catch (err) {
    console.warn('Silent background sync paused due to network lag:', err);
  } finally {
    isProcessingQueue = false;
  }
}

// Helper pengiriman data ke Apps Script
async function rawSendToGas(url: string, payload: any): Promise<boolean> {
  if (!url) return false;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await res.json();
    return data && data.status === 'success';
  } catch (err) {
    return false;
  }
}

/**
 * Simpan bacaan: Langsung amankan di antrean perangkat, lalu kirim ke Sheets di latar belakang
 */
export function queueSaveBacaan(item: BacaanItem, url: string = DEFAULT_GAS_URL): void {
  enqueueSyncAction({ type: 'saveBacaan', item });
  // Jalankan pengiriman di background
  flushSyncQueue(url).catch(() => {});
}

/**
 * Hapus bacaan: Amankan di antrean perangkat, lalu kirim ke Sheets di latar belakang
 */
export function queueDeleteBacaan(id: string, url: string = DEFAULT_GAS_URL): void {
  enqueueSyncAction({ type: 'deleteBacaan', targetId: id });
  // Jalankan pengiriman di background
  flushSyncQueue(url).catch(() => {});
}

// ---------------------------------------------------------------------------
// AMBIL DATA DARI GOOGLE SHEETS
// ---------------------------------------------------------------------------
export async function fetchFromGas(url: string = DEFAULT_GAS_URL): Promise<{
  success: boolean;
  bacaan?: BacaanItem[];
  ustadz?: UstadzProfile[];
  message?: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const targetUrl = url.includes('?') ? `${url}&action=getAll` : `${url}?action=getAll`;
    const res = await fetch(targetUrl, { method: 'GET', mode: 'cors', signal: controller.signal });
    clearTimeout(timeoutId);

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

// Inisialisasi pendengar otomatis ketika perangkat kembali online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    flushSyncQueue(getSavedGasUrl()).catch(() => {});
  });
}
