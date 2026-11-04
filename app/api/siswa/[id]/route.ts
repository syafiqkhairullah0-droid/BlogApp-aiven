/**
 * API Resource: /api/siswa/{id}
 *
 *   GET    /api/siswa/{id}  → detail satu siswa
 *   PUT    /api/siswa/{id}  → ubah data siswa
 *   DELETE /api/siswa/{id}  → hapus data siswa
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteSiswa, getSiswa, getSiswaByNis, updateSiswa } from '@/lib/siswa';
import { normalisasiData, pesanError, validasiData } from '@/lib/validasi';

export const dynamic = 'force-dynamic';

type Konteks = { params: Promise<{ id: string }> };

function ambilId(id: string): number | null {
  const angka = Number(id);
  return Number.isInteger(angka) && angka > 0 ? angka : null;
}

export async function GET(_request: NextRequest, { params }: Konteks) {
  const { id } = await params;
  const angkaId = ambilId(id);

  if (!angkaId) {
    return NextResponse.json({ ok: false, pesan: 'ID siswa tidak valid.' }, { status: 400 });
  }

  const siswa = await getSiswa(angkaId);
  if (!siswa) {
    return NextResponse.json({ ok: false, pesan: 'Data siswa tidak ditemukan.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: siswa });
}

export async function PUT(request: NextRequest, { params }: Konteks) {
  const { id } = await params;
  const angkaId = ambilId(id);

  if (!angkaId) {
    return NextResponse.json({ ok: false, pesan: 'ID siswa tidak valid.' }, { status: 400 });
  }

  const ada = await getSiswa(angkaId);
  if (!ada) {
    return NextResponse.json({ ok: false, pesan: 'Data siswa tidak ditemukan.' }, { status: 404 });
  }

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

  const bentrok = await getSiswaByNis(data.nis, angkaId);
  if (bentrok) {
    return NextResponse.json(
      { ok: false, galat: { nis: `NIS ${data.nis} sudah dipakai oleh ${bentrok.nama}.` } },
      { status: 409 },
    );
  }

  try {
    const siswa = await updateSiswa(angkaId, data);
    return NextResponse.json({ ok: true, data: siswa });
  } catch (err) {
    return NextResponse.json({ ok: false, pesan: pesanError(err) }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Konteks) {
  const { id } = await params;
  const angkaId = ambilId(id);

  if (!angkaId) {
    return NextResponse.json({ ok: false, pesan: 'ID siswa tidak valid.' }, { status: 400 });
  }

  try {
    const terhapus = await deleteSiswa(angkaId);
    if (!terhapus) {
      return NextResponse.json(
        { ok: false, pesan: 'Data siswa tidak ditemukan.' },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, pesan: pesanError(err) }, { status: 500 });
  }
}
