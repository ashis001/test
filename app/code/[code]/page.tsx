import { prisma } from '@/lib/prisma'
import Link from 'next/link'

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/

export default async function CodeStatsPage({ params }: { params: { code: string } }) {
  const code = params.code
  if (!CODE_REGEX.test(code)) {
    return (
      <div className="max-w-md">
        <h1 className="text-xl font-semibold mb-2">Invalid code</h1>
        <Link href="/" className="btn btn-primary">Back</Link>
      </div>
    )
  }
  const link = await prisma.link.findUnique({ where: { code } })
  if (!link) {
    return (
      <div className="max-w-md">
        <h1 className="text-xl font-semibold mb-2">Not found</h1>
        <p className="text-sm text-gray-600">No link exists for the code: {code}</p>
        <Link href="/" className="btn btn-primary mt-4">Back</Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h1 className="text-xl font-semibold">Stats for {code}</h1>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Target URL</div>
            <a className="underline break-all" href={link.url} target="_blank" rel="noreferrer">{link.url}</a>
          </div>
          <div>
            <div className="text-sm text-gray-600">Total Clicks</div>
            <div>{link.clicks}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Last Clicked</div>
            <div>{link.lastClickedAt ? new Date(link.lastClickedAt).toLocaleString() : '-'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Created</div>
            <div>{new Date(link.createdAt).toLocaleString()}</div>
          </div>
        </div>
      </div>
      <div>
        <Link href="/" className="btn btn-outline">Back to Dashboard</Link>
      </div>
    </div>
  )
}
