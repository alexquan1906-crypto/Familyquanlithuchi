import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import Header from './Header';
import { Toaster } from 'sonner';

export default function Layout() {
  return (
    <div className="flex h-[100dvh] w-full bg-slate-50 overflow-hidden text-slate-900 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto px-3 py-3 md:px-6 md:py-5 pb-20 md:pb-6 scrollbar-hide">
          <Outlet />
        </main>
      </div>
      <BottomNav />
      <Toaster position="top-center" richColors toastOptions={{ className: 'text-sm' }} />
    </div>
  );
}
