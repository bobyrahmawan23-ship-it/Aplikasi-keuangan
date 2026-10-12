import React, { useState, useEffect } from 'react';
import { Smartphone, Download, CheckCircle2, X, Share, PlusSquare, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';

interface InstallPwaModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstalled?: () => void;
}

export const InstallPwaModal: React.FC<InstallPwaModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstalled,
}) => {
  const [platformTab, setPlatformTab] = useState<'android' | 'ios'>('android');
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);

  useEffect(() => {
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOSDevice) {
      setPlatformTab('ios');
    }

    // Detect if already installed
    const standaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standaloneMode);
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      setIsInstalling(false);
      if (choiceResult.outcome === 'accepted') {
        if (onInstalled) onInstalled();
        onClose();
      }
    } else {
      // Manual instruction alert
      alert(
        'Untuk memasang di HP: Buka menu titik tiga (⋮) browser Anda di pojok kanan atas, lalu pilih "Tambahkan ke Layar Utama" / "Instal Aplikasi".'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-800 text-white px-5 py-4 flex items-center justify-between border-b border-indigo-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-indigo-950 flex items-center justify-center font-black shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">Download & Pasang di Layar HP</h3>
              <p className="text-[11px] text-indigo-200">Aplikasi Ringan PWA Tanpa Perlu PlayStore / AppStore</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-indigo-300 hover:text-white p-1 rounded-lg hover:bg-indigo-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {isStandalone ? (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-900 text-sm">Aplikasi Sudah Terpasang!</h4>
              <p className="text-slate-600 text-xs">
                Anda sudah membuka aplikasi ini dalam mode layar penuh (PWA) di HP Anda.
              </p>
            </div>
          ) : (
            <>
              {/* One-click install button if Chrome prompt available */}
              {deferredPrompt && (
                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl space-y-2.5 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-amber-800 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Pemasangan Instan 1-Klik Tersedia
                  </div>
                  <p className="text-slate-700 text-xs">
                    Perangkat Anda mendukung instalasi otomatis ke layar utama HP dalam 2 detik:
                  </p>
                  <button
                    onClick={handleInstallClick}
                    disabled={isInstalling}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-2.5 px-4 rounded-xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isInstalling ? 'Memasang Aplikasi...' : 'Pasang di Layar HP Sekarang'}</span>
                  </button>
                </div>
              )}

              {/* Platform Selector Tabs */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Petunjuk Pemasangan Manual:
                </span>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setPlatformTab('android')}
                    className={`py-2 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      platformTab === 'android'
                        ? 'bg-indigo-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Android / Chrome</span>
                  </button>
                  <button
                    onClick={() => setPlatformTab('ios')}
                    className={`py-2 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      platformTab === 'ios'
                        ? 'bg-indigo-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>iPhone / Safari (iOS)</span>
                  </button>
                </div>
              </div>

              {/* Instructions per Platform */}
              {platformTab === 'android' ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[11px] font-black">
                      1
                    </span>
                    Buka Google Chrome di HP Android
                  </h4>
                  <div className="pl-6 space-y-2 text-slate-600 text-[11px]">
                    <p>
                      Ketuk tombol menu <strong>Titik Tiga (⋮)</strong> di pojok kanan atas browser Google Chrome.
                    </p>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[11px] font-black">
                      2
                    </span>
                    Pilih "Tambahkan ke Layar Utama" / "Instal Aplikasi"
                  </h4>
                  <div className="pl-6 space-y-2 text-slate-600 text-[11px]">
                    <p>
                      Pilih menu bertuliskan <strong>"Tambahkan ke Layar Utama" (Add to Home screen)</strong> atau{' '}
                      <strong>"Instal Aplikasi"</strong>.
                    </p>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] font-black">
                      3
                    </span>
                    Selesai! Ikon MTQ Siap Digunakan
                  </h4>
                  <div className="pl-6 space-y-2 text-slate-600 text-[11px]">
                    <p>
                      Ikon <strong>MTQ Darul Abidin</strong> akan langsung muncul di halaman beranda HP Anda layaknya
                      aplikasi Android asli yang ringan, cepat, dan bekerja offline!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[11px] font-black">
                      1
                    </span>
                    Buka di Browser Safari iPhone
                  </h4>
                  <div className="pl-6 space-y-2 text-slate-600 text-[11px]">
                    <p>
                      Pastikan tautan aplikasi ini dibuka menggunakan browser bawaan <strong>Safari</strong> iPhone.
                    </p>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[11px] font-black">
                      2
                    </span>
                    Ketuk Tombol Share (Bagikan)
                  </h4>
                  <div className="pl-6 space-y-2 text-slate-600 text-[11px]">
                    <p className="flex items-center gap-1.5">
                      Ketuk ikon <Share className="w-3.5 h-3.5 text-blue-600 inline" /> <strong>Bagikan (Share)</strong>{' '}
                      di bar menu bawah layar iPhone Anda.
                    </p>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[11px] font-black">
                      3
                    </span>
                    Pilih "Add to Home Screen"
                  </h4>
                  <div className="pl-6 space-y-2 text-slate-600 text-[11px]">
                    <p className="flex items-center gap-1.5">
                      Gulir sedikit ke bawah dan pilih{' '}
                      <PlusSquare className="w-3.5 h-3.5 text-slate-800 inline" />{' '}
                      <strong>"Tambahkan ke Layar Utama" (Add to Home Screen)</strong>.
                    </p>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] font-black">
                      4
                    </span>
                    Ketuk "Tambah" (Add) di Kanan Atas
                  </h4>
                  <div className="pl-6 space-y-2 text-slate-600 text-[11px]">
                    <p>
                      Aplikasi MTQ Darul Abidin akan langsung tersimpan di homescreen iPhone tanpa browser bar!
                    </p>
                  </div>
                </div>
              )}

              {/* Benefit List */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2 bg-indigo-50/70 border border-indigo-200 rounded-lg">
                  <span className="block font-bold text-indigo-950 text-[10px]">Ukuran Ringan</span>
                  <span className="text-[9px] text-slate-500">Hemat memori HP &lt; 2MB</span>
                </div>
                <div className="p-2 bg-indigo-50/70 border border-indigo-200 rounded-lg">
                  <span className="block font-bold text-indigo-950 text-[10px]">Tampilan Penuh</span>
                  <span className="text-[9px] text-slate-500">Tanpa kolom URL browser</span>
                </div>
                <div className="p-2 bg-indigo-50/70 border border-indigo-200 rounded-lg">
                  <span className="block font-bold text-indigo-950 text-[10px]">Akses Cepat</span>
                  <span className="text-[9px] text-slate-500">1-Ketukan langsung buka</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Resmi & Terverifikasi MTQ</span>
          </div>
          <button
            onClick={onClose}
            className="bg-indigo-900 hover:bg-indigo-950 text-white font-bold px-4 py-1.5 rounded-lg text-xs"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
