export type KategoriPemasukan =
  | 'UDT'
  | 'INFAQ PENDAFTARAN'
  | 'Buku'
  | 'Wakaf Bangunan'
  | 'SPP Bulanan'
  | 'Infaq Kegiatan Hafidz Holiday'
  | 'Karantina Langit'
  | 'Infaq Donatur Tetap'
  | 'Kas Masuk Lainnya';

export type KategoriPengeluaran =
  | 'Gaji & Insentif Pengajar'
  | 'Operasional & Konsumsi Santri'
  | 'Pemeliharaan Bangunan & Fasilitas'
  | 'Program Hafidz Holiday'
  | 'Program Karantina Langit'
  | 'Pembelian Buku & Modul'
  | 'Kegiatan & Lomba Santri'
  | 'Pengeluaran Donatur Khusus'
  | 'Pengeluaran Lainnya';

export type SumberKas = 'Kas MTQ' | 'Kas Donatur';

export type MetodePembayaran = 'Tunai' | 'Transfer Bank' | 'Payment Gateway (QRIS/VA)';

export interface Santri {
  id: string;
  nis: string;
  nama: string;
  kelas: string;
  namaOrangTua: string;
  noWaOrangTua: string; // Formatted 628...
  status: 'Aktif' | 'Non-Aktif' | 'Alumni';
  tunggakanSppTahunLalu: number;
  kategoriSantri: 'Reguler' | 'Beasiswa' | 'Donatur Tetap';
  tanggalDaftar: string;
  alamat?: string;
}

export interface TransaksiPemasukan {
  id: string;
  tanggal: string; // YYYY-MM-DD
  santriId?: string; // NIS
  namaPembayar: string;
  kategori: KategoriPemasukan;
  nominal: number;
  sumberKas: SumberKas;
  metodePembayaran: MetodePembayaran;
  tahunAjaran: string; // e.g. "2025/2026" or "Tunggakan 2024/2025"
  bulanSpp?: string; // e.g. "Januari 2026"
  catatan: string;
  status: 'Lunas' | 'Pending' | 'Gagal';
  kwitansiTerkirim: boolean;
  referenceNumber?: string;
}

export interface TransaksiPengeluaran {
  id: string;
  tanggal: string;
  penerima: string;
  kategori: KategoriPengeluaran;
  nominal: number;
  sumberKas: SumberKas;
  catatan: string;
  petugas: string;
}

export interface LogPesanWhatsApp {
  id: string;
  tanggal: string;
  nomorWa: string;
  namaPenerima: string;
  transaksiId?: string;
  pesan: string;
  status: 'Terkirim' | 'Pending' | 'Gagal' | 'Dibaca';
  keterangan?: string;
}

export interface ToastNotice {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

export interface SummaryKas {
  totalKasMTQ: number;
  totalKasDonatur: number;
  totalPemasukanBulanIni: number;
  totalPengeluaranBulanIni: number;
  totalPemasukanTahunIni: number;
  totalPengeluaranTahunIni: number;
  totalTunggakanSpp: number;
}
