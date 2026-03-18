import { NavLink } from 'react-router-dom';
import { Home, Wallet, PieChart, CalendarDays, MessageSquare } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Tổng quan' },
  { path: '/finance', icon: Wallet, label: 'Thu Chi' },
  { path: '/stats', icon: PieChart, label: 'Thống kê' },
  { path: '/tasks', icon: CalendarDays, label: 'Nhiệm vụ' },
  { path: '/chat', icon: MessageSquare, label: 'Trợ lý AI' },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 safe-area-bottom z-50">
      <div className="flex justify-around items-stretch h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                  isActive 
                    ? 'text-green-600' 
                    : 'text-slate-400 active:text-slate-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-green-50' : ''}`}>
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                  </div>
                  <span className={`text-[10px] mt-0.5 leading-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
