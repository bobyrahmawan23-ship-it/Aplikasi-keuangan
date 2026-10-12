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
  nominalSpp?: number;
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

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  role: 'Bendahara Keuangan' | 'Pimpinan MTQ' | 'Staf Administrasi';
  avatar: string;
}

export interface ReminderTemplate {
  id: string;
  title: string;
  category: 'santun' | 'islami' | 'kompak' | 'puitis' | 'tempo' | 'awal_bulan';
  badge: string;
  badgeColor: string;
  template: (data: {
    bulan: string;
    jatuhTempo: string;
    nominal: string;
    noRekBSI: string;
    noRekBRI: string;
    atasNama: string;
    kontakBendahara: string;
  }) => string;
}

export interface KartuSppConfig {
  namaLembaga: string; // e.g. "MAHAD TAHFIDZ QUR'AN DARUL ABIDIN"
  subJudulLembaga: string; // e.g. "Lembaga Pendidikan Al-Qur'an & Pembinaan Karakter"
  judulKartu: string; // e.g. "KARTU KENDALI PEMBAYARAN SPP SANTRI"
  tahunAjaran: string; // e.g. "2026/2027"
  nominalSppBulanan: number; // Editable monthly SPP tariff, no hardcoded 250k
  namaBendahara: string; // e.g. "Ustadz H. Ahmad Dahlan, S.Pd.I"
  jabatanBendahara: string; // e.g. "Bendahara Keuangan Mahad"
  nipBendahara: string; // e.g. "NIP/ID: DA-BND-2026"
  teksStempel: string; // e.g. "MAHAD TAHFIDZ QUR'AN DARUL ABIDIN"
  tanggalValidasi: string; // YYYY-MM-DD
  catatanKartu: string; // Additional card footer notes
  nomorRekeningInfo: string; // Bank account info
}

