import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import Header from './Header';

export default function Layout() {
  return (
    <div className="flex h-[100dvh] w-full overflow-hidden text-slate-900 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto px-3.5 py-4 md:px-8 md:py-6 pb-24 md:pb-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
