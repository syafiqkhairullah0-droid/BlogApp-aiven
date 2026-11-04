/**
 * API Resource: /api/siswa
 *
 *   GET    /api/siswa  → daftar siswa (dukung q, kelas, status, sort, order, page, perPage)
 *   POST   /api/siswa  → tambah siswa baru
 *
 * Balasan sukses : { ok: true, ... }
 * Balasan gagal  : { ok: false, galat?: { field: pesan }, pesan?: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSiswa, getSiswaByNis, listSiswa } from '@/lib/siswa';
import type { StatusSiswa } from '@/lib/types';
import { normalisasiData, pesanError, validasiData } from '@/lib/validasi';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const hasil = await listSiswa({
    q: sp.get('q') ?? '',
    kelas: sp.get('kelas') ?? '',
    status: (sp.get('status') ?? '') as StatusSiswa | '',
    sort: (sp.get('sort') ?? 'nama') as 'nama' | 'nis' | 'kelas' | 'dibuat',
    order: sp.get('order') === 'desc' ? 'desc' : 'asc',
    page: Math.max(Number(sp.get('page')) || 1, 1),
    perPage: Math.min(Math.max(Number(sp.get('perPage')) || 10, 5), 50),
  });

  return NextResponse.json({ ok: true, ...hasil });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, pesan: 'Body permintaan harus berupa JSON.' },
      { status: 400 },
    );
  }

  const data = normalisasiData(body);
  const galat = validasiData(data);

  if (Object.keys(galat).length > 0) {
    return NextResponse.json({ ok: false, galat, nilai: data }, { status: 400 });
  }

  const bentrok = await getSiswaByNis(data.nis);
  if (bentrok) {
    return NextResponse.json(
      { ok: false, galat: { nis: `NIS ${data.nis} sudah dipakai oleh ${bentrok.nama}.` } },
      { status: 409 },
    );
  }

  try {
    const siswa = await createSiswa(data);
    return NextResponse.json({ ok: true, data: siswa }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, pesan: pesanError(err) }, { status: 500 });
  }
}
