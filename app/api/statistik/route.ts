/**
 * API Resource: /api/statistik
 * Ringkasan data siswa untuk dasbor.
 */

import { NextResponse } from 'next/server';
import { statistikSiswa } from '@/lib/siswa';

export const dynamic = 'force-dynamic';

export async function GET() {
  const statistik = await statistikSiswa();
  return NextResponse.json({ ok: true, data: statistik });
}
