import React, { useState, useRef, useEffect } from 'react';
import { Santri, TransaksiPemasukan, KartuSppConfig } from '../types';
import { formatRupiah, formatDateIndo, generateWaReceiptLink, formatPhoneWA } from '../utils/formatters';
import {
  Download,
  Send,
  Share2,
  CheckCircle2,
  Clock,
  Printer,
  Sparkles,
  User,
  Search,
  Filter,
  CreditCard,
  Building2,
  ShieldCheck,
  Palette,
  Copy,
  Check,
  RefreshCw,
  Settings,
  Edit3,
  Trash2,
  X,
  Sliders,
  DollarSign,
  Calendar,
  AlertCircle,
  Award,
} from 'lucide-react';

interface PenerbitanKartuSppGambarProps {
  santriList: Santri[];
  pemasukanList: TransaksiPemasukan[];
  onPaySppForMonth: (santri: Santri, monthName: string, isArrears: boolean, customNominal?: number) => void;
  onUpdatePemasukan?: (trx: TransaksiPemasukan) => void;
  onDeletePemasukan?: (id: string) => void;
  onSendWaLog?: (trx: TransaksiPemasukan) => void;
  addToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
  initialConfig?: KartuSppConfig;
  onUpdateConfig?: (config: KartuSppConfig) => void;
}

export type CardTheme = 'emerald' | 'navy' | 'maroon';

export const PenerbitanKartuSppGambar: React.FC<PenerbitanKartuSppGambarProps> = ({
  santriList,
  pemasukanList,
  onPaySppForMonth,
  onUpdatePemasukan,
  onDeletePemasukan,
  addToast,
  initialConfig,
  onUpdateConfig,
}) => {
  const [selectedNis, setSelectedNis] = useState<string>(santriList[0]?.nis || '');
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('emerald');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [classFilter, setClassFilter] = useState<string>('SEMUA');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // Active view tab: 'preview' | 'edit-card' | 'edit-lunas'
  const [activeSubTab, setActiveSubTab] = useState<'preview' | 'edit-card' | 'edit-lunas'>('preview');

  // Config State for SPP Card (Default named with MAHAD TAHFIDZ QUR'AN DARUL ABIDIN)
  const [config, setConfig] = useState<KartuSppConfig>(() => {
    const saved = localStorage.getItem('mtq_kartu_spp_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return (
      initialConfig || {
        namaLembaga: "MAHAD TAHFIDZ QUR'AN DARUL ABIDIN",
        subJudulLembaga: "Lembaga Pendidikan Al-Qur'an & Pembinaan Karakter Santri",
        judulKartu: "KARTU KENDALI PEMBAYARAN SPP SANTRI",
        tahunAjaran: "2026/2027",
        nominalSppBulanan: 0, // No hardcoded 250000!
        namaBendahara: "Ustadz H. Ahmad Dahlan, S.Pd.I",
        jabatanBendahara: "Bendahara Keuangan Mahad",
        nipBendahara: "ID: DA-BND-01",
        teksStempel: "MAHAD TAHFIDZ QUR'AN DARUL ABIDIN",
        tanggalValidasi: new Date().toISOString().split('T')[0],
        catatanKartu: "Harap simpan bukti kartu kendali ini dengan baik. Pembayaran SPP paling lambat tgl 10 setiap bulan.",
        nomorRekeningInfo: "BSI: 7171 2026 0192 / BRI: 0123 0100 2026 531",
      }
    );
  });

  // Modal State for Editing / Paying a Month
  const [editingMonthModal, setEditingMonthModal] = useState<{
    isOpen: boolean;
    month: string;
    existingTrx?: TransaksiPemasukan;
    nominal: string;
    tanggal: string;
    metode: string;
    catatan: string;
  }>({
    isOpen: false,
    month: '',
    nominal: '',
    tanggal: new Date().toISOString().split('T')[0],
    metode: 'Transfer Bank',
    catatan: '',
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const monthsAcademicYear = [
    'Juli 2026',
    'Agustus 2026',
    'September 2026',
    'Oktober 2026',
    'November 2026',
    'Desember 2026',
    'Januari 2027',
    'Februari 2027',
    'Maret 2027',
    'April 2027',
    'Mei 2027',
    'Juni 2027',
  ];

  // Current selected student
  const currentSantri = santriList.find(s => s.nis === selectedNis) || santriList[0] || null;

  // Filter transactions for current student
  const studentTransactions = React.useMemo(() => {
    if (!currentSantri) return [];
    return pemasukanList.filter(
      p => p.santriId === currentSantri.nis || p.namaPembayar.toLowerCase().includes(currentSantri.nama.toLowerCase())
    );
  }, [pemasukanList, currentSantri]);

  // Determine effective monthly SPP tariff for current student (NO hardcoded 250000!)
  const effectiveMonthlyTariff = React.useMemo(() => {
    if (currentSantri?.nominalSpp && currentSantri.nominalSpp > 0) {
      return currentSantri.nominalSpp;
    }
    if (config.nominalSppBulanan && config.nominalSppBulanan > 0) {
      return config.nominalSppBulanan;
    }
    return 0;
  }, [currentSantri, config.nominalSppBulanan]);

  // Months payment status
  const monthStatuses = React.useMemo(() => {
    return monthsAcademicYear.map(mName => {
      const monthPrefix = mName.split(' ')[0].toLowerCase();
      const match = studentTransactions.find(
        t =>
          t.kategori === 'SPP Bulanan' &&
          t.bulanSpp &&
          t.bulanSpp.toLowerCase().includes(monthPrefix) &&
          t.status === 'Lunas'
      );
      return {
        month: mName,
        isPaid: !!match,
        trx: match,
        nominal: match ? match.nominal : effectiveMonthlyTariff,
      };
    });
  }, [monthsAcademicYear, studentTransactions, effectiveMonthlyTariff]);

  const totalPaid = monthStatuses.filter(m => m.isPaid).reduce((acc, m) => acc + (m.trx?.nominal || 0), 0);
  const unpaidMonthsCount = monthStatuses.filter(m => !m.isPaid).length;
  const totalUnpaid = unpaidMonthsCount * effectiveMonthlyTariff;
  const totalMonthsPaid = monthStatuses.filter(m => m.isPaid).length;

  // Save Card Config
  const handleSaveConfig = (newConfig: KartuSppConfig) => {
    setConfig(newConfig);
    localStorage.setItem('mtq_kartu_spp_config', JSON.stringify(newConfig));
    if (onUpdateConfig) onUpdateConfig(newConfig);
    addToast('success', 'Konfigurasi Kartu SPP Disimpan', 'Pengaturan nama bendahara dan detail kartu berhasil diperbarui.');
  };

  // Open Month Payment Edit / Recording Modal
  const handleOpenMonthAction = (m: { month: string; isPaid: boolean; trx?: TransaksiPemasukan }) => {
    if (m.isPaid && m.trx) {
      setEditingMonthModal({
        isOpen: true,
        month: m.month,
        existingTrx: m.trx,
        nominal: m.trx.nominal.toString(),
        tanggal: m.trx.tanggal,
        metode: m.trx.metodePembayaran,
        catatan: m.trx.catatan,
      });
    } else {
      setEditingMonthModal({
        isOpen: true,
        month: m.month,
        existingTrx: undefined,
        nominal: effectiveMonthlyTariff > 0 ? effectiveMonthlyTariff.toString() : '',
        tanggal: new Date().toISOString().split('T')[0],
        metode: 'Transfer Bank',
        catatan: `Pembayaran SPP ${m.month} via Kartu SPP`,
      });
    }
  };

  // Submit Month Edit / Record Payment
  const handleSaveMonthAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSantri) return;

    const nom = Number(editingMonthModal.nominal);
    if (isNaN(nom) || nom <= 0) {
      alert('Harap masukkan nominal pembayaran yang valid.');
      return;
    }

    if (editingMonthModal.existingTrx && onUpdatePemasukan) {
      // Update existing paid transaction
      onUpdatePemasukan({
        ...editingMonthModal.existingTrx,
        nominal: nom,
        tanggal: editingMonthModal.tanggal,
        metodePembayaran: editingMonthModal.metode as any,
        catatan: editingMonthModal.catatan,
        status: 'Lunas',
      });
      addToast('success', 'Data Pembayaran Diperbarui', `Pembayaran ${editingMonthModal.month} berhasil diupdate.`);
    } else {
      // Create new payment
      onPaySppForMonth(currentSantri, editingMonthModal.month, false, nom);
      addToast('success', 'Pembayaran Berhasil Dicatat', `SPP ${editingMonthModal.month} untuk ${currentSantri.nama} berhasil lunas.`);
    }

    setEditingMonthModal(prev => ({ ...prev, isOpen: false }));
  };

  // Cancel / Revert Paid status for a month
  const handleCancelPaidMonth = (trxId: string, monthName: string) => {
    if (confirm(`Apakah Anda yakin ingin MEMBATALKAN status lunas pada bulan ${monthName}?\n\nData transaksi ini akan dihapus dan bulan akan kembali berstatus BELUM LUNAS.`)) {
      if (onDeletePemasukan) {
        onDeletePemasukan(trxId);
      }
      setEditingMonthModal(prev => ({ ...prev, isOpen: false }));
      addToast('warning', 'Status Lunas Dibatalkan', `Bulan ${monthName} kini berstatus Belum Lunas.`);
    }
  };

  // Draw Card onto HTML5 Canvas
  const drawCardToCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentSantri) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions: 1200 x 800 (high DPI 2x)
    const width = 1200;
    const height = 800;
    canvas.width = width;
    canvas.height = height;

    // Color palettes based on theme
    let bgGradientStart = '#064e3b';
    let bgGradientEnd = '#022c22';
    let primaryHeaderColor = '#064e3b';
    let accentGold = '#f59e0b';
    let borderGold = '#d97706';

    if (selectedTheme === 'navy') {
      bgGradientStart = '#1e1b4b';
      bgGradientEnd = '#0f172a';
      primaryHeaderColor = '#1e1b4b';
      accentGold = '#fbbf24';
      borderGold = '#d97706';
    } else if (selectedTheme === 'maroon') {
      bgGradientStart = '#4c0519';
      bgGradientEnd = '#1c050c';
      primaryHeaderColor = '#4c0519';
      accentGold = '#facc15';
      borderGold = '#ca8a04';
    }

    // 1. Background Fill with subtle gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#f8fafc');
    grad.addColorStop(1, '#f1f5f9');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Ornamental Border
    ctx.strokeStyle = borderGold;
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    ctx.strokeStyle = primaryHeaderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 28, width - 56, height - 56);

    // Corner Islamic accents
    const drawCorner = (x: number, y: number) => {
      ctx.fillStyle = accentGold;
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCorner(28, 28);
    drawCorner(width - 28, 28);
    drawCorner(28, height - 28);
    drawCorner(width - 28, height - 28);

    // 3. Header Banner
    const headerGrad = ctx.createLinearGradient(30, 30, width - 60, 140);
    headerGrad.addColorStop(0, bgGradientStart);
    headerGrad.addColorStop(1, bgGradientEnd);
    ctx.fillStyle = headerGrad;
    ctx.fillRect(30, 30, width - 60, 115);

    // Header Gold Stripe
    ctx.fillStyle = accentGold;
    ctx.fillRect(30, 145, width - 60, 6);

    // Header Text - NAMED: MAHAD TAHFIDZ QUR'AN DARUL ABIDIN
    ctx.textAlign = 'center';
    ctx.fillStyle = accentGold;
    ctx.font = 'bold 14px sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText(config.subJudulLembaga.toUpperCase(), width / 2, 58);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 28px sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(config.namaLembaga.toUpperCase(), width / 2, 92);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 13px sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(`${config.judulKartu.toUpperCase()} • TAHUN AJARAN ${config.tahunAjaran}`, width / 2, 122);

    // 4. Student Biodata Box
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(45, 165, width - 90, 95, 10);
    ctx.fill();
    ctx.stroke();

    // Student Info Columns
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('NAMA SANTRI', 65, 190);
    ctx.fillText('NOMOR INDUK (NIS)', 65, 230);

    ctx.fillStyle = primaryHeaderColor;
    ctx.font = '900 18px sans-serif';
    ctx.fillText(currentSantri.nama.toUpperCase(), 65, 212);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(currentSantri.nis, 65, 248);

    // Column 2
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('KELAS / HALAQAH', 380, 190);
    ctx.fillText('STATUS SANTRI', 380, 230);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(currentSantri.kelas, 380, 210);

    ctx.fillStyle = currentSantri.status === 'Aktif' ? '#047857' : '#b91c1c';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`● ${currentSantri.status} (${currentSantri.kategoriSantri})`, 380, 248);

    // Column 3
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('NAMA WALI SANTRI', 670, 190);
    ctx.fillText('WHATSAPP WALI', 670, 230);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(currentSantri.namaOrangTua, 670, 210);

    ctx.fillStyle = '#047857';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`+${currentSantri.noWaOrangTua}`, 670, 248);

    // Column 4 (Arrears & Summary)
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('TARIF SPP / BLN', 960, 190);
    ctx.fillText('PROGRESS PEMBAYARAN', 960, 230);

    ctx.fillStyle = primaryHeaderColor;
    ctx.font = '900 15px sans-serif';
    ctx.fillText(
      effectiveMonthlyTariff > 0 ? formatRupiah(effectiveMonthlyTariff) : 'Sesuai Ketentuan',
      960,
      210
    );

    ctx.fillStyle = totalMonthsPaid === 12 ? '#047857' : '#0f172a';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`${totalMonthsPaid} / 12 Bulan Lunas`, 960, 248);

    // 5. 12 Months Grid (2 Rows x 6 Columns)
    const gridStartX = 45;
    const gridStartY = 275;
    const colWidth = (width - 90 - 5 * 12) / 6; // ~175px
    const rowHeight = 155;

    monthStatuses.forEach((item, index) => {
      const col = index % 6;
      const row = Math.floor(index / 6);
      const x = gridStartX + col * (colWidth + 12);
      const y = gridStartY + row * (rowHeight + 12);

      // Card Box
      ctx.fillStyle = item.isPaid ? '#ecfdf5' : '#f8fafc';
      ctx.strokeStyle = item.isPaid ? '#10b981' : '#e2e8f0';
      ctx.lineWidth = item.isPaid ? 2 : 1.5;
      ctx.beginPath();
      ctx.roundRect(x, y, colWidth, rowHeight, 8);
      ctx.fill();
      ctx.stroke();

      // Month Header Banner
      ctx.fillStyle = item.isPaid ? '#047857' : '#475569';
      ctx.beginPath();
      ctx.roundRect(x, y, colWidth, 32, [8, 8, 0, 0]);
      ctx.fill();

      // Month Title Text
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(item.month, x + colWidth / 2, y + 21);

      // Nominal line (NO hardcoded 250k)
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 11px sans-serif';
      if (item.isPaid && item.trx) {
        ctx.fillText(`Nominal: ${formatRupiah(item.trx.nominal)}`, x + colWidth / 2, y + 55);
      } else if (effectiveMonthlyTariff > 0) {
        ctx.fillText(`Tarif: ${formatRupiah(effectiveMonthlyTariff)}`, x + colWidth / 2, y + 55);
      } else {
        ctx.fillText('Tarif: Sesuai Ketentuan', x + colWidth / 2, y + 55);
      }

      if (item.isPaid) {
        // Status LUNAS Badge
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.roundRect(x + 20, y + 72, colWidth - 40, 28, 6);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 12px sans-serif';
        ctx.fillText('✓ LUNAS', x + colWidth / 2, y + 90);

        // Date and Trx ID
        ctx.fillStyle = '#065f46';
        ctx.font = 'bold 10px monospace';
        const dateStr = item.trx ? formatDateIndo(item.trx.tanggal) : 'Terverifikasi';
        ctx.fillText(dateStr, x + colWidth / 2, y + 118);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText(item.trx?.id || 'TRX-PAID', x + colWidth / 2, y + 138);
      } else {
        // Status BELUM LUNAS
        ctx.fillStyle = '#fee2e2';
        ctx.beginPath();
        ctx.roundRect(x + 20, y + 72, colWidth - 40, 28, 6);
        ctx.fill();

        ctx.fillStyle = '#b91c1c';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('BELUM LUNAS', x + colWidth / 2, y + 90);

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'italic 11px sans-serif';
        ctx.fillText('Menunggu Pembayaran', x + colWidth / 2, y + 124);
      }
    });

    // 6. Bottom Summary & Official Stamp Area
    const bottomY = 625;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(45, bottomY, width - 90, 135, 10);
    ctx.fill();
    ctx.stroke();

    // Summary Column
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('TOTAL SPP SUDAH DIBAYAR:', 70, bottomY + 28);
    ctx.fillStyle = '#047857';
    ctx.font = '900 20px sans-serif';
    ctx.fillText(formatRupiah(totalPaid), 70, bottomY + 54);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('SISA BULAN BELUM LUNAS:', 70, bottomY + 84);
    ctx.fillStyle = unpaidMonthsCount > 0 ? '#b91c1c' : '#047857';
    ctx.font = '900 18px sans-serif';
    ctx.fillText(
      unpaidMonthsCount > 0
        ? `${unpaidMonthsCount} Bulan (${formatRupiah(totalUnpaid)})`
        : 'SEMUA BULAN SUDAH LUNAS ✓',
      70,
      bottomY + 108
    );

    // Note line
    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 10px sans-serif';
    ctx.fillText(config.catatanKartu, 70, bottomY + 126);

    // Official Stamp Graphic (Circular) with customizable text
    const stampX = 520;
    const stampY = bottomY + 68;

    ctx.save();
    ctx.translate(stampX, stampY);
    ctx.rotate(-0.08);

    ctx.strokeStyle = primaryHeaderColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 52, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 46, 0, Math.PI * 2);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = primaryHeaderColor;
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText(`★ ${config.teksStempel.slice(0, 24)} ★`, 0, -32);
    ctx.font = '900 12px sans-serif';
    ctx.fillText('TERVERIFIKASI', 0, -4);
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('BENDAHARA KAS', 0, 14);
    ctx.fillText('RESMI & SAH', 0, 32);
    ctx.restore();

    // Signatures & Treasurer Details (EDITABLE)
    ctx.textAlign = 'center';
    ctx.fillStyle = '#475569';
    ctx.font = '11px sans-serif';
    ctx.fillText(`Dicetak / Divalidasi: ${formatDateIndo(config.tanggalValidasi)}`, 850, bottomY + 25);
    ctx.fillText('Mengetahui / Memvalidasi,', 850, bottomY + 45);

    // Signature Line
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(730, bottomY + 102);
    ctx.lineTo(970, bottomY + 102);
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`( ${config.namaBendahara} )`, 850, bottomY + 116);

    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.fillText(`${config.jabatanBendahara} • ${config.nipBendahara}`, 850, bottomY + 129);

    // Verification Barcode / Token
    ctx.textAlign = 'right';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText(`KODE: MTQ-${currentSantri.nis}-${config.tahunAjaran.replace('/', '')}`, width - 65, bottomY + 25);
    ctx.fillText('Dokumen Digital Otentik Terenkripsi', width - 65, bottomY + 40);
  };

  // Re-draw when student, theme, or config changes
  useEffect(() => {
    drawCardToCanvas();
  }, [currentSantri, selectedTheme, monthStatuses, config]);

  // Handle Download Image (PNG)
  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentSantri) return;

    setIsGenerating(true);
    try {
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const filename = `Kartu_SPP_Mahad_Darul_Abidin_${currentSantri.nama.replace(/\s+/g, '_')}_${currentSantri.nis}.png`;
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast(
        'success',
        'Kartu SPP Berhasil Didownload',
        `File ${filename} telah tersimpan dengan resolusi tajam di galeri/folder download Anda.`
      );
    } catch (err) {
      addToast('error', 'Gagal Download', 'Terjadi kendala saat mengekspor gambar kartu SPP.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate WA Message text
  const getWaMessageText = () => {
    if (!currentSantri) return '';

    return `*${config.namaLembaga}*
*${config.judulKartu}*
Tahun Ajaran: ${config.tahunAjaran}
----------------------------------------
*Nama Santri:* ${currentSantri.nama}
*NIS:* ${currentSantri.nis}
*Kelas / Halaqah:* ${currentSantri.kelas}
*Wali Santri:* ${currentSantri.namaOrangTua}
----------------------------------------
📊 *RINGKASAN PEMBAYARAN SPP:*
• Total Lunas: *${totalMonthsPaid} dari 12 Bulan*
• Total Disetorkan: *${formatRupiah(totalPaid)}*
• Sisa Kewajiban: *${unpaidMonthsCount} Bulan* ${totalUnpaid > 0 ? `(${formatRupiah(totalUnpaid)})` : ''}

📅 *RINCIAN STATUS PER BULAN:*
${monthStatuses
  .map(
    m =>
      `• ${m.month}: ${
        m.isPaid ? `✅ LUNAS (${formatRupiah(m.trx?.nominal || m.nominal)})` : '❌ BELUM LUNAS'
      }`
  )
  .join('\n')}

----------------------------------------
📌 _${config.catatanKartu}_
🏛️ _Pembayaran dapat ditunaikan melalui ${config.nomorRekeningInfo}_

Hormat Kami,
*${config.namaBendahara}*
_${config.jabatanBendahara}_
*${config.namaLembaga}*`;
  };

  // Handle Send WhatsApp
  const handleSendWa = async () => {
    if (!currentSantri) return;

    const phoneCheck = formatPhoneWA(currentSantri.noWaOrangTua);
    if (!phoneCheck.isValid) {
      addToast(
        'error',
        'Nomor WhatsApp Tidak Valid',
        `Nomor WA wali santri (${currentSantri.noWaOrangTua}) tidak valid. Silakan perbarui data di menu Santri.`
      );
      return;
    }

    const waText = getWaMessageText();
    const canvas = canvasRef.current;

    // Check if browser supports Web Share API with image file
    if (canvas && navigator.share && navigator.canShare) {
      try {
        canvas.toBlob(async blob => {
          if (!blob) {
            const link = generateWaReceiptLink(phoneCheck.formatted, waText);
            window.open(link, '_blank');
            return;
          }

          const file = new File(
            [blob],
            `Kartu_SPP_Mahad_Darul_Abidin_${currentSantri.nama.replace(/\s+/g, '_')}_${currentSantri.nis}.png`,
            { type: 'image/png' }
          );

          if (navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                title: `Kartu SPP Mahad Darul Abidin - ${currentSantri.nama}`,
                text: waText,
                files: [file],
              });
              addToast('success', 'Berhasil Dikirim', 'Kartu gambar berhasil dibagikan langsung ke WhatsApp.');
              return;
            } catch (shareErr) {
              // User dismissed share dialog
            }
          }

          // Fallback
          handleDownloadImage();
          const link = generateWaReceiptLink(phoneCheck.formatted, waText);
          window.open(link, '_blank');
        }, 'image/png');
        return;
      } catch (e) {
        // Continue to fallback
      }
    }

    // Standard fallback: open WA Click-to-Chat & download image
    handleDownloadImage();
    const link = generateWaReceiptLink(phoneCheck.formatted, waText);
    window.open(link, '_blank');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(getWaMessageText());
    setCopiedText(true);
    addToast('info', 'Teks Disalin', 'Teks pengantar kartu SPP siap dipaste di chat WhatsApp orang tua.');
    setTimeout(() => setCopiedText(false), 2500);
  };

  const filteredSantri = santriList.filter(s => {
    const matchesSearch =
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nis.includes(searchTerm) ||
      s.namaOrangTua.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'SEMUA' || s.kelas === classFilter;
    return matchesSearch && matchesClass;
  });

  const uniqueClasses = ['SEMUA', ...Array.from(new Set(santriList.map(s => s.kelas)))];

  return (
    <div className="space-y-6">
      {/* Header Bar with Sub-Tab Selector */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-5 bg-indigo-600 rounded-full" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              Penerbitan & Konfigurasi Kartu SPP: {config.namaLembaga}
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Kelola identitas kartu, ubah nama bendahara, edit santri yang sudah lunas sebelumnya, dan terbitkan kartu gambar HD ke orang tua santri.
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setActiveSubTab('preview')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeSubTab === 'preview'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
              <span>Preview & Download Kartu</span>
            </button>
            <button
              onClick={() => setActiveSubTab('edit-card')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeSubTab === 'edit-card'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-amber-500" />
              <span>Edit Kartu & Bendahara</span>
            </button>
            <button
              onClick={() => setActiveSubTab('edit-lunas')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeSubTab === 'edit-lunas'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Edit Data Lunas Santri</span>
            </button>
          </div>
        </div>
      </div>

      {/* FILTER & SANTRI SELECTOR BAR */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:w-auto flex-1 flex flex-col sm:flex-row gap-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari santri, NIS, atau wali..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:bg-white"
              />
            </div>

            {/* Class Filter */}
            <select
              value={classFilter}
              onChange={e => setClassFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-600"
            >
              {uniqueClasses.map(c => (
                <option key={c} value={c}>
                  Kelas: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Dropdown Picker */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-700 shrink-0">Pilih Santri:</span>
            <select
              value={selectedNis}
              onChange={e => setSelectedNis(e.target.value)}
              className="w-full sm:w-64 bg-indigo-50/70 border border-indigo-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-indigo-950 focus:ring-2 focus:ring-indigo-600"
            >
              {filteredSantri.map(s => (
                <option key={s.id} value={s.nis}>
                  {s.nama} ({s.kelas}) - {s.nis}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: PREVIEW KARTU & DOWNLOAD */}
      {activeSubTab === 'preview' && currentSantri && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-xl p-4 shadow-sm border border-indigo-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black text-lg flex items-center justify-center shrink-0 shadow-xs">
                {currentSantri.nama.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white">{currentSantri.nama}</h3>
                  <span className="bg-indigo-800 text-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {currentSantri.kelas}
                  </span>
                  <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Bendahara: {config.namaBendahara}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Wali: {currentSantri.namaOrangTua} • No WA: +{currentSantri.noWaOrangTua} • SPP Lunas: {totalMonthsPaid}/12 Bulan
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Theme Selector */}
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-lg border border-white/10">
                <button
                  onClick={() => setSelectedTheme('emerald')}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                    selectedTheme === 'emerald' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Tema Hijau Emerald"
                >
                  Emerald
                </button>
                <button
                  onClick={() => setSelectedTheme('navy')}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                    selectedTheme === 'navy' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Tema Royal Navy"
                >
                  Navy
                </button>
                <button
                  onClick={() => setSelectedTheme('maroon')}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                    selectedTheme === 'maroon' ? 'bg-rose-700 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Tema Maroon Gold"
                >
                  Maroon
                </button>
              </div>

              <button
                onClick={handleDownloadImage}
                disabled={isGenerating}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download Gambar (.PNG)</span>
              </button>

              <button
                onClick={handleSendWa}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>Kirim ke WA Orang Tua</span>
              </button>

              <button
                onClick={handleCopyText}
                className="bg-indigo-800 hover:bg-indigo-700 text-white font-semibold px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-all border border-indigo-700"
              >
                {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedText ? 'Tersalin' : 'Copy Teks'}</span>
              </button>
            </div>
          </div>

          {/* Canvas Card Container (Visible High Quality Rendering) */}
          <div className="bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto text-center space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-2">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Sparkles className="w-4 h-4" /> Preview Kartu SPP: {config.namaLembaga} (1200 x 800)
              </span>
              <span className="text-[11px] text-slate-300">
                Tertanda: <strong className="text-white">{config.namaBendahara}</strong> ({config.jabatanBendahara})
              </span>
            </div>

            <div className="inline-block rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700 bg-white max-w-full">
              <canvas
                ref={canvasRef}
                className="w-full max-w-[850px] h-auto object-contain block mx-auto"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </div>

            <p className="text-[11px] text-slate-400 italic">
              * Resolusi saat didownload adalah 1200x800 pixel (sangat jernih di layar HP santri dan orang tua).
            </p>
          </div>

          {/* Interactive Month Matrix (Click to Edit / Record Payment) */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  Status SPP 12 Bulan (Klik Kotak Bulan untuk Mengedit Status / Nominal)
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Anda bisa mengedit bulan yang sudah lunas, mengubah nominal, atau membatalkan status lunas jika terjadi kekeliruan.
                </p>
              </div>
              <span className="text-[11px] font-bold text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                Total Disetor: {formatRupiah(totalPaid)}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {monthStatuses.map(m => (
                <div
                  key={m.month}
                  onClick={() => handleOpenMonthAction(m)}
                  className={`p-2.5 rounded-lg border flex flex-col justify-between space-y-2 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md ${
                    m.isPaid
                      ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-200'
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                  }`}
                  title={`Klik untuk edit data ${m.month}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{m.month}</span>
                    <Edit3 className="w-3 h-3 text-slate-400 hover:text-indigo-600" />
                  </div>

                  <div>
                    {m.isPaid && m.trx ? (
                      <span className="text-[11px] font-bold text-emerald-900 block font-mono">
                        {formatRupiah(m.trx.nominal)}
                      </span>
                    ) : effectiveMonthlyTariff > 0 ? (
                      <span className="text-[11px] font-medium text-slate-600 block font-mono">
                        {formatRupiah(effectiveMonthlyTariff)}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 block italic">Sesuai Ketentuan</span>
                    )}
                  </div>

                  {m.isPaid ? (
                    <div className="flex items-center justify-between pt-1 border-t border-emerald-200/60">
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-200/80 px-1.5 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" /> LUNAS
                      </span>
                      <span className="text-[9px] text-emerald-700 font-mono">
                        {m.trx?.tanggal ? formatDateIndo(m.trx.tanggal).slice(0, 6) : ''}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                        <Clock className="w-3 h-3 text-rose-600" /> BELUM
                      </span>
                      <span className="text-[10px] font-bold text-indigo-700 hover:underline">
                        + Bayar
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DASBOR EDIT KARTU SPP & BENDAHARA SECARA KESELURUHAN */}
      {activeSubTab === 'edit-card' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              Dasbor Konfigurasi & Edit Kartu SPP Secara Keseluruhan
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Atur nama lembaga (MAHAD TAHFIDZ QUR'AN DARUL ABIDIN), nama bendahara, jabatan, NIP, stempel, tahun ajaran, dan tarif bulanan secara fleksibel tanpa nilai default 250.000.
            </p>
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              handleSaveConfig(config);
              setActiveSubTab('preview');
            }}
            className="space-y-6"
          >
            {/* SECTION 1: NAMA BENDAHARA & PENGESAHAN */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-200 pb-2">
                <Award className="w-4 h-4 text-amber-500" />
                1. Edit Pengaturan Bendahara & Pengesahan Kartu
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Nama Lengkap Bendahara *
                  </label>
                  <input
                    type="text"
                    value={config.namaBendahara}
                    onChange={e => setConfig({ ...config, namaBendahara: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-600"
                    placeholder="Contoh: Ustadz H. Ahmad Dahlan, S.Pd.I"
                    required
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Nama ini akan tercetak di kolom tanda tangan & validasi kartu.
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Jabatan Bendahara *
                  </label>
                  <input
                    type="text"
                    value={config.jabatanBendahara}
                    onChange={e => setConfig({ ...config, jabatanBendahara: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-600"
                    placeholder="Contoh: Bendahara Keuangan Mahad"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    NIP / No. Identitas Pengurus
                  </label>
                  <input
                    type="text"
                    value={config.nipBendahara}
                    onChange={e => setConfig({ ...config, nipBendahara: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:ring-2 focus:ring-indigo-600"
                    placeholder="Contoh: NIP/ID: DA-BND-01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Teks Stempel Resmi Kartu
                  </label>
                  <input
                    type="text"
                    value={config.teksStempel}
                    onChange={e => setConfig({ ...config, teksStempel: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-600"
                    placeholder="Contoh: MAHAD TAHFIDZ QUR'AN DARUL ABIDIN"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Teks yang melingkar di stempel digital kartu SPP.
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Tanggal Validasi / Cetak Kartu
                  </label>
                  <input
                    type="date"
                    value={config.tanggalValidasi}
                    onChange={e => setConfig({ ...config, tanggalValidasi: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: IDENTITAS LEMBAGA & JUDUL KARTU */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-200 pb-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                2. Nama Lembaga & Judul Kartu SPP
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Nama Lembaga Utama (Sesuai Permintaan) *
                  </label>
                  <input
                    type="text"
                    value={config.namaLembaga}
                    onChange={e => setConfig({ ...config, namaLembaga: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-black text-indigo-950 focus:ring-2 focus:ring-indigo-600"
                    placeholder="MAHAD TAHFIDZ QUR'AN DARUL ABIDIN"
                    required
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Tercetak tebal di bagian kop atas kartu SPP.
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Sub-Judul Lembaga
                  </label>
                  <input
                    type="text"
                    value={config.subJudulLembaga}
                    onChange={e => setConfig({ ...config, subJudulLembaga: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-600"
                    placeholder="Lembaga Pendidikan Al-Qur'an & Pembinaan Karakter Santri"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Judul Dokumen Kartu
                  </label>
                  <input
                    type="text"
                    value={config.judulKartu}
                    onChange={e => setConfig({ ...config, judulKartu: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-600"
                    placeholder="KARTU KENDALI PEMBAYARAN SPP SANTRI"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Tahun Ajaran
                  </label>
                  <input
                    type="text"
                    value={config.tahunAjaran}
                    onChange={e => setConfig({ ...config, tahunAjaran: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-600"
                    placeholder="2026/2027"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: PENGATURAN TARIF SPP (HILANGKAN 250.000) */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-200 pb-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                3. Tarif SPP Bulanan (Fleksibel Bebas Tanpa Rp 250.000)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Nominal Tarif SPP Bulanan Global (Rp)
                  </label>
                  <input
                    type="number"
                    value={config.nominalSppBulanan === 0 ? '' : config.nominalSppBulanan}
                    onChange={e => setConfig({ ...config, nominalSppBulanan: e.target.value ? Number(e.target.value) : 0 })}
                    placeholder="Masukkan tarif (cth: 300000 atau kosongkan jika gratis)"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-emerald-800 focus:ring-2 focus:ring-indigo-600"
                  />
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-500 font-medium">Preset cepat:</span>
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, nominalSppBulanan: 0 })}
                      className="text-[10px] bg-slate-200 hover:bg-slate-300 px-2 py-0.5 rounded font-semibold text-slate-700"
                    >
                      Bebas / Rp 0
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, nominalSppBulanan: 200000 })}
                      className="text-[10px] bg-slate-200 hover:bg-slate-300 px-2 py-0.5 rounded font-semibold text-slate-700"
                    >
                      Rp 200.000
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, nominalSppBulanan: 300000 })}
                      className="text-[10px] bg-slate-200 hover:bg-slate-300 px-2 py-0.5 rounded font-semibold text-slate-700"
                    >
                      Rp 300.000
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, nominalSppBulanan: 350000 })}
                      className="text-[10px] bg-slate-200 hover:bg-slate-300 px-2 py-0.5 rounded font-semibold text-slate-700"
                    >
                      Rp 350.000
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, nominalSppBulanan: 500000 })}
                      className="text-[10px] bg-slate-200 hover:bg-slate-300 px-2 py-0.5 rounded font-semibold text-slate-700"
                    >
                      Rp 500.000
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Info Rekening Pembayaran Resmi
                  </label>
                  <input
                    type="text"
                    value={config.nomorRekeningInfo}
                    onChange={e => setConfig({ ...config, nomorRekeningInfo: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-600"
                    placeholder="BSI: 7171 2026 0192 / BRI: 0123 0100 2026 531"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Ditampilkan pada pesan WhatsApp pengantar kartu SPP.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Catatan Kaki Resmi Kartu SPP
                </label>
                <textarea
                  value={config.catatanKartu}
                  onChange={e => setConfig({ ...config, catatanKartu: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-600"
                  placeholder="Catatan resmi kartu..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveSubTab('preview')}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Batal / Kembali ke Preview
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm"
              >
                <Check className="w-4 h-4" />
                Simpan & Terapkan Perubahan ke Kartu SPP
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-TAB 3: EDIT SANTRI YANG SUDAH LUNAS PADA DATA SEBELUMNYA */}
      {activeSubTab === 'edit-lunas' && currentSantri && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-600" />
                Kelola & Edit Data Pembayaran Lunas: {currentSantri.nama} ({currentSantri.kelas})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Edit nominal transaksi yang sudah dibayarkan, ganti tanggal bayar, metode pembayaran, atau batalkan status lunas jika ada kesalahan pencatatan sebelumnya.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSubTab('preview')}
                className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold rounded-lg hover:bg-indigo-100"
              >
                Lihat Kartu Hasil Edit →
              </button>
            </div>
          </div>

          {/* Table of Months & Payments */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Bulan SPP</th>
                  <th className="px-4 py-3">Status Pembayaran</th>
                  <th className="px-4 py-3">Nominal Terbayar</th>
                  <th className="px-4 py-3">Tanggal & ID Transaksi</th>
                  <th className="px-4 py-3">Metode & Catatan</th>
                  <th className="px-4 py-3 text-right">Aksi Edit Lunas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {monthStatuses.map(m => (
                  <tr key={m.month} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">{m.month}</td>
                    <td className="px-4 py-3">
                      {m.isPaid ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> LUNAS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded uppercase">
                          <Clock className="w-3.5 h-3.5 text-rose-600" /> BELUM LUNAS
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      {m.isPaid && m.trx ? (
                        <span className="text-emerald-700">{formatRupiah(m.trx.nominal)}</span>
                      ) : (
                        <span className="text-slate-400 font-normal">
                          {effectiveMonthlyTariff > 0 ? formatRupiah(effectiveMonthlyTariff) : 'Belum Ada'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                      {m.isPaid && m.trx ? (
                        <div>
                          <span className="font-semibold block text-slate-800">{formatDateIndo(m.trx.tanggal)}</span>
                          <span className="text-[10px] text-slate-400">{m.trx.id}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-[11px]">
                      {m.isPaid && m.trx ? (
                        <div>
                          <span className="font-medium text-slate-800 block">{m.trx.metodePembayaran}</span>
                          <span className="text-[10px] text-slate-400 italic">{m.trx.catatan}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {m.isPaid && m.trx ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenMonthAction(m)}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-[11px] font-bold flex items-center gap-1"
                            title="Edit data pembayaran ini"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit Nominal / Data</span>
                          </button>
                          <button
                            onClick={() => handleCancelPaidMonth(m.trx!.id, m.month)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            title="Batalkan status lunas (hapus)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenMonthAction(m)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow-xs"
                        >
                          + Catat Lunas
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL EDIT / CATAT PEMBAYARAN BULAN */}
      {editingMonthModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  {editingMonthModal.existingTrx ? 'Edit Pembayaran Lunas' : 'Catat Pelunasan SPP'}
                </h3>
                <p className="text-[11px] text-indigo-200 mt-0.5">
                  Bulan: <span className="font-bold text-white">{editingMonthModal.month}</span> • Santri: {currentSantri?.nama}
                </p>
              </div>
              <button
                onClick={() => setEditingMonthModal(prev => ({ ...prev, isOpen: false }))}
                className="text-indigo-200 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMonthAction} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Nominal Pembayaran (Rp) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={editingMonthModal.nominal}
                  onChange={e => setEditingMonthModal({ ...editingMonthModal, nominal: e.target.value })}
                  placeholder="Masukkan nominal yang dibayar santri"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-indigo-950 focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Bebas diedit sesuai yang orang tua santri bayarkan (tanpa paksaan Rp 250.000).
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Tanggal Pembayaran
                  </label>
                  <input
                    type="date"
                    value={editingMonthModal.tanggal}
                    onChange={e => setEditingMonthModal({ ...editingMonthModal, tanggal: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Metode Pembayaran
                  </label>
                  <select
                    value={editingMonthModal.metode}
                    onChange={e => setEditingMonthModal({ ...editingMonthModal, metode: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="Transfer Bank">Transfer Bank</option>
                    <option value="Tunai">Tunai</option>
                    <option value="Payment Gateway (QRIS/VA)">Payment Gateway (QRIS/VA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Catatan Pembayaran
                </label>
                <input
                  type="text"
                  value={editingMonthModal.catatan}
                  onChange={e => setEditingMonthModal({ ...editingMonthModal, catatan: e.target.value })}
                  placeholder="Keterangan transfer / kwitansi..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                {editingMonthModal.existingTrx ? (
                  <button
                    type="button"
                    onClick={() => handleCancelPaidMonth(editingMonthModal.existingTrx!.id, editingMonthModal.month)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Batalkan Lunas</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingMonthModal(prev => ({ ...prev, isOpen: false }))}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
