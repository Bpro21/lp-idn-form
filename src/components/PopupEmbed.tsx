'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { LeadForm } from './LeadForm';

interface PopupEmbedProps {
  isOpen: boolean;
  onClose: () => void;
}

const Timer = () => {
  const [seconds, setSeconds] = useState(600); // 10 minutes

  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return <span>{formatTime(seconds)}</span>;
};

export const PopupEmbed = ({ isOpen, onClose }: PopupEmbedProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
      />
      
      {/* Modal content */}
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-[500px] w-full overflow-hidden flex flex-col max-h-[90vh] z-10 transition-all transform animate-in fade-in zoom-in-95 duration-300 scale-100">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer z-50 bg-white shadow-sm border border-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Form Box */}
        <div className="p-8 pt-12 flex-grow overflow-y-auto max-h-[90vh]">
          {/* Countdown Urgency */}
          <div className="mb-6 py-3 px-4 bg-idn-red/5 border border-idn-red/20 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-idn-red animate-pulse" />
              <span className="text-[10px] font-black text-idn-red uppercase tracking-widest">Sisa Waktu Promo</span>
            </div>
            <div className="flex items-center gap-1 font-mono font-bold text-idn-red text-sm">
               <Timer />
            </div>
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-3xl font-display font-black text-idn-dark mb-2">Daftar Sekarang</h2>
            <p className="text-idn-gray text-sm">Lengkapi data diri Anda untuk mengamankan kursi pelatihan.</p>
          </div>
          <LeadForm />
        </div>
      </div>
    </div>
  );
};

