import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ApkInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstructions(true);
    }
  };

  if (!isVisible || isInstalled) return null;

  return (
    <>
      <div className="bg-emerald-900 text-white px-4 py-2 text-xs flex items-center justify-between gap-3 shadow-inner no-print">
        <div className="flex items-center gap-2 max-w-2xl">
          <Smartphone className="w-4 h-4 text-amber-300 shrink-0" />
          <span className="text-emerald-100">
            <strong>Mode APK / Aplikasi HP:</strong> Pasang aplikasi ini ke layar utama smartphone Android / iPhone Anda agar bisa dibuka cepat layaknya aplikasi native.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-2.5 py-1 rounded bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-[11px] flex items-center gap-1 transition-all"
          >
            <Download className="w-3 h-3 stroke-[2.5]" />
            <span>Pasang APK / Web App</span>
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-emerald-300 hover:text-white rounded"
            aria-label="Tutup Banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Cara Pasang di HP (Android / iOS)</span>
              </h4>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p className="font-semibold text-slate-800">
                Aplikasi ini mendukung Progressive Web App (PWA) yang berjalan layaknya file APK resmi:
              </p>
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                <p>
                  <strong>Di Android (Google Chrome):</strong> Tekan tombol menu titik tiga (⋮) di pojok kanan atas browser, lalu pilih <strong>"Instal aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.
                </p>
                <p>
                  <strong>Di iPhone (Safari):</strong> Tekan tombol Bagikan (Share / kotak bertanda panah atas), lalu pilih <strong>"Add to Home Screen"</strong>.
                </p>
              </div>
              <p className="text-[11px] text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Data tersimpan otomatis secara offline di HP Anda.</span>
              </p>
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
};
