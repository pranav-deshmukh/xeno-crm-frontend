'use client'

import { useSession, signOut } from 'next-auth/react';
export default function AppHeader({ title, subtitle }: { title?: string, subtitle?: string }) {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title || 'Dashboard'}</h1>
          <p className="text-gray-600">{subtitle || "Welcome back, here's what's happening with your campaigns"}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-bold">
              Welcome, {(session?.user?.name)?.toUpperCase() || 'User'}
            </span>
            <button
              onClick={() => signOut()}
              className="text-sm text-white bg-red-500 hover:bg-red-700 font-medium p-3 rounded-lg"
            >
              Sign Out
            </button>
          </div>
          
          
        </div>
      </div>
    </header>
  );
}
