import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
        <div className="relative mb-4">
          <img
            src="/logo.jpg"
            alt="Family Finance"
            className="w-16 h-16 rounded-2xl shadow-xl border-2 border-emerald-500/40 animate-pulse object-cover"
          />
          <div className="absolute -inset-2 rounded-3xl border border-emerald-500/30 animate-ping pointer-events-none"></div>
        </div>
        <div className="w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-semibold text-slate-300">Đang tải ứng dụng...</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
