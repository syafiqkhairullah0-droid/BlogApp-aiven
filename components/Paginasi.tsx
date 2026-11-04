import Link from 'next/link';
import { buatUrl, type Parameter } from '@/lib/url';
import { IkonKanan, IkonKiri } from './Ikon';

interface Props {
  page: number;
  totalHalaman: number;
  total: number;
  perPage: number;
  parameter: Parameter;
}

export function Paginasi({ page, totalHalaman, total, perPage, parameter }: Props) {
  const awal = total === 0 ? 0 : (page - 1) * perPage + 1;
  const akhir = Math.min(page * perPage, total);

  // Maksimal 5 nomor halaman di sekitar halaman sekarang.
  const daftar: number[] = [];
  const dari = Math.max(1, Math.min(page - 2, totalHalaman - 4));
  const sampai = Math.min(totalHalaman, Math.max(dari + 4, 5));
  for (let i = dari; i <= sampai; i += 1) daftar.push(i);

  return (
    <div className="paginasi">
      <p className="paginasi-info">
        Menampilkan <strong>{awal}</strong>–<strong>{akhir}</strong> dari{' '}
        <strong>{total}</strong> data siswa
      </p>

      <div className="paginasi-tombol">
        <Link
          href={`/siswa${buatUrl(parameter, { page: page - 1 })}`}
          className="halaman-btn"
          aria-label="Halaman sebelumnya"
          aria-disabled={page <= 1}
        >
          <IkonKiri />
        </Link>

        {daftar.map((nomor) => (
          <Link
            key={nomor}
            href={`/siswa${buatUrl(parameter, { page: nomor })}`}
            className={nomor === page ? 'halaman-btn aktif' : 'halaman-btn'}
            aria-current={nomor === page ? 'page' : undefined}
          >
            {nomor}
          </Link>
        ))}

        <Link
          href={`/siswa${buatUrl(parameter, { page: page + 1 })}`}
          className="halaman-btn"
          aria-label="Halaman berikutnya"
          aria-disabled={page >= totalHalaman}
        >
          <IkonKanan />
        </Link>
      </div>
    </div>
  );
}
