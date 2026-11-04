import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { StatusDb } from "@/components/StatusDb";
import { Toast } from "@/components/Toast";

export const metadata: Metadata = {
  title: {
    default: "AUREUS — Sistem Manajemen Data Siswa",
    template: "%s · AUREUS",
  },
  description:
    "Aplikasi CRUD data siswa untuk tugas sekolah — Next.js 15, PostgreSQL Aiven, DBeaver. Tema gelap minimalis.",
  authors: [{ name: "Achmad Syafiq Khairullah" }],
};

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <div className="shell">
          <Sidebar />
          <div className="utama">
            <header className="topbar">
              <div className="kota-aksi">
                <StatusDb />
              </div>
              <div className="identitas">
                <span className="avatar">AS</span>
                <span className="identitas-teks">
                  <strong>Achmad Syafiq Khairullah</strong>
                  <span>XI RPL 5 · SMK Taruna Bhakti</span>
                </span>
              </div>
            </header>
            <main className="konten">{children}</main>
          </div>
        </div>
        <Toast />
      </body>
    </html>
  );
}
