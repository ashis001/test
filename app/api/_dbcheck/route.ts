import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Simple connectivity checks
    const ping = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() as now`;
    const count = await prisma.link.count();
    return NextResponse.json({ ok: true, now: ping?.[0]?.now ?? null, linkCount: count })
  } catch (e: any) {
    // Return sanitized error for diagnostics
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 })
  }
}
