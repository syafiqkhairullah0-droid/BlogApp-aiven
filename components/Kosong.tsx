import Link from 'next/link';
import { IkonKosong, IkonTambah } from './Ikon';

export function Kosong({
  judul = 'Belum ada data',
  pesan = 'Data yang sudah disimpan akan muncul di sini.',
  aksi,
}: {
  judul?: string;
  pesan?: string;
  aksi?: { label: string; href: string };
}) {
  return (
    <div className="kosong">
      <div className="kosong-ikon">
        <IkonKosong />
      </div>
      <h3>{judul}</h3>
      <p>{pesan}</p>
      {aksi && (
        <Link href={aksi.href} className="btn btn-utama">
          <IkonTambah />
          {aksi.label}
        </Link>
      )}
    </div>
  );
}
