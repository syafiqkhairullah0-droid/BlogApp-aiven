import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HapusButton } from '@/components/HapusButton';
import { IkonKiri, IkonUbah } from '@/components/Ikon';
import { inisial, statusLabel } from '@/lib/format';
import { getSiswa } from '@/lib/siswa';
import { STATUS_SISWA } from '@/lib/types';

export const metadata = { title: 'Detail Siswa' };
export const dynamic = 'force-dynamic';

export default async function HalamanDetailSiswa({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const siswa = await getSiswa(Number(id));

  if (!siswa) notFound();

  const labelStatus =
    STATUS_SISWA.find((s) => s.nilai === siswa.status)?.label ?? statusLabel(siswa.status);

  const detail = [
    { label: 'NIS', nilai: siswa.nis },
    { label: 'Nama Lengkap', nilai: siswa.nama },
    { label: 'Kelas', nilai: `Kelas ${siswa.kelas}` },
    { label: 'Jurusan', nilai: siswa.jurusan },
    { label: 'Status', nilai: labelStatus },
    { label: 'Tanggal Ditambahkan', nilai: siswa.dibuat_pada },
  ];

  return (
    <>
      <div className="kepala">
        <div>
          <p className="eyebrow">
            <Link href="/siswa" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <IkonKiri style={{ width: 13, height: 13 }} />
              Data Siswa
            </Link>
          </p>
          <h1 className="judul-h1">Detail Siswa</h1>
          <p className="lede">
            Nomor induk <span className="kode">{siswa.nis}</span> · ditambahkan pada{' '}
            {siswa.dibuat_pada}
          </p>
        </div>
        <div className="grup-tombol">
          <Link href={`/siswa/${siswa.id}/edit`} className="btn btn-utama">
            <IkonUbah />
            Ubah Data
          </Link>
          <HapusButton id={siswa.id} nama={siswa.nama} />
        </div>
      </div>

      <div className="kartu">
        <div className="kartu-pad" style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <span className="avatar" style={{ width: 68, height: 68, fontSize: 22, borderRadius: 20 }}>
            {inisial(siswa.nama)}
          </span>
          <div>
            <h2 className="judul-seksi" style={{ fontSize: 22 }}>
              {siswa.nama}
            </h2>
            <p style={{ color: 'var(--teks-3)', fontSize: 13.5 }}>
              Kelas {siswa.kelas} · {siswa.jurusan}
            </p>
            <span
              className={`lencana lencana-${siswa.status.toLowerCase()}`}
              style={{ marginTop: 9 }}
            >
              {labelStatus}
            </span>
          </div>
        </div>

        <div className="kartu-pad">
          <div className="baris-detail">
            {detail.map((d) => (
              <div className="detail-item" key={d.label}>
                <p className="detail-label">{d.label}</p>
                <p className="detail-nilai">{d.nilai}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
