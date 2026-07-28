import React, { useState } from 'react';
import { LogPesanWhatsApp, Santri, TransaksiPemasukan } from '../types';
import { formatPhoneWA, generateWaReceiptLink, generateWaReceiptText } from '../utils/formatters';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Phone,
  RefreshCw,
  Trash2,
  Users,
  Search,
  PlusCircle,
  FileText,
} from 'lucide-react';

interface WhatsAppCenterProps {
  logs: LogPesanWhatsApp[];
  santriList: Santri[];
  pemasukanList: TransaksiPemasukan[];
  onAddLog: (log: Omit<LogPesanWhatsApp, 'id'>) => void;
  onResendLog: (log: LogPesanWhatsApp) => void;
  onDeleteLog: (id: string) => void;
  onTriggerFailedNotice: (log: LogPesanWhatsApp) => void;
}

export const WhatsAppCenter: React.FC<WhatsAppCenterProps> = ({
  logs,
  santriList,
  pemasukanList,
  onAddLog,
  onResendLog,
  onDeleteLog,
  onTriggerFailedNotice,
}) => {
  // Test Message Generator State
  const [targetPhone, setTargetPhone] = useState<string>('081234567890');
  const [targetName, setTargetName] = useState<string>('H. Ahmad Subarkah');
  const [customMessage, setCustomMessage] = useState<string>(
    `Assalamu'alaikum Bpk/Ibu Wali Santri MTQ Darul Abidin. Diberitahukan bahwa kuitansi pembayaran SPP ananda telah diterbitkan.`
  );
  const [selectedTrxId, setSelectedTrxId] = useState<string>('');

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('SEMUA');

  const phoneCheck = formatPhoneWA(targetPhone);

  // Analytics Metrics
  const totalSent = logs.filter(l => l.status === 'Terkirim' || l.status === 'Dibaca').length;
  const totalRead = logs.filter(l => l.status === 'Dibaca').length;
  const totalPending = logs.filter(l => l.status === 'Pending').length;
  const totalFailed = logs.filter(l => l.status === 'Gagal').length;

  const handleSendCustomMessage = () => {
    if (!phoneCheck.isValid) {
      alert(`Nomor WhatsApp tidak valid: ${phoneCheck.errorReason}`);
      return;
    }

    const newLog: Omit<LogPesanWhatsApp, 'id'> = {
      tanggal: new Date().toISOString().replace('T', ' ').substring(0, 16),
      nomorWa: phoneCheck.formatted,
      namaPenerima: targetName,
      transaksiId: selectedTrxId || undefined,
      pesan: customMessage,
      status: 'Terkirim',
      keterangan: 'Pesan dikirim via WhatsApp Web / Click to Chat',
    };

    onAddLog(newLog);

    // Open WhatsApp link
    const link = generateWaReceiptLink(phoneCheck.formatted, customMessage);
    window.open(link, '_blank');
  };

  const handleSelectTrxForTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const trxId = e.target.value;
    setSelectedTrxId(trxId);
    if (trxId) {
      const trx = pemasukanList.find(t => t.id === trxId);
      if (trx) {
        const santri = santriList.find(s => s.nis === trx.santriId);
        if (santri) {
          setTargetPhone(santri.noWaOrangTua);
          setTargetName(`${santri.namaOrangTua} (Wali ${santri.nama})`);
        } else {
          setTargetName(trx.namaPembayar);
        }
        setCustomMessage(generateWaReceiptText(trx, santri));
      }
    }
  };

  const filteredLogs = logs.filter(l => {
    const matchesSearch =
      l.namaPenerima.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.nomorWa.includes(searchTerm) ||
      l.pesan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'SEMUA' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
            WhatsApp Center & Dasbor Analitik Pesan
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Pantau status pengiriman kwitansi & pesan secara real-time, validasi nomor HP, serta kirim pesan pengingat ke wali santri.
          </p>
        </div>
      </div>

      {/* Real-Time Message Analytics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Pesan Terkirim</span>
            <span className="text-lg font-bold text-emerald-700 block mt-0.5">{totalSent}</span>
            <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">Berhasil ke WhatsApp</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Dibaca Wali</span>
            <span className="text-lg font-bold text-indigo-700 block mt-0.5">{totalRead}</span>
            <span className="text-[10px] text-indigo-600 font-medium block mt-0.5">Konfirmasi dibaca</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Eye className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Status Pending</span>
            <span className="text-lg font-bold text-amber-700 block mt-0.5">{totalPending}</span>
            <span className="text-[10px] text-amber-600 font-medium block mt-0.5">Dalam antrean</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Gagal Pengiriman</span>
            <span className="text-lg font-bold text-rose-700 block mt-0.5">{totalFailed}</span>
            <span className="text-[10px] text-rose-600 font-medium block mt-0.5">Notifikasi push aktif</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <XCircle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Kwitansi & Custom Message Generator Tool */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-2">
          <Send className="w-4 h-4 text-emerald-600" /> Generator & Pengirim Pesan WhatsApp Instant
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Pilih Transaksi Terakhir */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Ambil Template dari Transaksi</label>
            <select
              value={selectedTrxId}
              onChange={handleSelectTrxForTemplate}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800"
            >
              <option value="">-- Pilih Transaksi Pemasukan --</option>
              {pemasukanList.map(t => (
                <option key={t.id} value={t.id}>
                  {t.id} - {t.namaPembayar} ({t.kategori})
                </option>
              ))}
            </select>
          </div>

          {/* Nama Penerima */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Nama Wali / Penerima</label>
            <input
              type="text"
              value={targetName}
              onChange={e => setTargetName(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium"
            />
          </div>

          {/* No WA & Validasi */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">No. WhatsApp Target</label>
            <input
              type="text"
              value={targetPhone}
              onChange={e => setTargetPhone(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono font-medium"
            />
            <div className="mt-1">
              {phoneCheck.isValid ? (
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Valid WA: +{phoneCheck.formatted}
                </span>
              ) : (
                <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> {phoneCheck.errorReason}
                </span>
              )}
            </div>
          </div>

          {/* Template Text Area */}
          <div className="md:col-span-3">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Pesan Kwitansi / Konfirmasi WhatsApp</label>
            <textarea
              rows={5}
              value={customMessage}
              onChange={e => setCustomMessage(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs leading-relaxed focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={handleSendCustomMessage}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition-all shadow-xs"
          >
            <Send className="w-3.5 h-3.5 text-amber-300" />
            <span>Kirim Pesan Ke WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
              Riwayat & Log Pengiriman Pesan
            </h3>
            <p className="text-[11px] text-slate-500">Log aktivitas pengiriman kwitansi & pemberitahuan santri</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari penerima / pesan..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-7 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="SEMUA">Semua Status</option>
              <option value="Terkirim">Terkirim</option>
              <option value="Dibaca">Dibaca</option>
              <option value="Pending">Pending</option>
              <option value="Gagal">Gagal</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-y border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="px-3 py-2">Waktu Log</th>
                <th className="px-3 py-2">Penerima & Nomor</th>
                <th className="px-3 py-2">Ringkasan Pesan</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2 font-mono text-slate-500 text-[11px]">{l.tanggal}</td>
                    <td className="px-3 py-2">
                      <span className="font-bold text-slate-900 block">{l.namaPenerima}</span>
                      <span className="font-mono text-[10px] text-slate-500">+{l.nomorWa}</span>
                    </td>
                    <td className="px-3 py-2 max-w-xs truncate text-slate-700 text-[11px]">{l.pesan}</td>
                    <td className="px-3 py-2">
                      {l.status === 'Terkirim' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" /> Terkirim
                        </span>
                      )}
                      {l.status === 'Dibaca' && (
                        <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
                          <Eye className="w-3 h-3" /> Dibaca
                        </span>
                      )}
                      {l.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                      {l.status === 'Gagal' && (
                        <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
                          <XCircle className="w-3 h-3" /> Gagal
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onResendLog(l)}
                          className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                          title="Kirim Ulang Pesan"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDeleteLog(l.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Hapus Log"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">
                    Tidak ada log pengiriman pesan WhatsApp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
