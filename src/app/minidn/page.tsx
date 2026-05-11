'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'motion/react';
import { 
  Users, 
  Search, 
  Download, 
  Trash2, 
  LogOut, 
  Lock, 
  Loader2, 
  Calendar, 
  Mail, 
  Phone,
  RefreshCcw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Settings as SettingsIcon,
  MessageCircle,
  Instagram,
  Youtube,
  Facebook,
  Filter
} from 'lucide-react';
import Image from 'next/image';

const FB_EVENTS = [
  "AddPaymentInfo", "AddToCart", "AddToWishlist", "CompleteRegistration", 
  "Contact", "CustomizeProduct", "Donate", "FindLocation", 
  "InitiateCheckout", "Lead", "Purchase", "Schedule", 
  "Search", "StartTrial", "SubmitApplication", "Subscribe", "ViewContent"
];

const TT_EVENTS = [
  "ViewContent", "ClickButton", "Search", "AddToWishlist", 
  "AddToCart", "InitiateCheckout", "AddPaymentInfo", "PlaceAnOrder", 
  "CompletePayment", "Contact", "Download", "SubmitForm", 
  "CompleteRegistration", "Subscribe"
];

const DEFAULT_TAG_STYLES: any = {
  'New': { color: 'bg-blue-100 text-blue-600' },
  'Warm': { color: 'bg-orange-100 text-orange-600' },
  'Hot': { color: 'bg-red-100 text-red-600' },
  'Ghosting': { color: 'bg-slate-100 text-slate-400' },
  'Closing': { color: 'bg-green-100 text-green-600' },
};


export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'leads' | 'settings'>('leads');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter State
  const [filterDay, setFilterDay] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());

  const [settings, setSettings] = useState({
    fb_pixel_id: '',
    tt_pixel_id: '',
    google_ads_id: '',
    fb_event_name: 'CompleteRegistration',
    tt_event_name: 'CompleteRegistration',
    fb_access_token: '',
    sales_names: '',
    lead_tags: 'New, Warm, Hot, Ghosting',
    admin_phone: '',
    instagram_url: '',
    youtube_url: '',
    facebook_url: ''
  });
  
  const [isCustomFb, setIsCustomFb] = useState(false);
  const [isCustomTt, setIsCustomTt] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'idn123';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      alert('Password salah!');
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

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('settings').select('*');
      if (error) throw error;
      const settingsObj: any = {};
      data?.forEach(s => settingsObj[s.key] = s.value);
      setSettings(prev => ({ ...prev, ...settingsObj }));
      if (settingsObj.fb_event_name && !FB_EVENTS.includes(settingsObj.fb_event_name)) setIsCustomFb(true);
      if (settingsObj.tt_event_name && !TT_EVENTS.includes(settingsObj.tt_event_name)) setIsCustomTt(true);
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));
      const { error } = await supabase.from('settings').upsert(updates, { onConflict: 'key' });
      if (error) throw error;
      alert('Pengaturan berhasil disimpan!');
    } catch (err: any) {
      alert('Gagal menyimpan: ' + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const updateLeadStatus = async (id: string, field: string, value: string | null) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('leads').update({ [field]: value }).eq('id', id);
      if (error) throw error;
      setLeads(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
    } catch (err: any) {
      alert('Gagal update: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus lead ini?')) return;
    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
      setLeads(leads.filter(lead => lead.id !== id));
    } catch (err: any) {
      alert('Gagal menghapus: ' + err.message);
    }
  };

  // Advanced Filtering Logic
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const leadDate = new Date(lead.created_at);
      const matchSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.phone?.includes(searchTerm);
      
      const matchDay = filterDay === 'all' || leadDate.getDate().toString() === filterDay;
      const matchMonth = filterMonth === 'all' || (leadDate.getMonth() + 1).toString() === filterMonth;
      const matchYear = filterYear === 'all' || leadDate.getFullYear().toString() === filterYear;

      return matchSearch && matchDay && matchMonth && matchYear;
    });
  }, [leads, searchTerm, filterDay, filterMonth, filterYear]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const currentLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const exportToCSV = () => {
    if (filteredLeads.length === 0) return;
    const headers = ['Nama', 'Email', 'Phone', 'Source', 'Tanggal'];
    const csvData = filteredLeads.map(lead => [lead.name, lead.email, lead.phone, lead.source, new Date(lead.created_at).toLocaleString('id-ID')]);
    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_idn_filtered_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
      fetchSettings();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-slate-900 rounded-[2rem] border border-slate-800 p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-idn-red/10 rounded-2xl flex items-center justify-center mb-6 border border-idn-red/20"><Lock className="w-8 h-8 text-idn-red" /></div>
            <h1 className="text-2xl font-black text-white mb-2">Admin ID-Networkers</h1>
            <p className="text-slate-400 text-sm text-center">Masukkan password untuk mengakses data lead pendaftaran.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-idn-red focus:outline-none transition-all" required />
            <button type="submit" className="w-full py-4 bg-idn-red text-white font-bold rounded-2xl hover:bg-idn-red/90 transition-all border-none cursor-pointer">Masuk Dashboard</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-idn-dark">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Image src="https://www.idn.id/wp-content/uploads/2023/01/LOGO-ID-Networkers-IDN.ID-Merah-1024x320.png" alt="Logo" width={120} height={40} className="h-8 w-auto object-contain" unoptimized />
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              <button onClick={() => setActiveTab('leads')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border-none cursor-pointer ${activeTab === 'leads' ? 'bg-white text-idn-red shadow-sm' : 'text-slate-500'}`}>Data Leads</button>
              <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border-none cursor-pointer ${activeTab === 'settings' ? 'bg-white text-idn-red shadow-sm' : 'text-slate-500'}`}>Pengaturan</button>
            </div>
          </div>
          <button onClick={() => { localStorage.removeItem('admin_auth'); setIsAuthenticated(false); }} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-idn-red border-none bg-transparent cursor-pointer"><LogOut className="w-4 h-4" /> Keluar</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {activeTab === 'leads' ? (
          <>
            {/* Stats & Filters */}
            <div className="space-y-6 mb-10">
              <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm min-w-[150px]">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Filtered</p>
                    <h3 className="text-3xl font-black text-idn-dark">{filteredLeads.length}</h3>
                  </div>
                  <div className="bg-idn-red p-6 rounded-3xl shadow-lg text-white min-w-[150px]">
                    <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Total Hari Ini</p>
                    <h3 className="text-3xl font-black">{leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length}</h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 w-full md:w-auto justify-end">
                  <div className="relative flex-grow md:flex-grow-0 md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" placeholder="Cari nama, email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-idn-red/20 focus:outline-none shadow-sm" />
                  </div>
                  <button onClick={fetchLeads} className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm cursor-pointer"><RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /></button>
                  <button onClick={exportToCSV} className="flex items-center gap-2 px-6 py-3.5 bg-idn-dark text-white font-bold rounded-2xl shadow-lg border-none cursor-pointer"><Download className="w-5 h-5" /> Export {filteredLeads.length} Lead</button>
                </div>
              </div>

              {/* Date Filter Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-4 shadow-sm">
                <div className="flex items-center gap-2 text-slate-400 mr-2">
                  <Filter className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Filter Tanggal:</span>
                </div>
                
                <select value={filterDay} onChange={(e) => {setFilterDay(e.target.value); setCurrentPage(1);}} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none">
                  <option value="all">Semua Tanggal</option>
                  {[...Array(31)].map((_, i) => (
                    <option key={i+1} value={(i+1).toString()}>{i+1}</option>
                  ))}
                </select>

                <select value={filterMonth} onChange={(e) => {setFilterMonth(e.target.value); setCurrentPage(1);}} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none">
                  <option value="all">Semua Bulan</option>
                  {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((m, i) => (
                    <option key={i+1} value={(i+1).toString()}>{m}</option>
                  ))}
                </select>

                <select value={filterYear} onChange={(e) => {setFilterYear(e.target.value); setCurrentPage(1);}} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none">
                  <option value="all">Semua Tahun</option>
                  {["2024", "2025", "2026"].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>

                {(filterDay !== 'all' || filterMonth !== 'all' || filterYear !== 'all') && (
                  <button onClick={() => {setFilterDay('all'); setFilterMonth('all'); setFilterYear('all');}} className="text-xs font-bold text-idn-red hover:underline ml-auto">Reset Filter</button>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Pendaftar</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Kontak</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Sumber</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Tanggal</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr><td colSpan={6} className="px-8 py-20 text-center"><Loader2 className="w-10 h-10 text-idn-red animate-spin mx-auto mb-2" /></td></tr>
                    ) : currentLeads.length === 0 ? (
                      <tr><td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold">Tidak ada data ditemukan.</td></tr>
                    ) : (
                      currentLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-6 flex items-center gap-4">
                            <div className="w-10 h-10 bg-idn-red/5 rounded-full flex items-center justify-center text-idn-red font-black border border-idn-red/10">{lead.name?.charAt(0).toUpperCase()}</div>
                            <div><p className="font-bold text-slate-900 leading-tight">{lead.name}</p><p className="text-[10px] text-slate-400 font-bold uppercase">{lead.source}</p></div>
                          </td>
                          <td className="px-8 py-6 space-y-1">
                            <div className="flex items-center gap-2 text-sm text-slate-600"><Mail className="w-3.5 h-3.5 text-slate-400" />{lead.email}</div>
                            <div className="flex items-center gap-2 text-sm text-slate-600"><Phone className="w-3.5 h-3.5 text-slate-400" />{lead.phone}
                              <a href={`https://wa.me/${lead.phone?.replace(/[^0-9]/g, '')}`} target="_blank" className="text-green-500 hover:scale-110 transition-transform"><ExternalLink className="w-3 h-3" /></a>
                            </div>
                          </td>
                          <td className="px-8 py-6"><span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase rounded-full border border-blue-100">{lead.source || 'Direct'}</span></td>
                          <td className="px-8 py-6">
                            <select 
                              value={lead.status || 'New'} 
                              onChange={(e) => updateLeadStatus(lead.id, 'status', e.target.value)}
                              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border-none cursor-pointer outline-none transition-all ${DEFAULT_TAG_STYLES[lead.status || 'New']?.color || 'bg-slate-100 text-slate-500'}`}
                            >
                              {(settings.lead_tags || 'New, Warm, Hot, Ghosting').split(',').map(tag => (
                                <option key={tag.trim()} value={tag.trim()}>{tag.trim()}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-8 py-6 text-sm text-slate-500 font-medium"><Calendar className="w-4 h-4 inline mr-2 text-slate-300" />{new Date(lead.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</td>
                          <td className="px-8 py-6 text-right"><button onClick={() => deleteLead(lead.id)} className="p-3 text-slate-300 hover:text-idn-red hover:bg-red-50 rounded-xl transition-all border-none bg-transparent cursor-pointer"><Trash2 className="w-5 h-5" /></button></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Halaman {currentPage} dari {totalPages || 1} ({filteredLeads.length} Lead)
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-slate-200 bg-white rounded-xl text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button 
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-9 h-9 rounded-xl text-xs font-black transition-all border-none cursor-pointer ${currentPage === pageNum ? 'bg-idn-red text-white shadow-lg shadow-idn-red/20' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 border border-slate-200 bg-white rounded-xl text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* ... rest of the settings code (Contact & Tracking) ... */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-10">
              <h2 className="text-2xl font-black text-idn-dark mb-8 flex items-center gap-3">
                <MessageCircle className="w-7 h-7 text-idn-red" /> Pengaturan Kontak & Sosmed
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest">Nomor WhatsApp Admin</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" value={settings.admin_phone} onChange={(e) => setSettings({...settings, admin_phone: e.target.value})} placeholder="628123456789" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none" />
                  </div>
                  <p className="mt-2 text-[10px] text-slate-400">Gunakan format 62 (tanpa tanda +)</p>
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest">Daftar Nama Sales</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                    <textarea value={settings.sales_names} onChange={(e) => setSettings({...settings, sales_names: e.target.value})} placeholder="Budi, Susi, Andi (Pisahkan dengan koma)" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none min-h-[100px] font-bold" />
                  </div>
                  <p className="mt-2 text-[10px] text-slate-400">Pisahkan setiap nama dengan tanda koma (,)</p>
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest">Daftar Tag Leads</label>
                  <div className="relative">
                    <Filter className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                    <textarea value={settings.lead_tags} onChange={(e) => setSettings({...settings, lead_tags: e.target.value})} placeholder="New, Warm, Hot, Ghosting (Pisahkan dengan koma)" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none min-h-[100px] font-bold" />
                  </div>
                  <p className="mt-2 text-[10px] text-slate-400">Gunakan untuk label di dashboard sales. Pisahkan dengan koma.</p>
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest">Instagram URL</label>
                  <div className="relative">
                    <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" value={settings.instagram_url} onChange={(e) => setSettings({...settings, instagram_url: e.target.value})} placeholder="https://..." className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest">Youtube URL</label>
                  <div className="relative">
                    <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" value={settings.youtube_url} onChange={(e) => setSettings({...settings, youtube_url: e.target.value})} placeholder="https://..." className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest">Facebook URL</label>
                  <div className="relative">
                    <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" value={settings.facebook_url} onChange={(e) => setSettings({...settings, facebook_url: e.target.value})} placeholder="https://..." className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-10">
              <h2 className="text-2xl font-black text-idn-dark mb-8 flex items-center gap-3">
                <SettingsIcon className="w-7 h-7 text-idn-red" /> Pengaturan Tracking Pixel
              </h2>
              <div className="space-y-8">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                  <label className="block text-sm font-black text-slate-700 mb-4 uppercase tracking-wider flex items-center justify-between">Meta (Facebook) Pixel<span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-md">FBQ</span></label>
                  <div className="space-y-4">
                    <input type="text" value={settings.fb_pixel_id} onChange={(e) => setSettings({...settings, fb_pixel_id: e.target.value})} placeholder="Pixel ID" className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none" />
                    <div className="flex gap-2">
                      {isCustomFb ? (
                        <input type="text" value={settings.fb_event_name} onChange={(e) => setSettings({...settings, fb_event_name: e.target.value})} placeholder="Custom Event" className="flex-grow px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none font-bold text-idn-red" />
                      ) : (
                        <select value={settings.fb_event_name} onChange={(e) => setSettings({...settings, fb_event_name: e.target.value})} className="flex-grow px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none font-bold text-slate-700 cursor-pointer">
                          {FB_EVENTS.map(ev => <option key={ev} value={ev}>{ev}</option>)}
                        </select>
                      )}
                      <button onClick={() => setIsCustomFb(!isCustomFb)} className="px-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:text-idn-red transition-all">Custom</button>
                    </div>
                    <input type="password" value={settings.fb_access_token} onChange={(e) => setSettings({...settings, fb_access_token: e.target.value})} placeholder="Meta Access Token (Dibutuhkan untuk CAPI)" className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none" />
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                  <label className="block text-sm font-black text-slate-700 mb-4 uppercase tracking-wider flex items-center justify-between">TikTok Pixel<span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-md">TTQ</span></label>
                  <div className="space-y-4">
                    <input type="text" value={settings.tt_pixel_id} onChange={(e) => setSettings({...settings, tt_pixel_id: e.target.value})} placeholder="Pixel ID" className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none" />
                    <div className="flex gap-2">
                      {isCustomTt ? (
                        <input type="text" value={settings.tt_event_name} onChange={(e) => setSettings({...settings, tt_event_name: e.target.value})} placeholder="Custom Event" className="flex-grow px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none font-bold text-idn-red" />
                      ) : (
                        <select value={settings.tt_event_name} onChange={(e) => setSettings({...settings, tt_event_name: e.target.value})} className="flex-grow px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none font-bold text-slate-700 cursor-pointer">
                          {TT_EVENTS.map(ev => <option key={ev} value={ev}>{ev}</option>)}
                        </select>
                      )}
                      <button onClick={() => setIsCustomTt(!isCustomTt)} className="px-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:text-idn-red transition-all">Custom</button>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                  <label className="block text-sm font-black text-slate-700 mb-4 uppercase tracking-wider">Google Ads Conversion</label>
                  <input type="text" value={settings.google_ads_id} onChange={(e) => setSettings({...settings, google_ads_id: e.target.value})} placeholder="AW-123456789" className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none" />
                </div>

                <button onClick={saveSettings} disabled={savingSettings} className="w-full py-6 bg-idn-red text-white font-black rounded-3xl shadow-2xl hover:bg-idn-red/90 disabled:opacity-70 border-none cursor-pointer text-lg flex items-center justify-center gap-3">
                  {savingSettings ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Simpan Semua Pengaturan'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
