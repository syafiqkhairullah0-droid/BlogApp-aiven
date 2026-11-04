import { FormSiswa } from '@/components/FormSiswa';

export const metadata = { title: 'Tambah Siswa' };
export const dynamic = 'force-dynamic';

export default function HalamanTambahSiswa() {
  return (
    <>
      <div className="kepala">
        <div>
          <p className="eyebrow">Tambah Data</p>
          <h1 className="judul-h1">Siswa Baru</h1>
          <p className="lede">
            Isi formulir berikut untuk menambahkan satu data siswa ke dalam tabel{' '}
            <code>sekolah.data_siswa</code> di PostgreSQL Aiven. Kolom bertanda{' '}
            <span style={{ color: 'var(--aksen)' }}>*</span> wajib diisi.
          </p>
        </div>
      </div>

      <div className="kartu">
        <FormSiswa mode="buat" />
      </div>
    </>
  );
}
