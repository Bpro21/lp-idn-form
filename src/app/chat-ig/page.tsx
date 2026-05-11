'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'motion/react';
import { User, Phone, ArrowRight, Loader2, CheckCircle2, Instagram } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ChatIGPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const leadData: any = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: 'ig-chat@idn.id', // Default email since it might be required in DB
      source: 'chat_ig',
      created_at: new Date().toISOString(),
    };

    try {
      // 1. Simpan ke Supabase
      const { error: supabaseError } = await supabase
        .from('leads')
        .insert([leadData]);

      if (supabaseError) throw supabaseError;

      // 2. Ambil Settings untuk CAPI
      const { data: settingsData } = await supabase.from('settings').select('*');
      const settings: any = {};
      settingsData?.forEach(s => settings[s.key] = s.value);

      // 3. Trigger Meta CAPI (Server-side)
      if (settings.fb_pixel_id && settings.fb_access_token) {
        try {
          await fetch('/api/track-capi', {
            method: 'POST',
            body: JSON.stringify({
              pixel_id: settings.fb_pixel_id,
              access_token: settings.fb_access_token,
              event_name: settings.fb_event_name || 'Lead',
              user_data: {
                phone: leadData.phone,
                name: leadData.name
              },
              source_url: window.location.href
            })
          });
        } catch (capiErr) {
          console.error('CAPI Error:', capiErr);
        }
      }

      setSuccess(true);
      
      // Redirect ke thanks page
      setTimeout(() => {
        router.push('/thanks?source=ig');
      }, 1500);

    } catch (err: any) {
      console.error('Error submitting lead:', err);
      setError(err.message || 'Terjadi kesalahan saat mengirim data.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100 text-center">
          <motion.div 
            initial={{ scale: 0, rotate: -180 }} 
            animate={{ scale: 1, rotate: 0 }} 
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </motion.div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Berhasil Terkirim!</h2>
          <p className="text-slate-500 text-lg leading-relaxed">Terima kasih atas minat Anda. Kami akan segera menghubungi Anda melalui WhatsApp.</p>
          <div className="mt-8 flex justify-center">
            <Loader2 className="w-6 h-6 text-idn-red animate-spin" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Logo Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <div className="relative w-48 h-16 mx-auto mb-6">
          <Image 
            src="https://www.idn.id/wp-content/uploads/2023/01/LOGO-ID-Networkers-IDN.ID-Merah-1024x320.png"
            alt="ID-Networkers Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-bold shadow-lg shadow-pink-200">
          <Instagram className="w-4 h-4" />
          <span>Instagram Special Offer</span>
        </div>
      </motion.div>

      {/* Form Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Konsultasi Sekarang</h1>
          <p className="text-slate-500">Silakan lengkapi formulir di bawah ini untuk memulai obrolan dengan tim ahli kami.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-[0.15em]">Nama Lengkap</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-idn-red transition-colors">
                <User className="h-5 w-5" />
              </div>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                className="block w-full pl-14 pr-5 py-5 bg-slate-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-idn-red focus:ring-4 focus:ring-idn-red/5 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-300" 
                placeholder="Masukkan nama Anda" 
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-[0.15em]">Nomor WhatsApp</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-idn-red transition-colors">
                <Phone className="h-5 w-5" />
              </div>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                required 
                className="block w-full pl-14 pr-5 py-5 bg-slate-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-idn-red focus:ring-4 focus:ring-idn-red/5 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-300" 
                placeholder="Contoh: 081234567890" 
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3"
            >
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              {error}
            </motion.div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="group relative w-full py-5 bg-idn-red text-white font-black rounded-[1.25rem] shadow-2xl shadow-idn-red/30 hover:shadow-idn-red/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3 border-none cursor-pointer overflow-hidden disabled:opacity-70 disabled:hover:translate-y-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            {loading ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> Sedang Memproses...</>
            ) : (
              <><span className="text-lg">Kirim via WhatsApp</span> <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-400 font-medium">
          Privasi Anda terjaga. Kami tidak akan menyebarkan nomor Anda.
        </p>
      </motion.div>

      <footer className="mt-12 text-slate-400 text-sm font-bold tracking-tight">
        © {new Date().getFullYear()} ID-Networkers Training Center
      </footer>
    </main>
  );
}
