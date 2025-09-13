'use client'

import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back, {session.user?.name}!
          </h1>
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Xeno CRM Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Manage your customers with intelligent segmentation
        </p>
        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="bg-red-600 text-white px-6 py-3 rounded-md text-lg hover:bg-red-700"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
}