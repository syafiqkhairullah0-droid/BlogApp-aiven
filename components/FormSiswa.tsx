'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import {
  JURUSAN_TERSEDIA,
  KELAS_TERSEDIA,
  STATUS_SISWA,
  type HasilApi,
  type Siswa,
  type StatusSiswa,
} from '@/lib/types';
import { IkonKiri, IkonPeringatan, IkonSimpan } from './Ikon';

const AWAL: HasilApi = { ok: false, galat: {} };

/** Isi form yang dikendalikan React, supaya isian user tidak hilang saat validasi gagal. */
interface IsiForm {
  nis: string;
  nama: string;
  kelas: string;
  jurusan: string;
  status: StatusSiswa;
}

const KOSONG: IsiForm = { nis: '', nama: '', kelas: '', jurusan: '', status: 'AKTIF' };

export function FormSiswa({ mode, siswa }: { mode: 'buat' | 'ubah'; siswa?: Siswa }) {
  const router = useRouter();
  const [isi, setIsi] = useState<IsiForm>(() =>
    siswa
      ? {
          nis: siswa.nis,
          nama: siswa.nama,
          kelas: siswa.kelas,
          jurusan: siswa.jurusan,
          status: siswa.status,
        }
      : KOSONG,
  );
  const [hasil, setHasil] = useState<HasilApi>(AWAL);
  const [pending, setPending] = useState(false);

  const galat = hasil.galat ?? {};

  /**
   * Submit lewat REST API (app/api/siswa/route.ts).
   *
   * Form sengaja tidak memakai <form action>, karena React 19 me-reset form
   * begitu sebuah action selesai, dan itu mengosongkan isi <select>.
   */
  async function kirim(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);

    const isiForm = Object.fromEntries(new FormData(event.currentTarget).entries());
    const url = mode === 'buat' ? '/api/siswa' : `/api/siswa/${siswa!.id}`;
    const metode = mode === 'buat' ? 'POST' : 'PUT';

    try {
      const respons = await fetch(url, {
        method: metode,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isiForm),
      });

      const balasan = await respons.json();

      if (balasan.ok) {
        const nama = balasan.data?.nama ?? isi.nama;
        router.push(
          mode === 'buat'
            ? `/siswa?sukses=${encodeURIComponent(`Data ${nama} berhasil ditambahkan.`)}`
            : `/siswa/${siswa!.id}?sukses=${encodeURIComponent(`Data ${nama} berhasil diperbarui.`)}`,
        );
        router.refresh();
        return;
      }

      setHasil({ ok: false, pesan: balasan.pesan, galat: balasan.galat, nilai: balasan.nilai });
    } catch {
      setHasil({
        ok: false,
        pesan: 'Tidak dapat menghubungi server. Pastikan aplikasi masih berjalan.',
      });
    } finally {
      setPending(false);
    }
  }

  function ubah<K extends keyof IsiForm>(kunci: K, nilai: IsiForm[K]) {
    setIsi((lama) => ({ ...lama, [kunci]: nilai }));
  }

  return (
    <form onSubmit={kirim}>
      {hasil.pesan && (
        <div className="pesan-salah" style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 'var(--r-md)', background: 'var(--bahaya-latar)', border: '1px solid rgba(232,120,120,.3)' }}>
          <IkonPeringatan style={{ width: 16, height: 16, flex: 'none' }} />
          {hasil.pesan}
        </div>
      )}

      <div className="kartu-pad">
        <div className="form-grid">
          <div className="bidang">
            <label htmlFor="nis">
              NIS <span className="wajib">*</span>
            </label>
            <input
              id="nis"
              name="nis"
              className={galat.nis ? 'input bermasalah' : 'input'}
              value={isi.nis}
              onChange={(e) => ubah('nis', e.target.value)}
              placeholder="Contoh: 20260101"
              inputMode="numeric"
            />
            {galat.nis && <p className="pesan-salah">{galat.nis}</p>}
            {!galat.nis && <p className="petunjuk">Nomor induk siswa, 4-20 digit angka.</p>}
          </div>

          <div className="bidang">
            <label htmlFor="nama">
              Nama Lengkap <span className="wajib">*</span>
            </label>
            <input
              id="nama"
              name="nama"
              className={galat.nama ? 'input bermasalah' : 'input'}
              value={isi.nama}
              onChange={(e) => ubah('nama', e.target.value)}
              placeholder="Contoh: Akmal Rizal Pratama"
            />
            {galat.nama && <p className="pesan-salah">{galat.nama}</p>}
          </div>

          <div className="bidang">
            <label htmlFor="kelas">
              Kelas <span className="wajib">*</span>
            </label>
            <select
              id="kelas"
              name="kelas"
              className={galat.kelas ? 'select bermasalah' : 'select'}
              value={isi.kelas}
              onChange={(e) => ubah('kelas', e.target.value)}
            >
              <option value="">-- Pilih kelas --</option>
              {KELAS_TERSEDIA.map((k) => (
                <option key={k} value={k}>
                  Kelas {k}
                </option>
              ))}
            </select>
            {galat.kelas && <p className="pesan-salah">{galat.kelas}</p>}
          </div>

          <div className="bidang">
            <label htmlFor="jurusan">
              Jurusan <span className="wajib">*</span>
            </label>
            <select
              id="jurusan"
              name="jurusan"
              className={galat.jurusan ? 'select bermasalah' : 'select'}
              value={isi.jurusan}
              onChange={(e) => ubah('jurusan', e.target.value)}
            >
              <option value="">-- Pilih jurusan --</option>
              {JURUSAN_TERSEDIA.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
            {galat.jurusan && <p className="pesan-salah">{galat.jurusan}</p>}
          </div>

          <div className="bidang">
            <label htmlFor="status">
              Status <span className="wajib">*</span>
            </label>
            <select
              id="status"
              name="status"
              className={galat.status ? 'select bermasalah' : 'select'}
              value={isi.status}
              onChange={(e) => ubah('status', e.target.value as StatusSiswa)}
            >
              {STATUS_SISWA.map((s) => (
                <option key={s.nilai} value={s.nilai}>
                  {s.label}
                </option>
              ))}
            </select>
            {galat.status && <p className="pesan-salah">{galat.status}</p>}
          </div>
        </div>
      </div>

      <div className="kotak-alat">
        <Link href="/siswa" className="btn btn-hantu">
          <IkonKiri />
          Kembali
        </Link>
        <button type="submit" className="btn btn-utama" disabled={pending}>
          <IkonSimpan />
          {pending ? 'Menyimpan…' : mode === 'buat' ? 'Simpan Data' : 'Simpan Perubahan'}
        </button>
      </div>
    </form>
  );
}
