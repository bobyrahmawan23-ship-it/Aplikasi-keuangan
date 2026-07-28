import React, { useState } from 'react';
import { TransaksiPengeluaran, KategoriPengeluaran, SumberKas } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';
import {
  ArrowUpRight,
  PlusCircle,
  Search,
  Trash2,
  Calendar,
  UserCheck,
  DollarSign,
  FileText,
  Building,
  Wallet,
} from 'lucide-react';

interface InputPengeluaranProps {
  pengeluaranList: TransaksiPengeluaran[];
  onAddPengeluaran: (trx: Omit<TransaksiPengeluaran, 'id'>) => void;
  onDeletePengeluaran: (id: string) => void;
}

export const InputPengeluaran: React.FC<InputPengeluaranProps> = ({
  pengeluaranList,
  onAddPengeluaran,
  onDeletePengeluaran,
}) => {
  const [penerima, setPenerima] = useState<string>('');
  const [kategori, setKategori] = useState<KategoriPengeluaran>('Operasional & Konsumsi Santri');
  const [nominal, setNominal] = useState<string>('300000');
  const [sumberKas, setSumberKas] = useState<SumberKas>('Kas MTQ');
  const [petugas, setPetugas] = useState<string>('Ustadz Mansur');
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [catatan, setCatatan] = useState<string>('');

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterKas, setFilterKas] = useState<string>('SEMUA');

  const categories: KategoriPengeluaran[] = [
    'Gaji & Insentif Pengajar',
    'Operasional & Konsumsi Santri',
    'Pemeliharaan Bangunan & Fasilitas',
    'Program Hafidz Holiday',
    'Program Karantina Langit',
    'Pembelian Buku & Modul',
    'Kegiatan & Lomba Santri',
    'Pengeluaran Donatur Khusus',
    'Pengeluaran Lainnya',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!penerima.trim() || !nominal || Number(nominal) <= 0) {
      alert('Harap isi nama penerima dan nominal pengeluaran yang valid.');
      return;
    }

    onAddPengeluaran({
      tanggal,
      penerima,
      kategori,
      nominal: Number(nominal),
      sumberKas,
      petugas,
      catatan: catatan || `Pengeluaran ${kategori}`,
    });

    setPenerima('');
    setNominal('300000');
    setCatatan('');
  };

  const filteredList = pengeluaranList.filter(item => {
    const matchesSearch =
      item.penerima.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.catatan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKas = filterKas === 'SEMUA' || item.sumberKas === filterKas;
    return matchesSearch && matchesKas;
  });

  const totalPengeluaranMTQ = pengeluaranList.filter(i => i.sumberKas === 'Kas MTQ').reduce((a, b) => a + b.nominal, 0);
  const totalPengeluaranDonatur = pengeluaranList.filter(i => i.sumberKas === 'Kas Donatur').reduce((a, b) => a + b.nominal, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs md:col-span-1">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-rose-600 rounded-full" />
            Pengeluaran Kas MTQ
          </h2>
          <p className="text-[11px] text-slate-500 mt-1">
            Pencatatan pengeluaran operasional, gaji pengajar, konsumsi, dan program dari Kas MTQ maupun Kas Donatur.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Pengeluaran Kas MTQ</span>
            <span className="text-lg font-bold text-rose-600">{formatRupiah(totalPengeluaranMTQ)}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Wallet className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Pengeluaran Kas Donatur</span>
            <span className="text-lg font-bold text-amber-700">{formatRupiah(totalPengeluaranDonatur)}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Building className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Input Form Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-rose-600" /> Input Pengeluaran Baru
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Tanggal */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Tanggal Pengeluaran <span className="text-rose-500">*</span>
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

            {/* Nama Penerima / Toko */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nama Penerima / Toko / Ustadz <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Ustadz Mansur / Katering Barokah / Toko Bangunan"
                value={penerima}
                onChange={e => setPenerima(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                required
              />
            </div>

            {/* Kategori Pengeluaran */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Kategori Pengeluaran <span className="text-rose-500">*</span>
              </label>
              <select
                value={kategori}
                onChange={e => setKategori(e.target.value as KategoriPengeluaran)}
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
                Nominal (Rp) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="300000"
                  value={nominal}
                  onChange={e => setNominal(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-rose-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  required
                />
                <DollarSign className="w-3.5 h-3.5 text-rose-600 absolute left-2.5 top-2" />
              </div>
            </div>

            {/* Sumber Kas Pengeluaran */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Sumber Kas <span className="text-rose-500">*</span>
              </label>
              <select
                value={sumberKas}
                onChange={e => setSumberKas(e.target.value as SumberKas)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium"
              >
                <option value="Kas MTQ">Kas MTQ (Operasional Utama)</option>
                <option value="Kas Donatur">Kas Donatur (Khusus Dana Donatur)</option>
              </select>
            </div>

            {/* Petugas Pengeluar */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Nama Petugas Penanggungjawab</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nama Bendahara / Petugas"
                  value={petugas}
                  onChange={e => setPetugas(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium"
                />
                <UserCheck className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              </div>
            </div>

            {/* Catatan / Keperluan */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Keterangan / Keperluan Lengkap</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Contoh: Pembelian bahan makanan santri karantina weekend"
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
              className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition-all shadow-xs active:scale-95"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-200" />
              <span>Simpan Pengeluaran Kas</span>
            </button>
          </div>
        </form>
      </div>

      {/* Expense History Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-rose-600 rounded-full" />
              Daftar Transaksi Pengeluaran Kas
            </h3>
            <p className="text-[11px] text-slate-500">Riwayat pencatatan kas keluar MTQ Darul Abidin</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative min-w-[180px]">
              <input
                type="text"
                placeholder="Cari penerima / keperluan..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-7 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>

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

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-y border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="px-3 py-2">ID / Tanggal</th>
                <th className="px-3 py-2">Penerima / Toko</th>
                <th className="px-3 py-2">Kategori Pengeluaran</th>
                <th className="px-3 py-2">Nominal</th>
                <th className="px-3 py-2">Sumber Kas</th>
                <th className="px-3 py-2">Petugas</th>
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
                    <td className="px-3 py-2 font-semibold text-slate-900">{item.penerima}</td>
                    <td className="px-3 py-2">
                      <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                        {item.kategori}
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{item.catatan}</span>
                    </td>
                    <td className="px-3 py-2 font-bold text-rose-700">{formatRupiah(item.nominal)}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase ${item.sumberKas === 'Kas MTQ' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                        {item.sumberKas}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-600 text-[11px]">{item.petugas}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => onDeletePengeluaran(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all"
                        title="Hapus Transaksi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Belum ada data transaksi pengeluaran.
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
