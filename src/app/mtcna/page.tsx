'use client';

import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Award, 
  BookOpen, 
  Clock, 
  Users, 
  ShieldCheck, 
  Globe, 
  Zap, 
  ArrowRight, 
  Star, 
  TrendingUp, 
  Server, 
  MessageCircle, 
  RefreshCcw, 
  Home as HomeIcon,
  Quote,
  Instagram,
  Youtube,
  Facebook,
  Share2,
  Coffee,
  ShoppingBag,
  X,
  ChevronDown
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { REAL_ORDERS, CURRICULUM } from '@/lib/constants';
import { PopupEmbed } from '@/components/PopupEmbed';

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeOrder, setActiveOrder] = useState<typeof REAL_ORDERS[0] | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showEmbedPopup, setShowEmbedPopup] = useState(false);

  const showRandomOrder = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * REAL_ORDERS.length);
    setActiveOrder(REAL_ORDERS[randomIndex]);
    
    // Hide after 6 seconds
    setTimeout(() => {
      setActiveOrder(null);
    }, 6000);
  }, []);

  useEffect(() => {
    // Initial delay
    const initialTimer = setTimeout(() => {
      showRandomOrder();
    }, 5000);

    // Subsequent random intervals (between 15 and 40 seconds)
    const interval = setInterval(() => {
      const chance = Math.random();
      if (chance > 0.4) { // Only show sometimes to avoid spamming
        showRandomOrder();
      }
    }, 20000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [showRandomOrder]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      title: "Materi Terupdate",
      desc: "Kurikulum resmi dari MikroTik yang disesuaikan dengan kebutuhan industri terkini.",
      icon: BookOpen
    },
    {
      title: "Trainer Berpengalaman",
      desc: "Dibimbing langsung oleh MikroTik Certified Trainer yang aktif di industri networking.",
      icon: Users
    },
    {
      title: "Ujian Sertifikasi Internasional",
      desc: "Termasuk biaya ujian sertifikasi MikroTik Certified Network Associate (MTCNA).",
      icon: Award
    },
    {
      title: "Fasilitas Lab Lengkap",
      desc: "Praktik langsung menggunakan RouterBoard fisik untuk setiap peserta.",
      icon: Zap
    }
  ];

  const handleDaftarClick = () => {
    if (typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'Lead');
    }
    setShowEmbedPopup(true);
  };

  return (
    <div className="pt-20 min-h-screen">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Image 
              src="https://www.idn.id/wp-content/uploads/2023/01/LOGO-ID-Networkers-IDN.ID-Merah-1024x320.png" 
              alt="ID-Networkers Logo" 
              width={160}
              height={50}
              className="h-10 w-auto object-contain"
              unoptimized
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 opacity-10">
          <Globe className="w-96 h-96 text-idn-red" />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-idn-red/10 text-idn-red font-bold text-sm mb-6 uppercase tracking-wider">
              MIKROTIK MTCNA + EXAM
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold text-idn-dark leading-tight mb-6">
              Bimbing Kamu Jadi <span className="text-idn-red text-glow">Profesional IT</span> yang Dicari Banyak Perusahaan
            </h1>
            <p className="text-xl text-idn-gray mb-10 leading-relaxed max-w-3xl">
              Saatnya naik level bersama <span className="whitespace-nowrap">ID-Networkers</span>. Akselerasi karier IT-mu dengan kuasai skill yang benar-benar dibutuhkan industri lewat training & sertifikasi yang relevan. Terbukti telah dipercaya oleh 45.000+ alumni korporasi ternama di Indonesia.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full">
              <button 
                onClick={handleDaftarClick}
                className="sleek-btn-primary bg-idn-red hover:brightness-110 flex items-center justify-center gap-2 text-lg py-5 px-10 shadow-2xl shadow-idn-red/30 w-full sm:w-auto transition-all active:scale-95 cursor-pointer border-none"
              >
                Daftar Sekarang <ArrowRight className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm relative z-40">
                <div className="text-sm text-left flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <div>
                    <span className="font-bold text-idn-dark text-base">45k+</span> <span className="text-idn-gray">Alumni</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-2xl">
              <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white shadow-sm border border-slate-100">
                <div className="p-2 bg-green-500/10 rounded-full flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-left">
                  <span className="font-bold block text-sm">100% Praktik</span>
                  <span className="text-xs text-idn-gray underline decoration-green-500/30">Hands-on LAB</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white shadow-sm border border-slate-100">
                <div className="p-2 bg-green-500/10 rounded-full flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-left">
                  <span className="font-bold block text-sm">Ujian International</span>
                  <span className="text-xs text-idn-gray underline decoration-green-500/30">Lulus, dapat sertifikat</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Pain vs Gain Section */}
      <section className="py-24 bg-idn-slate-50 border-y border-slate-200/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-idn-dark mb-4">Kenapa Penting Punya sertifikasi MTCNA Kalau Mau Berkarir di bidang Networking?</h2>
            <p className="text-idn-gray text-lg">Karena banyak yang bisa setting Mikrotik dasar, tapi ternyata skill-nya belum sesuai sama standar industri di dunia kerja</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Problems Column */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-sm border border-slate-200 h-full flex flex-col">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-idn-dark leading-tight">Kalau kamu lagi ada di fase:</h3>
                </div>
                
                <div className="space-y-4 flex-grow mb-8">
                  {[
                    "Sering lihat konfigurasi MikroTik tapi bingung logikanya (routing, NAT, firewall)",
                    "Belajar dari YouTube, tapi materinya loncat-loncat dan nggak terstruktur",
                    "Nggak punya device MikroTik buat praktik langsung, jadi cuma teori doang",
                    "Takut salah konfigurasi karena belum paham best practice di dunia kerja",
                    "Belum ngerti gimana cara setup jaringan yang “dipakai perusahaan” (bukan sekadar lab)",
                    "Nggak pede apply posisi NOC / Network Engineer karena belum punya sertifikasi MTCNA",
                    "Kalah saing sama kandidat yang sudah pegang sertifikasi MikroTik",
                    "Bingung jalur karir networking itu arahnya ke mana setelah belajar basic",
                    "Sudah pernah coba belajar MikroTik, tapi berhenti di tengah jalan karena terasa rumit",
                    "Nggak punya mentor yang bisa jelasin konsep networking dengan simpel & praktis"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-idn-red/60 flex-shrink-0" />
                      <p className="text-idn-gray text-sm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100">
                  <p className="text-idn-red font-black text-sm mb-1 leading-none">SELAMAT…</p>
                  <p className="text-idn-dark font-bold text-sm leading-relaxed">
                    <span className="whitespace-nowrap">ID-Networkers</span> siap bantu kamu keluar dari fase ini dan naik level.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Solutions Column */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col"
            >
              <div className="bg-idn-dark p-8 md:p-12 rounded-[32px] shadow-2xl h-full flex flex-col text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-idn-red opacity-10 blur-[100px] -mr-32 -mt-32"></div>
                
                <div className="mb-8 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider mb-4 border border-green-500/30">
                    <TrendingUp className="w-4 h-4" />
                    Transformasi Karier
                  </div>
                  <h3 className="text-2xl font-bold leading-tight">Karena di sini kamu akan:</h3>
                </div>
                
                <div className="space-y-4 flex-grow relative z-10">
                  {[
                    "Punya roadmap jelas untuk mulai karir di bidang networking (NOC / Network Engineer)",
                    "Paham konsep dasar jaringan + bisa langsung implementasi di MikroTik (bukan cuma teori)",
                    "Mampu konfigurasi MikroTik dari nol: IP Addressing, Routing, NAT, Firewall, DHCP, dll",
                    "Terbiasa dengan studi kasus jaringan yang sering dipakai di perusahaan",
                    "Lebih percaya diri saat technical test & interview posisi networking",
                    "Memiliki sertifikasi MTCNA yang diakui secara global sebagai dasar networking MikroTik",
                    "Punya portofolio praktik (lab & simulasi) yang bisa jadi nilai jual saat apply kerja",
                    "Siap bersaing untuk posisi NOC, IT Support, atau Junior Network Engineer",
                    "Lebih cepat dapet kerja pertama di bidang networking",
                    "Skill networking lebih “naik level” dan jadi fondasi untuk lanjut ke CCNA / level advanced",
                    "Dibimbing mentor yang paham implementasi jaringan di dunia kerja nyata",
                    "Update dengan kebutuhan industri, khususnya penggunaan MikroTik di banyak perusahaan"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="mt-1.5 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed font-medium">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 p-5 bg-white/5 rounded-2xl border border-white/10 relative z-10">
                  <p className="text-sm text-slate-400 font-medium italic">
                    "Investasi untuk skill adalah satu-satunya investasi yang tidak akan pernah hilang nilainya."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-idn-red/10 text-idn-red text-xs font-bold uppercase tracking-widest mb-6">
              Jadwal Pelatihan
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-idn-dark mb-6">
              Jadwal <span className="text-idn-red text-glow">Terdekat</span>
            </h2>
            <p className="text-idn-gray text-lg">
              Pilih jadwal yang paling sesuai dengan waktu luang kamu. Batch baru dibuka setiap bulan.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-idn-red rounded-[48px] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-idn-red/20 mb-16"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-2xl"></div>
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6 border border-white/30 backdrop-blur-sm">
                  <Clock className="w-4 h-4 animate-pulse" />
                  Kesempatan Terbatas
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-6 leading-tight">
                  Jangan Sampai Ketinggalan <br />
                  <span className="text-white/70">Batch Terdekat!</span>
                </h2>
                <p className="text-xl text-white/90 mb-8 leading-relaxed opacity-90">
                  Setiap batch kami batasi hanya untuk <span className="font-bold underline decoration-white-2">12 orang</span> agar kualitas pembelajaran tetap optimal dan setiap peserta mendapatkan bimbingan intensif.
                </p>
                <div className="flex flex-wrap gap-6 mt-8">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-white/70" />
                    <div>
                      <span className="block text-2xl font-bold leading-none">Sisa 3 Kursi</span>
                      <span className="text-sm text-white/80">Untuk batch Mei 2026</span>
                    </div>
                  </div>
                  <div className="w-px h-12 bg-white/20 hidden sm:block"></div>
                  <div className="flex items-center gap-3">
                    <Star className="w-6 h-6 text-yellow-300 fill-current" />
                    <div>
                      <span className="block text-2xl font-bold leading-none">Best Seller</span>
                      <span className="text-sm text-white/80">Training terpopuler di <span className="whitespace-nowrap">ID-Networkers</span></span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <h3 className="text-xl font-bold mb-6 text-center">Batch Terdekat: Mei 2026</h3>
                <div className="space-y-4 mb-8 text-sm">
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span className="text-white/80">Jadwal</span>
                    <span className="font-bold">11, 12, 13 Mei 2026</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span className="text-white/80">Lokasi</span>
                    <span className="font-bold"><span className="whitespace-nowrap">ID-Networkers</span> Jakarta / Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Investasi</span>
                    <div className="text-right">
                      <span className="inline-block text-xs line-through text-white/60 decoration-white/50 mr-2">Rp. 3.000.000</span>
                      <span className="text-xl md:text-2xl font-black text-yellow-300">Rp. 2.000.000</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleDaftarClick}
                  className="block w-full py-5 rounded-2xl bg-white text-idn-red font-black text-center text-lg shadow-xl hover:bg-slate-50 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer border-none"
                >
                  Amankan Seat Kamu Sekarang
                </button>
                <p className="text-center text-[10px] mt-4 text-white/70 uppercase tracking-widest font-bold">
                  *Harga promo berakhir dalam 48 jam kedepan
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Official Schedule List Section */}
      <section className="py-24 bg-idn-slate-50 border-y border-slate-200/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-idn-red/10 text-idn-red text-xs font-bold uppercase tracking-widest mb-6 border border-idn-red/20 shadow-sm">
              Schedule List
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-idn-dark mb-6">
              Daftar Jadwal <span className="text-idn-red text-glow">Resmi <span className="whitespace-nowrap">ID-Networkers</span></span>
            </h2>
            <p className="text-idn-gray text-lg">
              Temukan berbagai pilihan waktu dan lokasi pelatihan Networking terbaik untuk kamu.
            </p>
          </div>
          
          <div className="bg-white rounded-[40px] shadow-2xl shadow-idn-dark/5 border border-slate-200/60 overflow-hidden group">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-idn-slate-50/50 border-b border-slate-200 font-display">
                    <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-idn-dark">Materi</th>
                    <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-idn-dark text-center">Tanggal</th>
                    <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-idn-dark text-center">Waktu</th>
                    <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-idn-dark text-center">Harga</th>
                    <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-idn-dark text-center">Lokasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { materi: "Mikrotik MTCNA + Exam", tgl: "29, 30, 31 Mei 2026", waktu: "3 Hari (09:00 - 17:00 WIB)", harga: "Rp 2.000.000", lokasi: "Jakarta", color: "text-idn-red" },
                    { materi: "Mikrotik MTCNA + Exam", tgl: "25, 26, 28 Mei 2026", waktu: "3 Hari (09:00 - 17:00 WIB)", harga: "Rp 2.000.000", lokasi: "Jakarta", color: "text-idn-red" },
                    { materi: "Mikrotik MTCNA + Exam", tgl: "11, 12, 13 Mei 2026", waktu: "3 Hari (09:00 - 17:00 WIB)", harga: "Rp 2.000.000", lokasi: "Jakarta", color: "text-idn-red" },
                    { materi: "Mikrotik MTCNA + Exam", tgl: "22, 23, 24 Mei 2026", waktu: "3 Hari (09:00 - 17:00 WIB)", harga: "Rp 2.000.000", lokasi: "Jakarta", color: "text-idn-red" },
                    { materi: "Mikrotik MTCNA + Exam (Kelas Malam)", tgl: "18 - 29 Mei 2026", waktu: "8 Hari (19:30 - 21:30 WIB)", harga: "Rp 2.500.000", lokasi: "Online", color: "text-blue-600" }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-idn-slate-50/50 transition-colors group/row">
                      <td className={`px-8 py-6 font-bold text-base whitespace-nowrap ${row.color}`}>{row.materi}</td>
                      <td className="px-8 py-6 text-sm text-idn-gray text-center font-medium whitespace-nowrap">{row.tgl}</td>
                      <td className="px-8 py-6 text-xs text-idn-gray text-center font-medium italic whitespace-nowrap">{row.waktu}</td>
                      <td className="px-8 py-6 text-sm text-idn-dark text-center font-black whitespace-nowrap">{row.harga}</td>
                      <td className="px-8 py-6 text-center">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${row.lokasi === 'Online' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-red-50 text-idn-red border border-red-100'}`}>
                          {row.lokasi}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-100">
              {[
                { materi: "Mikrotik MTCNA + Exam", tgl: "29, 30, 31 Mei 2026", waktu: "(09:00 - 17:00 WIB)", harga: "Rp 2.000.000", lokasi: "Jakarta", color: "text-idn-red" },
                { materi: "Mikrotik MTCNA + Exam", tgl: "25, 26, 28 Mei 2026", waktu: "(09:00 - 17:00 WIB)", harga: "Rp 2.000.000", lokasi: "Jakarta", color: "text-idn-red" },
                { materi: "Mikrotik MTCNA + Exam", tgl: "11, 12, 13 Mei 2026", waktu: "(09:00 - 17:00 WIB)", harga: "Rp 2.000.000", lokasi: "Jakarta", color: "text-idn-red" },
                { materi: "Mikrotik MTCNA + Exam", tgl: "22, 23, 24 Mei 2026", waktu: "(09:00 - 17:00 WIB)", harga: "Rp 2.000.000", lokasi: "Jakarta", color: "text-idn-red" },
                { materi: "Mikrotik MTCNA + Exam (Kelas Malam)", tgl: "18 - 29 Mei 2026", waktu: "(19:30 - 21:30 WIB)", harga: "Rp 2.500.000", lokasi: "Online", color: "text-blue-600" }
              ].map((row, i) => (
                <div key={i} className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className={`font-bold text-base ${row.color}`}>{row.materi}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${row.lokasi === 'Online' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-red-50 text-idn-red border border-red-100'}`}>
                      {row.lokasi}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400 space-y-1 mb-4">
                    <p>{row.tgl}</p>
                    <p className="text-xs">{row.waktu}</p>
                  </div>
                  <p className="font-bold text-idn-dark">{row.harga}</p>
                </div>
              ))}
            </div>
            <div className="bg-idn-slate-50/50 px-8 py-4 text-center border-t border-slate-100">
              <p className="text-[10px] font-bold text-idn-gray uppercase tracking-widest">
                Terakhir diperbarui 29 menit yang lalu • Harga sudah termasuk Exam & Sertifikasi Internasional
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-24 bg-idn-slate-50 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-idn-red/10 text-idn-red text-xs font-bold uppercase tracking-widest mb-6">
              Who is this for?
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-idn-dark mb-6">Siapa Yang Harus Ikut?</h2>
            <p className="text-idn-gray text-xl">Program ini dirancang khusus untuk kamu yang ingin serius berkarier di dunia Networking.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-x-16 gap-y-12">
            {[
              {
                title: "Mahasiswa & Fresh Graduate",
                desc: "Bangun pondasi networking yang kuat dan miliki sertifikasi internasional untuk memperbesar peluang kerja di perusahaan ternama.",
                icon: BookOpen
              },
              {
                title: "IT Support & Helpdesk",
                desc: "Tingkatkan level kamu dari support harian menjadi Network Engineer profesional dengan penguasaan RouterOS yang mendalam.",
                icon: TrendingUp
              },
              {
                title: "Network Administrator",
                desc: "Validasi keahlian kamu dengan sertifikasi resmi dan pelajari best practice konfigurasi MikroTik sesuai standar industri.",
                icon: ShieldCheck
              },
              {
                title: "Career Switchers",
                desc: "Transisi ke industri IT dengan bimbingan dari nol hingga mahir mengoperasikan perangkat networking profesional.",
                icon: Zap
              }
            ].map((persona, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-8 group"
              >
                <div className="w-20 h-20 rounded-[32px] bg-white shadow-xl shadow-slate-200/60 flex items-center justify-center flex-shrink-0 group-hover:bg-idn-red group-hover:text-white transition-all duration-500 transform group-hover:-translate-y-2">
                   <persona.icon className="w-10 h-10" />
                </div>
                <div className="pt-2">
                  <h3 className="text-2xl font-extrabold text-idn-dark mb-3 group-hover:text-idn-red transition-colors">{persona.title}</h3>
                  <p className="text-idn-gray text-lg leading-relaxed">{persona.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-display font-extrabold text-idn-dark mb-8">Apa Saja Yang Kamu Pelajari?</h2>
              <div className="grid gap-4">
                {CURRICULUM.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-idn-slate-50 rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-8 h-8 bg-idn-red/10 text-idn-red rounded-full flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <span className="font-semibold text-idn-dark text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="sleek-card p-10 bg-gradient-to-br from-idn-dark to-slate-900 text-white relative z-10 overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-idn-red opacity-10 blur-[80px] -mr-32 -mt-32"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-idn-red text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-white/10">
                    Career Roadmap
                  </div>
                  <h3 className="text-3xl font-display font-black mb-8 tracking-tight">Jalur <span className="text-idn-red text-glow">Mastery</span> Kamu</h3>
                  
                  <div className="space-y-8">
                    {[
                      { step: "01", title: "Fundamental Mastery", desc: "Memahami TCP/IP, OSI Layer, dan navigasi RouterOS secara mendalam.", icon: ShieldCheck },
                      { step: "02", title: "Advanced Configuration", desc: "Mahir setting Firewall, QoS, NAT, dan Wireless standar ISP.", icon: Zap },
                      { step: "03", title: "Real-world Troubleshooting", desc: "Simulasi case industri & teknik penyaluran traffic yang efisien.", icon: TrendingUp },
                      { step: "04", title: "Global Certification", desc: "Ujian resmi MTCNA dan bergabung dengan jaringan expert dunia.", icon: Award }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-6 items-start relative group/item">
                        {i !== 3 && <div className="absolute left-[27px] top-[50px] bottom-[-30px] w-px bg-gradient-to-b from-idn-red/50 to-transparent"></div>}
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-idn-red group-hover/item:border-idn-red transition-all duration-300">
                          <item.icon className="w-6 h-6 text-idn-red group-hover/item:text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                          <p className="text-sm text-slate-400 leading-relaxed font-light">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-idn-red rounded-[32px] -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -ml-32 w-80 h-80 bg-idn-red/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 -mr-32 -mb-32 w-[600px] h-[600px] bg-idn-dark/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
            <div className="lg:w-2/5 lg:sticky lg:top-32">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-idn-red/10 text-idn-red text-xs font-bold uppercase tracking-widest mb-6">
                Premium Access
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-extrabold text-idn-dark mb-6 leading-tight">
                Fasilitas <span className="text-idn-red text-glow">Eksklusif</span> Untuk Peserta
              </h2>
              <p className="text-idn-gray text-lg mb-8 leading-relaxed">
                Kami tidak hanya memberikan materi, tapi juga ekosistem pendukung untuk memastikan kamu benar-benar mahir dan siap terjun ke industri.
              </p>
              
              <div className="p-8 bg-idn-dark rounded-[32px] text-white shadow-2xl shadow-idn-dark/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-idn-red blur-[60px] opacity-20 -mr-16 -mt-16 group-hover:opacity-40 transition-opacity"></div>
                <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-[0.2em] relative z-10"><span className="whitespace-nowrap">ID-Networkers</span> Quality Guarantee</p>
                <div className="text-3xl font-black mb-2 tracking-tight relative z-10">100% Praktik Langsung</div>
                <p className="text-sm text-slate-400 leading-relaxed relative z-10">Semua fasilitas dirancang untuk memaksimalkan kurikulum hands-on lab kami.</p>
              </div>
            </div>

            <div className="lg:w-3/5 grid sm:grid-cols-2 gap-x-12 gap-y-16">
              {[
                {
                  title: "Free Mengulang",
                  desc: "Gratis Mengulang Training 2 Kali tanpa syarat",
                  icon: RefreshCcw,
                  color: "from-idn-red to-[#b22e36]"
                },
                {
                  title: "Menginap Gratis",
                  desc: "Peserta training diperbolehkan menginap di lokasi pelaksanaan training",
                  icon: HomeIcon,
                  color: "from-blue-600 to-blue-400"
                },
                {
                  title: "Vue Authorized Partner",
                  desc: "ID-Networkers sudah menjadi penyelenggara resmi ujian sertifikasi international.",
                  icon: ShieldCheck,
                  color: "from-slate-800 to-slate-900"
                },
                {
                  title: "Lab Komplit",
                  desc: "Disediakan perangkat lab satu orang satu, agar lebih fokus dalam proses belajar",
                  icon: Server,
                  color: "from-green-600 to-green-400"
                },
                {
                  title: "Murah & Berkualitas",
                  desc: "Materi Berkualitas dan Harga Training Termurah untuk sekelas training IT",
                  icon: TrendingUp,
                  color: "from-yellow-500 to-amber-500"
                },
                {
                  title: "Trainer Tersertifikasi",
                  desc: "Trainer Bersertifikasi Internasional dan Berpengalaman mengajar di dalam maupun luar negeri",
                  icon: Users,
                  color: "from-purple-600 to-indigo-500"
                },
                {
                  title: "Fasilitas Lengkap",
                  desc: "Sertifikat, Modul, T-shirt, Makan siang, Coffee Break, Goodie Bag, Notebook, Ruangan Ber AC, dll",
                  icon: Coffee,
                  color: "from-orange-500 to-[#d53942]"
                },
                {
                  title: "After sales yang baik",
                  desc: "After training peserta akan dimasukan ke group whatsapp dan mailist untuk diskusi seputar materi training, pemberitahuan info dan lowongan kerja.",
                  icon: MessageCircle,
                  color: "from-cyan-500 to-blue-500"
                }
              ].map((facility, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex gap-6 group"
                >
                  <div className="flex-shrink-0">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${facility.color} text-white flex items-center justify-center shadow-lg shadow-black/5 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <facility.icon className="w-7 h-7" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-idn-dark mb-2 group-hover:text-idn-red transition-colors flex items-center gap-2">
                      {facility.title}
                      <span className="w-1.5 h-1.5 rounded-full bg-idn-red opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    </h3>
                    <p className="text-idn-gray leading-relaxed text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">{facility.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section className="py-24 bg-idn-slate-50 border-t border-slate-200/60 overflow-hidden text-idn-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-idn-red/10 text-idn-red text-xs font-bold uppercase tracking-widest mb-6 border border-idn-red/20 shadow-sm">
                Expert Instructors
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-extrabold text-idn-dark mb-4 tracking-tight">
                Belajar Dari <span className="text-idn-red text-glow">Praktisi Terbaik</span>
              </h2>
              <p className="text-idn-gray text-lg leading-relaxed">
                ID-Networkers didukung oleh instruktur yang tidak hanya bersertifikat internasional, tetapi juga aktif menangani berbagai project infrastruktur jaringan skala nasional & global.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                name: "Oky Tria Saputra",
                title: "M.KOM - MIKROTIK CERTIFIED TRAINER",
                initials: "OT",
                image: "https://www.idn.id/wp-content/uploads/2020/06/mas-oky-min.png",
                certs: ["MTCINE", "MTCIPV6E", "MTCTCE", "MTCWE", "MTCUME", "UEWA", "MTCNA", "MTCRE"],
                link: "https://id.linkedin.com/in/okytria"
              },
              {
                name: "Mahesa Yudha Pratama",
                title: "MIKROTIK CERTIFIED TRAINER",
                initials: "MY",
                image: "https://www.idn.id/wp-content/uploads/2023/09/Mahesa-Yudha.png",
                certs: ["MTCINE", "MTCTCE", "MTCSE", "CONP", "MTCWE", "MTCRE", "MTCNA"],
                link: "https://id.linkedin.com/in/mahesayudhapratama"
              },
              {
                name: "At-thoriq Firdaus Ramadhan",
                title: "MULTI-VENDOR CERTIFIED EXPERT",
                initials: "AT",
                image: "https://www.idn.id/wp-content/uploads/2023/09/Attoriq.png",
                certs: ["MTCINE", "CONP", "JNCIS-SP", "NSE4", "UEWA", "RCNA-RS", "MTCIPV6", "MTCSE"],
                link: "https://id.linkedin.com/in/thoriq-firdaus"
              }
            ].map((trainer, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative"
              >
                <div className="bg-white p-10 rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-200/50 flex flex-col items-center text-center h-full group-hover:-translate-y-2">
                  <div className="w-40 h-40 rounded-full bg-idn-red overflow-hidden mb-8 transform group-hover:scale-105 transition-all duration-500 shadow-xl shadow-idn-dark/5 relative flex items-center justify-center p-3">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white">
                      <Image 
                        src={trainer.image} 
                        alt={trainer.name}
                        width={160}
                        height={160}
                        className="w-full h-full object-cover object-top"
                        unoptimized
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-idn-dark mb-2 group-hover:text-idn-red transition-colors">{trainer.name}</h3>
                  <p className="text-idn-red font-bold text-[10px] mb-6 uppercase tracking-widest">{trainer.title}</p>
                  
                  <div className="flex flex-wrap justify-center gap-2 mt-auto">
                    {trainer.certs.map((cert, cidx) => (
                      <span 
                        key={cidx} 
                        className={`text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-tighter transition-all border
                          ${cert.startsWith('MTC') ? 'bg-[#d53942]/5 text-[#d53942] border-[#d53942]/20' : 
                            cert.startsWith('CCN') ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            cert.startsWith('CON') ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            cert.startsWith('NSE') ? 'bg-orange-50 text-orange-600 border-orange-100' :
                            'bg-green-50 text-green-600 border-green-100'
                          }
                        `}
                      >
                        {cert}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-100 w-full flex justify-center">
                    <Link 
                      href={trainer.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 text-[10px] font-bold text-idn-gray hover:text-idn-red transition-colors uppercase tracking-[0.2em]"
                    >
                      View Profile <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Marquee Section */}
      <section className="py-24 bg-white overflow-hidden border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-idn-red/10 text-idn-red text-xs font-bold uppercase tracking-widest mb-6 border border-idn-red/10">
            Success Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-idn-dark mb-4 tracking-tight">
            Apa Kata Mereka yang dulu ada di posisi kamu <span className="text-idn-red text-glow">setelah ikut training di <span className="whitespace-nowrap">ID-Networkers</span> …</span>
          </h2>
          <p className="text-idn-gray text-lg max-w-xl">
            Puluhan ribu alumni ID-Networkers telah membuktikan kualitas pelatihan kami. Sekarang giliran kamu.
          </p>
        </div>

        <div className="relative flex overflow-hidden py-10">
          <motion.div 
            className="flex gap-8 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {[
              { text: "Gak cuma teori, tapi bener-bener diajarin troubleshooting yang sering terjadi di lapangan.", author: "Maya", role: "Fresh Graduate" },
              { text: "Karir saya meningkat pesat setelah ambil sertifikasi di ID-Networkers. Gaji juga ikutan naik!", author: "Faisal", role: "Senior Network Admin" },
              { text: "Materi yang diajarkan sangat relevan dengan dunia kerja. Instrukturnya sabar dan penjelasannya mudah dimengerti.", author: "Rian", role: "Network Engineer" },
              { text: "Fasilitas di ID-Networkers sangat lengkap. Masing-masing peserta dapat router fisik, jadi bener-bener hands-on.", author: "Siska", role: "IT Specialist" },
              { text: "Berhasil lulus sertifikasi MTCNA berkat bimbingan intensif selama 4 hari ini. Sangat direkomendasikan!", author: "Andi", role: "System Administrator" },
              // Duplicate once for seamless loop
              { text: "Gak cuma teori, tapi bener-bener diajarin troubleshooting yang sering terjadi di lapangan.", author: "Maya", role: "Fresh Graduate" },
              { text: "Karir saya meningkat pesat setelah ambil sertifikasi di ID-Networkers. Gaji juga ikutan naik!", author: "Faisal", role: "Senior Network Admin" },
              { text: "Materi yang diajarkan sangat relevan dengan dunia kerja. Instrukturnya sabar dan penjelasannya mudah dimengerti.", author: "Rian", role: "Network Engineer" },
              { text: "Fasilitas di ID-Networkers sangat lengkap. Masing-masing peserta dapat router fisik, jadi bener-bener hands-on.", author: "Siska", role: "IT Specialist" },
              { text: "Berhasil lulus sertifikasi MTCNA berkat bimbingan intensif selama 4 hari ini. Sangat direkomendasikan!", author: "Andi", role: "System Administrator" },
            ].map((t, idx) => (
              <div 
                key={idx}
                className="inline-flex flex-col h-full w-[400px] p-8 rounded-[32px] bg-idn-slate-50 border border-slate-100 shadow-sm whitespace-normal relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 transform translate-x-4 -translate-y-4 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700">
                  <Quote className="w-24 h-24 text-idn-red" />
                </div>
                <div className="flex text-yellow-400 mb-6">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-idn-dark font-medium leading-relaxed mb-8 relative z-10 text-sm">"{t.text}"</p>
                <div className="mt-auto flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-idn-dark text-idn-red flex items-center justify-center font-black text-xs uppercase shadow-lg">
                    {t.author[0]}
                  </div>
                  <div>
                    <span className="block font-bold text-idn-dark text-sm">{t.author}</span>
                    <span className="block text-[10px] text-idn-gray uppercase tracking-wider font-bold opacity-60">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Video Section */}
        <div className="max-w-7xl mx-auto px-6 py-20 mt-12 bg-white">
          <div className="grid md:grid-cols-12 gap-12 lg:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-5 relative aspect-[9/16] w-full max-w-[340px] mx-auto overflow-hidden rounded-[40px] shadow-2xl border-4 border-white shadow-idn-dark/10 ring-1 ring-slate-200"
            >
              <iframe 
                src="https://www.youtube.com/embed/SNfWxZ2WO-Y" 
                className="absolute inset-0 w-full h-full"
                title="ID-Networkers Training Experience"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
              <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-[40px]"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:col-span-7 flex flex-col justify-center"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-idn-red/5 text-idn-red text-xs font-black uppercase tracking-[0.2em] mb-8 border border-idn-red/10 w-fit shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-idn-red animate-pulse"></div>
                Real Training Experience
              </div>
              <h3 className="text-4xl md:text-5xl font-display font-black text-idn-dark mb-10 leading-[1.1] tracking-tight">
                Rasakan Atmosfer Belajar <br/> 
                <span className="text-idn-red text-glow">Semi-Private</span> Terbaik
              </h3>
              
              <div className="space-y-10">
                {[
                  {
                    title: "Bimbingan Hands-On",
                    desc: "Setiap langkah konfigurasi dibimbing langsung. Tidak ada yang tertinggal karena batch dibatasi hanya 12 orang.",
                    icon: Zap,
                    accent: "bg-idn-red"
                  },
                  {
                    title: "Case Study Industri",
                    desc: "Gak cuma teori, tapi bener-bener diajarin troubleshooting yang sering terjadi di lapangan berdasarkan pengalaman trainer.",
                    icon: ShieldCheck,
                    accent: "bg-blue-600"
                  },
                  {
                    title: "Impact Masa Depan",
                    desc: "Gaji terasa 'stuck' dan karir tidak berkembang? Sertifikasi internasional adalah kunci kenaikan nilai jual kamu.",
                    icon: TrendingUp,
                    accent: "bg-green-600"
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center group-hover:bg-idn-dark group-hover:text-white transition-all duration-300 relative z-10 border border-slate-100">
                        <item.icon className="w-7 h-7" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg ${item.accent} opacity-20 blur-sm group-hover:opacity-100 transition-opacity`}></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-idn-dark text-xl mb-2 group-hover:text-idn-red transition-colors flex items-center gap-2 tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-idn-gray leading-relaxed text-base font-medium opacity-80 group-hover:opacity-100 transition-opacity">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-14 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-8">
                <button 
                  onClick={handleDaftarClick}
                  className="group/btn inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-idn-dark text-white font-black text-lg hover:bg-idn-red transition-all shadow-2xl shadow-idn-dark/10 hover:shadow-idn-red/20 active:scale-95 cursor-pointer border-none"
                >
                  Daftar Batch Terdekat 
                  <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-idn-red/10 text-idn-red text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-idn-red/10"
            >
              Gallery
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-extrabold text-idn-dark mb-6 tracking-tight"
            >
              Dokumentasi <span className="text-idn-red">Kegiatan Training</span>
            </motion.h2>
          </div>
        </div>

        <div className="relative flex overflow-hidden py-4">
          <motion.div 
            className="flex gap-6 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              duration: 40, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {[
              "https://www.idn.id/wp-content/uploads/2026/05/IMG_2619-scaled.jpg",
              "https://www.idn.id/wp-content/uploads/2026/05/IMG_2636-scaled.jpg",
              "https://www.idn.id/wp-content/uploads/2026/05/IMG_2690-scaled.jpg",
              "https://www.idn.id/wp-content/uploads/2026/05/IMG_2696-scaled.jpg",
              "https://www.idn.id/wp-content/uploads/2026/05/IMG_2622-scaled.jpg",
              "https://www.idn.id/wp-content/uploads/2026/05/IMG_2620-scaled.jpg",
              // Duplicate once for seamless loop
              "https://www.idn.id/wp-content/uploads/2026/05/IMG_2619-scaled.jpg",
              "https://www.idn.id/wp-content/uploads/2026/05/IMG_2636-scaled.jpg",
              "https://www.idn.id/wp-content/uploads/2026/05/IMG_2690-scaled.jpg",
              "https://www.idn.id/wp-content/uploads/2026/05/IMG_2696-scaled.jpg",
              "https://www.idn.id/wp-content/uploads/2026/05/IMG_2622-scaled.jpg",
              "https://www.idn.id/wp-content/uploads/2026/05/IMG_2620-scaled.jpg",
            ].map((img, idx) => (
              <div 
                key={idx}
                className="inline-block w-[300px] md:w-[450px] aspect-video rounded-[32px] overflow-hidden shadow-2xl relative group flex-shrink-0"
              >
                <Image 
                  src={img} 
                  alt={`Training Documentation ${idx + 1}`} 
                  width={450}
                  height={250}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-idn-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Investment Section */}
      <section id="daftar" className="py-12 md:py-24 bg-idn-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-idn-red/10 text-idn-red text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-idn-red/10">
              Investment
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-extrabold text-idn-dark mb-6 tracking-tight leading-tight">
              Investasi Terbaik Untuk <br className="hidden md:block" /> <span className="text-idn-red">Masa Depan Karir Kamu</span>
            </h2>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-2xl shadow-idn-dark/5 overflow-hidden border border-slate-100"
          >
            <div className="grid md:grid-cols-10">
              <div className="md:col-span-6 p-8 md:p-16">
                <h3 className="text-3xl md:text-4xl font-display font-black text-idn-dark mb-6">Paket MTCNA + Exam</h3>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                  {[
                    "4 Hari Training Intensif",
                    "Official MTCNA Exam",
                    "MikroTik Router",
                    "Modul Hardcopy & PDF",
                    "Video Rekaman Training",
                    "Grup Support Alumni",
                    "Lunch & 2x Coffee Break",
                    "Sertifikat Training ID-Networkers"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                        <CheckCircle2 className="w-3 h-3 text-green-500 group-hover:text-white" />
                      </div>
                      <span className="text-sm font-bold text-idn-dark/80 group-hover:text-idn-dark transition-colors">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-4 bg-[#0F172A] px-6 py-12 md:p-12 text-white flex flex-col justify-center items-center relative overflow-hidden">
                <div className="relative z-10 w-full flex flex-col items-center">
                  <div className="text-center mb-8 md:mb-10 w-full">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-idn-red text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 md:mb-6 shadow-lg shadow-idn-red/40 animate-bounce">
                      <Star className="w-3 h-3 fill-current" /> DISKON TERBATAS
                    </div>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-xl md:text-2xl font-bold opacity-80">Rp</span>
                      <span className="text-4xl md:text-6xl font-black tracking-tight text-glow">2.000.000</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleDaftarClick}
                    className="group/btn w-full bg-idn-red hover:bg-white text-white hover:text-idn-red py-5 rounded-2xl font-black text-center text-lg transition-all shadow-2xl shadow-idn-red/20 flex items-center justify-center gap-3 active:scale-95 cursor-pointer border-none"
                  >
                    Daftar Sekarang
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-24 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-idn-dark mb-6 tracking-tight">
              Pertanyaan yang <span className="text-idn-red">Sering Diajukan</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "Cocok buat pemula ga?", a: "Cocok, karena akan diajarkan dari basic mikrotik" },
              { q: "Kalo gak lulus gimana?", a: "Ada free retake exam 1 kali, dan materi ini yang paling banyak diambil pemula" },
              { q: "Examnya wajib offline?", a: "Betul, untuk exam mikrotik pertama kali wajib offline ya, bisa di Jakarta atau Semarang" },
              { q: "Sertifikasi MTCNA berlaku berapa lama?", a: "Sertifikasi MTCNA ini berlaku selama 3 tahun dari tanggal kelulusan exam." }
            ].map((faq, i) => (
              <div 
                key={i}
                className={`rounded-2xl border transition-all duration-300 ${activeFaq === i ? 'border-idn-red bg-idn-slate-50 shadow-lg' : 'border-slate-200 bg-white hover:border-idn-red/30'}`}
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <span className="font-bold text-idn-dark text-lg pr-8">{faq.q}</span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${activeFaq === i ? 'bg-idn-red text-white rotate-180' : 'bg-idn-slate-100 text-idn-gray'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-idn-gray leading-relaxed border-t border-idn-red/10 mt-2">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-idn-dark mb-16 tracking-tight leading-tight">
            Ikuti Update Terbaru dari <span className="text-idn-red">ID-Networkers</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 w-full max-w-5xl mx-auto">
            {[
              { name: "Instagram", icon: Instagram, link: "https://www.instagram.com/idnetworkers/" },
              { name: "YouTube", icon: Youtube, link: "https://www.youtube.com/@IDNetworkers" },
              { name: "TikTok", icon: Share2, link: "https://www.tiktok.com/@idnetworkers" },
              { name: "Facebook", icon: Facebook, link: "https://www.facebook.com/idnetworkers" },
              { name: "WhatsApp", icon: MessageCircle, link: "https://wa.me/6281908191001" }
            ].map((social, idx) => (
              <Link
                key={idx}
                href={social.link}
                className="flex flex-col items-center justify-center p-8 rounded-[40px] bg-white border border-slate-100 shadow-xl shadow-idn-dark/[0.03] transition-all hover:shadow-idn-red/5 hover:-translate-y-2 group"
              >
                <social.icon className="w-10 h-10 mb-4 text-idn-dark transition-colors group-hover:text-idn-red" />
                <span className="font-black text-[10px] uppercase tracking-[0.2em]">{social.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Sticky CTA Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 z-[90] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
      >
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-idn-red tracking-widest leading-none mb-1">MTCNA + Exam</span>
            <span className="text-base font-black text-idn-dark leading-none">2.000.000</span>
          </div>
          <button 
            onClick={handleDaftarClick}
            className="flex-grow bg-idn-red text-white py-4 rounded-2xl font-black text-center text-sm shadow-xl shadow-idn-red/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
          >
            Daftar Sekarang <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Fake Order Popup */}
      <AnimatePresence>
        {activeOrder && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed top-24 right-6 md:top-auto md:bottom-10 md:left-6 md:right-auto z-[100] max-w-[280px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-idn-red/10 flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-6 h-6 text-idn-red" />
            </div>
            <div className="flex flex-col">
              <p className="text-[10px] font-black uppercase text-idn-red tracking-widest leading-none mb-1">Pendaftaran Baru!</p>
              <p className="text-sm font-bold text-idn-dark leading-tight mb-0.5">{activeOrder.name}</p>
              <p className="text-[10px] text-idn-gray font-medium leading-tight">Mendaftar {activeOrder.training}</p>
            </div>
            <button 
              onClick={() => setActiveOrder(null)}
              className="absolute top-2 right-2 text-slate-300 hover:text-idn-red transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <PopupEmbed isOpen={showEmbedPopup} onClose={() => setShowEmbedPopup(false)} />
    </div>
  );
}
