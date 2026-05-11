import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Mikrotik MTCNA + Exam | ID-Networkers Training Center",
  description: "Bimbing kamu jadi Profesional IT yang dicari banyak perusahaan. Ikuti training MikroTik MTCNA bersertifikat internasional bersama ID-Networkers.",
  keywords: "Mikrotik, MTCNA, Training Mikrotik, Sertifikasi Mikrotik, ID-Networkers, Networking",
  openGraph: {
    title: "Mikrotik MTCNA + Exam | ID-Networkers Training Center",
    description: "Training & Sertifikasi MikroTik MTCNA Terpercaya di Indonesia.",
    images: ["https://www.idn.id/wp-content/uploads/2023/01/LOGO-ID-Networkers-IDN.ID-Merah-1024x320.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

import { PixelScripts } from "@/components/PixelScripts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
        <PixelScripts />
        {children}
      </body>
    </html>
  );
}
