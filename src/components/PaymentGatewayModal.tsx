import React, { useState } from 'react';
import { Santri, TransaksiPemasukan, KategoriPemasukan } from '../types';
import { formatRupiah } from '../utils/formatters';
import { QrCode, CreditCard, CheckCircle2, X, RefreshCw, ShieldCheck, Building } from 'lucide-react';

interface PaymentGatewayModalProps {
  santriList: Santri[];
  onClose: () => void;
  onProcessGatewayPayment: (trx: Omit<TransaksiPemasukan, 'id' | 'kwitansiTerkirim'>) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  santriList,
  onClose,
  onProcessGatewayPayment,
}) => {
  const [selectedSantriNis, setSelectedSantriNis] = useState<string>(santriList[0]?.nis || '');
  const [kategori, setKategori] = useState<KategoriPemasukan>('SPP Bulanan');
  const [nominal, setNominal] = useState<string>('250000');
  const [bulanSpp, setBulanSpp] = useState<string>('Juli 2026');
  const [gatewayMethod, setGatewayMethod] = useState<'QRIS' | 'VA_BSI' | 'VA_BRI'>('QRIS');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const selectedSantri = santriList.find(s => s.nis === selectedSantriNis);

  const handleSimulatePayment = () => {
    if (!selectedSantri) return;

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      onProcessGatewayPayment({
        tanggal: new Date().toISOString().split('T')[0],
        santriId: selectedSantri.nis,
        namaPembayar: `${selectedSantri.nama} (${selectedSantri.namaOrangTua})`,
        kategori,
        nominal: Number(nominal),
        sumberKas: 'Kas MTQ',
        metodePembayaran: 'Payment Gateway (QRIS/VA)',
        tahunAjaran: '2026/2027',
        bulanSpp: kategori === 'SPP Bulanan' ? bulanSpp : undefined,
        catatan: `Pembayaran via ${gatewayMethod} Payment Gateway Auto-Verified`,
        status: 'Lunas',
        referenceNumber: `GATEWAY-${Math.floor(100000 + Math.random() * 900000)}`,
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden space-y-0">
        {/* Header */}
        <div className="bg-indigo-950 text-white px-4 py-3 flex items-center justify-between border-b border-indigo-900">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-xs uppercase tracking-wide">Payment Gateway QRIS & VA - MTQ Darul Abidin</span>
          </div>
          <button onClick={onClose} className="text-indigo-300 hover:text-white p-1 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isSuccess ? (
          <div className="p-5 space-y-3.5 text-xs">
            <p className="text-slate-600 text-[11px]">
              Pilih santri dan komponen pembayaran di bawah untuk mensimulasikan pemrosesan otomatis transaksi via Gateway.
            </p>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Pilih Santri *</label>
              <select
                value={selectedSantriNis}
                onChange={e => setSelectedSantriNis(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
              >
                {santriList.map(s => (
                  <option key={s.id} value={s.nis}>
                    {s.nama} - {s.kelas} ({s.nis})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Kategori Pembayaran</label>
                <select
                  value={kategori}
                  onChange={e => setKategori(e.target.value as KategoriPemasukan)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800"
                >
                  <option value="SPP Bulanan">SPP Bulanan</option>
                  <option value="UDT">UDT</option>
                  <option value="Wakaf Bangunan">Wakaf Bangunan</option>
                  <option value="Infaq Kegiatan Hafidz Holiday">Hafidz Holiday</option>
                  <option value="Karantina Langit">Karantina Langit</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  value={nominal}
                  onChange={e => setNominal(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-indigo-950"
                />
              </div>
            </div>

            {/* Gateway Channel Selector */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">Metode Gateway</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setGatewayMethod('QRIS')}
                  className={`p-2 rounded-lg border text-xs font-bold text-center transition-all ${
                    gatewayMethod === 'QRIS' ? 'bg-indigo-50 border-indigo-500 text-indigo-950' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  QRIS Instant
                </button>
                <button
                  type="button"
                  onClick={() => setGatewayMethod('VA_BSI')}
                  className={`p-2 rounded-lg border text-xs font-bold text-center transition-all ${
                    gatewayMethod === 'VA_BSI' ? 'bg-indigo-50 border-indigo-500 text-indigo-950' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  VA BSI
                </button>
                <button
                  type="button"
                  onClick={() => setGatewayMethod('VA_BRI')}
                  className={`p-2 rounded-lg border text-xs font-bold text-center transition-all ${
                    gatewayMethod === 'VA_BRI' ? 'bg-indigo-50 border-indigo-500 text-indigo-950' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  VA BRI
                </button>
              </div>
            </div>

            {/* QRIS / VA Display Box */}
            <div className="bg-indigo-950 text-white p-3.5 rounded-lg text-center space-y-1.5 border border-indigo-900">
              <span className="text-[10px] text-amber-300 uppercase block tracking-wider font-bold">
                Kanal {gatewayMethod} Terverifikasi
              </span>
              {gatewayMethod === 'QRIS' ? (
                <div className="w-24 h-24 bg-white mx-auto rounded-lg p-1.5 flex items-center justify-center">
                  <QrCode className="w-20 h-20 text-slate-900" />
                </div>
              ) : (
                <div className="font-mono text-base font-bold text-amber-300 tracking-wider">
                  {gatewayMethod === 'VA_BSI' ? '9880 2026 0192 88' : '8821 2026 0192 99'}
                </div>
              )}
              <p className="text-[10px] text-slate-300">Total Tagihan: {formatRupiah(Number(nominal))}</p>
            </div>

            <div className="pt-1">
              <button
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Memproses Transaksi Gateway...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                    <span>Proses Pembayaran Gateway Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pembayaran Berhasil Diproses!</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Sistem secara otomatis telah mencatatkan penerimaan kas dan menerbitkan kwitansi digital.
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-indigo-950 hover:bg-indigo-900 text-white font-bold px-5 py-2 rounded-lg text-xs shadow-xs uppercase tracking-wide"
            >
              Tutup & Lihat Transaksi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
