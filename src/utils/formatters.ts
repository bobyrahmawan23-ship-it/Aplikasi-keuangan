import { TransaksiPemasukan, Santri } from '../types';

export const formatRupiah = (number: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(number);
};

export const formatDateIndo = (dateStr: string): string => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
};

/**
 * Validates and converts phone number into standard 628xxxxxxxx format
 */
export const formatPhoneWA = (phone: string): { formatted: string; isValid: boolean; errorReason?: string } => {
  if (!phone) {
    return { formatted: '', isValid: false, errorReason: 'Nomor WhatsApp kosong' };
  }

  // Remove non-numeric characters except +
  let cleaned = phone.replace(/[^0-9]/g, '');

  if (cleaned.startsWith('08')) {
    cleaned = '628' + cleaned.substring(2);
  } else if (cleaned.startsWith('8')) {
    cleaned = '628' + cleaned.substring(1);
  } else if (cleaned.startsWith('6208')) {
    cleaned = '628' + cleaned.substring(4);
  }

  // Indonesian mobile numbers are usually between 10 to 14 digits starting with 628
  const isValid = /^628[1-9][0-9]{7,11}$/.test(cleaned);

  return {
    formatted: cleaned,
    isValid,
    errorReason: isValid ? undefined : 'Format nomor harus diawali 08/628 dan 10-14 digit angka',
  };
};

/**
 * Generates WhatsApp click-to-chat URL
 */
export const generateWaReceiptLink = (phone: string, textMessage: string): string => {
  const { formatted } = formatPhoneWA(phone);
  const encodedText = encodeURIComponent(textMessage);
  return `https://wa.me/${formatted}?text=${encodedText}`;
};

/**
 * Generates digital receipt text template
 */
export const generateWaReceiptText = (trx: TransaksiPemasukan, santri?: Santri): string => {
  const tanggalFormatted = formatDateIndo(trx.tanggal);
  const nominalFormatted = formatRupiah(trx.nominal);

  let studentBlock = '';
  if (santri) {
    studentBlock = `*NAMA SANTRI:* ${santri.nama}\n*NIS:* ${santri.nis}\n*KELAS:* ${santri.kelas}\n*WALI:* ${santri.namaOrangTua}\n`;
  } else if (trx.namaPembayar) {
    studentBlock = `*NAMA PEMBAYAR/DONATUR:* ${trx.namaPembayar}\n`;
  }

  return `*KWITANSI DIGITAL RESMI*
*MTQ DARUL ABIDIN*
===========================
*No. Kwitansi:* ${trx.id}
*Tanggal:* ${tanggalFormatted}

${studentBlock}*RINCIAN PEMBAYARAN:*
• Kategori: *${trx.kategori}*
${trx.bulanSpp ? `• Bulan/Periode: *${trx.bulanSpp}*\n` : ''}• Tahun Ajaran: *${trx.tahunAjaran}*
• Sumber Kas: *${trx.sumberKas}*
• Metode: *${trx.metodePembayaran}*
• Status: *${trx.status.toUpperCase()}*

---------------------------
*TOTAL DITERIMA:*
👉 *${nominalFormatted}*
---------------------------
*Catatan:* ${trx.catatan || 'Pembayaran diterima dengan baik.'}

_Syukron jazakumullah khairan atas pembayaran/infaq Bapak/Ibu. Semoga menjadi amal jariyah dan membawa keberkahan bagi ananda santri._

*Bendahara MTQ Darul Abidin*
📌 _Pesan ini dibuat otomatis oleh Sistem Keuangan MTQ Darul Abidin_`;
};
