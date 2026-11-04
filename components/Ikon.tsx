/**
 * Kumpulan ikon SVG inline (stroke currentColor) supaya tidak perlu dependensi
 * ikon eksternal. Semua ikon memakai viewBox 24x24.
 */

import type { CSSProperties, ReactNode } from 'react';

export type IkonProps = {
  className?: string;
  style?: CSSProperties;
};

const dasar = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function Ikon({ className, style, children }: IkonProps & { children: ReactNode }) {
  return (
    <svg {...dasar} className={className} style={style}>
      {children}
    </svg>
  );
}

export function IkonDasbor(props: IkonProps) {
  return (
    <Ikon {...props}>
      <rect x="3" y="3" width="7.5" height="8.5" rx="1.6" />
      <rect x="13.5" y="3" width="7.5" height="5" rx="1.6" />
      <rect x="13.5" y="11" width="7.5" height="10" rx="1.6" />
      <rect x="3" y="14.5" width="7.5" height="6.5" rx="1.6" />
    </Ikon>
  );
}

export function IkonSiswa(props: IkonProps) {
  return (
    <Ikon {...props}>
      <path d="M16 20v-1.6a3.4 3.4 0 0 0-3.4-3.4H6.4A3.4 3.4 0 0 0 3 18.4V20" />
      <circle cx="9.5" cy="8" r="3.4" />
      <path d="M21 20v-1.6a3.4 3.4 0 0 0-2.6-3.3M15.6 4.7a3.4 3.4 0 0 1 0 6.6" />
    </Ikon>
  );
}

export function IkonPanduan(props: IkonProps) {
  return (
    <Ikon {...props}>
      <path d="M4 5.2A1.8 1.8 0 0 1 5.8 3.4H11v16.4H5.8A1.8 1.8 0 0 1 4 18z" />
      <path d="M20 5.2a1.8 1.8 0 0 0-1.8-1.8H13v16.4h5.2A1.8 1.8 0 0 0 20 18z" />
    </Ikon>
  );
}

export function IkonTambah(props: IkonProps) {
  return (
    <Ikon {...props}>
      <path d="M12 5v14M5 12h14" />
    </Ikon>
  );
}

export function IkonCari(props: IkonProps) {
  return (
    <Ikon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </Ikon>
  );
}

export function IkonUbah(props: IkonProps) {
  return (
    <Ikon {...props}>
      <path d="M12 20h8" />
      <path d="M16.4 3.6a2.1 2.1 0 0 1 3 3L8.2 17.8l-4 1 1-4z" />
    </Ikon>
  );
}

export function IkonHapus(props: IkonProps) {
  return (
    <Ikon {...props}>
      <path d="M3.5 6.2h17M9 6.2V4.6A1.6 1.6 0 0 1 10.6 3h2.8A1.6 1.6 0 0 1 15 4.6v1.6" />
      <path d="M18.4 6.2 17.6 19a1.8 1.8 0 0 1-1.8 1.7H8.2A1.8 1.8 0 0 1 6.4 19L5.6 6.2" />
      <path d="M10 10.4v6M14 10.4v6" />
    </Ikon>
  );
}

export function IkonLihat(props: IkonProps) {
  return (
    <Ikon {...props}>
      <path d="M2.2 12S5.8 5.4 12 5.4 21.8 12 21.8 12 18.2 18.6 12 18.6 2.2 12 2.2 12" />
      <circle cx="12" cy="12" r="2.9" />
    </Ikon>
  );
}

export function IkonKanan(props: IkonProps) {
  return (
    <Ikon {...props}>
      <path d="m9 5 7 7-7 7" />
    </Ikon>
  );
}

export function IkonKiri(props: IkonProps) {
  return (
    <Ikon {...props}>
      <path d="m15 5-7 7 7 7" />
    </Ikon>
  );
}

export function IkonAtas(props: IkonProps) {
  return (
    <Ikon {...props}>
      <path d="m6 14 6-6 6 6" />
    </Ikon>
  );
}

export function IkonBawah(props: IkonProps) {
  return (
    <Ikon {...props}>
      <path d="m6 10 6 6 6-6" />
    </Ikon>
  );
}

export function IkonCek(props: IkonProps) {
  return (
    <Ikon {...props}>
      <path d="m4.5 12.5 5 5 10-11" />
    </Ikon>
  );
}

export function IkonSilang(props: IkonProps) {
  return (
    <Ikon {...props}>
      <path d="M6 6 18 18M18 6 6 18" />
    </Ikon>
  );
}

export function IkonPeringatan(props: IkonProps) {
  return (
    <Ikon {...props}>
      <path d="M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9.4v4.2M12 17.4h.01" />
    </Ikon>
  );
}

export function IkonServer(props: IkonProps) {
  return (
    <Ikon {...props}>
      <rect x="2.5" y="3.5" width="19" height="6" rx="1.6" />
      <rect x="2.5" y="14.5" width="19" height="6" rx="1.6" />
      <path d="M6.5 6.5h.01M6.5 17.5h.01" />
    </Ikon>
  );
}

export function IkonBuku(props: IkonProps) {
  return (
    <Ikon {...props}>
      <path d="M3.5 4.5A1.5 1.5 0 0 1 5 3h5.2a2 2 0 0 1 2 2v14a1.6 1.6 0 0 0-1.6-1.6H3.5z" />
      <path d="M20.5 4.5A1.5 1.5 0 0 0 19 3h-5.2a2 2 0 0 0-2 2v14a1.6 1.6 0 0 1 1.6-1.6h5.6z" />
    </Ikon>
  );
}

export function IkonKosong(props: IkonProps) {
  return (
    <Ikon {...props}>
      <path d="M3 7.5h18M3 12h18M3 16.5h12" />
      <circle cx="18.5" cy="16.5" r="3" />
      <path d="m20.8 18.8 2 2" />
    </Ikon>
  );
}

export function IkonSimpan(props: IkonProps) {
  return (
    <Ikon {...props}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <path d="M17 21v-8H7v8M7 3v5h7" />
    </Ikon>
  );
}
