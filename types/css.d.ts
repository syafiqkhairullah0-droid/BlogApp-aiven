/**
 * Deklarasi tipe untuk berkas CSS biasa.
 *
 * Next.js hanya mendeklarasikan '*.module.css' (CSS Modules) di
 * node_modules/next/types/global.d.ts. Berkas CSS biasa seperti
 * app/globals.css tidak punya deklarasi, sehingga TypeScript menandainya
 * "Cannot find module './globals.css' or its corresponding type declarations"
 * (error TS2307) di app/layout.tsx.
 *
 * Berkas ini yang menutup celah tersebut.
 */

declare module '*.css';
