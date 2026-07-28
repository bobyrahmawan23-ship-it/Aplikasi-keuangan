import React, { useState } from 'react';
import { TransaksiPemasukan, TransaksiPengeluaran, Santri, SummaryKas, KategoriPemasukan } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';
import { exportToExcel, exportToWord, generateWaReportSummaryText } from '../utils/exports';
import { FileSpreadsheet, FileText, Send, Calendar, Building, Wallet, TrendingUp, Filter } from 'lucide-react';

interface RekapLaporanProps {
  pemasukanList: TransaksiPemasukan[];
  pengeluaranList: TransaksiPengeluaran[];
  santriList: Santri[];
  summary: SummaryKas;
}

export const RekapLaporan: React.FC<RekapLaporanProps> = ({
  pemasukanList,
  pengeluaranList,
  santriList,
  summary,
}) => {
  const [selectedBulan, setSelectedBulan] = useState<string>('07'); // Default July
  const [selectedTahun, setSelectedTahun] = useState<string>('2026');

  const categoriesIn: KategoriPemasukan[] = [
    'UDT',
    'INFAQ PENDAFTARAN',
    'Buku',
    'Wakaf Bangunan',
    'SPP Bulanan',
    'Infaq Kegiatan Hafidz Holiday',
    'Karantina Langit',
    'Infaq Donatur Tetap',
    'Kas Masuk Lainnya',
  ];

  // Filter transactions by selected month/year or all
  const filteredPemasukan = React.useMemo(() => {
    return pemasukanList.filter(p => {
      const d = new Date(p.tanggal);
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const y = String(d.getFullYear());
      return m === selectedBulan && y === selectedTahun;
    });
  }, [pemasukanList, selectedBulan, selectedTahun]);

  const filteredPengeluaran = React.useMemo(() => {
    return pengeluaranList.filter(p => {
      const d = new Date(p.tanggal);
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const y = String(d.getFullYear());
      return m === selectedBulan && y === selectedTahun;
    });
  }, [pengeluaranList, selectedBulan, selectedTahun]);

  // Totals
  const totalPemasukanFilter = filteredPemasukan.reduce((a, b) => a + b.nominal, 0);
  const totalPengeluaranFilter = filteredPengeluaran.reduce((a, b) => a + b.nominal, 0);
  const netCashFlow = totalPemasukanFilter - totalPengeluaranFilter;

  // Breakdown per category
  const breakdownCategory: Record<string, number> = {};
  categoriesIn.forEach(c => {
    breakdownCategory[c] = filteredPemasukan.filter(p => p.kategori === c).reduce((a, b) => a + b.nominal, 0);
  });

  // Handle Send Report via WhatsApp
  const handleSendWaReport = () => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monthName = months[parseInt(selectedBulan, 10) - 1] || 'Bulan Ini';
    const text = generateWaReportSummaryText(filteredPemasukan, filteredPengeluaran, summary, `${monthName} ${selectedTahun}`);
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
            Rekap Laporan Keuangan MTQ Darul Abidin
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Pelaporan rekapitulasi total penerimaan per item pembayaran, arus kas, dan pengeluaran per bulan/tahun.
          </p>
        </div>

        {/* Period Selector & Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Month Selector */}
          <select
            value={selectedBulan}
            onChange={e => setSelectedBulan(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
          >
            <option value="01">Januari</option>
            <option value="02">Februari</option>
            <option value="03">Maret</option>
            <option value="04">April</option>
            <option value="05">Mei</option>
            <option value="06">Juni</option>
            <option value="07">Juli</option>
            <option value="08">Agustus</option>
            <option value="09">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </select>

          {/* Year Selector */}
          <select
            value={selectedTahun}
            onChange={e => setSelectedTahun(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
          >
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>

          {/* Export Excel */}
          <button
            onClick={() => exportToExcel(pemasukanList, pengeluaranList, santriList, `${selectedBulan}_${selectedTahun}`)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
            <span>Excel (.xlsx)</span>
          </button>

          {/* Export Word */}
          <button
            onClick={() => exportToWord(filteredPemasukan, filteredPengeluaran, summary, `Laporan Keuangan ${selectedBulan}/${selectedTahun}`)}
            className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-200" />
            <span>Word (.docx)</span>
          </button>

          {/* Kirim WA */}
          <button
            onClick={handleSendWaReport}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim WA</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Pemasukan Periode Ini</span>
          <span className="text-lg font-bold text-emerald-700 block mt-0.5">{formatRupiah(totalPemasukanFilter)}</span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{filteredPemasukan.length} Transaksi Pemasukan</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Pengeluaran Periode Ini</span>
          <span className="text-lg font-bold text-rose-600 block mt-0.5">{formatRupiah(totalPengeluaranFilter)}</span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{filteredPengeluaran.length} Transaksi Pengeluaran</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Surplus / Arus Kas Bersih</span>
          <span className={`text-lg font-bold block mt-0.5 ${netCashFlow >= 0 ? 'text-indigo-700' : 'text-rose-700'}`}>
            {formatRupiah(netCashFlow)}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Pemasukan dikurangi Pengeluaran</span>
        </div>
      </div>

      {/* Detailed Revenue breakdown per Payment Item */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
            Rekap Penerimaan Per Item Pembayaran
          </h3>
          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 uppercase">
            Periode: {selectedBulan}/{selectedTahun}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {categoriesIn.map(cat => {
            const amount = breakdownCategory[cat] || 0;
            return (
              <div key={cat} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-0.5">
                <span className="text-[11px] font-semibold text-slate-700 block">{cat}</span>
                <span className="text-sm font-bold text-indigo-950 block">{formatRupiah(amount)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Income & Expense Breakdown Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Income Table */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wide border-b border-slate-100 pb-2">Rincian Transaksi Pemasukan</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-y border-slate-200">
                  <th className="px-2.5 py-1.5">Tanggal</th>
                  <th className="px-2.5 py-1.5">Nama</th>
                  <th className="px-2.5 py-1.5">Kategori</th>
                  <th className="px-2.5 py-1.5 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPemasukan.length > 0 ? (
                  filteredPemasukan.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-2.5 py-1.5 text-slate-600 font-mono text-[11px]">{p.tanggal}</td>
                      <td className="px-2.5 py-1.5 font-semibold text-slate-900">{p.namaPembayar}</td>
                      <td className="px-2.5 py-1.5 text-slate-700">{p.kategori}</td>
                      <td className="px-2.5 py-1.5 text-right font-bold text-emerald-700">{formatRupiah(p.nominal)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-400">
                      Tidak ada transaksi pemasukan pada periode ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expense Table */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wide border-b border-slate-100 pb-2">Rincian Transaksi Pengeluaran</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-y border-slate-200">
                  <th className="px-2.5 py-1.5">Tanggal</th>
                  <th className="px-2.5 py-1.5">Penerima</th>
                  <th className="px-2.5 py-1.5">Kategori</th>
                  <th className="px-2.5 py-1.5 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPengeluaran.length > 0 ? (
                  filteredPengeluaran.map(e => (
                    <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-2.5 py-1.5 text-slate-600 font-mono text-[11px]">{e.tanggal}</td>
                      <td className="px-2.5 py-1.5 font-semibold text-slate-900">{e.penerima}</td>
                      <td className="px-2.5 py-1.5 text-slate-700">{e.kategori}</td>
                      <td className="px-2.5 py-1.5 text-right font-bold text-rose-700">{formatRupiah(e.nominal)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-400">
                      Tidak ada transaksi pengeluaran pada periode ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
