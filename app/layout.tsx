import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'TinyLink',
  description: 'A simple URL shortener',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="container py-4 flex items-center justify-between">
            <a href="/" className="inline-flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white text-sm font-semibold">TL</span>
              <span className="text-lg font-semibold">TinyLink</span>
            </a>
            <nav className="text-sm space-x-4">
              <a href="/" className="hover:underline">Dashboard</a>
              <a href="/healthz" className="hover:underline">Health</a>
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
      </body>
    </html>
  )
}
