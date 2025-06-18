"use client"

export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Test Page</h1>
        <p className="text-gray-700 mb-6">If you can see this, Next.js is working correctly!</p>
        <div className="p-4 bg-green-100 text-green-800 rounded">
          <p>Tailwind CSS is working!</p>
        </div>
      </div>
    </div>
  )
}
