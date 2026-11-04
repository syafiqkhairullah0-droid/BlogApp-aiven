import { cekKoneksiDb } from '@/lib/db';

/**
 * Lencana status koneksi database di topbar.
 * Dicek dari server supaya kredensial Aiven tidak pernah masuk ke browser.
 */
export async function StatusDb() {
  const { ok, pesan } = await cekKoneksiDb();

  return (
    <span className={ok ? 'status-db' : 'status-db gagal'} title={pesan}>
      <span className="titik" />
      <span>{ok ? pesan : 'Database tidak terhubung'}</span>
    </span>
  );
}
