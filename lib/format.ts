/** Utilitas format tampilan. Tanpa dependensi luar, tanpa efek samping. */

/** 'AKTIF' -> 'Aktif' */
export function statusLabel(status: string): string {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

/** Huruf awal nama, untuk avatar lingkaran. */
export function inisial(nama: string): string {
  const bersih = nama.trim();
  if (!bersih) return '?';
  const kata = bersih.split(/\s+/);
  if (kata.length === 1) return kata[0].slice(0, 2).toUpperCase();
  return (kata[0][0] + kata[kata.length - 1][0]).toUpperCase();
}

/** Angka -> "1.234" gaya Indonesia */
export function angka(n: number): string {
  return new Intl.NumberFormat('id-ID').format(n);
}
