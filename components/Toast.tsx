'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { IkonCek, IkonPeringatan } from './Ikon';

/**
 * Notifikasi hasil aksi. Pesan dikirim lewat query string (?sukses= / ?galat=)
 * supaya tetap tampil setelah redirect dari Server Action, lalu URL dibersihkan
 * supaya tidak muncul lagi saat halaman di-refresh.
 */
export function Toast() {
  return (
    <Suspense fallback={null}>
      <ToastIsi />
    </Suspense>
  );
}

function ToastIsi() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const sukses = params.get('sukses');
  const gagal = params.get('galat');
  const pesan = sukses ?? gagal;

  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    if (!pesan) return;

    setTampil(true);
    const timer = setTimeout(() => {
      setTampil(false);
      const sisa = new URLSearchParams(window.location.search);
      sisa.delete('sukses');
      sisa.delete('galat');
      const qs = sisa.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 4500);

    return () => clearTimeout(timer);
  }, [pesan, pathname, router]);

  if (!pesan || !tampil) return null;

  return (
    <div className={sukses ? 'toast berhasil' : 'toast gagal'} role="status" aria-live="polite">
      {sukses ? <IkonCek /> : <IkonPeringatan />}
      <span>{pesan}</span>
    </div>
  );
}
