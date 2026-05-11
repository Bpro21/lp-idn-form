'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'motion/react';
import { User, Phone, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SimplifiedLeadPageProps {
  source: string;
  redirectSource: string;
  title: string;
  subtitle: string;
  buttonText: string;
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  theme?: 'light' | 'dark';
}

export const SimplifiedLeadPage = ({
  source,
  redirectSource,
  title,
  subtitle,
  buttonText,
  badgeText,
  badgeIcon,
  theme = 'light'
}: SimplifiedLeadPageProps) => {
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
      email: `${source}@idn.id`,
      source: source,
      created_at: new Date().toISOString(),
    };

    try {
      const { error: supabaseError } = await supabase.from('leads').insert([leadData]);
      if (supabaseError) throw supabaseError;

      const { data: settingsData } = await supabase.from('settings').select('*');
      const settings: any = {};
      settingsData?.forEach(s => settings[s.key] = s.value);

      if (settings.fb_pixel_id && settings.fb_access_token) {
        try {
          await fetch('/api/track-capi', {
            method: 'POST',
            body: JSON.stringify({
              pixel_id: settings.fb_pixel_id,
              access_token: settings.fb_access_token,
              event_name: 'Lead',
              user_data: { phone: leadData.phone, name: leadData.name },
              source_url: window.location.href
            })
          });
        } catch (capiErr) {
          console.error('CAPI Error:', capiErr);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/thanks?source=${redirectSource}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'} flex items-center justify-center p-4`}>
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </motion.div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Berhasil Terkirim!</h2>
          <p className="text-slate-500">Mohon tunggu sebentar...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} flex flex-col items-center justify-center p-4 sm:p-8`}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
        <div className={`relative w-48 h-16 mx-auto mb-6 ${theme === 'dark' ? 'bg-white/10' : ''} p-2 rounded-xl`}>
          <Image src="https://www.idn.id/wp-content/uploads/2023/01/LOGO-ID-Networkers-IDN.ID-Merah-1024x320.png" alt="IDN" fill className="object-contain" priority />
        </div>
        {badgeText && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-idn-red rounded-full text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-idn-red/20">
            {badgeIcon}
            <span>{badgeText}</span>
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl text-slate-900">
        <h1 className="text-3xl font-black mb-2 tracking-tight">{title}</h1>
        <p className="text-slate-500 mb-8">{subtitle}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input type="text" name="name" required className="w-full pl-14 pr-5 py-5 bg-slate-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-idn-red outline-none transition-all font-medium" placeholder="Nama Anda" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">WhatsApp</label>
            <div className="relative">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input type="tel" name="phone" required className="w-full pl-14 pr-5 py-5 bg-slate-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-idn-red outline-none transition-all font-medium" placeholder="0812xxxx" />
            </div>
          </div>
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold">{error}</div>}
          <button type="submit" disabled={loading} className="w-full py-5 bg-idn-red text-white font-black rounded-[1.25rem] shadow-xl shadow-idn-red/20 flex items-center justify-center gap-3 hover:-translate-y-1 transition-all disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin" /> : <><span className="text-lg">{buttonText}</span> <ArrowRight /></>}
          </button>
        </form>
      </motion.div>
    </main>
  );
};
