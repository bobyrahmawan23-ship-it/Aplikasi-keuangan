import React, { useState, useEffect } from 'react';
import {
  Santri,
  TransaksiPemasukan,
  TransaksiPengeluaran,
  LogPesanWhatsApp,
  SummaryKas,
  ToastNotice,
  AuthUser,
} from './types';
import { initialSantriList, initialPemasukanList, initialPengeluaranList, initialWaLogs } from './data/initialData';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { InputPemasukan } from './components/InputPemasukan';
import { InputPengeluaran } from './components/InputPengeluaran';
import { DataSantri } from './components/DataSantri';
import { KartuKendali } from './components/KartuKendali';
import { PenerbitanKartuSppGambar } from './components/PenerbitanKartuSppGambar';
import { PengingatSppDashboard } from './components/PengingatSppDashboard';
import { RekapLaporan } from './components/RekapLaporan';
import { WhatsAppCenter } from './components/WhatsAppCenter';
import { PanduanSpreadsheet } from './components/PanduanSpreadsheet';
import { ToastNotification } from './components/ToastNotification';
import { KwitansiModal } from './components/KwitansiModal';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { InstallPwaModal } from './components/InstallPwaModal';
import { LoginScreen, defaultUsers } from './components/LoginScreen';
import { generateWaReceiptText, generateWaReceiptLink, formatPhoneWA } from './utils/formatters';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('mtq_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultUsers[0];
      }
    }
    return defaultUsers[0]; // Default logged-in as Bendahara
  });

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Load state from localStorage or initialSeed

  const [santriList, setSantriList] = useState<Santri[]>(() => {
    const saved = localStorage.getItem('mtq_santri_list');
    return saved ? JSON.parse(saved) : initialSantriList;
  });

  const [pemasukanList, setPemasukanList] = useState<TransaksiPemasukan[]>(() => {
    const saved = localStorage.getItem('mtq_pemasukan_list');
    return saved ? JSON.parse(saved) : initialPemasukanList;
  });

  const [pengeluaranList, setPengeluaranList] = useState<TransaksiPengeluaran[]>(() => {
    const saved = localStorage.getItem('mtq_pengeluaran_list');
    return saved ? JSON.parse(saved) : initialPengeluaranList;
  });

  const [waLogs, setWaLogs] = useState<LogPesanWhatsApp[]>(() => {
    const saved = localStorage.getItem('mtq_wa_logs');
    return saved ? JSON.parse(saved) : initialWaLogs;
  });

  const [toasts, setToasts] = useState<ToastNotice[]>([]);
  const [selectedSantriForCard, setSelectedSantriForCard] = useState<Santri | null>(null);
  const [kwitansiTrx, setKwitansiTrx] = useState<TransaksiPemasukan | null>(null);
  const [showGatewayModal, setShowGatewayModal] = useState<boolean>(false);

  // Sync state to localStorage for online persistence
  useEffect(() => {
    localStorage.setItem('mtq_santri_list', JSON.stringify(santriList));
  }, [santriList]);

  useEffect(() => {
    localStorage.setItem('mtq_pemasukan_list', JSON.stringify(pemasukanList));
  }, [pemasukanList]);

  useEffect(() => {
    localStorage.setItem('mtq_pengeluaran_list', JSON.stringify(pengeluaranList));
  }, [pengeluaranList]);

  useEffect(() => {
    localStorage.setItem('mtq_wa_logs', JSON.stringify(waLogs));
  }, [waLogs]);

  // Toast Helper
  const addToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    const newNotice: ToastNotice = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setToasts(prev => [newNotice, ...prev.slice(0, 4)]);

    // Auto dismiss
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newNotice.id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Calculate Summary Kas
  const summaryKas: SummaryKas = React.useMemo(() => {
    const totalInMTQ = pemasukanList.filter(i => i.sumberKas === 'Kas MTQ').reduce((a, b) => a + b.nominal, 0);
    const totalInDonatur = pemasukanList.filter(i => i.sumberKas === 'Kas Donatur').reduce((a, b) => a + b.nominal, 0);
    const totalOutMTQ = pengeluaranList.filter(i => i.sumberKas === 'Kas MTQ').reduce((a, b) => a + b.nominal, 0);
    const totalOutDonatur = pengeluaranList.filter(i => i.sumberKas === 'Kas Donatur').reduce((a, b) => a + b.nominal, 0);

    const totalKasMTQ = totalInMTQ - totalOutMTQ;
    const totalKasDonatur = totalInDonatur - totalOutDonatur;

    const totalPemasukanBulanIni = pemasukanList.reduce((a, b) => a + b.nominal, 0);
    const totalPengeluaranBulanIni = pengeluaranList.reduce((a, b) => a + b.nominal, 0);
    const totalTunggakanSpp = santriList.reduce((a, b) => a + b.tunggakanSppTahunLalu, 0);

    return {
      totalKasMTQ,
      totalKasDonatur,
      totalPemasukanBulanIni,
      totalPengeluaranBulanIni,
      totalPemasukanTahunIni: totalPemasukanBulanIni,
      totalPengeluaranTahunIni: totalPengeluaranBulanIni,
      totalTunggakanSpp,
    };
  }, [pemasukanList, pengeluaranList, santriList]);

  // Handle Income Add
  const handleAddPemasukan = (trxData: Omit<TransaksiPemasukan, 'id' | 'kwitansiTerkirim'>) => {
    const newTrx: TransaksiPemasukan = {
      ...trxData,
      id: `TRX-IN-2026-${String(pemasukanList.length + 1).padStart(3, '0')}`,
      kwitansiTerkirim: false,
    };

    setPemasukanList(prev => [newTrx, ...prev]);

    // If payment is for arrears, deduct student arrears
    if (trxData.santriId && (trxData.tahunAjaran.includes('Tunggakan') || trxData.kategori === 'SPP Bulanan')) {
      setSantriList(prev =>
        prev.map(s => {
          if (s.nis === trxData.santriId && trxData.tahunAjaran.includes('Tunggakan')) {
            const remaining = Math.max(0, s.tunggakanSppTahunLalu - trxData.nominal);
            return { ...s, tunggakanSppTahunLalu: remaining };
          }
          return s;
        })
      );
    }

    addToast(
      'success',
      'Pemasukan Kas Berhasil',
      `Berhasil mencatat transaksi ${newTrx.id} senilai Rp ${newTrx.nominal.toLocaleString('id-ID')}`
    );

    // Auto prompt kwitansi
    setKwitansiTrx(newTrx);
  };

  // Handle Expense Add
  const handleAddPengeluaran = (trxData: Omit<TransaksiPengeluaran, 'id'>) => {
    const newTrx: TransaksiPengeluaran = {
      ...trxData,
      id: `TRX-OUT-2026-${String(pengeluaranList.length + 1).padStart(3, '0')}`,
    };

    setPengeluaranList(prev => [newTrx, ...prev]);
    addToast(
      'info',
      'Pengeluaran Kas Dicatat',
      `Pengeluaran ${newTrx.id} dari ${newTrx.sumberKas} sebesar Rp ${newTrx.nominal.toLocaleString('id-ID')}`
    );
  };

  // Handle Delete Pemasukan
  const handleDeletePemasukan = (id: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data transaksi ${id}?`)) {
      setPemasukanList(prev => prev.filter(p => p.id !== id));
      addToast('warning', 'Transaksi Dihapus', `Data transaksi ${id} telah dihapus.`);
    }
  };

  // Handle Delete Pengeluaran
  const handleDeletePengeluaran = (id: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data pengeluaran ${id}?`)) {
      setPengeluaranList(prev => prev.filter(p => p.id !== id));
      addToast('warning', 'Pengeluaran Dihapus', `Data pengeluaran ${id} telah dihapus.`);
    }
  };

  // Handle Reset Cash / Delete Default App Data
  const handleResetData = () => {
    if (
      confirm(
        'APAKAH ANDA YAKIN INGIN MENGHAPUS / RESET SEMUA DATA KAS BAWAAN APLIKASI?\n\nSemua transaksi kas masuk & keluar akan dikosongkan. Data santri dapat diinput ulang secara manual.'
      )
    ) {
      setPemasukanList([]);
      setPengeluaranList([]);
      setWaLogs([]);
      addToast('error', 'Data Bawaan Dihapus', 'Semua data kas masuk & keluar aplikasi telah dikosongkan.');
    }
  };

  // Handle Santri Operations
  const handleAddSantri = (santriData: Omit<Santri, 'id'>) => {
    const newSantri: Santri = {
      ...santriData,
      id: `SNT-${String(santriList.length + 1).padStart(3, '0')}`,
    };
    setSantriList(prev => [...prev, newSantri]);
    addToast('success', 'Santri Baru Ditambahkan', `Ananda ${newSantri.nama} (${newSantri.kelas}) berhasil terdaftar.`);
  };

  const handleUpdateSantri = (updated: Santri) => {
    setSantriList(prev => prev.map(s => (s.id === updated.id ? updated : s)));
    addToast('success', 'Data Santri Diperbarui', `Perubahan data ${updated.nama} berhasil disimpan.`);
  };

  const handleDeleteSantri = (id: string) => {
    const target = santriList.find(s => s.id === id);
    if (confirm(`Apakah Anda yakin ingin menghapus data santri ${target?.nama || id}?`)) {
      setSantriList(prev => prev.filter(s => s.id !== id));
      addToast('warning', 'Santri Dihapus', `Data santri ${target?.nama || id} telah dihapus dari sistem.`);
    }
  };

  // Handle Update Existing Pemasukan / Pelunasan
  const handleUpdatePemasukan = (updated: TransaksiPemasukan) => {
    setPemasukanList(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    addToast('success', 'Transaksi Diperbarui', `Data transaksi ${updated.id} berhasil disimpan.`);
  };

  // Handle Paying SPP from Control Card directly (NO hardcoded 250000!)
  const handlePaySppForMonth = (santri: Santri, monthName: string, isArrears: boolean, customNominal?: number) => {
    const nominalToUse =
      customNominal !== undefined
        ? customNominal
        : isArrears
        ? santri.tunggakanSppTahunLalu
        : santri.nominalSpp || 0;

    handleAddPemasukan({
      tanggal: new Date().toISOString().split('T')[0],
      santriId: santri.nis,
      namaPembayar: `${santri.nama} (${santri.namaOrangTua})`,
      kategori: 'SPP Bulanan',
      nominal: nominalToUse,
      sumberKas: 'Kas MTQ',
      metodePembayaran: 'Transfer Bank',
      tahunAjaran: isArrears ? 'Tunggakan 2025/2026' : '2026/2027',
      bulanSpp: monthName,
      catatan: `Pembayaran SPP ${monthName} via Kartu Kendali`,
      status: 'Lunas',
    });
  };

  // Send WA Kwitansi Log Trigger
  const handleSendWaLog = (trx: TransaksiPemasukan) => {
    const santri = santriList.find(s => s.nis === trx.santriId);
    const phone = santri ? santri.noWaOrangTua : '081234567890';
    const phoneCheck = formatPhoneWA(phone);

    if (!phoneCheck.isValid) {
      addToast('error', 'Gagal Pengiriman WA', `Nomor WA wali (${phone}) tidak valid! Harap perbaiki format nomor.`);
      return;
    }

    const newLog: LogPesanWhatsApp = {
      id: `LOG-WA-${Date.now()}`,
      tanggal: new Date().toISOString().replace('T', ' ').substring(0, 16),
      nomorWa: phoneCheck.formatted,
      namaPenerima: santri ? `${santri.namaOrangTua} (Wali ${santri.nama})` : trx.namaPembayar,
      transaksiId: trx.id,
      pesan: `Kwitansi Digital ${trx.kategori} ${trx.id} Rp ${trx.nominal.toLocaleString('id-ID')}`,
      status: 'Terkirim',
      keterangan: 'Pesan dikirim via WhatsApp API',
    };

    setWaLogs(prev => [newLog, ...prev]);

    // Mark transaction receipt sent
    setPemasukanList(prev => prev.map(p => (p.id === trx.id ? { ...p, kwitansiTerkirim: true } : p)));

    addToast('success', 'Kwitansi WA Terkirim', `Kwitansi ${trx.id} berhasil dikirim ke +${phoneCheck.formatted}`);
  };

  // Direct WA Notice Helper
  const handleSendWaNotice = (phone: string, text: string, name: string) => {
    const phoneCheck = formatPhoneWA(phone);
    if (!phoneCheck.isValid) {
      addToast('error', 'Gagal Pengiriman Pesan', `Format nomor WA ${name} (${phone}) tidak valid!`);
      return;
    }

    const link = generateWaReceiptLink(phoneCheck.formatted, text);
    window.open(link, '_blank');

    setWaLogs(prev => [
      {
        id: `LOG-WA-${Date.now()}`,
        tanggal: new Date().toISOString().replace('T', ' ').substring(0, 16),
        nomorWa: phoneCheck.formatted,
        namaPenerima: name,
        pesan: text,
        status: 'Terkirim',
        keterangan: 'Pesan pengingat dikirim ke wali santri',
      },
      ...prev,
    ]);

    addToast('success', 'Pengingat WA Dikirim', `Pemberitahuan telah dikirim ke +${phoneCheck.formatted}`);
  };

  // Handle User Login
  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    localStorage.setItem('mtq_auth_user', JSON.stringify(user));
    addToast('success', 'Selamat Datang', `Login berhasil sebagai ${user.name} (${user.role})`);
  };

  // Handle User Logout
  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar / Log Out dari sistem MTQ Darul Abidin?')) {
      setCurrentUser(null);
      localStorage.removeItem('mtq_auth_user');
      addToast('info', 'Sampai Jumpa', 'Anda telah berhasil keluar dari sistem.');
    }
  };

  // If user is not logged in, show Login Screen
  if (!currentUser) {
    return (
      <>
        <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
        <LoginScreen onLogin={handleLogin} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 font-sans flex flex-col antialiased">
      {/* Toast Notification Container */}
      <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />

      {/* Mobile PWA Download Reminder Strip */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 px-3 py-1.5 text-[11px] font-bold flex items-center justify-between sm:hidden shadow-xs">
        <div className="flex items-center gap-1.5 truncate">
          <span>📲</span>
          <span className="truncate">Tampilkan di Layar HP (Aplikasi PWA)</span>
        </div>
        <button
          onClick={() => setShowInstallModal(true)}
          className="bg-slate-950 text-white hover:bg-slate-900 px-2.5 py-0.5 rounded text-[10px] shrink-0 font-extrabold uppercase shadow-xs active:scale-95"
        >
          Pasang
        </button>
      </div>

      {/* Header */}
      <Header
        summary={summaryKas}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenInstallModal={() => setShowInstallModal(true)}
        onResetData={handleResetData}
        onOpenGatewayModal={() => setShowGatewayModal(true)}
      />

      {/* Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingWaCount={waLogs.filter(l => l.status === 'Pending' || l.status === 'Gagal').length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            summary={summaryKas}
            pemasukan={pemasukanList}
            pengeluaran={pengeluaranList}
            santriList={santriList}
            onNavigate={setActiveTab}
            onOpenGatewayModal={() => setShowGatewayModal(true)}
            onSelectTransactionForWa={trx => setKwitansiTrx(trx)}
          />
        )}

        {/* Dasbor Penerbitan Kartu SPP Berupa Gambar */}
        {activeTab === 'kartu-spp-gambar' && (
          <PenerbitanKartuSppGambar
            santriList={santriList}
            pemasukanList={pemasukanList}
            onPaySppForMonth={handlePaySppForMonth}
            onUpdatePemasukan={handleUpdatePemasukan}
            onDeletePemasukan={handleDeletePemasukan}
            onSendWaLog={handleSendWaLog}
            addToast={addToast}
          />
        )}

        {/* Dasbor Pesan Pengingat SPP untuk Seluruh Wali Santri */}
        {activeTab === 'pengingat-spp' && (
          <PengingatSppDashboard
            santriList={santriList}
            pemasukanList={pemasukanList}
            addToast={addToast}
          />
        )}

        {activeTab === 'pemasukan' && (
          <InputPemasukan
            pemasukanList={pemasukanList}
            santriList={santriList}
            onAddPemasukan={handleAddPemasukan}
            onUpdatePemasukan={handleUpdatePemasukan}
            onDeletePemasukan={handleDeletePemasukan}
            onOpenWaReceipt={trx => setKwitansiTrx(trx)}
            onOpenGatewayModal={() => setShowGatewayModal(true)}
          />
        )}

        {activeTab === 'pengeluaran' && (
          <InputPengeluaran
            pengeluaranList={pengeluaranList}
            onAddPengeluaran={handleAddPengeluaran}
            onDeletePengeluaran={handleDeletePengeluaran}
          />
        )}

        {activeTab === 'santri' && (
          <DataSantri
            santriList={santriList}
            onAddSantri={handleAddSantri}
            onUpdateSantri={handleUpdateSantri}
            onDeleteSantri={handleDeleteSantri}
            onSelectSantriForControlCard={santri => {
              setSelectedSantriForCard(santri);
              setActiveTab('kartu-spp-gambar');
            }}
            onSendWaNotice={handleSendWaNotice}
          />
        )}

        {activeTab === 'kartu-kendali' && (
          <KartuKendali
            santriList={santriList}
            pemasukanList={pemasukanList}
            selectedSantri={selectedSantriForCard}
            onSelectSantri={setSelectedSantriForCard}
            onPaySppForMonth={handlePaySppForMonth}
            onNavigateToImageCard={() => setActiveTab('kartu-spp-gambar')}
          />
        )}

        {activeTab === 'laporan' && (
          <RekapLaporan
            pemasukanList={pemasukanList}
            pengeluaranList={pengeluaranList}
            santriList={santriList}
            summary={summaryKas}
          />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppCenter
            logs={waLogs}
            santriList={santriList}
            pemasukanList={pemasukanList}
            onAddLog={log => setWaLogs(prev => [{ ...log, id: `LOG-WA-${Date.now()}` }, ...prev])}
            onResendLog={log => handleSendWaNotice(log.nomorWa, log.pesan, log.namaPenerima)}
            onDeleteLog={id => setWaLogs(prev => prev.filter(l => l.id !== id))}
            onTriggerFailedNotice={log =>
              addToast('error', 'Notifikasi Pengiriman Gagal', `Pengiriman ke ${log.namaPenerima} (+${log.nomorWa}) mengalami kendala.`)
            }
          />
        )}

        {activeTab === 'panduan' && <PanduanSpreadsheet />}
      </main>

      {/* Kwitansi Modal */}
      {kwitansiTrx && (
        <KwitansiModal
          transaksi={kwitansiTrx}
          santriList={santriList}
          onClose={() => setKwitansiTrx(null)}
          onSendWaLog={handleSendWaLog}
        />
      )}

      {/* Gateway Modal */}
      {showGatewayModal && (
        <PaymentGatewayModal
          santriList={santriList}
          onClose={() => setShowGatewayModal(false)}
          onProcessGatewayPayment={handleAddPemasukan}
        />
      )}

      {/* PWA Install Modal */}
      <InstallPwaModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        deferredPrompt={deferredPrompt}
        onInstalled={() => {
          setDeferredPrompt(null);
          addToast('success', 'Aplikasi Terpasang', 'Aplikasi MTQ Darul Abidin berhasil dipasang di layar HP!');
        }}
      />

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-300 border-t border-emerald-900 py-4 text-center text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 MTQ Darul Abidin. Sistem Penginputan, Pelaporan Keuangan & Kwitansi WhatsApp Santri.</p>
        </div>
      </footer>
    </div>
  );
}

