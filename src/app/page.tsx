'use client';

import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Globe, Star, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-idn-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 -z-10 opacity-5">
        <Globe className="w-[800px] h-[800px] text-idn-red" />
      </div>
      <div className="absolute bottom-0 left-0 -z-10 opacity-5">
        <Users className="w-[600px] h-[600px] text-idn-dark" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full text-center"
      >
        <Image 
          src="https://www.idn.id/wp-content/uploads/2023/01/LOGO-ID-Networkers-IDN.ID-Merah-1024x320.png" 
          alt="ID-Networkers Logo" 
          width={240}
          height={75}
          className="h-16 w-auto object-contain mx-auto mb-12"
          unoptimized
        />

        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-idn-dark mb-6 leading-tight">
          Pusat Pelatihan <span className="text-idn-red">IT & Networking</span> Terpercaya
        </h1>
        <p className="text-xl text-idn-gray mb-12 max-w-2xl mx-auto">
          Pilih program pelatihan terbaik untuk meningkatkan karir Anda bersama ID-Networkers.
        </p>

        <div className="grid md:grid-cols-1 gap-8 max-w-xl mx-auto">
          <Link href="/mtcna" className="group">
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white p-8 rounded-[40px] shadow-2xl shadow-idn-dark/5 border border-slate-100 flex flex-col items-center text-center transition-all group-hover:border-idn-red/30"
            >
              <div className="w-20 h-20 rounded-[32px] bg-idn-red/10 text-idn-red flex items-center justify-center mb-6 group-hover:bg-idn-red group-hover:text-white transition-all duration-500">
                <BookOpen className="w-10 h-10" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-idn-red/5 text-idn-red text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-idn-red/10">
                Best Seller
              </div>
              <h2 className="text-3xl font-display font-black text-idn-dark mb-4 group-hover:text-idn-red transition-colors">
                MikroTik MTCNA + Exam
              </h2>
              <p className="text-idn-gray leading-relaxed mb-8">
                Bimbingan intensif dari nol hingga mahir mengoperasikan perangkat networking profesional dengan sertifikasi internasional.
              </p>
              <div className="mt-auto flex items-center gap-2 text-idn-red font-black uppercase tracking-widest text-sm">
                Pelajari Selengkapnya <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </motion.div>
          </Link>
        </div>

        <div className="mt-16 flex items-center justify-center gap-12 grayscale opacity-40">
           <div className="flex items-center gap-2">
             <Star className="w-5 h-5 fill-current text-yellow-400" />
             <span className="font-bold text-idn-dark text-lg">45k+ Alumni</span>
           </div>
           <div className="flex items-center gap-2">
             <Users className="w-5 h-5 text-idn-dark" />
             <span className="font-bold text-idn-dark text-lg">15+ Certified Trainers</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
