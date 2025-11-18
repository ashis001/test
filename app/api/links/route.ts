import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/

function randomCode(len = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let out = ''
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

export async function GET() {
  try {
    const links = await prisma.link.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(links)
  } catch (e) {
    console.error('GET /api/links failed:', e)
    return NextResponse.json({ error: 'Failed to list links' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    let { url, code } = body as { url?: string; code?: string }

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'url is required' }, { status: 400 })
    }

    try {
      // Validate URL
      new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    if (code) {
      if (!CODE_REGEX.test(code)) {
        return NextResponse.json({ error: 'code must match [A-Za-z0-9]{6,8}' }, { status: 400 })
      }
      const exists = await prisma.link.findUnique({ where: { code } })
      if (exists) {
        return NextResponse.json({ error: 'Code already exists' }, { status: 409 })
      }
    } else {
      // generate a 6-char code
      let attempt = 0
      do {
        code = randomCode(6)
        const exists = await prisma.link.findUnique({ where: { code } })
        if (!exists) break
        attempt++
      } while (attempt < 5)
      if (!code) return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 })
    }

    const created = await prisma.link.create({ data: { code: code!, url } })
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    console.error('POST /api/links failed:', e)
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 })
  }
}
