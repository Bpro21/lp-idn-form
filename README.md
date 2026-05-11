# Project Landing Page Multi-Lead & Tracking (ID-Networkers)

Project ini adalah sistem landing page yang dirancang untuk kebutuhan iklan MTCNA dengan fitur segmentasi leads, dashboard admin, dan tracking konversi yang mendalam.

## 🚀 Fitur Utama

### 1. Multi-Lead Segmentation
Sistem ini menggunakan link khusus untuk membedakan sumber trafik. Setiap link akan mengarahkan user ke halaman yang sama namun dengan pesan WhatsApp yang berbeda saat konfirmasi:
- `/chat-ig` : Segmentasi trafik dari Instagram Ads.
- `/chat-tiktok` : Segmentasi trafik dari TikTok Ads.
- `/chat-fida` & `/chat-budi` : Segmentasi untuk agen/personal.

### 2. Admin Dashboard (`/minidn`)
Halaman admin khusus untuk manajemen operasional tanpa perlu menyentuh code:
- **Update Nomor WhatsApp**: Mengubah nomor tujuan "Thanks Page" secara global.
- **Manajemen Status Leads**: Menambahkan fitur "Tagging" (New, Warm, Hot, Ghosting) langsung di tabel leads.
- **Konfigurasi Tracking**: Setup Pixel ID (FB, TikTok) dan Google Ads ID secara real-time.

### 3. Conversion Tracking & Analytics
- **Global Noindex**: Situs sudah dikonfigurasi `noindex, nofollow` agar tidak terindeks Google (privasi iklan).
- **Meta Pixel & CAPI**: Integrasi tracking event untuk optimasi iklan Facebook.
- **TikTok & Google Ads**: Tracking konversi pendaftaran otomatis.

### 4. High Conversion UI/UX
- **Urgency Countdown**: Timer 10 menit di pop-up pendaftaran untuk mendorong user segera mengisi data.
- **Auto-Redirect Thanks Page**: User akan otomatis diarahkan ke WhatsApp setelah 3 detik di halaman terima kasih.
- **Modern Design**: Menggunakan Tailwind CSS & Framer Motion untuk animasi yang premium.

## 🛠 Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS.
- **Database & Auth**: Supabase.
- **Animations**: Framer Motion / Motion for React.
- **Icons**: Lucide React.

## 📖 Cara Penggunaan

### Mengubah Nomor WhatsApp Admin
1. Buka halaman `/minidn`.
2. Masukkan nomor WhatsApp baru di kolom "Nomor Admin".
3. Klik "Simpan Semua Pengaturan".

### Melihat Leads & Tagging
1. Buka halaman `/minidn`.
2. Scroll ke bagian "List Data Leads".
3. Gunakan dropdown "Status" untuk memberi tanda pada leads (misal: "Hot" untuk yang sudah bayar).

---
*Dikembangkan oleh Antigravity untuk ID-Networkers.*
