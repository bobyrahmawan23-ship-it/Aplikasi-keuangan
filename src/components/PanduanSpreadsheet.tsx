import React, { useState } from 'react';
import {
  BookOpenCheck,
  FileSpreadsheet,
  Code,
  Smartphone,
  Laptop,
  Copy,
  Check,
  HelpCircle,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

export const PanduanSpreadsheet: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const gasCode = `/**
 * GOOGLE APPS SCRIPT (GAS) - MTQ DARUL ABIDIN
 * Otomasi Pengiriman Kwitansi & Rekap Keuangan via WhatsApp API / Fonnte / Wablas
 */

function kirimKwitansiWA(noWa, namaSantri, nominal, kategori, noKwitansi) {
  var token = "TOKEN_API_WHATSAPP_ANDA"; // Contoh: Fonnte / Wablas Token
  var url = "https://api.fonnte.com/send"; // Endpoint provider WA Gateway

  // Format Nomor ke Standard 628
  var formattedNo = noWa.toString().replace(/[^0-9]/g, '');
  if (formattedNo.indexOf('08') === 0) {
    formattedNo = '628' + formattedNo.substring(2);
  }

  var pesan = "*KWITANSI DIGITAL RESMI MTQ DARUL ABIDIN*\\n" +
              "----------------------------------------\\n" +
              "No. Kwitansi: *" + noKwitansi + "*\\n" +
              "Nama Santri: *" + namaSantri + "*\\n" +
              "Kategori: *" + kategori + "*\\n" +
              "Nominal: *Rp " + Number(nominal).toLocaleString('id-ID') + "*\\n" +
              "----------------------------------------\\n" +
              "Syukron Jazakumullah Khairan atas pembayaran/infaqnya.";

  var payload = {
    "target": formattedNo,
    "message": pesan
  };

  var options = {
    "method": "post",
    "headers": {
      "Authorization": token
    },
    "payload": payload,
    "muteHttpExceptions": true
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    Logger.log("Hasil Kirim: " + response.getContentText());
    return true;
  } catch (e) {
    Logger.log("Error GAS: " + e.toString());
    return false;
  }
}`;

  const vbaCode = `' VBA MACRO EXCEL DESKTOP - MTQ DARUL ABIDIN
' Membuat Link WhatsApp Otomatis & Format Nomor Telepon Konsisten

Sub BuatLinkWhatsAppKwitansi()
    Dim ws As Worksheet
    Dim lastRow As Long
    Dim i As Long
    Dim phoneStr As String
    Dim namaSantri As String
    Dim nominal As Double
    Dim waLink As String
    Dim messageText As String
    
    Set ws = ThisWorkbook.Sheets("Kas_Pemasukan")
    lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    
    For i = 2 To lastRow
        phoneStr = Trim(CStr(ws.Cells(i, 6).Value)) ' Kolom F: No WA
        namaSantri = ws.Cells(i, 4).Value           ' Kolom D: Nama Santri
        nominal = CDbl(ws.Cells(i, 7).Value)         ' Kolom G: Nominal
        
        ' Formatter Nomor HP ke 628
        phoneStr = Replace(phoneStr, "-", "")
        phoneStr = Replace(phoneStr, " ", "")
        If Left(phoneStr, 2) = "08" Then
            phoneStr = "628" & Mid(phoneStr, 3)
        End If
        
        messageText = "KWITANSI DIGITAL MTQ DARUL ABIDIN%0ANama: " & namaSantri & "%0ANominal: Rp " & Format(nominal, "#,##0")
        waLink = "https://wa.me/" & phoneStr & "?text=" & messageText
        
        ' Masukkan Link ke Kolom H (Aksi WA)
        ws.Hyperlinks.Add Anchor:=ws.Cells(i, 8), Address:=waLink, TextToDisplay:="Kirim WA Kwitansi"
    Next i
    
    MsgBox "Proses Pembuatan Link Kwitansi WA Selesai!", vbInformation, "MTQ Darul Abidin"
End Sub`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
          Panduan Lengkap, Rumus Excel/Sheets & Skrip Otomasi
        </h2>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Panduan teknis pengoperasian aplikasi di Laptop & HP, struktur database Google Sheets, rumus rekapitulasi, serta kode skrip GAS & VBA.
        </p>
      </div>

      {/* 1. Panduan Penggunaan Mobile (HP) & Laptop */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-indigo-600" /> 1. Petunjuk Penggunaan di Laptop & Smartphone (HP)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-indigo-50/50 border border-indigo-200 rounded-lg space-y-1.5">
            <h4 className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
              <Laptop className="w-4 h-4 text-indigo-700" /> Akses Melalui Laptop / PC Browser
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-slate-700 leading-relaxed text-[11px]">
              <li>Aplikasi berbasis Web Apps responsive yang berjalan di semua browser (Chrome, Edge, Safari).</li>
              <li>Tersimpan secara online dan tersinkronisasi otomatis saat Log In/Log Out dari perangkat manapun.</li>
              <li>Dapat mengeksport laporan dalam format <strong>Excel (.xlsx)</strong> dan <strong>Word (.docx)</strong> secara instan.</li>
              <li>Mendukung pencetakan fisik laporan dan kwitansi digital via driver printer terhubung.</li>
            </ul>
          </div>

          <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg space-y-1.5">
            <h4 className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
              <Smartphone className="w-4 h-4 text-amber-700" /> Akses Melalui Smartphone (HP Android / iOS)
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-slate-700 leading-relaxed text-[11px]">
              <li>Tampilan menyesuaikan layar HP secara otomatis dengan navigasi bottom bar yang fleksibel.</li>
              <li>
                Tombol <strong>"Kirim WA"</strong> akan secara otomatis membuka aplikasi WhatsApp Mobile di HP tanpa perlu menyimpan nomor kontak terlebih dahulu.
              </li>
              <li>Mendukung pemindaian QRIS langsung melalui kamera HP untuk proses pembayaran instan.</li>
              <li>Format nomor WhatsApp diverifikasi otomatis sebelum pengiriman pesan agar tidak terjadi kegagalan.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Rekomendasi Struktur Sheet / Tab Spreadsheet */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" /> 2. Rekomendasi Struktur Tab / Sheet Spreadsheet (Excel & Google Sheets)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold text-indigo-900 block mb-0.5 text-xs">Sheet 1: Data_Santri</span>
            <p className="text-slate-600 text-[11px]">Kolom: NIS, Nama_Santri, Kelas, Nama_Wali, No_WA_Wali, Status, Kategori_Santri, Tunggakan_TA_Lalu.</p>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold text-indigo-900 block mb-0.5 text-xs">Sheet 2: Kas_Pemasukan</span>
            <p className="text-slate-600 text-[11px]">Kolom: ID_Transaksi, Tanggal, NIS, Nama_Pembayar, Kategori, Nominal, Sumber_Kas, Metode, Tahun_Ajaran, Bulan_SPP, Catatan.</p>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold text-indigo-900 block mb-0.5 text-xs">Sheet 3: Kas_Pengeluaran</span>
            <p className="text-slate-600 text-[11px]">Kolom: ID_Transaksi, Tanggal, Penerima, Kategori_Pengeluaran, Nominal, Sumber_Kas, Petugas, Catatan.</p>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold text-indigo-900 block mb-0.5 text-xs">Sheet 4: Rekap_Bulanan_Tahunan</span>
            <p className="text-slate-600 text-[11px]">Formula SUMIFS & COUNTIFS untuk menghitung total pemasukan & pengeluaran per kategori per bulan.</p>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold text-indigo-900 block mb-0.5 text-xs">Sheet 5: Kartu_Kendali_Santri</span>
            <p className="text-slate-600 text-[11px]">Pencarian VLOOKUP/XLOOKUP status SPP 12 bulan (Juli-Juni) untuk santri pilihan.</p>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold text-indigo-900 block mb-0.5 text-xs">Sheet 6: Log_WhatsApp</span>
            <p className="text-slate-600 text-[11px]">Log pengiriman kwitansi: Tanggal, No_WA, Nama_Penerima, Status (Terkirim, Dibaca, Pending, Gagal).</p>
          </div>
        </div>
      </div>

      {/* 3. Formula Excel / Google Sheets */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-indigo-600" /> 3. Formula Rumus Excel & Google Sheets Utama
        </h3>

        <div className="space-y-2.5 text-xs">
          {/* Rumus 1: SUMIFS */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">A. Rekap Total Pemasukan per Kategori & Bulan (SUMIFS)</span>
              <button
                onClick={() => handleCopy('=SUMIFS(Kas_Pemasukan!F:F, Kas_Pemasukan!E:E, "SPP Bulanan", Kas_Pemasukan!B:B, ">=2026-07-01")', 'sumifs')}
                className="text-[10px] bg-slate-200 hover:bg-slate-300 font-bold px-2 py-0.5 rounded flex items-center gap-1"
              >
                {copiedSection === 'sumifs' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />} Copy Formula
              </button>
            </div>
            <code className="block p-2 bg-slate-950 text-amber-300 rounded font-mono overflow-x-auto text-[11px]">
              =SUMIFS(Kas_Pemasukan!F:F, Kas_Pemasukan!E:E, "SPP Bulanan", Kas_Pemasukan!G:G, "Kas MTQ")
            </code>
            <p className="text-slate-500 text-[11px]">Penjelasan: Menjumlahkan total nominal kas masuk khusus untuk Kategori 'SPP Bulanan' pada 'Kas MTQ'.</p>
          </div>

          {/* Rumus 2: Link WhatsApp */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">B. Formula Generator Link WhatsApp Otomatis</span>
              <button
                onClick={() =>
                  handleCopy(
                    '=HYPERLINK("https://wa.me/" & IF(LEFT(E2,2)="08","628"&MID(E2,3,20),E2) & "?text=" & ENCODEURL("KWITANSI MTQ DARUL ABIDIN: " & A2), "Kirim WA")',
                    'walink'
                  )
                }
                className="text-[10px] bg-slate-200 hover:bg-slate-300 font-bold px-2 py-0.5 rounded flex items-center gap-1"
              >
                {copiedSection === 'walink' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />} Copy Formula
              </button>
            </div>
            <code className="block p-2 bg-slate-950 text-amber-300 rounded font-mono overflow-x-auto text-[11px]">
              =HYPERLINK("https://wa.me/" & IF(LEFT(E2,2)="08","628"&MID(E2,3,20),E2) & "?text=" & ENCODEURL("Kwitansi MTQ: " & B2), "Kirim WA")
            </code>
            <p className="text-slate-500 text-[11px]">Penjelasan: Mengubah format nomor 08xx menjadi 628xx dan membuat tombol tautan langsung ke WA.</p>
          </div>

          {/* Rumus 3: QUERY Google Sheets */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">C. Google Sheets QUERY Dynamic Report</span>
              <button
                onClick={() => handleCopy('=QUERY(Kas_Pemasukan!A:K, "SELECT E, SUM(F) GROUP BY E LABEL SUM(F) \'Total (Rp)\'", 1)', 'query')}
                className="text-[10px] bg-slate-200 hover:bg-slate-300 font-bold px-2 py-0.5 rounded flex items-center gap-1"
              >
                {copiedSection === 'query' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />} Copy Formula
              </button>
            </div>
            <code className="block p-2 bg-slate-950 text-amber-300 rounded font-mono overflow-x-auto text-[11px]">
              =QUERY(Kas_Pemasukan!A:K, "SELECT E, SUM(F) GROUP BY E LABEL SUM(F) 'Total Penerimaan'", 1)
            </code>
            <p className="text-slate-500 text-[11px]">Penjelasan: Membuat tabel rekapitulasi dinamis berdasarkan Kategori Pemasukan.</p>
          </div>
        </div>
      </div>

      {/* 4. Skrip Otomasi GAS & VBA */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-2">
          <Code className="w-4 h-4 text-indigo-600" /> 4. Skrip Otomasi Google Apps Script (GAS) & VBA Excel
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
          {/* GAS Code */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs">Google Apps Script (Google Sheets Web)</span>
              <button
                onClick={() => handleCopy(gasCode, 'gas')}
                className="text-[10px] bg-slate-200 hover:bg-slate-300 font-bold px-2 py-0.5 rounded flex items-center gap-1"
              >
                {copiedSection === 'gas' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />} Copy GAS Script
              </button>
            </div>
            <pre className="p-3 bg-slate-950 text-emerald-300 rounded-lg font-mono text-[11px] overflow-x-auto max-h-72 leading-relaxed border border-slate-800">
              {gasCode}
            </pre>
          </div>

          {/* VBA Code */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs">VBA Macro Script (Microsoft Excel Desktop)</span>
              <button
                onClick={() => handleCopy(vbaCode, 'vba')}
                className="text-[10px] bg-slate-200 hover:bg-slate-300 font-bold px-2 py-0.5 rounded flex items-center gap-1"
              >
                {copiedSection === 'vba' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />} Copy VBA Script
              </button>
            </div>
            <pre className="p-3 bg-slate-950 text-amber-300 rounded-lg font-mono text-[11px] overflow-x-auto max-h-72 leading-relaxed border border-slate-800">
              {vbaCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
