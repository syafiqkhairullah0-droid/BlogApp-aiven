'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IkonHapus, IkonPeringatan } from './Ikon';

export function HapusButton({ id, nama }: { id: number; nama: string }) {
  const router = useRouter();
  const [buka, setBuka] = useState(false);
  const [pending, setPending] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);

  async function konfirmasi() {
    setPending(true);
    setGalat(null);

    try {
      const respons = await fetch(`/api/siswa/${id}`, { method: 'DELETE' });
      const balasan = await respons.json();

      if (balasan.ok) {
        setBuka(false);
        router.push(`/siswa?sukses=${encodeURIComponent('Data siswa berhasil dihapus.')}`);
        router.refresh();
        return;
      }

      setGalat(balasan.pesan ?? 'Gagal menghapus data.');
    } catch {
      setGalat('Tidak dapat menghubungi server. Pastikan aplikasi masih berjalan.');
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-bahaya btn-kecil"
        onClick={() => setBuka(true)}
        title={`Hapus data ${nama}`}
      >
        <IkonHapus />
        Hapus
      </button>

      {buka && (
        <div className="modal-lapis" onClick={() => setBuka(false)} role="presentation">
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="judul-hapus"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-ikon">
              <IkonPeringatan />
            </div>
            <h3 className="modal-judul" id="judul-hapus">
              Hapus data siswa?
            </h3>
            <p className="modal-teks">
              Data <strong>{nama}</strong> akan dihapus permanen dari database. Tindakan ini
              tidak dapat dibatalkan.
            </p>
            {galat && (
              <p className="pesan-salah" style={{ marginTop: 12 }}>
                {galat}
              </p>
            )}
            <div className="modal-aksi">
              <button type="button" className="btn btn-hantu" onClick={() => setBuka(false)}>
                Batal
              </button>
              <button type="button" className="btn btn-bahaya" onClick={konfirmasi} disabled={pending}>
                {pending ? 'Menghapus…' : 'Ya, hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
