import { notFound } from 'next/navigation';
import { FormSiswa } from '@/components/FormSiswa';
import { getSiswa } from '@/lib/siswa';

export const metadata = { title: 'Ubah Data Siswa' };
export const dynamic = 'force-dynamic';

export default async function HalamanUbahSiswa({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const siswa = await getSiswa(Number(id));

  if (!siswa) notFound();

  return (
    <>
      <div className="kepala">
        <div>
          <p className="eyebrow">Ubah Data</p>
          <h1 className="judul-h1">Perbarui Data Siswa</h1>
          <p className="lede">
            Mengubah data <strong>{siswa.nama}</strong> (NIS {siswa.nis}). Perubahan langsung
            ditulis ke database dan terlihat di DBeaver.
          </p>
        </div>
      </div>

      <div className="kartu">
        <FormSiswa mode="ubah" siswa={siswa} />
      </div>
    </>
  );
}
