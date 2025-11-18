import { NextResponse } from 'next/server'

export async function GET() {
  const now = new Date().toISOString()
  const uptimeSec = Math.floor(process.uptime())
  const env = process.env.NODE_ENV || 'development'
  return NextResponse.json({ ok: true, version: '1.0', now, uptimeSec, env })
}
