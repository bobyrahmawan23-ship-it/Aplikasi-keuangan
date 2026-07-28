import React, { useState } from 'react';
import { TransaksiPemasukan, Santri } from '../types';
import { formatRupiah, formatDateIndo, generateWaReceiptText, generateWaReceiptLink } from '../utils/formatters';
import { Send, Printer, Copy, Check, X, Building, CheckCircle2, ShieldCheck } from 'lucide-react';

interface KwitansiModalProps {
  transaksi: TransaksiPemasukan | null;
  santriList: Santri[];
  onClose: () => void;
  onSendWaLog: (trx: TransaksiPemasukan) => void;
}

export const KwitansiModal: React.FC<KwitansiModalProps> = ({
  transaksi,
  santriList,
  onClose,
  onSendWaLog,
}) => {
  const [copied, setCopied] = useState(false);

  if (!transaksi) return null;

  const santri = santriList.find(s => s.nis === transaksi.santriId);
  const rawText = generateWaReceiptText(transaksi, santri);

  const handleCopyText = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWa = () => {
    onSendWaLog(transaksi);
    const targetPhone = santri ? santri.noWaOrangTua : '081234567890';
    const link = generateWaReceiptLink(targetPhone, rawText);
    window.open(link, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden space-y-0">
        {/* Modal Header */}
        <div className="bg-indigo-950 text-white px-4 py-3 flex items-center justify-between border-b border-indigo-900">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-xs uppercase tracking-wide">Kwitansi Digital Resmi - MTQ Darul Abidin</span>
          </div>
          <button onClick={onClose} className="text-indigo-300 hover:text-white p-1 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt Content Printable Area */}
        <div className="p-5 space-y-3.5 text-xs font-sans text-slate-800" id="kwitansi-printable">
          {/* Header Receipt */}
          <div className="text-center border-b border-slate-200 pb-2.5">
            <h2 className="text-sm font-bold text-indigo-950 tracking-tight uppercase">MTQ DARUL ABIDIN</h2>
            <p className="text-[11px] text-slate-500 font-medium">Majelis Ta'lim & Tahfidz Qur'an Darul Abidin</p>
            <p className="text-[10px] text-slate-400">Bukti Pembayaran & Infaq Santri Sah & Terverifikasi</p>
          </div>

          {/* Receipt Info */}
          <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">No. Kwitansi:</span>
              <span className="font-mono font-bold text-slate-900">{transaksi.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Tanggal:</span>
              <span className="font-semibold text-slate-800">{formatDateIndo(transaksi.tanggal)}</span>
            </div>
          </div>

          {/* Student / Payer Details */}
          <div className="space-y-1 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-200/80">
            <span className="text-[10px] font-bold text-indigo-900 uppercase block tracking-wider">Data Pembayar / Santri</span>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div>
                <span className="text-slate-500">Nama:</span>
                <span className="font-bold text-slate-900 block">{santri ? santri.nama : transaksi.namaPembayar}</span>
              </div>
              {santri && (
                <div>
                  <span className="text-slate-500">NIS / Kelas:</span>
                  <span className="font-semibold text-slate-800 block">
                    {santri.nis} ({santri.kelas})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Item Breakdown Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="px-2.5 py-1.5">Kategori</th>
                  <th className="px-2.5 py-1.5">Periode / Keterangan</th>
                  <th className="px-2.5 py-1.5 text-right">Jumlah (Rp)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2.5 py-1.5 font-bold text-indigo-900">{transaksi.kategori}</td>
                  <td className="px-2.5 py-1.5 text-slate-600">{transaksi.bulanSpp || transaksi.tahunAjaran}</td>
                  <td className="px-2.5 py-1.5 text-right font-bold text-indigo-900">{formatRupiah(transaksi.nominal)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total & Status */}
          <div className="flex items-center justify-between p-2.5 bg-indigo-950 text-white rounded-lg border border-indigo-900">
            <div>
              <span className="text-[10px] text-slate-300 block uppercase font-bold">TOTAL DITERIMA</span>
              <span className="text-base font-bold text-amber-300">{formatRupiah(transaksi.nominal)}</span>
            </div>
            <div className="flex items-center gap-1 bg-emerald-600 text-white font-bold px-2.5 py-1 rounded text-xs uppercase">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
              <span>{transaksi.status.toUpperCase()}</span>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-2 flex justify-between items-end text-[11px] text-slate-500">
            <div className="flex items-center gap-1 text-[10px] text-indigo-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Digital Stamp System MTQ</span>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-400 mb-5">Bendahara MTQ Darul Abidin</p>
              <p className="font-bold text-slate-800 border-t border-slate-300 pt-0.5 text-[11px]">( Tim Keuangan MTQ )</p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 p-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handleCopyText}
            className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tercopy' : 'Copy Teks WA'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak</span>
            </button>

            <button
              onClick={handleSendWa}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Send className="w-3.5 h-3.5 text-amber-300" />
              <span>Kirim via WA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
