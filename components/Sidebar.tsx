'use client'

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Home, Send, Target, User, ChevronDown 
} from 'lucide-react';
import Image from 'next/image';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    // { id: 'customers', label: 'Customers', icon: Users, path: '/customers' },
    { id: 'segments', label: 'Segments', icon: Target, path: '/segment-builder' },
    { id: 'campaigns', label: 'Campaigns', icon: Send, path: '/campaign-history' },
    { id: 'create-campaign', label: 'Create Campaign', icon: Send, path: '/create-campaign' },
    // { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
    // { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
  ];

  // Set active tab based on current pathname
  useEffect(() => {
    const currentItem = sidebarItems.find(item => pathname === item.path);
    if (currentItem) {
      setActiveTab(currentItem.id);
    }
  }, [pathname]);

  const handleNavigation = (item: typeof sidebarItems[0]) => {
    setActiveTab(item.id);
    router.push(item.path);
  };

  return (
    <div className="w-64 h-screen bg-white shadow-sm border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="rounded-lg flex items-center justify-center">
            <Image src={'/logo.svg'} alt="Logo" width={70} height={70} />
          </div>
          <div>
            {/* <h1 className="text-xl font-bold text-gray-900"></h1> */}
            <p className="text-xs text-gray-500 font-bold">Next-Gen CRM</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {session?.user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {session?.user?.email || 'user@example.com'}
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
            title="Sign Out"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}