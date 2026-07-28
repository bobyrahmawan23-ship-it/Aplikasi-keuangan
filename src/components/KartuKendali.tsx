import React, { useState } from 'react';
import { Santri, TransaksiPemasukan } from '../types';
import { formatRupiah, formatDateIndo, generateWaReceiptLink } from '../utils/formatters';
import { CreditCard, CheckCircle2, Clock, Send, Printer, User, AlertCircle, Sparkles } from 'lucide-react';

interface KartuKendaliProps {
  santriList: Santri[];
  pemasukanList: TransaksiPemasukan[];
  selectedSantri: Santri | null;
  onSelectSantri: (santri: Santri) => void;
  onPaySppForMonth: (santri: Santri, monthName: string, isArrears: boolean) => void;
}

export const KartuKendali: React.FC<KartuKendaliProps> = ({
  santriList,
  pemasukanList,
  selectedSantri,
  onSelectSantri,
  onPaySppForMonth,
}) => {
  const currentSantri = selectedSantri || santriList[0] || null;

  const monthsAcademicYear = [
    'Juli 2026',
    'Agustus 2026',
    'September 2026',
    'Oktober 2026',
    'November 2026',
    'Desember 2026',
    'Januari 2027',
    'Februari 2027',
    'Maret 2027',
    'April 2027',
    'Mei 2027',
    'Juni 2027',
  ];

  // Filter transactions for current student
  const santriTransactions = React.useMemo(() => {
    if (!currentSantri) return [];
    return pemasukanList.filter(
      p => p.santriId === currentSantri.nis || p.namaPembayar.toLowerCase().includes(currentSantri.nama.toLowerCase())
    );
  }, [pemasukanList, currentSantri]);

  // Total paid by student
  const totalPaid = santriTransactions.reduce((a, b) => a + b.nominal, 0);

  // Function to send WA summary for student control card
  const handleSendWaControlCard = () => {
    if (!currentSantri) return;

    let text = `*KARTU KENDALI PEMBAYARAN SPP SANTRI*\n*MTQ DARUL ABIDIN*\n----------------------------------------\n*NAMA:* ${currentSantri.nama}\n*NIS:* ${currentSantri.nis}\n*KELAS:* ${currentSantri.kelas}\n*WALI:* ${currentSantri.namaOrangTua}\n----------------------------------------\n*STATUS TUNGGAKAN TA LALU:* ${formatRupiah(currentSantri.tunggakanSppTahunLalu)}\n*TOTAL DIBAYARKAN:* ${formatRupiah(totalPaid)}\n\n*STATUS SPP TA 2026/2027:*\n`;

    monthsAcademicYear.forEach(m => {
      const isPaid = santriTransactions.some(
        t => t.kategori === 'SPP Bulanan' && t.bulanSpp && t.bulanSpp.toLowerCase().includes(m.split(' ')[0].toLowerCase())
      );
      text += `• ${m}: ${isPaid ? '✅ LUNAS' : '❌ BELUM'}\n`;
    });

    text += `\n_Terima kasih atas perhatian dan kerjasama Bapak/Ibu Wali Santri._\n*MTQ Darul Abidin*`;

    const link = generateWaReceiptLink(currentSantri.noWaOrangTua, text);
    window.open(link, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header & Student Selector */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
            Kartu Kendali Pembayaran SPP Santri
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Monitoring kewajiban SPP bulanan, pelunasan tunggakan tahun ajaran sebelumnya, dan riwayat pembayaran per santri.
          </p>
        </div>

        {/* Student Selector Dropdown */}
        <div className="flex items-center gap-2 min-w-[260px]">
          <User className="w-4 h-4 text-indigo-600 shrink-0" />
          <select
            value={currentSantri ? currentSantri.nis : ''}
            onChange={e => {
              const found = santriList.find(s => s.nis === e.target.value);
              if (found) onSelectSantri(found);
            }}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
          >
            {santriList.map(s => (
              <option key={s.id} value={s.nis}>
                {s.nama} - {s.kelas} (NIS: {s.nis})
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentSantri ? (
        <div className="space-y-4">
          {/* Student Profile Card & Summary */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-xl p-5 shadow-sm border border-indigo-900 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-800/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
                  {currentSantri.nama.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{currentSantri.nama}</h3>
                    <span className="bg-indigo-800/80 text-indigo-200 border border-indigo-700 text-[9px] font-bold uppercase px-2 py-0.5 rounded">
                      {currentSantri.kelas}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    NIS: <span className="font-mono font-bold text-amber-300">{currentSantri.nis}</span> | Wali: {currentSantri.namaOrangTua} (+{currentSantri.noWaOrangTua})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSendWaControlCard}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>Kirim WA</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-indigo-800/90 hover:bg-indigo-700 text-indigo-100 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 border border-indigo-700 transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="bg-indigo-950/90 border border-indigo-800/70 p-2.5 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-indigo-300 block">Total Pembayaran Diterima</span>
                <span className="text-base font-bold text-white">{formatRupiah(totalPaid)}</span>
              </div>

              <div className="bg-indigo-950/90 border border-indigo-800/70 p-2.5 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-rose-400 block">Tunggakan SPP TA Lalu (2025/2026)</span>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <span className="text-base font-bold text-rose-200">{formatRupiah(currentSantri.tunggakanSppTahunLalu)}</span>
                  {currentSantri.tunggakanSppTahunLalu > 0 && (
                    <button
                      onClick={() => onPaySppForMonth(currentSantri, 'Pelunasan Tunggakan TA Lalu', true)}
                      className="text-[10px] bg-rose-600 hover:bg-rose-500 text-white font-bold px-2 py-0.5 rounded transition-all shrink-0 uppercase"
                    >
                      Bayar Now
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-indigo-950/90 border border-indigo-800/70 p-2.5 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-amber-400 block">Kategori Santri</span>
                <span className="text-base font-bold text-amber-200">{currentSantri.kategoriSantri}</span>
              </div>
            </div>
          </div>

          {/* SPP Academic Year Monthly Grid Matrix */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Matriks Status SPP Bulanan (TA 2026/2027)
                </h3>
                <p className="text-[11px] text-slate-500">Klik 'Bayar SPP' untuk langsung mencatat transaksi penerimaan bulan terkait</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {monthsAcademicYear.map(mName => {
                const monthShort = mName.split(' ')[0];
                const matchingTrx = santriTransactions.find(
                  t => t.kategori === 'SPP Bulanan' && t.bulanSpp && t.bulanSpp.toLowerCase().includes(monthShort.toLowerCase())
                );
                const isPaid = !!matchingTrx;

                return (
                  <div
                    key={mName}
                    className={`p-2.5 rounded-lg border flex flex-col justify-between space-y-1.5 transition-all ${
                      isPaid ? 'bg-emerald-50/80 border-emerald-300' : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{mName}</span>
                      <span className="text-[10px] text-slate-500">Nominal: Rp 250.000</span>
                    </div>

                    {isPaid ? (
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-200/80 px-1.5 py-0.5 rounded uppercase">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" /> LUNAS
                        </span>
                        <span className="text-[9px] text-slate-500 block font-mono">{formatDateIndo(matchingTrx.tanggal)}</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded uppercase">
                          <Clock className="w-3 h-3 text-rose-600" /> BELUM
                        </span>
                        <button
                          onClick={() => onPaySppForMonth(currentSantri, mName, false)}
                          className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-1 rounded text-[10px] uppercase transition-all shadow-xs"
                        >
                          Bayar SPP
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Transaction History Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
              Riwayat Transaksi Santri Ini
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-y border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                    <th className="px-3 py-2">ID / Tanggal</th>
                    <th className="px-3 py-2">Kategori</th>
                    <th className="px-3 py-2">Periode</th>
                    <th className="px-3 py-2">Nominal</th>
                    <th className="px-3 py-2">Metode</th>
                    <th className="px-3 py-2">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {santriTransactions.length > 0 ? (
                    santriTransactions.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3 py-2 font-mono text-slate-700 text-[11px]">
                          <span className="font-bold block text-slate-900">{t.id}</span>
                          <span className="text-[10px] text-slate-400">{formatDateIndo(t.tanggal)}</span>
                        </td>
                        <td className="px-3 py-2 font-semibold text-indigo-800">{t.kategori}</td>
                        <td className="px-3 py-2 text-slate-600 text-[11px]">{t.bulanSpp || t.tahunAjaran}</td>
                        <td className="px-3 py-2 font-bold text-slate-900">{formatRupiah(t.nominal)}</td>
                        <td className="px-3 py-2 text-slate-500 text-[11px]">{t.metodePembayaran}</td>
                        <td className="px-3 py-2 text-slate-500 text-[11px]">{t.catatan}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-3 py-6 text-center text-slate-400">
                        Belum ada riwayat transaksi terdaftar untuk santri ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 space-y-2">
          <AlertCircle className="w-6 h-6 text-slate-300 mx-auto" />
          <p className="text-xs">Belum ada data santri yang dipilih.</p>
        </div>
      )}
    </div>
  );
};
