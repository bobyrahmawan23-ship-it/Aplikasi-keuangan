import React, { useState } from 'react';
import { Santri, TransaksiPemasukan, ReminderTemplate } from '../types';
import { formatRupiah, generateWaReceiptLink, formatPhoneWA } from '../utils/formatters';
import {
  MessageSquare,
  Send,
  Copy,
  Check,
  Shuffle,
  Users,
  Sparkles,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Building2,
  Phone,
  Edit3,
  RefreshCw,
  Search,
} from 'lucide-react';

interface PengingatSppDashboardProps {
  santriList: Santri[];
  pemasukanList: TransaksiPemasukan[];
  addToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
}

export const reminderTemplates: ReminderTemplate[] = [
  {
    id: 'tmpl-islami',
    title: 'Sentuhan Qur\'ani & Mahkota Cahaya (Menyentuh Kalbu)',
    category: 'islami',
    badge: 'Islami & Berkah',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    template: ({ bulan, jatuhTempo, nominal, noRekBSI, noRekBRI, atasNama, kontakBendahara }) =>
`🕌 *BISMILLAHIRRAHMANIRRAHIM* 🕌
*ASSALAMU'ALAIKUM WARAHMATULLAHI WABARAKATUH*

Kepada Yang Terhormat,
*Bapak/Ibu Seluruh Wali Santri MTQ Darul Abidin*
Yang senantiasa dirahmati & diberkahi Allah Subhanahu wa Ta'ala.

════════════════════════════════════
📖 _"Siapa yang membaca Al-Qur'an, mempelajarinya, dan mengamalkannya, maka dipakaikan mahkota dari cahaya pada hari kiamat kepada kedua orang tuanya..."_ (HR. Hakim)
════════════════════════════════════

Segala puji bagi Allah atas limpahan karunia-Nya yang memperkenankan ananda tercinta terus berjuang menghafal dan memuliakan Kalam Suci Al-Qur'an di *MTQ Darul Abidin*.

Melalui pesan ini, kami dari pengurus & bendahara madrasah menginfokan terkait *INFAQ SPP BULANAN (${bulan.toUpperCase()})*:

📌 *Nominal SPP:* ${nominal} / Santri
📅 *Batas Pembayaran:* Paling lambat *${jatuhTempo}*

Infaq SPP yang Bapak/Ibu tunaikan adalah wasilah operasional santri, insentif para asatidz/asatidzah pembimbing Al-Qur'an, serta ladang amal jariyah yang pahalanya tiada terputus.

💳 *SALURAN PEMBAYARAN RESMI:*
• *Bank Syariah Indonesia (BSI):* \`${noRekBSI}\`
• *Bank BRI:* \`${noRekBRI}\`
• *Atas Nama:* *${atasNama}*

📲 *KONFIRMASI PEMBAYARAN:*
Mohon kirimkan foto/bukti transfer ke nomor bendahara:
Wa.me/${kontakBendahara.replace(/[^0-9]/g, '')}
_Format:_ \`Nama Santri / Kelas / Bulan ${bulan}\`

Semoga Allah membalas kebaikan Bapak/Ibu dengan kelapangan rezeki yang halal, keluarga sakinah, serta ananda yang kelak menjadi syafaat di akhirat. Aamiin Ya Rabbal 'Alamin. 🤲

Hormat kami,
*Pengurus & Bendahara MTQ Darul Abidin*`,
  },
  {
    id: 'tmpl-santun',
    title: 'Santun & Penuh Doa (Formal Kehangatan Keluarga)',
    category: 'santun',
    badge: 'Santun & Formal',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    template: ({ bulan, jatuhTempo, nominal, noRekBSI, noRekBRI, atasNama, kontakBendahara }) =>
`🌸 *ASSALAMU'ALAIKUM WARAHMATULLAHI WABARAKATUH* 🌸

Semoga Bapak dan Ibu Wali Santri sekalian senantiasa dalam limpahan kesehatan, taufiq, dan keberkahan dari Allah Ta'ala.

Kami segenap asatidz dan pengurus *MTQ Darul Abidin* mengucapkan *Jazakumullahu Khairan Katsiran* atas amanah dan kepercayaan Bapak/Ibu yang senantiasa mendampingi putra-putri tercinta dalam thalabul 'ilmi menghafal Al-Qur'an.

Berikut kami sampaikan pengingat administrasi *SPP BULAN ${bulan.toUpperCase()}*:
════════════════════════════════════
🔹 *Kewajiban SPP:* ${nominal}
🔹 *Jatuh Tempo:* *${jatuhTempo}*
════════════════════════════════════

Pembayaran dapat ditunaikan melalui rekening madrasah:
🏛️ *BSI:* \`${noRekBSI}\`
🏛️ *BRI:* \`${noRekBRI}\`
🏷️ *a.n:* *${atasNama}*

Bagi Bapak/Ibu yang telah menunaikan pembayaran, kami haturkan terima kasih teriring doa barakallah. Bagi yang belum, kami nantikan sebelum tanggal jatuh tempo demi kelancaran kegiatan belajar ananda.

Terima kasih atas perhatian dan kerja sama yang baik.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.

*Divisi Keuangan MTQ Darul Abidin*`,
  },
  {
    id: 'tmpl-kompak',
    title: 'Kompak & Ceria (Gaya Ramah Akrab Grup WA)',
    category: 'kompak',
    badge: 'Akrab & Ceria',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    template: ({ bulan, jatuhTempo, nominal, noRekBSI, noRekBRI, atasNama, kontakBendahara }) =>
`✨ *HALO BAPAK / IBU WALI SANTRI MTQ DARUL ABIDIN!* ✨
Assalamu'alaikum Warahmatullahi Wabarakatuh 🌿

Semoga hari ini penuh semangat dan senyum kebahagiaan untuk kita semua ya! 😊

Waktu bergulir cepat, Alhamdulillah kegiatan halaqah tahfidz ananda di MTQ Darul Abidin berjalan khidmat dan penuh keceriaan.

📢 *PENGINGAT SPP BULANAN (${bulan.toUpperCase()}):*
Agar proses belajar, fasilitas, serta konsumsi santri senantiasa optimal, yuk kita selesaikan administrasi SPP ananda sebelum tanggal jatuh tempo:

🎯 *Nominal:* ${nominal}
⏰ *Batas Waktu:* *${jatuhTempo}*

Transfer ke rekening resmi MTQ:
💳 *BSI:* \`${noRekBSI}\`
💳 *BRI:* \`${noRekBRI}\`
*(a.n ${atasNama})*

Setelah transfer, yuk kirimkan buktinya ke wa admin:
👉 Wa.me/${kontakBendahara.replace(/[^0-9]/g, '')}

Semangat selalu mendampingi para calon hafiz/hafizah kebanggaan keluarga! 🚀🤍

Salam Hangat,
*Keluarga Besar MTQ Darul Abidin*`,
  },
  {
    id: 'tmpl-puitis',
    title: 'Mutiara Hikmah & Mahkota Akhirat (Puitis Spiritual)',
    category: 'puitis',
    badge: 'Mutiara Hikmah',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    template: ({ bulan, jatuhTempo, nominal, noRekBSI, noRekBRI, atasNama, kontakBendahara }) =>
`📜 *SETIAP RUPIAH, MENJADI SAKSI AL-QUR'AN* 📜
Assalamu'alaikum Wr. Wb.

Sahabat shalih/shalihah para Wali Santri MTQ Darul Abidin,
Harta yang kita belanjakan untuk bekal ananda menghafal kalamullah adalah sebaik-baik perniagaan yang tak akan pernah merugi.

Menjelang tanggal jatuh tempo, izinkan kami mengingatkan infaq *SPP BULAN ${bulan.toUpperCase()}*:
════════════════════════════════════
💎 *Nominal:* ${nominal}
⌛ *Tenggat Waktu:* *${jatuhTempo}*
════════════════════════════════════

Saluran Donasi & SPP Resmi:
• BSI: \`${noRekBSI}\`
• BRI: \`${noRekBRI}\`
• a.n: *${atasNama}*

Konfirmasi: Wa.me/${kontakBendahara.replace(/[^0-9]/g, '')}

Semoga setiap rezeki yang dikeluarkan diganti Allah dengan berlipat ganda berkah dan kesehatan sekeluarga. Aamiin.

*Pengurus Majelis Ta'lim & Tahfidz Darul Abidin*`,
  },
  {
    id: 'tmpl-tempo',
    title: 'Pemberitahuan Jatuh Tempo (Tegas, Rapi & Sistematis)',
    category: 'tempo',
    badge: 'Jatuh Tempo',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    template: ({ bulan, jatuhTempo, nominal, noRekBSI, noRekBRI, atasNama, kontakBendahara }) =>
`🔔 *PEMBERITAHUAN JATUH TEMPO SPP SANTRI* 🔔
*MTQ DARUL ABIDIN*
══════════════════════════════════════════
Kepada: Yth. Seluruh Bapak/Ibu Wali Santri
Perihal: Pembayaran SPP Bulan *${bulan.toUpperCase()}*

Diberitahukan bahwa batas akhir pembayaran SPP bulanan ananda santri MTQ Darul Abidin adalah pada:
🗓️ *Hari/Tgl:* *${jatuhTempo}*
💰 *Jumlah:* ${nominal} / Santri

Kanal Pembayaran Terverifikasi:
1. *BSI (Bank Syariah Indonesia):* \`${noRekBSI}\`
2. *BRI:* \`${noRekBRI}\`
3. *Atas Nama:* *${atasNama}*

Bagi Bapak/Ibu yang telah menunaikan pembayaran, mohon abaikan pesan ini atau kirimkan struk transfer untuk penerbitan kwitansi digital resmi.

Atas kerja sama dan ketepatan waktunya, kami sampaikan terima kasih.

*Bagian Administrasi & Keuangan MTQ Darul Abidin*`,
  },
  {
    id: 'tmpl-awal',
    title: 'Edisi Semangat Awal Bulan Baru (Thalabul \'Ilmi)',
    category: 'awal_bulan',
    badge: 'Awal Bulan',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    template: ({ bulan, jatuhTempo, nominal, noRekBSI, noRekBRI, atasNama, kontakBendahara }) =>
`🌙 *MARHABAN BULAN ${bulan.toUpperCase()}!* 🌙
*Assalamu'alaikum Warahmatullahi Wabarakatuh*

Bismillah, menyambut lembaran baru bulan ${bulan}, semoga Allah menganugerahkan kesehatan, kelancaran rezeki, serta bertambahnya hafalan Al-Qur'an bagi seluruh santri MTQ Darul Abidin.

Di awal bulan ini, pengurus membuka layanan pembayaran *SPP BULAN ${bulan.toUpperCase()}*:
• Nominal SPP: *${nominal}*
• Jatuh Tempo: *${jatuhTempo}*
• Rekening BSI: \`${noRekBSI}\` (a.n ${atasNama})
• Rekening BRI: \`${noRekBRI}\` (a.n ${atasNama})

Yuk tunaikan di awal waktu agar operasional pendidikan ananda semakin berkah dan lancar. 

Konfirmasi setoran via WhatsApp Bendahara:
Wa.me/${kontakBendahara.replace(/[^0-9]/g, '')}

Jazakumullahu khairan katsiran.
*MTQ Darul Abidin*`,
  },
];

export const PengingatSppDashboard: React.FC<PengingatSppDashboardProps> = ({
  santriList,
  pemasukanList,
  addToast,
}) => {
  // Form Variables
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [bulan, setBulan] = useState<string>('Oktober 2026');
  const [jatuhTempo, setJatuhTempo] = useState<string>('10 Oktober 2026');
  const [nominal, setNominal] = useState<string>('Sesuai Ketentuan Santri');
  const [noRekBSI, setNoRekBSI] = useState<string>('7171 2026 0192');
  const [noRekBRI, setNoRekBRI] = useState<string>('0123 0100 2026 531');
  const [atasNama, setAtasNama] = useState<string>("MAHAD TAHFIDZ QUR'AN DARUL ABIDIN");
  const [kontakBendahara, setKontakBendahara] = useState<string>('081234567890');

  const [isEditingCustom, setIsEditingCustom] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const currentTemplate = reminderTemplates[selectedTemplateIndex];

  // Generated message text
  const generatedMessage = isEditingCustom
    ? customText
    : currentTemplate.template({
        bulan,
        jatuhTempo,
        nominal,
        noRekBSI,
        noRekBRI,
        atasNama,
        kontakBendahara,
      });

  // Calculate unpaid students for this month
  const unpaidStudents = React.useMemo(() => {
    const monthKey = bulan.split(' ')[0].toLowerCase();
    return santriList.filter(s => {
      const isPaid = pemasukanList.some(
        p =>
          (p.santriId === s.nis || p.namaPembayar.toLowerCase().includes(s.nama.toLowerCase())) &&
          p.kategori === 'SPP Bulanan' &&
          p.bulanSpp &&
          p.bulanSpp.toLowerCase().includes(monthKey)
      );
      return !isPaid;
    });
  }, [santriList, pemasukanList, bulan]);

  const paidStudentsCount = santriList.length - unpaidStudents.length;
  const percentagePaid = santriList.length > 0 ? Math.round((paidStudentsCount / santriList.length) * 100) : 0;

  // Shuffle / Random template
  const handleShuffle = () => {
    let nextIdx = Math.floor(Math.random() * reminderTemplates.length);
    if (nextIdx === selectedTemplateIndex) {
      nextIdx = (selectedTemplateIndex + 1) % reminderTemplates.length;
    }
    setSelectedTemplateIndex(nextIdx);
    setIsEditingCustom(false);
    addToast('info', 'Kalimat Pengingat Berganti', `Berganti ke: "${reminderTemplates[nextIdx].title}"`);
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    addToast('success', 'Pesan Berhasil Disalin', 'Pesan broadcast siap ditempel di grup WhatsApp wali santri.');
    setTimeout(() => setCopied(false), 2500);
  };

  // Open WhatsApp ready to broadcast to Group
  const handleSendToGroup = () => {
    const link = `https://api.whatsapp.com/send?text=${encodeURIComponent(generatedMessage)}`;
    window.open(link, '_blank');
    addToast('success', 'Membuka WhatsApp', 'Pilih Grup WhatsApp Wali Santri MTQ untuk mengirimkan broadcast.');
  };

  // Send Personal Message to single parent
  const handleSendPersonalWa = (santri: Santri) => {
    const phoneCheck = formatPhoneWA(santri.noWaOrangTua);
    if (!phoneCheck.isValid) {
      addToast('error', 'Nomor Tidak Valid', `Nomor WA ${santri.namaOrangTua} (${santri.noWaOrangTua}) tidak valid.`);
      return;
    }

    const personalMessage =
`Assalamu'alaikum Wr. Wb. Yth. Bapak/Ibu *${santri.namaOrangTua}* (Wali dari *${santri.nama}* - ${santri.kelas}) di MTQ Darul Abidin.

Semoga senantiasa dalam limpahan berkah Allah Ta'ala. Kami menginfokan pengingat SPP ananda bulan *${bulan}* senilai *${nominal}* yang akan jatuh tempo pada *${jatuhTempo}*.

Rekening resmi madrasah:
• BSI: \`${noRekBSI}\` a.n ${atasNama}
• BRI: \`${noRekBRI}\` a.n ${atasNama}

Jika sudah melakukan transfer, mohon kirimkan buktinya ke nomor ini. Jazakumullahu khairan katsiran.
_Bendahara MTQ Darul Abidin_`;

    const link = generateWaReceiptLink(phoneCheck.formatted, personalMessage);
    window.open(link, '_blank');
    addToast('info', 'Pengingat Personal Terbuka', `Membuka pesan personal ke wali ananda ${santri.nama}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
            Dasbor Pesan Pengingat SPP & Broadcast Grup WhatsApp
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Susun pesan pengingat SPP dengan kalimat otomatis yang variatif, keren, unik, dan siap kirim ke Grup WhatsApp Wali Santri atau personal.
          </p>
        </div>

        {/* Shuffle Button */}
        <button
          onClick={handleShuffle}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xs active:scale-95 transition-all self-start md:self-auto"
        >
          <Shuffle className="w-4 h-4" />
          <span>🎲 Acak / Ganti Kalimat Otomatis</span>
        </button>
      </div>

      {/* Progress & Compliance Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Total Santri Terdaftar
            </span>
            <span className="text-xl font-bold text-slate-900">{santriList.length} Santri</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
              Sudah Lunas ({bulan})
            </span>
            <span className="text-xl font-bold text-emerald-700">{paidStudentsCount} Santri</span>
            <span className="text-[10px] text-slate-500 block">Progress: {percentagePaid}%</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
              Belum Lunas ({bulan})
            </span>
            <span className="text-xl font-bold text-rose-700">{unpaidStudents.length} Santri</span>
            <span className="text-[10px] text-slate-500 block">Status: Perlu Disampaikan Pengingat</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Template Selector & Message Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Template Selector & Variables (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Template Style Selector */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Pilih Gaya Kalimat Pengingat:
              </span>
              <span className="text-[10px] text-slate-500">6 Varian Unik</span>
            </div>

            <div className="space-y-2">
              {reminderTemplates.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTemplateIndex(idx);
                    setIsEditingCustom(false);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                    selectedTemplateIndex === idx && !isEditingCustom
                      ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/30'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block leading-tight">{t.title}</span>
                    <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded border ${t.badgeColor}`}>
                      {t.badge}
                    </span>
                  </div>
                  {selectedTemplateIndex === idx && !isEditingCustom && (
                    <span className="w-5 h-5 rounded-full bg-indigo-700 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Variables Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wide block border-b border-slate-100 pb-2">
              ⚙️ Pengaturan Variabel Teks
            </span>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Periode Bulan</label>
                <input
                  type="text"
                  value={bulan}
                  onChange={e => setBulan(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Batas Jatuh Tempo</label>
                <input
                  type="text"
                  value={jatuhTempo}
                  onChange={e => setJatuhTempo(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Nominal SPP</label>
                <input
                  type="text"
                  value={nominal}
                  onChange={e => setNominal(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">No. Rekening BSI</label>
                <input
                  type="text"
                  value={noRekBSI}
                  onChange={e => setNoRekBSI(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">No. Rekening BRI</label>
                <input
                  type="text"
                  value={noRekBRI}
                  onChange={e => setNoRekBRI(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Atas Nama Rekening</label>
                <input
                  type="text"
                  value={atasNama}
                  onChange={e => setAtasNama(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Preview WhatsApp Bubble & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Preview Pesan Format WhatsApp (Live)
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    if (!isEditingCustom) {
                      setCustomText(generatedMessage);
                    }
                    setIsEditingCustom(!isEditingCustom);
                  }}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center gap-1 transition-all"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isEditingCustom ? 'Kembali ke Template' : 'Edit Kustom Teks'}</span>
                </button>
              </div>
            </div>

            {/* WhatsApp Chat Simulation Container */}
            <div className="bg-[#e5ddd5] dark:bg-slate-900 p-3 sm:p-5 rounded-xl border border-slate-300 shadow-inner max-h-[500px] overflow-y-auto">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md max-w-xl mx-auto space-y-2 border border-slate-200">
                {isEditingCustom ? (
                  <textarea
                    rows={16}
                    value={customText}
                    onChange={e => setCustomText(e.target.value)}
                    className="w-full p-2 border border-indigo-300 rounded-lg font-mono text-xs leading-relaxed focus:ring-2 focus:ring-indigo-600 bg-indigo-50/20 text-slate-900"
                  />
                ) : (
                  <pre className="whitespace-pre-wrap font-sans text-xs text-slate-800 dark:text-slate-200 leading-relaxed break-words select-text">
                    {generatedMessage}
                  </pre>
                )}
                <div className="text-right text-[10px] text-slate-400 font-mono">
                  {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} • WhatsApp Format
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={handleSendToGroup}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-4 rounded-xl shadow-md text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>Kirim ke Grup WA Wali Santri</span>
              </button>

              <button
                onClick={handleCopy}
                className="bg-indigo-900 hover:bg-indigo-950 text-white font-bold py-2.5 px-4 rounded-xl shadow-md text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Teks Berhasil Disalin!' : 'Salin Format Pesan Keren'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Table: Unpaid Students List & 1-Click Personal WA Reminder */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-600" />
              Daftar Santri Belum Lunas SPP {bulan} ({unpaidStudents.length} Santri)
            </h3>
            <p className="text-[11px] text-slate-500">
              Kirimkan pengingat personal satu per satu langsung ke nomor WhatsApp wali santri terkait.
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari santri belum lunas..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-y border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="px-3 py-2">Santri / NIS</th>
                <th className="px-3 py-2">Kelas</th>
                <th className="px-3 py-2">Wali Santri</th>
                <th className="px-3 py-2">No. WhatsApp</th>
                <th className="px-3 py-2">Tunggakan Lalu</th>
                <th className="px-3 py-2 text-right">Aksi Pengingat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {unpaidStudents
                .filter(
                  s =>
                    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.nis.includes(searchTerm) ||
                    s.namaOrangTua.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2.5 font-bold text-slate-900">
                      <div>{s.nama}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-normal">NIS: {s.nis}</div>
                    </td>
                    <td className="px-3 py-2.5 text-slate-700">{s.kelas}</td>
                    <td className="px-3 py-2.5 text-slate-800 font-medium">{s.namaOrangTua}</td>
                    <td className="px-3 py-2.5 font-mono text-emerald-800">+{s.noWaOrangTua}</td>
                    <td className="px-3 py-2.5">
                      {s.tunggakanSppTahunLalu > 0 ? (
                        <span className="text-rose-600 font-bold">{formatRupiah(s.tunggakanSppTahunLalu)}</span>
                      ) : (
                        <span className="text-slate-400">Nihil</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        onClick={() => handleSendPersonalWa(s)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] inline-flex items-center gap-1 shadow-xs transition-all active:scale-95"
                      >
                        <Send className="w-3 h-3 text-amber-300" />
                        <span>Kirim WA</span>
                      </button>
                    </td>
                  </tr>
                ))}
              {unpaidStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-emerald-700 font-bold">
                    🎉 Alhamdulillah! Seluruh santri telah melunasi SPP untuk bulan {bulan}.
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
