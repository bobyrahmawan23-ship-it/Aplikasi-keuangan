import React from 'react';
import { SummaryKas, AuthUser } from '../types';
import { formatRupiah } from '../utils/formatters';
import {
  Wallet,
  RefreshCw,
  Smartphone,
  Laptop,
  Trash2,
  LogOut,
  Download,
  UserCheck,
} from 'lucide-react';

interface HeaderProps {
  summary: SummaryKas;
  currentUser: AuthUser | null;
  onLogout: () => void;
  onOpenInstallModal: () => void;
  onResetData: () => void;
  onOpenGatewayModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  summary,
  currentUser,
  onLogout,
  onOpenInstallModal,
  onResetData,
  onOpenGatewayModal,
}) => {
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
            <div className="bg-indigo-950/80 border border-indigo-800 rounded-xl px-3 py-1 flex items-center gap-2 min-w-[120px] sm:min-w-[140px]">
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
            <div className="bg-indigo-950/80 border border-indigo-800 rounded-xl px-3 py-1 flex items-center gap-2 min-w-[120px] sm:min-w-[140px]">
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

            {/* Install on Mobile / Download App Button */}
            <button
              onClick={onOpenInstallModal}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 sm:px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
              title="Pasang / Download Aplikasi ke Layar HP"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-[11px]">Pasang di HP</span>
            </button>

            {/* Payment Gateway Trigger Button */}
            <button
              onClick={onOpenGatewayModal}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
              title="Bayar SPP / QRIS Gateway"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pay Gateway</span>
            </button>

            {/* Reset Data Button */}
            <button
              onClick={onResetData}
              className="bg-red-500/20 text-red-200 hover:text-white border border-red-500/30 hover:bg-red-600/80 px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all uppercase"
              title="Reset / Hapus Data Kas Bawaan Aplikasi"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-300" />
              <span className="hidden xl:inline text-[10px]">Reset</span>
            </button>

            {/* User Profile & Logout */}
            {currentUser && (
              <div className="flex items-center gap-1.5 bg-indigo-950/90 border border-indigo-700/80 pl-2 pr-1 py-1 rounded-xl">
                <div className="text-left hidden lg:block">
                  <div className="text-[11px] font-bold text-white leading-tight truncate max-w-[130px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[9px] text-amber-300 font-semibold">{currentUser.role}</div>
                </div>

                <div className="w-7 h-7 rounded-lg bg-indigo-800 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                  {currentUser.avatar}
                </div>

                <button
                  onClick={onLogout}
                  className="p-1 text-indigo-300 hover:text-rose-300 hover:bg-indigo-900 rounded-lg transition-colors"
                  title="Keluar / Log Out dari Sistem"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

