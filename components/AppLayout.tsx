'use client'

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import AppHeader from './AppHeader';
import ProtectedRoute from './ProtectedRoute';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  
  // Pages that should not have the layout
  const noLayoutPages = ['/', '/signin', '/login', '/auth', '/signup'];
  const shouldShowLayout = !noLayoutPages.includes(pathname);

  if (!shouldShowLayout) {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <div className="h-screen bg-gray-50 flex">
        <div className='h-screen'>

        <Sidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 h-screen overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}