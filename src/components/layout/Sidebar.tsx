import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, PieChart, Calendar, CalendarDays, HeartHandshake } from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Tổng quan' },
  { path: '/finance', icon: Wallet, label: 'Sổ Thu Chi' },
  { path: '/stats', icon: PieChart, label: 'Thống kê' },
  { path: '/calendar', icon: Calendar, label: 'Lịch Thu Chi' },
  { path: '/tasks', icon: CalendarDays, label: 'Lịch Âm Dương' },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white/95 backdrop-blur-md border-r border-slate-200/80 h-full shrink-0 select-none shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
      {/* Brand Header */}
      <div className="p-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src="/logo.jpg" 
              alt="Logo" 
              className="w-10 h-10 rounded-2xl object-cover shadow-md shadow-emerald-600/20 border border-slate-100" 
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-extrabold text-slate-800 tracking-tight leading-tight">
              Family Finance
            </h1>
            <p className="text-[11px] font-semibold text-emerald-600">
              Gia đình hạnh phúc
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Menu Chính
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-200 group font-medium ${
                  isActive
                    ? 'bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/25 scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-xl transition-colors ${
                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'
                  }`}>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className="text-[15px]">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info Widget */}
      <div className="p-3 m-3 bg-gradient-to-br from-emerald-50 to-teal-50/60 rounded-2xl border border-emerald-100/80 text-emerald-950">
        <div className="flex items-center gap-2 mb-1">
          <HeartHandshake size={16} className="text-emerald-600" />
          <span className="text-xs font-bold text-emerald-800">Đồng lòng tài chính</span>
        </div>
        <p className="text-[11px] text-emerald-700/80 leading-relaxed">
          Tích tiểu thành đại · Chi tiêu thông minh cho tổ ấm vững vàng.
        </p>
      </div>
    </aside>
  );
}
