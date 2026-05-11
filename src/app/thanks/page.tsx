'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'motion/react';
import { CheckCircle2, MessageCircle, Home, Instagram, Youtube, Facebook, Globe } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';


export default function ThanksPage() {
  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  const hasTracked = useRef(false);

  const [pageSettings, setPageSettings] = useState({
    admin_phone: '628111111111',
    instagram_url: 'https://instagram.com/idnetworkers',
    youtube_url: 'https://youtube.com/idnetworkers',
    facebook_url: 'https://facebook.com/idnetworkers'
  });
  const [countdown, setCountdown] = useState(3);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Helper untuk membuat WhatsApp URL
  const getWaUrl = () => {
    const message = source === 'ig' 
      ? 'Halo Admin, saya dari Instagram baru saja mengisi form, saya ingin tanya soal training di ID-Networkers ?' 
      : source === 'tt'
      ? 'Halo Admin, saya dari TikTok baru saja mengisi form, saya ingin tanya soal training di ID-Networkers ?'
      : source === 'budi'
      ? 'Halo Admin, saya baru saja mengisi form, saya ingin tanya soal training di ID-Networkers ?'
      : source === 'fida'
      ? 'Halo Admin, saya baru saja mengisi form, saya ingin tanya soal training di ID-Networkers ?'
      : 'Halo Admin, saya baru saja mengisi form di website iklan MTCNA, saya ingin ambil promo nya.';
    
    return `https://wa.me/${pageSettings.admin_phone}?text=${encodeURIComponent(message)}`;
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsRedirecting(true);
      window.location.href = getWaUrl();
    }
  }, [countdown, pageSettings.admin_phone]);

  useEffect(() => {
    const trackConversion = async () => {
      try {
        const { data } = await supabase.from('settings').select('*');
        const settings: any = {};
        data?.forEach(s => settings[s.key] = s.value);

        // Update page settings state
        const rawPhone = settings.admin_phone || '';
        const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

        setPageSettings(prev => ({
          ...prev,
          admin_phone: cleanPhone || prev.admin_phone,
          instagram_url: settings.instagram_url || prev.instagram_url,
          youtube_url: settings.youtube_url || prev.youtube_url,
          facebook_url: settings.facebook_url || prev.facebook_url
        }));

        if (hasTracked.current) return;

        // 1. Pixel Tracking Logic (Hanya jika bukan dari IG/TT/Personal untuk menghindari double tracking CAPI)
        if (source !== 'ig' && source !== 'tt' && source !== 'budi' && source !== 'fida') {
          if (typeof (window as any).fbq === 'function' && settings.fb_pixel_id) {
            (window as any).fbq('track', settings.fb_event_name || 'CompleteRegistration');
          }

          if (typeof (window as any).ttq === 'object' && settings.tt_pixel_id) {
            (window as any).ttq.track(settings.tt_event_name || 'CompleteRegistration');
          }

          if (typeof (window as any).gtag === 'function' && settings.google_ads_id) {
            (window as any).gtag('event', 'conversion', {
              'send_to': settings.google_ads_id,
            });
          }
        }
        
        hasTracked.current = true;
      } catch (err) {
        console.error('Error in thanks page tracking:', err);
      }
    };

    trackConversion();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6 text-idn-dark">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden"
        >
          <div className="h-32 bg-idn-red relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <Globe className="w-64 h-64 text-white absolute -right-12 -top-12" />
            </div>
          </div>

          <div className="px-8 md:px-16 py-12 text-center -mt-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-xl mb-8 relative z-10 border-4 border-slate-50">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-black text-idn-dark mb-4">
              Terima Kasih!
            </h1>
            <p className="text-xl text-slate-500 mb-12 max-w-xl mx-auto leading-relaxed">
              Pendaftaran Anda telah kami terima. Tim <span className="font-bold text-idn-dark">ID-Networkers</span> akan segera menghubungi Anda melalui WhatsApp untuk konfirmasi detail jadwal dan pembayaran.
            </p>

            <div className="grid gap-6 mb-12">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-left">
                <h3 className="font-bold text-idn-dark mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-idn-red text-white rounded-full flex items-center justify-center text-xs">!</span>
                  Konfirmasi Pendaftaran
                </h3>
                <p className="text-sm text-slate-500 ml-8">
                  {isRedirecting 
                    ? "Sedang mengalihkan ke WhatsApp..." 
                    : `Anda akan dialihkan ke WhatsApp dalam ${countdown} detik untuk konfirmasi otomatis...`}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={getWaUrl()}
                className="bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2 text-lg py-5 px-10 shadow-xl shadow-green-500/20 transition-all active:scale-95 no-underline text-white font-bold rounded-2xl"
              >
                <MessageCircle className="w-5 h-5" /> {isRedirecting ? 'Mengalihkan...' : 'Chat Admin Sekarang'}
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 text-lg py-5 px-10 border border-slate-200 text-idn-dark hover:bg-slate-50 transition-all active:scale-95 no-underline font-bold rounded-2xl"
              >
                <Home className="w-5 h-5" /> Kembali ke Home
              </Link>
            </div>
          </div>

          <div className="bg-slate-50 px-8 py-8 border-t border-slate-100 flex flex-col items-center">
            <p className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest">Ikuti Kami Untuk Info Training Terbaru</p>
            <div className="flex gap-6">
              {[
                { icon: Instagram, link: pageSettings.instagram_url },
                { icon: Youtube, link: pageSettings.youtube_url },
                { icon: Facebook, link: pageSettings.facebook_url }
              ].map((social, i) => (
                <Link key={i} href={social.link} target="_blank" className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-400 hover:text-idn-red hover:border-idn-red/20 transition-all">
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
