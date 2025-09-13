'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useSession, signOut } from 'next-auth/react'

export default function Dashboard() {
  const { data: session } = useSession()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome to Xeno CRM
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {session?.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                >
                  Sign Out
                </button>
              </div>
            </div>
            <p className="text-gray-600">
              This is your protected dashboard. You can now build your CRM features here!
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}