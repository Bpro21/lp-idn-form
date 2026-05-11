'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  RefreshCcw, 
  Phone, 
  Mail, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Lock,
  Clock,
  AlertCircle,
  Flame,
  Ghost,
  UserCheck,
  UserPlus,
  Tag
} from 'lucide-react';
import Image from 'next/image';

const DEFAULT_TAG_STYLES: any = {
  'New': { color: 'bg-blue-100 text-blue-600', icon: Clock },
  'Warm': { color: 'bg-orange-100 text-orange-600', icon: AlertCircle },
  'Hot': { color: 'bg-red-100 text-red-600', icon: Flame },
  'Ghosting': { color: 'bg-slate-100 text-slate-400', icon: Ghost },
  'Closing': { color: 'bg-green-100 text-green-600', icon: Flame },
};

const FU_STEPS = ['FU0', 'FU1', 'FU2', 'FU3', 'FU4'];

export default function SalesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentSalesName, setCurrentSalesName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSalesName, setSelectedSalesName] = useState('');
  const [availableSales, setAvailableSales] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>(['New', 'Warm', 'Hot', 'Ghosting']);
  
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');
  const [viewFilter, setViewFilter] = useState<'all' | 'mine'>('all');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchInitialData = async () => {
    const { data: settings } = await supabase.from('settings').select('*');
    
    const salesNames = settings?.find(s => s.key === 'sales_names')?.value || '';
    setAvailableSales(salesNames.split(',').map((s: string) => s.trim()).filter(Boolean));

    const tags = settings?.find(s => s.key === 'lead_tags')?.value || '';
    if (tags) {
      setAvailableTags(tags.split(',').map((s: string) => s.trim()).filter(Boolean));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await supabase.from('settings').select('*').eq('key', 'sales_password').single();
    const salesPass = data?.value || 'sales123';

    if (password === salesPass && selectedSalesName) {
      setIsAuthenticated(true);
      setCurrentSalesName(selectedSalesName);
      localStorage.setItem('sales_auth', 'true');
      localStorage.setItem('sales_name', selectedSalesName);
    } else {
      alert('Password salah atau Nama Sales belum dipilih!');
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setLeads(data || []);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id: string, field: string, value: string | null) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('leads').update({ [field]: value }).eq('id', id);
      if (error) throw error;
      setLeads(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
      if (field === 'assigned_to' && value) alert('Lead berhasil diklaim!');
    } catch (err: any) {
      alert('Gagal update: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
    if (localStorage.getItem('sales_auth') === 'true') {
      setIsAuthenticated(true);
      setCurrentSalesName(localStorage.getItem('sales_name') || '');
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchLeads();
  }, [isAuthenticated]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) || lead.phone?.includes(searchTerm);
      const matchStatus = activeStatusFilter === 'all' || lead.status === activeStatusFilter;
      const matchView = viewFilter === 'all' || lead.assigned_to === currentSalesName;
      return matchSearch && matchStatus && matchView;
    });
  }, [leads, searchTerm, activeStatusFilter, viewFilter, currentSalesName]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const currentLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getTagStyle = (tag: string) => {
    return DEFAULT_TAG_STYLES[tag] || { color: 'bg-slate-100 text-slate-500', icon: Tag };
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-slate-900 rounded-[2rem] border border-slate-800 p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20"><Users className="w-8 h-8 text-blue-500" /></div>
            <h1 className="text-2xl font-black text-white mb-2">Sales Dashboard</h1>
            <p className="text-slate-400 text-sm">Pilih nama Anda dan masukkan password untuk masuk.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <select value={selectedSalesName} onChange={(e) => setSelectedSalesName(e.target.value)} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none font-bold" required>
              <option value="">-- Pilih Nama Sales --</option>
              {availableSales.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
            <input type="password" placeholder="Password Sales" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
            <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all border-none cursor-pointer">Login Sales</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-idn-dark pb-12">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="https://www.idn.id/wp-content/uploads/2023/01/LOGO-ID-Networkers-IDN.ID-Merah-1024x320.png" alt="Logo" width={100} height={30} className="h-6 w-auto object-contain" unoptimized />
            <div className="h-6 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Sales:</span>
              <span className="text-sm font-black text-idn-red uppercase">{currentSalesName}</span>
            </div>
          </div>
          <button onClick={() => { localStorage.removeItem('sales_auth'); setIsAuthenticated(false); }} className="text-sm font-bold text-slate-400 hover:text-idn-red border-none bg-transparent cursor-pointer">Logout</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-6 mb-10 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setViewFilter('all')} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase transition-all border-none cursor-pointer ${viewFilter === 'all' ? 'bg-idn-dark text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>Semua Lead</button>
            <button onClick={() => setViewFilter('mine')} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase transition-all border-none cursor-pointer ${viewFilter === 'mine' ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>Lead Saya</button>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            <div className="relative flex-grow lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" placeholder="Cari nama..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm" />
            </div>
            <button onClick={fetchLeads} className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm cursor-pointer"><RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /></button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setActiveStatusFilter('all')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase border-none cursor-pointer ${activeStatusFilter === 'all' ? 'bg-slate-200 text-slate-700' : 'bg-white text-slate-400'}`}>Filter: Semua</button>
          {availableTags.map(tag => (
            <button 
              key={tag}
              onClick={() => setActiveStatusFilter(tag)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase border-none cursor-pointer ${activeStatusFilter === tag ? getTagStyle(tag).color : 'bg-white text-slate-400'}`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {currentLeads.map((lead) => (
              <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} key={lead.id} className={`bg-white rounded-[2rem] border-2 shadow-xl p-8 flex flex-col justify-between transition-all ${lead.assigned_to === currentSalesName ? 'border-blue-500' : 'border-transparent'}`}>
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black border border-slate-200">{lead.name?.charAt(0).toUpperCase()}</div>
                      <div>
                        <h3 className="font-black text-lg text-idn-dark leading-tight">{lead.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{new Date(lead.created_at).toLocaleDateString('id-ID')}</p>
                          <span className="w-1 h-1 bg-slate-200 rounded-full" />
                          <span className="text-[9px] font-black uppercase text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{lead.source?.replace(/_/g, ' ') || 'Direct'}</span>
                        </div>
                      </div>
                    </div>
                    {lead.assigned_to ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                        <UserCheck className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase">{lead.assigned_to}</span>
                      </div>
                    ) : (
                      <button onClick={() => updateLeadStatus(lead.id, 'assigned_to', currentSalesName)} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-lg font-black text-[10px] uppercase border-none cursor-pointer hover:bg-green-600 transition-all">
                        <UserPlus className="w-3 h-3" /> Ambil Lead
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {availableTags.map(tag => (
                      <button 
                        key={tag}
                        disabled={lead.assigned_to && lead.assigned_to !== currentSalesName}
                        onClick={() => updateLeadStatus(lead.id, 'status', tag)}
                        className={`py-2 rounded-lg text-[9px] font-black uppercase transition-all border-none cursor-pointer ${lead.status === tag ? getTagStyle(tag).color : 'bg-slate-50 text-slate-300'} ${(lead.assigned_to && lead.assigned_to !== currentSalesName) ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-bold">{lead.phone}</span>
                      <a href={`https://wa.me/${lead.phone?.replace(/[^0-9]/g, '')}`} target="_blank" className="ml-auto p-1.5 bg-green-500 text-white rounded-lg"><ExternalLink className="w-3 h-3" /></a>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex gap-1">
                    {FU_STEPS.map(step => (
                      <button 
                        key={step}
                        disabled={lead.assigned_to && lead.assigned_to !== currentSalesName}
                        onClick={() => updateLeadStatus(lead.id, 'follow_up', step)}
                        className={`flex-grow py-2 rounded-lg text-[10px] font-black transition-all border-none cursor-pointer ${lead.follow_up === step ? 'bg-idn-red text-white shadow-lg' : 'bg-slate-100 text-slate-400'} ${(lead.assigned_to && lead.assigned_to !== currentSalesName) ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        {step}
                      </button>
                    ))}
                  </div>
                  {lead.assigned_to === currentSalesName && (
                    <button onClick={() => updateLeadStatus(lead.id, 'assigned_to', null)} className="w-full mt-4 text-[9px] font-bold text-slate-300 hover:text-idn-red transition-all bg-transparent border-none cursor-pointer uppercase">Lepas Lead Ini</button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
