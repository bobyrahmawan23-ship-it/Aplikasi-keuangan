import React, { useState } from 'react';
import { TransaksiPemasukan, KategoriPemasukan, SumberKas, MetodePembayaran, Santri } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';
import {
  PlusCircle,
  Search,
  Filter,
  Send,
  Trash2,
  Calendar,
  User,
  CreditCard,
  FileText,
  DollarSign,
  QrCode,
  CheckCircle2,
  Edit3,
  X,
  Check,
} from 'lucide-react';

interface InputPemasukanProps {
  pemasukanList: TransaksiPemasukan[];
  santriList: Santri[];
  onAddPemasukan: (trx: Omit<TransaksiPemasukan, 'id' | 'kwitansiTerkirim'>) => void;
  onUpdatePemasukan?: (trx: TransaksiPemasukan) => void;
  onDeletePemasukan: (id: string) => void;
  onOpenWaReceipt: (trx: TransaksiPemasukan) => void;
  onOpenGatewayModal: () => void;
}

export const InputPemasukan: React.FC<InputPemasukanProps> = ({
  pemasukanList,
  santriList,
  onAddPemasukan,
  onUpdatePemasukan,
  onDeletePemasukan,
  onOpenWaReceipt,
  onOpenGatewayModal,
}) => {
  const [selectedSantriNis, setSelectedSantriNis] = useState<string>('');
  const [namaPembayar, setNamaPembayar] = useState<string>('');
  const [kategori, setKategori] = useState<KategoriPemasukan>('SPP Bulanan');
  const [nominal, setNominal] = useState<string>('');
  const [sumberKas, setSumberKas] = useState<SumberKas>('Kas MTQ');
  const [metodePembayaran, setMetodePembayaran] = useState<MetodePembayaran>('Transfer Bank');
  const [tahunAjaran, setTahunAjaran] = useState<string>('2026/2027');
  const [bulanSpp, setBulanSpp] = useState<string>('Juli 2026');
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [catatan, setCatatan] = useState<string>('');

  // Editing state for existing transaction
  const [editingTrx, setEditingTrx] = useState<TransaksiPemasukan | null>(null);
  const [editTanggal, setEditTanggal] = useState<string>('');
  const [editNamaPembayar, setEditNamaPembayar] = useState<string>('');
  const [editSantriId, setEditSantriId] = useState<string>('');
  const [editKategori, setEditKategori] = useState<KategoriPemasukan>('SPP Bulanan');
  const [editNominal, setEditNominal] = useState<string>('');
  const [editSumberKas, setEditSumberKas] = useState<SumberKas>('Kas MTQ');
  const [editMetode, setEditMetode] = useState<MetodePembayaran>('Transfer Bank');
  const [editTahunAjaran, setEditTahunAjaran] = useState<string>('2026/2027');
  const [editBulanSpp, setEditBulanSpp] = useState<string>('');
  const [editStatus, setEditStatus] = useState<'Lunas' | 'Pending' | 'Gagal'>('Lunas');
  const [editCatatan, setEditCatatan] = useState<string>('');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterKategori, setFilterKategori] = useState<string>('SEMUA');
  const [filterKas, setFilterKas] = useState<string>('SEMUA');

  const categories: KategoriPemasukan[] = [
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

  // Auto-fill student name when student is selected from dropdown
  const handleSantriSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nis = e.target.value;
    setSelectedSantriNis(nis);
    if (nis) {
      const s = santriList.find(item => item.nis === nis);
      if (s) {
        setNamaPembayar(`${s.nama} (${s.namaOrangTua})`);
        if (s.tunggakanSppTahunLalu > 0 && kategori === 'SPP Bulanan') {
          setTahunAjaran('Tunggakan 2025/2026');
        }
        if (s.nominalSpp && s.nominalSpp > 0) {
          setNominal(s.nominalSpp.toString());
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPembayar.trim() || !nominal || Number(nominal) <= 0) {
      alert('Harap isi nama pembayar dan nominal yang valid.');
      return;
    }

    onAddPemasukan({
      tanggal,
      santriId: selectedSantriNis || undefined,
      namaPembayar,
      kategori,
      nominal: Number(nominal),
      sumberKas,
      metodePembayaran,
      tahunAjaran,
      bulanSpp: kategori === 'SPP Bulanan' ? bulanSpp : undefined,
      catatan: catatan || `Pembayaran ${kategori}`,
      status: 'Lunas',
    });

    // Reset form - NO hardcoded 250000
    setNominal('');
    setCatatan('');
  };

  // Open Edit Modal for a past transaction
  const handleOpenEditTrx = (trx: TransaksiPemasukan) => {
    setEditingTrx(trx);
    setEditTanggal(trx.tanggal);
    setEditNamaPembayar(trx.namaPembayar);
    setEditSantriId(trx.santriId || '');
    setEditKategori(trx.kategori);
    setEditNominal(trx.nominal.toString());
    setEditSumberKas(trx.sumberKas);
    setEditMetode(trx.metodePembayaran);
    setEditTahunAjaran(trx.tahunAjaran);
    setEditBulanSpp(trx.bulanSpp || '');
    setEditStatus(trx.status);
    setEditCatatan(trx.catatan);
  };

  const handleSaveEditTrx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrx || !onUpdatePemasukan) return;

    if (!editNamaPembayar.trim() || !editNominal || Number(editNominal) <= 0) {
      alert('Harap isi nama pembayar dan nominal yang valid.');
      return;
    }

    onUpdatePemasukan({
      ...editingTrx,
      tanggal: editTanggal,
      namaPembayar: editNamaPembayar,
      santriId: editSantriId || undefined,
      kategori: editKategori,
      nominal: Number(editNominal),
      sumberKas: editSumberKas,
      metodePembayaran: editMetode,
      tahunAjaran: editTahunAjaran,
      bulanSpp: editBulanSpp || undefined,
      status: editStatus,
      catatan: editCatatan,
    });

    setEditingTrx(null);
  };

  const filteredList = pemasukanList.filter(item => {
    const matchesSearch =
      item.namaPembayar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.santriId && item.santriId.includes(searchTerm));
    const matchesKategori = filterKategori === 'SEMUA' || item.kategori === filterKategori;
    const matchesKas = filterKas === 'SEMUA' || item.sumberKas === filterKas;
    return matchesSearch && matchesKategori && matchesKas;
  });

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Form Penginputan Pemasukan Kas</h2>
          <p className="text-xs text-slate-500">
            Catat penerimaan SPP, infaq, wakaf, UDT, dan donasi santri. Kwitansi WhatsApp otomatis siap dikirim.
          </p>
        </div>
        <button
          onClick={onOpenGatewayModal}
          className="bg-indigo-900 hover:bg-indigo-800 text-amber-300 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 border border-indigo-700 shadow-xs"
        >
          <QrCode className="w-3.5 h-3.5 text-amber-400" />
          <span>Simulasi Gateway QRIS / VA</span>
        </button>
      </div>

      {/* Input Form Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-indigo-600" /> Input Pemasukan Baru
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Tanggal */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Tanggal Transaksi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={tanggal}
                  onChange={e => setTanggal(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                  required
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              </div>
            </div>

            {/* Pilih Santri (Optional) */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Pilih Santri Terdaftar (Opsional)</label>
              <div className="relative">
                <select
                  value={selectedSantriNis}
                  onChange={handleSantriSelect}
                  className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                >
                  <option value="">-- Pilih Santri (Atau Manual Di Bawah) --</option>
                  {santriList.map(s => (
                    <option key={s.id} value={s.nis}>
                      {s.nis} - {s.nama} ({s.kelas})
                    </option>
                  ))}
                </select>
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              </div>
            </div>

            {/* Nama Pembayar / Donatur */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nama Santri / Donatur <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Muhammad Al-Fatih / Bpk. Ahmad"
                value={namaPembayar}
                onChange={e => setNamaPembayar(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                required
              />
            </div>

            {/* Kategori Pembayaran */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Kategori Pembayaran <span className="text-rose-500">*</span>
              </label>
              <select
                value={kategori}
                onChange={e => setKategori(e.target.value as KategoriPemasukan)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white font-bold text-slate-800"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Nominal */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nominal Pembayaran (Rp) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Masukkan nominal (cth: 300000)"
                  value={nominal}
                  onChange={e => setNominal(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  required
                />
                <DollarSign className="w-3.5 h-3.5 text-indigo-600 absolute left-2.5 top-2" />
              </div>
            </div>

            {/* Sumber Kas Tujuan */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Sumber Kas Tujuan <span className="text-rose-500">*</span>
              </label>
              <select
                value={sumberKas}
                onChange={e => setSumberKas(e.target.value as SumberKas)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium"
              >
                <option value="Kas MTQ">Kas MTQ (Operasional Utama)</option>
                <option value="Kas Donatur">Kas Donatur (Khusus Infaq Donatur)</option>
              </select>
            </div>

            {/* Metode Pembayaran */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Metode Pembayaran</label>
              <div className="relative">
                <select
                  value={metodePembayaran}
                  onChange={e => setMetodePembayaran(e.target.value as MetodePembayaran)}
                  className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium"
                >
                  <option value="Tunai">Tunai / Cash</option>
                  <option value="Transfer Bank">Transfer Bank / Mobile Banking</option>
                  <option value="Payment Gateway (QRIS/VA)">Payment Gateway (QRIS / Virtual Account)</option>
                </select>
                <CreditCard className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              </div>
            </div>

            {/* Tahun Ajaran */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Tahun Ajaran / Periode</label>
              <select
                value={tahunAjaran}
                onChange={e => setTahunAjaran(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium"
              >
                <option value="2026/2027">Tahun Ajaran 2026/2027 (Berjalan)</option>
                <option value="Tunggakan 2025/2026">Tunggakan SPP TA 2025/2026</option>
                <option value="2025/2026">Tahun Ajaran 2025/2026</option>
              </select>
            </div>

            {/* Bulan SPP (if SPP) */}
            {kategori === 'SPP Bulanan' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Bulan SPP</label>
                <input
                  type="text"
                  placeholder="Contoh: Juli 2026 / Agustus 2026"
                  value={bulanSpp}
                  onChange={e => setBulanSpp(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium"
                />
              </div>
            )}

            {/* Catatan */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Catatan / Keterangan</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Contoh: Titipan wali santri via transfer / Karantina Langit"
                  value={catatan}
                  onChange={e => setCatatan(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium"
                />
                <FileText className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition-all shadow-xs active:scale-95"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Simpan Transaksi Pemasukan</span>
            </button>
          </div>
        </form>
      </div>

      {/* Transactions Table & Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
              Daftar Transaksi Pemasukan Kas
            </h3>
            <p className="text-[11px] text-slate-500">Riwayat pencatatan kas masuk MTQ Darul Abidin</p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative min-w-[160px]">
              <input
                type="text"
                placeholder="Cari nama/NIS/ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-7 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>

            <select
              value={filterKategori}
              onChange={e => setFilterKategori(e.target.value)}
              className="py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="SEMUA">Semua Kategori</option>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={filterKas}
              onChange={e => setFilterKas(e.target.value)}
              className="py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="SEMUA">Semua Kas</option>
              <option value="Kas MTQ">Kas MTQ</option>
              <option value="Kas Donatur">Kas Donatur</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-y border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="px-3 py-2">ID / Tanggal</th>
                <th className="px-3 py-2">Nama Santri / Donatur</th>
                <th className="px-3 py-2">Kategori & Periode</th>
                <th className="px-3 py-2">Nominal</th>
                <th className="px-3 py-2">Kas & Metode</th>
                <th className="px-3 py-2 text-center">Kwitansi WA</th>
                <th className="px-3 py-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredList.length > 0 ? (
                filteredList.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2 font-mono text-slate-600 text-[11px]">
                      <span className="font-bold text-slate-800 block">{item.id}</span>
                      <span className="text-[10px] text-slate-400">{formatDateIndo(item.tanggal)}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="font-semibold text-slate-900 block">{item.namaPembayar}</span>
                      {item.santriId && <span className="text-[10px] text-slate-500 font-mono">NIS: {item.santriId}</span>}
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                        {item.kategori}
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {item.tahunAjaran} {item.bulanSpp ? `(${item.bulanSpp})` : ''}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-bold text-slate-900">{formatRupiah(item.nominal)}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase ${item.sumberKas === 'Kas MTQ' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                        {item.sumberKas}
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{item.metodePembayaran}</span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => onOpenWaReceipt(item)}
                        className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white font-bold px-2 py-1 rounded text-[10px] uppercase transition-all shadow-xs"
                      >
                        <Send className="w-3 h-3" />
                        <span>Kirim WA</span>
                      </button>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditTrx(item)}
                          className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all"
                          title="Edit Transaksi (Nominal, Tanggal, Status)"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeletePemasukan(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all"
                          title="Hapus Transaksi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Tidak ada data transaksi pemasukan yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit Transaksi / Santri Lunas */}
      {editingTrx && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  Edit Transaksi & Data Lunas
                </h3>
                <p className="text-[11px] text-indigo-200 mt-0.5">
                  ID Transaksi: <span className="font-mono font-bold text-white">{editingTrx.id}</span>
                </p>
              </div>
              <button
                onClick={() => setEditingTrx(null)}
                className="text-indigo-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditTrx} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={editTanggal}
                    onChange={e => setEditTanggal(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Status Pembayaran</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as 'Lunas' | 'Pending' | 'Gagal')}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-indigo-900"
                  >
                    <option value="Lunas">✓ Lunas</option>
                    <option value="Pending">⏳ Pending</option>
                    <option value="Gagal">✕ Gagal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Nama Pembayar / Santri</label>
                <input
                  type="text"
                  value={editNamaPembayar}
                  onChange={e => setEditNamaPembayar(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Kategori</label>
                  <select
                    value={editKategori}
                    onChange={e => setEditKategori(e.target.value as KategoriPemasukan)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    value={editNominal}
                    onChange={e => setEditNominal(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-indigo-900"
                    placeholder="Masukkan nominal"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Tahun Ajaran</label>
                  <input
                    type="text"
                    value={editTahunAjaran}
                    onChange={e => setEditTahunAjaran(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Bulan SPP (Jika Ada)</label>
                  <input
                    type="text"
                    value={editBulanSpp}
                    onChange={e => setEditBulanSpp(e.target.value)}
                    placeholder="Contoh: Juli 2026"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Sumber Kas</label>
                  <select
                    value={editSumberKas}
                    onChange={e => setEditSumberKas(e.target.value as SumberKas)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Kas MTQ">Kas MTQ</option>
                    <option value="Kas Donatur">Kas Donatur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Metode Pembayaran</label>
                  <select
                    value={editMetode}
                    onChange={e => setEditMetode(e.target.value as MetodePembayaran)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Transfer Bank">Transfer Bank</option>
                    <option value="Tunai">Tunai</option>
                    <option value="Payment Gateway (QRIS/VA)">Payment Gateway (QRIS/VA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Catatan / Keterangan</label>
                <textarea
                  value={editCatatan}
                  onChange={e => setEditCatatan(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  placeholder="Keterangan pembayaran..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingTrx(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
