import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/

export async function GET(
  _req: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params
  const notFoundHtml = `<!doctype html>
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>404 | TinyLink</title>
      <style>
        body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f8fafc;color:#0f172a}
        .box{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;max-width:520px;box-shadow:0 1px 2px rgba(0,0,0,.05)}
        .title{font-size:20px;font-weight:600;margin:0 0 8px}
        .text{font-size:14px;color:#475569;margin:0 0 16px}
        .btn{display:inline-flex;align-items:center;gap:8px;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px;font-size:14px;color:#0f172a;text-decoration:none}
        .btn:hover{background:#f1f5f9}
      </style>
    </head>
    <body>
      <div class="box">
        <h1 class="title">404 – Link not found</h1>
        <p class="text">This short link does not exist or has been removed.</p>
        <a class="btn" href="/">← Back to Dashboard</a>
      </div>
    </body>
  </html>`
  if (!CODE_REGEX.test(code)) return new NextResponse(notFoundHtml, { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } })
  const link = await prisma.link.findUnique({ where: { code } })
  if (!link) return new NextResponse(notFoundHtml, { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } })

  try {
    await prisma.link.update({
      where: { code },
      data: { clicks: { increment: 1 }, lastClickedAt: new Date() },
    })
  } catch (e) {
    console.error(`Redirect update failed for code ${code}:`, e)
  }

  return NextResponse.redirect(link.url, { status: 302 })
}
