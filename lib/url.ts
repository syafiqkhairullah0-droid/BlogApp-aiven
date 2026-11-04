/** Utilitas menyusun query string tanpa mengulang parameter yang sudah ada. */

export type Parameter = Record<string, string | number | undefined | null>;

export function buatUrl(saatIni: Parameter, perubahan: Parameter = {}): string {
  const gabungan: Parameter = { ...saatIni, ...perubahan };

  const params = new URLSearchParams();
  for (const [kunci, nilai] of Object.entries(gabungan)) {
    if (nilai === undefined || nilai === null || nilai === '') continue;
    params.set(kunci, String(nilai));
  }

  const qs = params.toString();
  return qs ? `?${qs}` : '';
}
