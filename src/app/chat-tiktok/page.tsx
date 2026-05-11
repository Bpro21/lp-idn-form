'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'motion/react';
import { User, Phone, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Custom TikTok Icon (since it might not be in the current Lucide version)
const TikTokIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function ChatTikTokPage() {
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
      email: 'tt-chat@idn.id',
      source: 'chat_tiktok',
      created_at: new Date().toISOString(),
    };

    try {
      // 1. Simpan ke Supabase
      const { error: supabaseError } = await supabase
        .from('leads')
        .insert([leadData]);

      if (supabaseError) throw supabaseError;

      // 2. Ambil Settings untuk CAPI (TikTok also uses CAPI if configured)
      const { data: settingsData } = await supabase.from('settings').select('*');
      const settings: any = {};
      settingsData?.forEach(s => settings[s.key] = s.value);

      // 3. Trigger Meta CAPI (Optional for TikTok, but keeping the same logic for now)
      if (settings.fb_pixel_id && settings.fb_access_token) {
        try {
          await fetch('/api/track-capi', {
            method: 'POST',
            body: JSON.stringify({
              pixel_id: settings.fb_pixel_id,
              access_token: settings.fb_access_token,
              event_name: 'Lead',
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
        router.push('/thanks?source=tt');
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
      <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl text-center">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </motion.div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Berhasil!</h2>
          <p className="text-slate-500 text-lg">Terima kasih. Admin kami akan segera menghubungi Anda di WhatsApp.</p>
          <div className="mt-8">
            <Loader2 className="w-6 h-6 text-idn-red animate-spin mx-auto" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Logo Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <div className="relative w-48 h-16 mx-auto mb-6 bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
          <Image 
            src="https://www.idn.id/wp-content/uploads/2023/01/LOGO-ID-Networkers-IDN.ID-Merah-1024x320.png"
            alt="ID-Networkers Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-black border border-white/20 rounded-full text-white text-sm font-bold shadow-xl shadow-cyan-500/20">
          <div className="flex gap-0.5">
            <span className="text-[#00f2ea]"><TikTokIcon /></span>
          </div>
          <span>TikTok Special Offer</span>
        </div>
      </motion.div>

      {/* Form Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Daftar Sekarang</h1>
          <p className="text-slate-500">Isi data Anda untuk konsultasi gratis via WhatsApp.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Nama Lengkap</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-idn-red transition-colors">
                <User className="h-5 w-5" />
              </div>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                className="block w-full pl-14 pr-5 py-5 bg-slate-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-idn-red outline-none transition-all text-slate-900 font-medium" 
                placeholder="Nama lengkap" 
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Nomor WhatsApp</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-idn-red transition-colors">
                <Phone className="h-5 w-5" />
              </div>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                required 
                className="block w-full pl-14 pr-5 py-5 bg-slate-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-idn-red outline-none transition-all text-slate-900 font-medium" 
                placeholder="0812xxxx" 
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="group relative w-full py-5 bg-idn-red text-white font-black rounded-[1.25rem] shadow-2xl shadow-idn-red/30 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 border-none cursor-pointer overflow-hidden disabled:opacity-70"
          >
            {loading ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> Memproses...</>
            ) : (
              <><span className="text-lg">Klaim Promo via WA</span> <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-400 font-medium">
          Keamanan data Anda terjamin oleh ID-Networkers.
        </p>
      </motion.div>

      <footer className="mt-12 text-slate-500 text-sm font-bold">
        © {new Date().getFullYear()} ID-Networkers
      </footer>
    </main>
  );
}
