import React from 'react';
import { SummaryKas, TransaksiPemasukan, TransaksiPengeluaran, Santri } from '../types';
import { formatRupiah, formatDateIndo, generateWaReceiptText, generateWaReceiptLink } from '../utils/formatters';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  AlertCircle,
  PlusCircle,
  QrCode,
  Send,
  UserPlus,
  FileSpreadsheet,
  Building,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardProps {
  summary: SummaryKas;
  pemasukan: TransaksiPemasukan[];
  pengeluaran: TransaksiPengeluaran[];
  santriList: Santri[];
  onNavigate: (tab: any) => void;
  onOpenGatewayModal: () => void;
  onSelectTransactionForWa: (trx: TransaksiPemasukan) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  summary,
  pemasukan,
  pengeluaran,
  santriList,
  onNavigate,
  onOpenGatewayModal,
  onSelectTransactionForWa,
}) => {
  // Chart Data: Income per category
  const categoryData = React.useMemo(() => {
    const map: Record<string, number> = {};
    pemasukan.forEach(item => {
      map[item.kategori] = (map[item.kategori] || 0) + item.nominal;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [pemasukan]);

  // Colors for Pie Chart
  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#6366f1'];

  // Bar Chart Data (Comparison)
  const barData = [
    {
      name: 'Kas MTQ',
      Pemasukan: pemasukan.filter(i => i.sumberKas === 'Kas MTQ').reduce((a, b) => a + b.nominal, 0),
      Pengeluaran: pengeluaran.filter(i => i.sumberKas === 'Kas MTQ').reduce((a, b) => a + b.nominal, 0),
    },
    {
      name: 'Kas Donatur',
      Pemasukan: pemasukan.filter(i => i.sumberKas === 'Kas Donatur').reduce((a, b) => a + b.nominal, 0),
      Pengeluaran: pengeluaran.filter(i => i.sumberKas === 'Kas Donatur').reduce((a, b) => a + b.nominal, 0),
    },
  ];

  const recentTransactions = React.useMemo(() => {
    return [...pemasukan].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()).slice(0, 6);
  }, [pemasukan]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-xl p-5 shadow-sm border border-indigo-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-indigo-800/80 border border-indigo-700 text-amber-300 text-[11px] font-bold mb-2 uppercase tracking-wide">
              <Building className="w-3.5 h-3.5" /> MTQ Darul Abidin Financial System
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              Selamat Datang di Dasbor Keuangan Santri
            </h2>
            <p className="text-indigo-200/80 text-xs mt-1 max-w-2xl">
              Pantau arus kas MTQ, kas donatur, penerimaan SPP & infaq, kartu kendali santri, serta pengiriman kwitansi WhatsApp secara real-time.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => onNavigate('pemasukan')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Tambah Kas</span>
            </button>
            <button
              onClick={() => onNavigate('pengeluaran')}
              className="bg-indigo-800 hover:bg-indigo-700 text-white font-semibold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 border border-indigo-700 transition-all"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-300" />
              <span>Pengeluaran</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Saldo Kas MTQ */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              Total Kas MTQ
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1.5">
            <span className="text-xl font-bold text-slate-900 tracking-tight block">
              {formatRupiah(summary.totalKasMTQ)}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Saldo Utama Operasional
            </span>
          </div>
        </div>

        {/* Card 2: Total Saldo Kas Donatur */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              Kas Donatur
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1.5">
            <span className="text-xl font-bold text-indigo-700 tracking-tight block">
              {formatRupiah(summary.totalKasDonatur)}
            </span>
            <span className="text-[10px] text-amber-700 font-bold mt-1 flex items-center gap-1">
              <Building className="w-3 h-3" /> Infaq Donatur Terikat
            </span>
          </div>
        </div>

        {/* Card 3: Pemasukan vs Pengeluaran */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              Arus Kas Bulan Ini
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Masuk:</span>
              <span className="font-bold text-emerald-700">{formatRupiah(summary.totalPemasukanBulanIni)}</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-slate-500 font-medium">Keluar:</span>
              <span className="font-bold text-orange-600">{formatRupiah(summary.totalPengeluaranBulanIni)}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Tunggakan SPP Santri */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              Tunggakan SPP Santri
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1.5">
            <span className="text-xl font-bold text-rose-600 tracking-tight block">
              {formatRupiah(summary.totalTunggakanSpp)}
            </span>
            <button
              onClick={() => onNavigate('santri')}
              className="text-[10px] text-rose-700 hover:underline font-bold mt-1 flex items-center gap-1"
            >
              Lihat Santri Menunggak &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Charts & Graphs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Kas Comparison Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Perbandingan Pemasukan & Pengeluaran</h3>
              <p className="text-xs text-slate-500">Antara Kas Utama MTQ dan Kas Donatur Tetap</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={val => `Rp ${(val / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: any) => formatRupiah(Number(value))} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Pemasukan" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Pengeluaran" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Income Breakdown Pie Chart */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Komposisi Pemasukan</h3>
              <p className="text-xs text-slate-500">Breakdown per Kategori Pembayaran</p>
            </div>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatRupiah(Number(value))} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} layout="horizontal" verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400 text-center">Belum ada data pemasukan</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Access & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Features Panel */}
        <div className="lg:col-span-4 bg-indigo-900 text-white rounded-xl p-4 shadow-xs border border-indigo-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wide text-amber-300">Aksi Cepat Pengelolaan</h3>
          <p className="text-[11px] text-indigo-200/90">
            Pilih fitur cepat di bawah untuk memproses transaksi, kwitansi, atau data santri.
          </p>

          <div className="space-y-2 pt-1">
            <button
              onClick={onOpenGatewayModal}
              className="w-full bg-indigo-800/90 hover:bg-amber-500 hover:text-slate-950 text-white font-semibold p-2.5 rounded-lg text-xs flex items-center justify-between transition-all border border-indigo-700/80"
            >
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Bayar SPP via Payment Gateway</span>
              </div>
              <span>&rarr;</span>
            </button>

            <button
              onClick={() => onNavigate('santri')}
              className="w-full bg-indigo-800/90 hover:bg-indigo-700 text-white font-semibold p-2.5 rounded-lg text-xs flex items-center justify-between transition-all border border-indigo-700/80"
            >
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-300" />
                <span>Tambah & Kelola Santri Baru</span>
              </div>
              <span>&rarr;</span>
            </button>

            <button
              onClick={() => onNavigate('laporan')}
              className="w-full bg-indigo-800/90 hover:bg-indigo-700 text-white font-semibold p-2.5 rounded-lg text-xs flex items-center justify-between transition-all border border-indigo-700/80"
            >
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-300" />
                <span>Download Laporan Word/Excel</span>
              </div>
              <span>&rarr;</span>
            </button>
          </div>
        </div>

        {/* Recent Income Transactions Table */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                Transaksi Pemasukan Terbaru
              </h3>
              <p className="text-[11px] text-slate-500">Pencatatan pembayaran & infaq santri terkini</p>
            </div>
            <button
              onClick={() => onNavigate('pemasukan')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
            >
              Lihat Semua &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-y border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                  <th className="px-3 py-2">Tanggal</th>
                  <th className="px-3 py-2">Nama Santri / Donatur</th>
                  <th className="px-3 py-2">Kategori</th>
                  <th className="px-3 py-2">Nominal</th>
                  <th className="px-3 py-2">Metode</th>
                  <th className="px-3 py-2 text-right">Kwitansi WA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentTransactions.map(trx => {
                  return (
                    <tr key={trx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-2 font-mono text-slate-600 text-[11px]">{formatDateIndo(trx.tanggal)}</td>
                      <td className="px-3 py-2 font-semibold text-slate-900">{trx.namaPembayar}</td>
                      <td className="px-3 py-2">
                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                          {trx.kategori}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-bold text-slate-900">{formatRupiah(trx.nominal)}</td>
                      <td className="px-3 py-2 text-slate-500 text-[11px]">{trx.metodePembayaran}</td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => onSelectTransactionForWa(trx)}
                          className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white font-bold px-2 py-1 rounded text-[10px] uppercase transition-all shadow-xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>WA</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
