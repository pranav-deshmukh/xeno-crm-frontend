'use client'

import { useSession, signOut } from 'next-auth/react';
import { Search, Bell, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AppHeader({ title, subtitle }: { title?: string, subtitle?: string }) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title || 'Dashboard'}</h1>
          <p className="text-gray-600">{subtitle || "Welcome back, here's what's happening with your campaigns"}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Welcome, {session?.user?.name || 'User'}
            </span>
            <button
              onClick={() => signOut()}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Sign Out
            </button>
          </div>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns, customers..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button 
            onClick={() => router.push('/create-campaign')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>
      </div>
    </header>
  );
}
