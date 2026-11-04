import Link from 'next/link';
import { Kosong } from '@/components/Kosong';
import { Paginasi } from '@/components/Paginasi';
import { HapusButton } from '@/components/HapusButton';
import { IkonAtas, IkonBawah, IkonCari, IkonLihat, IkonTambah, IkonUbah } from '@/components/Ikon';
import { inisial, statusLabel } from '@/lib/format';
import { listSiswa, opsiKelas } from '@/lib/siswa';
import { STATUS_SISWA, type StatusSiswa } from '@/lib/types';
import { buatUrl } from '@/lib/url';

export const metadata = { title: 'Data Siswa' };
export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | string[] | undefined>;

function ambil(sp: SearchParams, kunci: string): string {
  const nilai = sp[kunci];
  return typeof nilai === 'string' ? nilai : '';
}

export default async function HalamanSiswa({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const q = ambil(sp, 'q');
  const kelas = ambil(sp, 'kelas');
  const status = ambil(sp, 'status');
  const sort = ambil(sp, 'sort') || 'nama';
  const order = ambil(sp, 'order') === 'desc' ? 'desc' : 'asc';
  const page = Math.max(Number(ambil(sp, 'page')) || 1, 1);

  const [hasil, kelasOpsi] = await Promise.all([
    listSiswa({
      q,
      kelas,
      status: (status || '') as StatusSiswa | '',
      sort: sort as 'nama' | 'nis' | 'kelas' | 'dibuat',
      order,
      page,
    }),
    opsiKelas(),
  ]);

  const parameter = { q, kelas, status, sort, order, page: String(page) };

  function tautanSort(kolom: string) {
    const arahBaru = sort === kolom && order === 'asc' ? 'desc' : 'asc';
    return `/siswa${buatUrl(parameter, { sort: kolom, order: arahBaru, page: undefined })}`;
  }

  function panahSort(kolom: string) {
    if (sort !== kolom) return null;
    return order === 'asc' ? (
      <IkonAtas style={{ width: 13, height: 13 }} />
    ) : (
      <IkonBawah style={{ width: 13, height: 13 }} />
    );
  }

  return (
    <>
      <div className="kepala">
        <div>
          <p className="eyebrow">Kelola Data</p>
          <h1 className="judul-h1">Data Siswa</h1>
          <p className="lede">
            CRUD lengkap untuk data siswa: tambah, ubah, lihat detail, dan hapus. Data tersimpan di
            PostgreSQL Aiven dan bisa dimanipulasi juga lewat DBeaver.
          </p>
        </div>
        <div className="grup-tombol">
          <Link href="/siswa/baru" className="btn btn-utama">
            <IkonTambah />
            Tambah Siswa
          </Link>
        </div>
      </div>

      <div className="kartu">
        {/* Filter — form GET, jadi tetap jalan tanpa JavaScript */}
        <form className="filter-bar" method="get" action="/siswa">
          <div className="bidang lebar">
            <label htmlFor="q">Cari Siswa</label>
            <input
              id="q"
              name="q"
              className="input"
              defaultValue={q}
              placeholder="Cari berdasarkan nama atau NIS…"
            />
          </div>

          <div className="bidang">
            <label htmlFor="filter-kelas">Kelas</label>
            <select id="filter-kelas" name="kelas" className="select" defaultValue={kelas}>
              <option value="">Semua kelas</option>
              {kelasOpsi.map((k) => (
                <option key={k} value={k}>
                  Kelas {k}
                </option>
              ))}
            </select>
          </div>

          <div className="bidang">
            <label htmlFor="filter-status">Status</label>
            <select id="filter-status" name="status" className="select" defaultValue={status}>
              <option value="">Semua status</option>
              {STATUS_SISWA.map((s) => (
                <option key={s.nilai} value={s.nilai}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-utama">
            <IkonCari />
            Terapkan
          </button>
          <Link href="/siswa" className="btn btn-hantu">
            Reset
          </Link>
        </form>

        {hasil.data.length === 0 ? (
          <Kosong
            judul={q || kelas || status ? 'Data tidak ditemukan' : 'Belum ada data siswa'}
            pesan={
              q || kelas || status
                ? 'Coba ubah kata kunci atau reset filter pencarian.'
                : 'Mulai dengan menambahkan data siswa pertama ke database.'
            }
            aksi={{ label: 'Tambah Siswa', href: '/siswa/baru' }}
          />
        ) : (
          <div className="tabs-wrapper">
            <table className="tabel">
              <thead>
                <tr>
                  <th>
                    <Link href={tautanSort('nis')}>NIS {panahSort('nis')}</Link>
                  </th>
                  <th>
                    <Link href={tautanSort('nama')}>Nama Siswa {panahSort('nama')}</Link>
                  </th>
                  <th>
                    <Link href={tautanSort('kelas')}>Kelas {panahSort('kelas')}</Link>
                  </th>
                  <th>Jurusan</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {hasil.data.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <span className="kode">{s.nis}</span>
                    </td>
                    <td>
                      <div className="orang">
                        <span className="avatar">{inisial(s.nama)}</span>
                        <span>
                          <span className="nama-utama">{s.nama}</span>
                          <span className="nama-sub">Ditambahkan {s.dibuat_pada}</span>
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="lencana lencana-kelas polos">Kelas {s.kelas}</span>
                    </td>
                    <td style={{ color: 'var(--teks-2)' }}>{s.jurusan}</td>
                    <td>
                      <span className={`lencana lencana-${s.status.toLowerCase()}`}>
                        {statusLabel(s.status)}
                      </span>
                    </td>
                    <td>
                      <div className="aksi-baris">
                        <Link
                          href={`/siswa/${s.id}`}
                          className="btn btn-hantu btn-kecil"
                          title="Lihat detail"
                        >
                          <IkonLihat />
                          Detail
                        </Link>
                        <Link
                          href={`/siswa/${s.id}/edit`}
                          className="btn btn-hantu btn-kecil"
                          title="Ubah data"
                        >
                          <IkonUbah />
                          Ubah
                        </Link>
                        <HapusButton id={s.id} nama={s.nama} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {hasil.data.length > 0 && (
          <Paginasi
            page={hasil.page}
            totalHalaman={hasil.totalHalaman}
            total={hasil.total}
            perPage={hasil.perPage}
            parameter={parameter}
          />
        )}
      </div>
    </>
  );
}
