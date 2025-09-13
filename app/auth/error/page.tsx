'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {error === 'Configuration' && 'There is a problem with the server configuration.'}
            {error === 'AccessDenied' && 'Access denied. Please try again.'}
            {error === 'Verification' && 'The token has expired or has already been used.'}
            {!error && 'An unknown error occurred.'}
          </p>
          <div className="mt-4">
            <Link 
              href="/auth/signin"
              className="text-blue-600 hover:text-blue-500"
            >
              Try signing in again
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthError() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  )
}