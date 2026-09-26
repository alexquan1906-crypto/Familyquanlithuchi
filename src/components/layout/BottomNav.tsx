import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, PieChart, Calendar, CalendarDays } from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Tổng quan' },
  { path: '/finance', icon: Wallet, label: 'Thu Chi' },
  { path: '/stats', icon: PieChart, label: 'Thống kê' },
  { path: '/calendar', icon: Calendar, label: 'Lịch' },
  { path: '/tasks', icon: CalendarDays, label: 'Âm Dương' },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-nav safe-area-bottom z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 relative ${
                  isActive 
                    ? 'text-emerald-600 scale-105' 
                    : 'text-slate-400 hover:text-slate-600 active:scale-95'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-2xl transition-all duration-200 ${
                    isActive ? 'bg-emerald-50 text-emerald-600' : ''
                  }`}>
                    <Icon size={21} strokeWidth={isActive ? 2.5 : 1.8} />
                  </div>
                  <span className={`text-[10px] mt-0.5 tracking-tight ${
                    isActive ? 'font-extrabold text-emerald-700' : 'font-medium'
                  }`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="w-1 h-1 bg-emerald-600 rounded-full mt-0.5 animate-pulse"></span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
