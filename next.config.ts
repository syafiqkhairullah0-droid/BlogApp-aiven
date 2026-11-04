import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  // Badge dev Next.js (ikon "N") muncul di pojok kiri bawah dan menutupi
  // sidebar, jadi dimatikan supaya tampilan bersih.
  devIndicators: false,
  // Ada package-lock.json lain di folder di atas project ini, jadi root
  // workspace harus dipatah agar Next tidak salah menebak.
  outputFileTracingRoot: path.join(process.cwd()),
  // pg (node-postgres) tidak boleh di-bundle oleh Turbopack/webpack,
  // karena ia memakai modul native & socket TCP.
  // PGlite (mode demo) juga dikecualikan supaya berkas .wasm-nya dibaca
  // langsung dari node_modules, bukan dipaketkan ulang.
  serverExternalPackages: ['pg', '@electric-sql/pglite'],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
