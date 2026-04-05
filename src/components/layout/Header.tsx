import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'Tổng Quan',
  '/finance': 'Thu Chi',
  '/stats': 'Thống Kê',
  '/calendar': 'Lịch',
  '/tasks': 'Lịch Âm Dương',
  '/ai-chat': 'Trợ Lý AI',
};

export default function Header() {
  const { signOut } = useAuth();
  const location = useLocation();
  const currentDate = new Date();
  const monthInfo = `Tháng ${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
  const pageTitle = pageTitles[location.pathname] || 'Tổng Quan';

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="min-w-0">
        <h2 className="text-lg font-bold text-slate-800 truncate">
          {pageTitle}
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          {monthInfo}
        </p>
      </div>

      <button
        onClick={signOut}
        className="shrink-0 ml-3 p-2.5 bg-red-50 text-red-500 rounded-xl border border-red-100 hover:bg-red-100 active:bg-red-200 transition-colors"
        title="Đăng Xuất"
      >
        <LogOut size={20} />
      </button>
    </header>
  );
}
