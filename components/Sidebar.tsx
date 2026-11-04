'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IkonDasbor, IkonPanduan, IkonSiswa } from './Ikon';

const MENU = [
  { href: '/', label: 'Dasbor', Ikon: IkonDasbor, tepat: true },
  { href: '/siswa', label: 'Data Siswa', Ikon: IkonSiswa, tepat: false },
  { href: '/panduan', label: 'Panduan', Ikon: IkonPanduan, tepat: false },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/" className="merek">
        <span className="merek-tanda">A</span>
        <span>
          <span className="merek-nama">AUREUS</span>
          <span className="merek-sub">Manajemen Data Siswa</span>
        </span>
      </Link>

      <nav>
        <p className="nav-label">Menu</p>
        <div className="nav">
          {MENU.map(({ href, label, Ikon, tepat }) => {
            const aktif = tepat ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={aktif ? 'nav-item aktif' : 'nav-item'}
                aria-current={aktif ? 'page' : undefined}
              >
                <Ikon />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="sidebar-kaki">
        <div className="kartu-sekolah">
          <strong>SMK Taruna Bhakti</strong>
          <span>
            Tugas CRUD Data Siswa
            <br />
           XI RPL 5 · Achmad Syafiq K.
          </span>
        </div>
        <div className="kartu-sekolah">
          <span style={{ marginTop: 0 }}>
            Next.js 15 · PostgreSQL Aiven
            <br />· DBeaver
          </span>
        </div>
      </div>
    </aside>
  );
}
