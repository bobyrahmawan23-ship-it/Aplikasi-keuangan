import React from 'react';
import { SummaryKas } from '../types';
import { formatRupiah } from '../utils/formatters';
import { Building2, Wallet, RefreshCw, Smartphone, Laptop, CheckCircle2, Trash2 } from 'lucide-react';

interface HeaderProps {
  summary: SummaryKas;
  onResetData: () => void;
  onOpenGatewayModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ summary, onResetData, onOpenGatewayModal }) => {
  return (
    <header className="bg-indigo-900 text-white border-b border-indigo-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-2.5 gap-3">
          {/* Brand & Organization Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500 text-white font-bold text-lg italic flex items-center justify-center shadow-xs shrink-0">
              M
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase">
                  MTQ DARUL ABIDIN <span className="font-light opacity-80 text-xs sm:text-sm">| Keuangan</span>
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-800/90 text-emerald-300 border border-indigo-700/80">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span>ONLINE & AUTO-SYNC</span>
                </span>
              </div>
              <p className="text-[11px] text-indigo-200/80 font-normal">
                Sistem Management Keuangan, Kwitansi WhatsApp & Kartu Kendali Santri
              </p>
            </div>
          </div>

          {/* Balance Cards & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-between md:justify-end">
            {/* Balance Kas MTQ */}
            <div className="bg-indigo-950/80 border border-indigo-800 rounded-xl px-3 py-1 flex items-center gap-2 min-w-[130px] sm:min-w-[150px]">
              <div className="p-1 rounded-md bg-indigo-800/60 text-indigo-300">
                <Wallet className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-indigo-300 block tracking-wider">
                  Kas MTQ
                </span>
                <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  {formatRupiah(summary.totalKasMTQ)}
                </span>
              </div>
            </div>

            {/* Balance Kas Donatur */}
            <div className="bg-indigo-950/80 border border-indigo-800 rounded-xl px-3 py-1 flex items-center gap-2 min-w-[130px] sm:min-w-[150px]">
              <div className="p-1 rounded-md bg-amber-900/60 text-amber-300">
                <Wallet className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-amber-300 block tracking-wider">
                  Kas Donatur
                </span>
                <span className="text-xs sm:text-sm font-bold text-amber-200 tracking-tight">
                  {formatRupiah(summary.totalKasDonatur)}
                </span>
              </div>
            </div>

            <div className="hidden sm:block h-6 w-[1px] bg-indigo-800" />

            {/* Payment Gateway Trigger Button */}
            <button
              onClick={onOpenGatewayModal}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
              title="Bayar SPP / QRIS Gateway"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pay Gateway</span>
            </button>

            {/* Reset Data Button */}
            <button
              onClick={onResetData}
              className="bg-red-500/20 text-red-200 hover:text-white border border-red-500/30 hover:bg-red-600/80 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all uppercase"
              title="Reset / Hapus Data Kas Bawaan Aplikasi"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-300" />
              <span className="hidden lg:inline text-[10px]">Reset Data</span>
            </button>

            {/* Device Indicator */}
            <div className="hidden xl:flex items-center gap-1 text-[10px] text-indigo-300 bg-indigo-950/50 px-2 py-1 rounded-lg border border-indigo-800">
              <Laptop className="w-3 h-3" />
              <Smartphone className="w-3 h-3" />
              <span>Multi-Device</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
