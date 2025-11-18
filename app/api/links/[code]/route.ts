import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const runtime = 'nodejs'

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/

export async function GET(
  _req: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params
  if (!CODE_REGEX.test(code)) return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
  try {
    const link = await prisma.link.findUnique({ where: { code } })
    if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(link)
  } catch (e) {
    console.error(`GET /api/links/${code} failed:`, e)
    return NextResponse.json({ error: 'Failed to fetch link' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params
  if (!CODE_REGEX.test(code)) return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
  try {
    await prisma.link.delete({ where: { code } })
    return NextResponse.json({ ok: true })
  } catch {
    console.error(`DELETE /api/links/${code} not found`)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
