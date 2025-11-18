export default function NotFound() {
  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold mb-2">404 - Not Found</h1>
      <p className="text-sm text-gray-600">The requested short link does not exist.</p>
      <a href="/" className="btn btn-primary mt-4 inline-block">Go back</a>
    </div>
  )
}
