import Link from 'next/link';
import { IkonKanan, IkonTambah } from '@/components/Ikon';
import { angka, inisial, statusLabel } from '@/lib/format';
import { statistikSiswa } from '@/lib/siswa';

export const metadata = { title: 'Dasbor' };
export const dynamic = 'force-dynamic';

export default async function HalamanDasbor() {
  const stat = await statistikSiswa();

  const aktif = stat.perStatus.find((s) => s.status === 'AKTIF')?.jumlah ?? 0;
  const lulus = stat.perStatus.find((s) => s.status === 'LULUS')?.jumlah ?? 0;
  const maks = Math.max(...stat.perKelas.map((k) => k.jumlah), 1);

  const kartu = [
    { label: 'Total Siswa', nilai: stat.total, kaki: 'terdaftar di database' },
    { label: 'Siswa Aktif', nilai: aktif, kaki: 'sedang aktif belajar' },
    { label: 'Siswa Lulus', nilai: lulus, kaki: 'sudah dinyatakan lulus' },
    { label: 'Kelas', nilai: stat.perKelas.length, kaki: 'kelas dengan data siswa' },
  ];

  return (
    <>
      <div className="kepala">
        <div>
          <p className="eyebrow">Dasbor</p>
          <h1 className="judul-h1">Manajemen Data Siswa</h1>
          <p className="lede">
            Ringkasan data siswa SMK Taruna Bhakti yang tersimpan di PostgreSQL Aiven dan dikelola
            melalui aplikasi Next.js ini. Semua angka di bawah dihitung langsung dari database.
          </p>
        </div>
        <div className="grup-tombol">
          <Link href="/siswa" className="btn btn-hantu">
            Lihat Semua Data
            <IkonKanan />
          </Link>
          <Link href="/siswa/baru" className="btn btn-utama">
            <IkonTambah />
            Tambah Siswa
          </Link>
        </div>
      </div>

      <div className="baris-statistik">
        {kartu.map((k) => (
          <div className="statistik" key={k.label}>
            <p className="statistik-label">{k.label}</p>
            <p className="statistik-nilai">{angka(k.nilai)}</p>
            <p className="statistik-kaki">{k.kaki}</p>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginTop: 22 }}>
        <div className="kartu">
          <div className="judul-bagian">
            <div>
              <h2 className="judul-seksi">Siswa Terbaru</h2>
              <p className="nama-sub">5 data terakhir yang ditambahkan</p>
            </div>
            <Link href="/siswa" className="btn btn-hantu btn-kecil">
              Semua data
              <IkonKanan />
            </Link>
          </div>

          {stat.terbaru.length === 0 ? (
            <div className="kosong">
              <h3>Belum ada data</h3>
              <p>Tambahkan siswa pertama untuk melihat daftar di sini.</p>
              <Link href="/siswa/baru" className="btn btn-utama">
                <IkonTambah />
                Tambah Siswa
              </Link>
            </div>
          ) : (
            <div className="tabs-wrapper">
              <table className="tabel ringkas">
                <thead>
                  <tr>
                    <th>Nama Siswa</th>
                    <th>Kelas</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stat.terbaru.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <Link href={`/siswa/${s.id}`} className="orang" style={{ gap: 12 }}>
                          <span className="avatar">{inisial(s.nama)}</span>
                          <span>
                            <span className="nama-utama">{s.nama}</span>
                            <span className="nama-sub">{s.nis}</span>
                          </span>
                        </Link>
                      </td>
                      <td>
                        <span className="lencana lencana-kelas polos">Kelas {s.kelas}</span>
                      </td>
                      <td>
                        <span className={`lencana lencana-${s.status.toLowerCase()}`}>
                          {statusLabel(s.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="kartu">
          <div className="judul-bagian">
            <h2 className="judul-seksi">Sebaran per Kelas</h2>
          </div>
          <div className="grafik-batang">
            {stat.perKelas.length === 0 && <p className="nama-sub">Belum ada data.</p>}
            {stat.perKelas.map((k) => (
              <div className="grafik-item" key={k.kelas}>
                <span className="grafik-label">Kelas {k.kelas}</span>
                <span className="grafik-nilai">{k.jumlah} siswa</span>
                <span className="grafik-rel">
                  <span
                    className="grafik-isi"
                    style={{ width: `${Math.round((k.jumlah / maks) * 100)}%` }}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
