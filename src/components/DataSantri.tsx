import React, { useState } from 'react';
import { Santri } from '../types';
import { formatRupiah, formatPhoneWA } from '../utils/formatters';
import {
  UserPlus,
  Search,
  Edit3,
  Trash2,
  Phone,
  CheckCircle2,
  AlertTriangle,
  User,
  Users,
  Send,
  X,
  CreditCard,
} from 'lucide-react';

interface DataSantriProps {
  santriList: Santri[];
  onAddSantri: (santri: Omit<Santri, 'id'>) => void;
  onUpdateSantri: (santri: Santri) => void;
  onDeleteSantri: (id: string) => void;
  onSelectSantriForControlCard: (santri: Santri) => void;
  onSendWaNotice: (phone: string, text: string, name: string) => void;
}

export const DataSantri: React.FC<DataSantriProps> = ({
  santriList,
  onAddSantri,
  onUpdateSantri,
  onDeleteSantri,
  onSelectSantriForControlCard,
  onSendWaNotice,
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingSantri, setEditingSantri] = useState<Santri | null>(null);

  // Form State
  const [nis, setNis] = useState<string>('');
  const [nama, setNama] = useState<string>('');
  const [kelas, setKelas] = useState<string>('Tahfidz Ula A');
  const [namaOrangTua, setNamaOrangTua] = useState<string>('');
  const [noWaOrangTua, setNoWaOrangTua] = useState<string>('');
  const [status, setStatus] = useState<'Aktif' | 'Non-Aktif' | 'Alumni'>('Aktif');
  const [tunggakanSppTahunLalu, setTunggakanSppTahunLalu] = useState<string>('0');
  const [nominalSpp, setNominalSpp] = useState<string>('');
  const [kategoriSantri, setKategoriSantri] = useState<'Reguler' | 'Beasiswa' | 'Donatur Tetap'>('Reguler');
  const [alamat, setAlamat] = useState<string>('');

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterKelas, setFilterKelas] = useState<string>('SEMUA');
  const [filterTunggakan, setFilterTunggakan] = useState<string>('SEMUA');

  // Phone Format Validation State
  const phoneValidation = formatPhoneWA(noWaOrangTua);

  const resetForm = () => {
    setNis(`20260100${santriList.length + 1}`);
    setNama('');
    setKelas('Tahfidz Ula A');
    setNamaOrangTua('');
    setNoWaOrangTua('0812');
    setStatus('Aktif');
    setTunggakanSppTahunLalu('0');
    setNominalSpp('');
    setKategoriSantri('Reguler');
    setAlamat('');
    setEditingSantri(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (s: Santri) => {
    setEditingSantri(s);
    setNis(s.nis);
    setNama(s.nama);
    setKelas(s.kelas);
    setNamaOrangTua(s.namaOrangTua);
    setNoWaOrangTua(s.noWaOrangTua);
    setStatus(s.status);
    setTunggakanSppTahunLalu(s.tunggakanSppTahunLalu.toString());
    setNominalSpp(s.nominalSpp ? s.nominalSpp.toString() : '');
    setKategoriSantri(s.kategoriSantri);
    setAlamat(s.alamat || '');
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !nis.trim() || !namaOrangTua.trim()) {
      alert('Harap lengkapi data NIS, Nama Santri, dan Nama Orang Tua.');
      return;
    }

    if (!phoneValidation.isValid) {
      alert(`Format nomor WhatsApp tidak valid: ${phoneValidation.errorReason}`);
      return;
    }

    if (editingSantri) {
      onUpdateSantri({
        ...editingSantri,
        nis,
        nama,
        kelas,
        namaOrangTua,
        noWaOrangTua: phoneValidation.formatted,
        status,
        tunggakanSppTahunLalu: Number(tunggakanSppTahunLalu),
        nominalSpp: nominalSpp ? Number(nominalSpp) : undefined,
        kategoriSantri,
        alamat,
      });
    } else {
      onAddSantri({
        nis,
        nama,
        kelas,
        namaOrangTua,
        noWaOrangTua: phoneValidation.formatted,
        status,
        tunggakanSppTahunLalu: Number(tunggakanSppTahunLalu),
        nominalSpp: nominalSpp ? Number(nominalSpp) : undefined,
        kategoriSantri,
        tanggalDaftar: new Date().toISOString().split('T')[0],
        alamat,
      });
    }

    setShowAddModal(false);
    resetForm();
  };

  const filteredList = santriList.filter(s => {
    const matchesSearch =
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nis.includes(searchTerm) ||
      s.namaOrangTua.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKelas = filterKelas === 'SEMUA' || s.kelas === filterKelas;
    const matchesTunggakan =
      filterTunggakan === 'SEMUA' ||
      (filterTunggakan === 'ADA_TUNGGAKAN' && s.tunggakanSppTahunLalu > 0) ||
      (filterTunggakan === 'LUNAS' && s.tunggakanSppTahunLalu === 0);
    return matchesSearch && matchesKelas && matchesTunggakan;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
            Data Santri & Kontak Wali (Sistem Manajemen Kontak)
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Kelola data santri baru, hapus santri lama, validasi format nomor WA orang tua, dan pantau tunggakan SPP tahun lalu.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-3.5 py-2 rounded-lg text-xs flex items-center gap-2 transition-all shadow-xs active:scale-95 shrink-0"
        >
          <UserPlus className="w-3.5 h-3.5 text-amber-300" />
          <span>+ Tambah Santri Baru</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Cari nama santri, NIS, atau wali..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterKelas}
              onChange={e => setFilterKelas(e.target.value)}
              className="py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="SEMUA">Semua Kelas</option>
              <option value="Tahfidz Ula A">Tahfidz Ula A</option>
              <option value="Tahfidz Ula B">Tahfidz Ula B</option>
              <option value="Tahfidz Wustho">Tahfidz Wustho</option>
              <option value="Karantina Langit">Karantina Langit</option>
              <option value="Hafidz Holiday">Hafidz Holiday</option>
            </select>

            <select
              value={filterTunggakan}
              onChange={e => setFilterTunggakan(e.target.value)}
              className="py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="SEMUA">Semua Status SPP</option>
              <option value="ADA_TUNGGAKAN">Ada Tunggakan TA Lalu</option>
              <option value="LUNAS">Lunas / Tanpa Tunggakan</option>
            </select>
          </div>
        </div>

        {/* Santri Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-y border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="px-3 py-2">NIS & Santri</th>
                <th className="px-3 py-2">Kelas & Status</th>
                <th className="px-3 py-2">Wali Santri & WA</th>
                <th className="px-3 py-2">Kategori</th>
                <th className="px-3 py-2">Tunggakan TA Lalu</th>
                <th className="px-3 py-2 text-center">Kartu Kendali</th>
                <th className="px-3 py-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredList.length > 0 ? (
                filteredList.map(s => {
                  const phoneCheck = formatPhoneWA(s.noWaOrangTua);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-2">
                        <span className="font-bold text-slate-900 block">{s.nama}</span>
                        <span className="text-[10px] text-slate-500 font-mono">NIS: {s.nis}</span>
                      </td>
                      <td className="px-3 py-2">
                        <span className="font-semibold text-slate-800 block">{s.kelas}</span>
                        <span className={`inline-flex px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${s.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className="font-semibold text-slate-900 block">{s.namaOrangTua}</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span className="font-mono text-[11px] text-slate-700">+{phoneCheck.formatted}</span>
                          {phoneCheck.isValid ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" title="Format WA Valid" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 text-amber-500" title="Format WA Perlu Diperbaiki" />
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                          {s.kategoriSantri}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        {s.tunggakanSppTahunLalu > 0 ? (
                          <span className="font-bold text-rose-600 block">
                            {formatRupiah(s.tunggakanSppTahunLalu)}
                            <span className="text-[9px] font-semibold uppercase text-rose-500 block">Menunggak TA Lalu</span>
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-bold text-[11px]">Lunas (Rp 0)</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => onSelectSantriForControlCard(s)}
                          className="inline-flex items-center gap-1 bg-indigo-900 hover:bg-indigo-800 text-white font-bold px-2 py-1 rounded text-[10px] uppercase transition-all shadow-xs"
                        >
                          <CreditCard className="w-3 h-3 text-amber-400" />
                          <span>Kartu</span>
                        </button>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() =>
                              onSendWaNotice(
                                s.noWaOrangTua,
                                `Assalamu'alaikum Bpk/Ibu ${s.namaOrangTua}, wali dari ananda ${s.nama} (${s.kelas}). Diberitahukan infaq SPP ananda...`,
                                s.namaOrangTua
                              )
                            }
                            className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                            title="Kirim WA Pengingat"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(s)}
                            className="p-1 text-slate-500 hover:text-indigo-700 hover:bg-slate-100 rounded"
                            title="Edit Santri"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteSantri(s.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            title="Hapus Santri"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Tidak ada data santri ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Santri Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                {editingSantri ? 'Edit Data Santri' : 'Tambah Data Santri Baru'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">NIS Santri *</label>
                  <input
                    type="text"
                    value={nis}
                    onChange={e => setNis(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Nama Lengkap Santri *</label>
                  <input
                    type="text"
                    placeholder="Muhammad Al-Fatih"
                    value={nama}
                    onChange={e => setNama(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Kelas / Kelompok *</label>
                  <select
                    value={kelas}
                    onChange={e => setKelas(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800"
                  >
                    <option value="Tahfidz Ula A">Tahfidz Ula A</option>
                    <option value="Tahfidz Ula B">Tahfidz Ula B</option>
                    <option value="Tahfidz Wustho">Tahfidz Wustho</option>
                    <option value="Karantina Langit">Karantina Langit</option>
                    <option value="Hafidz Holiday">Hafidz Holiday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Status Santri</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Non-Aktif">Non-Aktif</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Nama Orang Tua / Wali *</label>
                  <input
                    type="text"
                    placeholder="H. Ahmad Subarkah"
                    value={namaOrangTua}
                    onChange={e => setNamaOrangTua(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">No. WhatsApp Wali *</label>
                  <input
                    type="text"
                    placeholder="081234567890"
                    value={noWaOrangTua}
                    onChange={e => setNoWaOrangTua(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono font-medium"
                    required
                  />
                  {noWaOrangTua && (
                    <div className="mt-1 flex items-center gap-1 text-[10px]">
                      {phoneValidation.isValid ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Formatted: +{phoneValidation.formatted}
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {phoneValidation.errorReason}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Kategori Santri</label>
                  <select
                    value={kategoriSantri}
                    onChange={e => setKategoriSantri(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800"
                  >
                    <option value="Reguler">Reguler</option>
                    <option value="Beasiswa">Beasiswa</option>
                    <option value="Donatur Tetap">Donatur Tetap</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Tunggakan SPP Tahun Lalu (Rp)</label>
                  <input
                    type="number"
                    value={tunggakanSppTahunLalu}
                    onChange={e => setTunggakanSppTahunLalu(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-rose-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Tarif SPP Bulanan Khusus Santri Ini (Rp) - Opsional
                </label>
                <input
                  type="number"
                  placeholder="Kosongkan jika mengikuti tarif umum / gratis"
                  value={nominalSpp}
                  onChange={e => setNominalSpp(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-indigo-900"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Nominal ini akan otomatis terbaca di form kas masuk dan kartu SPP santri ini.
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Alamat Lengkap</label>
                <input
                  type="text"
                  placeholder="Jl. Pemuda No. 12"
                  value={alamat}
                  onChange={e => setAlamat(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div className="pt-2.5 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-4 py-1.5 rounded-lg text-xs shadow-xs"
                >
                  {editingSantri ? 'Simpan Perubahan' : 'Tambah Santri'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
