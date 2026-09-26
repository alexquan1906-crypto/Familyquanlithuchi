import { LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import { getLunarDateMock as getLunarDate } from '../../lib/lunar';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Tổng Quan', subtitle: 'Báo cáo thu chi gia đình' },
  '/finance': { title: 'Sổ Thu Chi', subtitle: 'Quản lý thu nhập & chi tiêu' },
  '/stats': { title: 'Thống Kê', subtitle: 'Biểu đồ phân tích tài chính' },
  '/calendar': { title: 'Lịch Thu Chi', subtitle: 'Theo dõi dòng tiền theo ngày' },
  '/tasks': { title: 'Lịch Âm Dương', subtitle: 'Xem ngày tốt, giỗ chạp & ngày lễ' },
};

export default function Header() {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const currentDate = new Date();
  
  const lunarInfo = getLunarDate(currentDate);

  const solarText = `${currentDate.getDate()} thg ${currentDate.getMonth() + 1}, ${currentDate.getFullYear()}`;
  const lunarText = `${lunarInfo.day}/${lunarInfo.month} ÂL · Năm ${lunarInfo.canChi}`;

  const currentInfo = pageTitles[location.pathname] || { title: 'Tổng Quan', subtitle: 'Family Finance' };

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || '';

  return (
    <header className="glass-header px-4 py-3 md:px-6 md:py-3.5 flex items-center justify-between sticky top-0 z-30 transition-all">
      <div className="min-w-0 pr-2">
        <h1 className="text-lg md:text-xl font-extrabold text-slate-800 tracking-tight leading-snug">
          {currentInfo.title}
        </h1>
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mt-0.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
            <Sun size={12} className="text-amber-500" /> {solarText}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/70">
            <Moon size={11} className="text-amber-600" /> {lunarText}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {user && (
          <div
            className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 bg-slate-100 rounded-xl border border-slate-200 max-w-[140px]"
            title={user.email || ''}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-6 h-6 rounded-lg object-cover border border-white shrink-0"
              />
            ) : (
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xs font-semibold text-slate-700 truncate hidden md:inline">
              {displayName}
            </span>
          </div>
        )}

        <button
          onClick={() => {
            if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
              signOut();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-semibold text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-xl border border-slate-200 hover:border-rose-200 transition-all duration-200 group"
          title="Đăng Xuất"
        >
          <LogOut size={16} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
          <span className="hidden sm:inline">Đăng xuất</span>
        </button>
      </div>
    </header>
  );
}
