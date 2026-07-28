import { Santri, TransaksiPemasukan, TransaksiPengeluaran, LogPesanWhatsApp } from '../types';

export const initialSantriList: Santri[] = [
  {
    id: 'SNT-001',
    nis: '202601001',
    nama: 'Muhammad Al-Fatih',
    kelas: 'Tahfidz Ula A',
    namaOrangTua: 'H. Ahmad Subarkah',
    noWaOrangTua: '6281234567890',
    status: 'Aktif',
    tunggakanSppTahunLalu: 250000,
    kategoriSantri: 'Reguler',
    tanggalDaftar: '2025-07-10',
    alamat: 'Jl. Pemuda No. 12, Kota'
  },
  {
    id: 'SNT-002',
    nis: '202601002',
    nama: 'Aisyah Humaira',
    kelas: 'Tahfidz Ula B',
    namaOrangTua: 'Bpk. Ridwan Hakim',
    noWaOrangTua: '6281987654321',
    status: 'Aktif',
    tunggakanSppTahunLalu: 0,
    kategoriSantri: 'Reguler',
    tanggalDaftar: '2025-07-12',
    alamat: 'Komp. Darul Abidin Indah B-4'
  },
  {
    id: 'SNT-003',
    nis: '202601003',
    nama: 'Zaid bin Tsabit',
    kelas: 'Tahfidz Wustho',
    namaOrangTua: 'Ibu Sarah Amelia',
    noWaOrangTua: '6285712345678',
    status: 'Aktif',
    tunggakanSppTahunLalu: 500000,
    kategoriSantri: 'Beasiswa',
    tanggalDaftar: '2025-07-15',
    alamat: 'Jl. Merdeka No. 45'
  },
  {
    id: 'SNT-004',
    nis: '202601004',
    nama: 'Fatimah Az-Zahra',
    kelas: 'Karantina Langit',
    namaOrangTua: 'Bpk. Hendra Gunawan',
    noWaOrangTua: '6281311223344',
    status: 'Aktif',
    tunggakanSppTahunLalu: 0,
    kategoriSantri: 'Donatur Tetap',
    tanggalDaftar: '2025-08-01',
    alamat: 'Jl. Melati No. 8'
  },
  {
    id: 'SNT-005',
    nis: '202601005',
    nama: 'Abdullah Azzam',
    kelas: 'Hafidz Holiday',
    namaOrangTua: 'Bpk. Syarifuddin',
    noWaOrangTua: '6282199887766',
    status: 'Aktif',
    tunggakanSppTahunLalu: 0,
    kategoriSantri: 'Reguler',
    tanggalDaftar: '2025-12-20',
    alamat: 'Jl. Flamboyan No. 2'
  }
];

export const initialPemasukanList: TransaksiPemasukan[] = [
  {
    id: 'TRX-IN-2026-001',
    tanggal: '2026-07-01',
    santriId: '202601001',
    namaPembayar: 'Muhammad Al-Fatih (H. Ahmad Subarkah)',
    kategori: 'SPP Bulanan',
    nominal: 250000,
    sumberKas: 'Kas MTQ',
    metodePembayaran: 'Transfer Bank',
    tahunAjaran: '2026/2027',
    bulanSpp: 'Juli 2026',
    catatan: 'SPP Bulanan Juli 2026',
    status: 'Lunas',
    kwitansiTerkirim: true,
    referenceNumber: 'TRF-9821213'
  },
  {
    id: 'TRX-IN-2026-002',
    tanggal: '2026-07-02',
    santriId: '202601002',
    namaPembayar: 'Aisyah Humaira (Bpk. Ridwan Hakim)',
    kategori: 'SPP Bulanan',
    nominal: 250000,
    sumberKas: 'Kas MTQ',
    metodePembayaran: 'Tunai',
    tahunAjaran: '2026/2027',
    bulanSpp: 'Juli 2026',
    catatan: 'Pembayaran SPP Juli di kantor',
    status: 'Lunas',
    kwitansiTerkirim: true
  },
  {
    id: 'TRX-IN-2026-003',
    tanggal: '2026-07-05',
    santriId: '202601004',
    namaPembayar: 'Bpk. Hendra Gunawan',
    kategori: 'Infaq Donatur Tetap',
    nominal: 1500000,
    sumberKas: 'Kas Donatur',
    metodePembayaran: 'Transfer Bank',
    tahunAjaran: '2026/2027',
    catatan: 'Infaq donatur rutin operasional karantina',
    status: 'Lunas',
    kwitansiTerkirim: true,
    referenceNumber: 'TRF-554433'
  },
  {
    id: 'TRX-IN-2026-004',
    tanggal: '2026-07-10',
    santriId: '202601003',
    namaPembayar: 'Zaid bin Tsabit (Ibu Sarah)',
    kategori: 'Wakaf Bangunan',
    nominal: 1000000,
    sumberKas: 'Kas MTQ',
    metodePembayaran: 'Payment Gateway (QRIS/VA)',
    tahunAjaran: '2026/2027',
    catatan: 'Wakaf Pembangunan Ruang Hafalan',
    status: 'Lunas',
    kwitansiTerkirim: false,
    referenceNumber: 'QRIS-887712'
  },
  {
    id: 'TRX-IN-2026-005',
    tanggal: '2026-07-15',
    santriId: '202601001',
    namaPembayar: 'Muhammad Al-Fatih (H. Ahmad Subarkah)',
    kategori: 'SPP Bulanan',
    nominal: 250000,
    sumberKas: 'Kas MTQ',
    metodePembayaran: 'Transfer Bank',
    tahunAjaran: 'Tunggakan 2025/2026',
    bulanSpp: 'Juni 2026 (Pelunasan Tunggakan)',
    catatan: 'Pelunasan SPP Tunggakan Tahun Ajaran Lalu',
    status: 'Lunas',
    kwitansiTerkirim: true
  },
  {
    id: 'TRX-IN-2026-006',
    tanggal: '2026-07-20',
    santriId: '202601005',
    namaPembayar: 'Abdullah Azzam (Bpk. Syarifuddin)',
    kategori: 'Infaq Kegiatan Hafidz Holiday',
    nominal: 750000,
    sumberKas: 'Kas MTQ',
    metodePembayaran: 'Tunai',
    tahunAjaran: '2026/2027',
    catatan: 'Pendaftaran Program Hafidz Holiday',
    status: 'Lunas',
    kwitansiTerkirim: true
  }
];

export const initialPengeluaranList: TransaksiPengeluaran[] = [
  {
    id: 'TRX-OUT-2026-001',
    tanggal: '2026-07-05',
    penerima: 'Ustadz & Asatidz MTQ',
    kategori: 'Gaji & Insentif Pengajar',
    nominal: 1800000,
    sumberKas: 'Kas MTQ',
    petugas: 'Ustadz Mansur',
    catatan: 'Bisharah pengajar bulan Juli 2026'
  },
  {
    id: 'TRX-OUT-2026-002',
    tanggal: '2026-07-12',
    penerima: 'Katering Barokah Santri',
    kategori: 'Operasional & Konsumsi Santri',
    nominal: 650000,
    sumberKas: 'Kas Donatur',
    petugas: 'Siti Aminah',
    catatan: 'Konsumsi Program Karantina Langit Weekend'
  },
  {
    id: 'TRX-OUT-2026-003',
    tanggal: '2026-07-18',
    penerima: 'Toko Buku Islamil',
    kategori: 'Pembelian Buku & Modul',
    nominal: 350000,
    sumberKas: 'Kas MTQ',
    petugas: 'Ahmad Zakaria',
    catatan: 'Pembelian Mushaf Al-Qur\'an Tajwid Warna & Modul Mutaba\'ah'
  }
];

export const initialWaLogs: LogPesanWhatsApp[] = [
  {
    id: 'LOG-WA-001',
    tanggal: '2026-07-01 09:30',
    nomorWa: '6281234567890',
    namaPenerima: 'H. Ahmad Subarkah (Wali Al-Fatih)',
    transaksiId: 'TRX-IN-2026-001',
    pesan: 'Kwitansi Digital SPP Juli 2026 Rp 250.000',
    status: 'Terkirim',
    keterangan: 'Pesan berhasil terikirim melalui WA Web API'
  },
  {
    id: 'LOG-WA-002',
    tanggal: '2026-07-02 14:15',
    nomorWa: '6281987654321',
    namaPenerima: 'Bpk. Ridwan Hakim (Wali Aisyah)',
    transaksiId: 'TRX-IN-2026-002',
    pesan: 'Kwitansi Digital SPP Juli 2026 Rp 250.000',
    status: 'Dibaca',
    keterangan: 'Pesan telah dibaca wali santri'
  },
  {
    id: 'LOG-WA-003',
    tanggal: '2026-07-05 16:00',
    nomorWa: '6281311223344',
    namaPenerima: 'Bpk. Hendra Gunawan',
    transaksiId: 'TRX-IN-2026-003',
    pesan: 'Konfirmasi Infaq Donatur Tetap Rp 1.500.000',
    status: 'Terkirim',
    keterangan: 'Pesan konfirmasi donasi berhasil dikirim'
  }
];
