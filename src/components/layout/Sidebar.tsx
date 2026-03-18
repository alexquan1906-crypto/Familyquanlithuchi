import { NavLink } from 'react-router-dom';
import { Home, Wallet, PieChart, CalendarDays, MessageSquare } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Tổng quan' },
  { path: '/finance', icon: Wallet, label: 'Thu Chi' },
  { path: '/stats', icon: PieChart, label: 'Thống kê' },
  { path: '/tasks', icon: CalendarDays, label: 'Lịch & Nhiệm vụ' },
  { path: '/ai-chat', icon: MessageSquare, label: 'Trợ lý AI' },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full">
      <div className="p-6">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-3">
          <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full shadow-sm" />
          Family Finance
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors min-h-[48px] ${
                  isActive
                    ? 'bg-green-50 text-green-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <Icon size={24} />
              <span className="text-lg">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
