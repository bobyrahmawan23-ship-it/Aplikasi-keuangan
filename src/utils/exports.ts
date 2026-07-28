import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { TransaksiPemasukan, TransaksiPengeluaran, Santri, SummaryKas } from '../types';
import { formatRupiah, formatDateIndo } from './formatters';

/**
 * Export Pemasukan & Pengeluaran to Excel (.xlsx)
 */
export const exportToExcel = (
  pemasukan: TransaksiPemasukan[],
  pengeluaran: TransaksiPengeluaran[],
  santriList: Santri[],
  periodeText: string = 'Keseluruhan'
) => {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Transaksi Pemasukan
  const rowsPemasukan = pemasukan.map((item, index) => ({
    No: index + 1,
    'ID Transaksi': item.id,
    Tanggal: item.tanggal,
    'NIS Santri': item.santriId || '-',
    'Nama Santri / Donatur': item.namaPembayar,
    'Kategori Pembayaran': item.kategori,
    'Nominal (Rp)': item.nominal,
    'Sumber Kas': item.sumberKas,
    'Metode Pembayaran': item.metodePembayaran,
    'Tahun Ajaran': item.tahunAjaran,
    'Bulan SPP': item.bulanSpp || '-',
    Catatan: item.catatan || '-',
    Status: item.status,
  }));
  const wsPemasukan = XLSX.utils.json_to_sheet(rowsPemasukan);
  XLSX.utils.book_append_sheet(wb, wsPemasukan, 'Kas Pemasukan');

  // Sheet 2: Transaksi Pengeluaran
  const rowsPengeluaran = pengeluaran.map((item, index) => ({
    No: index + 1,
    'ID Transaksi': item.id,
    Tanggal: item.tanggal,
    Penerima: item.penerima,
    Kategori: item.kategori,
    'Nominal (Rp)': item.nominal,
    'Sumber Kas': item.sumberKas,
    Petugas: item.petugas,
    Catatan: item.catatan || '-',
  }));
  const wsPengeluaran = XLSX.utils.json_to_sheet(rowsPengeluaran);
  XLSX.utils.book_append_sheet(wb, wsPengeluaran, 'Kas Pengeluaran');

  // Sheet 3: Master Data Santri
  const rowsSantri = santriList.map((s, index) => ({
    No: index + 1,
    NIS: s.nis,
    Nama: s.nama,
    Kelas: s.kelas,
    'Nama Wali': s.namaOrangTua,
    'No. WhatsApp Wali': s.noWaOrangTua,
    Status: s.status,
    Kategori: s.kategoriSantri,
    'Tunggakan TA Lalu (Rp)': s.tunggakanSppTahunLalu,
  }));
  const wsSantri = XLSX.utils.json_to_sheet(rowsSantri);
  XLSX.utils.book_append_sheet(wb, wsSantri, 'Data Santri');

  // Write Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(data, `Laporan_Keuangan_MTQ_Darul_Abidin_${periodeText.replace(/\s+/g, '_')}.xlsx`);
};

/**
 * Export Financial Summary Report to Microsoft Word (.docx)
 */
export const exportToWord = async (
  pemasukan: TransaksiPemasukan[],
  pengeluaran: TransaksiPengeluaran[],
  summary: SummaryKas,
  periodeTitle: string = 'Laporan Keuangan MTQ Darul Abidin'
) => {
  const totalInMTQ = pemasukan.filter(i => i.sumberKas === 'Kas MTQ').reduce((a, b) => a + b.nominal, 0);
  const totalInDonatur = pemasukan.filter(i => i.sumberKas === 'Kas Donatur').reduce((a, b) => a + b.nominal, 0);
  const totalOutMTQ = pengeluaran.filter(i => i.sumberKas === 'Kas MTQ').reduce((a, b) => a + b.nominal, 0);
  const totalOutDonatur = pengeluaran.filter(i => i.sumberKas === 'Kas Donatur').reduce((a, b) => a + b.nominal, 0);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'MTQ DARUL ABIDIN',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: periodeTitle.toUpperCase(),
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `Tanggal Dicetak: ${formatDateIndo(new Date().toISOString().split('T')[0])}`,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: '' }), // Spacer

          new Paragraph({
            text: 'I. RINGKASAN SALDO & ARUS KAS',
            heading: HeadingLevel.HEADING_3,
          }),

          // Table Summary
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Komponen Kas', children: [new TextRun({ bold: true, text: 'Komponen Kas' })] })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Total Pemasukan', children: [new TextRun({ bold: true, text: 'Total Pemasukan' })] })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Total Pengeluaran', children: [new TextRun({ bold: true, text: 'Total Pengeluaran' })] })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Saldo Akhir', children: [new TextRun({ bold: true, text: 'Saldo Akhir' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Kas MTQ')] }),
                  new TableCell({ children: [new Paragraph(formatRupiah(totalInMTQ))] }),
                  new TableCell({ children: [new Paragraph(formatRupiah(totalOutMTQ))] }),
                  new TableCell({ children: [new Paragraph(formatRupiah(summary.totalKasMTQ))] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Kas Donatur')] }),
                  new TableCell({ children: [new Paragraph(formatRupiah(totalInDonatur))] }),
                  new TableCell({ children: [new Paragraph(formatRupiah(totalOutDonatur))] }),
                  new TableCell({ children: [new Paragraph(formatRupiah(summary.totalKasDonatur))] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ bold: true, text: 'TOTAL KESELURUHAN' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ bold: true, text: formatRupiah(totalInMTQ + totalInDonatur) })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ bold: true, text: formatRupiah(totalOutMTQ + totalOutDonatur) })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ bold: true, text: formatRupiah(summary.totalKasMTQ + summary.totalKasDonatur) })] })] }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'II. RINCIAN TRANSAKSI PEMASUKAN TERAKHIR',
            heading: HeadingLevel.HEADING_3,
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ bold: true, text: 'Tanggal' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ bold: true, text: 'Nama Pembayar' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ bold: true, text: 'Kategori' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ bold: true, text: 'Nominal' })] })] }),
                ],
              }),
              ...pemasukan.slice(0, 15).map(
                p =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph(formatDateIndo(p.tanggal))] }),
                      new TableCell({ children: [new Paragraph(p.namaPembayar)] }),
                      new TableCell({ children: [new Paragraph(p.kategori)] }),
                      new TableCell({ children: [new Paragraph(formatRupiah(p.nominal))] }),
                    ],
                  })
              ),
            ],
          }),

          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'III. RINCIAN TRANSAKSI PENGELUARAN TERAKHIR',
            heading: HeadingLevel.HEADING_3,
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ bold: true, text: 'Tanggal' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ bold: true, text: 'Penerima' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ bold: true, text: 'Kategori' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ bold: true, text: 'Nominal' })] })] }),
                ],
              }),
              ...pengeluaran.slice(0, 15).map(
                e =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph(formatDateIndo(e.tanggal))] }),
                      new TableCell({ children: [new Paragraph(e.penerima)] }),
                      new TableCell({ children: [new Paragraph(e.kategori)] }),
                      new TableCell({ children: [new Paragraph(formatRupiah(e.nominal))] }),
                    ],
                  })
              ),
            ],
          }),

          new Paragraph({ text: '' }),
          new Paragraph({ text: 'Laporan ini disahkan oleh Panitia Keuangan & Pimpinan MTQ Darul Abidin.', alignment: AlignmentType.RIGHT }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Laporan_Keuangan_MTQ_Darul_Abidin_${new Date().toISOString().split('T')[0]}.docx`);
};

/**
 * Generate formatted WhatsApp summary text to share financial reports directly to WA groups or pimpinan
 */
export const generateWaReportSummaryText = (
  pemasukan: TransaksiPemasukan[],
  pengeluaran: TransaksiPengeluaran[],
  summary: SummaryKas,
  periodeName: string = 'Bulan Ini'
): string => {
  const totalIn = pemasukan.reduce((a, b) => a + b.nominal, 0);
  const totalOut = pengeluaran.reduce((a, b) => a + b.nominal, 0);

  // Grouping pemasukan per category
  const inCategorySummary: Record<string, number> = {};
  pemasukan.forEach(item => {
    inCategorySummary[item.kategori] = (inCategorySummary[item.kategori] || 0) + item.nominal;
  });

  let categoryInText = '';
  Object.entries(inCategorySummary).forEach(([cat, nom]) => {
    categoryInText += `  • ${cat}: *${formatRupiah(nom)}*\n`;
  });

  return `*LAPORAN RINGKASAN KEUANGAN MTQ DARUL ABIDIN*
*PERIODE:* ${periodeName.toUpperCase()}
========================================

📌 *ARUS KAS & SALDO SAAT INI:*
💰 *Saldo Kas MTQ:* ${formatRupiah(summary.totalKasMTQ)}
🤲 *Saldo Kas Donatur:* ${formatRupiah(summary.totalKasDonatur)}
🏷️ *Total Saldo Kas Gabungan:* ${formatRupiah(summary.totalKasMTQ + summary.totalKasDonatur)}

----------------------------------------
📥 *REKAP PEMASUKAN (${periodeName}):*
Total: *${formatRupiah(totalIn)}*
Rincian per Kategori:
${categoryInText || '  (Belum ada transaksi)\n'}
----------------------------------------
📤 *REKAP PENGELUARAN (${periodeName}):*
Total: *${formatRupiah(totalOut)}*

----------------------------------------
⚠️ *TOTAL TUNGGAKAN SPP SANTRI:*
Total Tunggakan: *${formatRupiah(summary.totalTunggakanSpp)}*

_Demikian Laporan Keuangan MTQ Darul Abidin disampaikan secara transparan. Jazakumullah Khairan._
🗓️ _Update: ${formatDateIndo(new Date().toISOString().split('T')[0])}_`;
};
