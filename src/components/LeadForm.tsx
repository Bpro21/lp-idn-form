'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'motion/react';
import { User, Mail, Phone, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const LeadForm = () => {
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
      email: formData.get('email'),
      phone: formData.get('phone'),
      source: 'mtcna_landing_page',
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
                email: leadData.email,
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
        router.push('/thanks');
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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Pendaftaran Berhasil!</h2>
        <p className="text-slate-500">Mohon tunggu, Anda sedang dialihkan...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Nama Lengkap</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-5 w-5 text-slate-400" /></div>
          <input type="text" id="name" name="name" required className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-idn-red/20 focus:border-idn-red transition-all" placeholder="Nama lengkap Anda" />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Alamat Email</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-slate-400" /></div>
          <input type="email" id="email" name="email" required className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-idn-red/20 focus:border-idn-red transition-all" placeholder="nama@email.com" />
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Nomor WhatsApp</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone className="h-5 w-5 text-slate-400" /></div>
          <input type="tel" id="phone" name="phone" required className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-idn-red/20 focus:border-idn-red transition-all" placeholder="0812xxxx" />
        </div>
      </div>
      {error && <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">{error}</div>}
      <button type="submit" disabled={loading} className="w-full py-5 bg-idn-red text-white font-black rounded-2xl shadow-xl shadow-idn-red/20 hover:bg-idn-red/90 transition-all active:scale-[0.98] flex items-center justify-center gap-3 border-none cursor-pointer">
        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</> : <><ArrowRight className="w-5 h-5" /> Daftar Sekarang</>}
      </button>
    </form>
  );
};
