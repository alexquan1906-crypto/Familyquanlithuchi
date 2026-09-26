import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import FinancePage from './pages/FinancePage';
import StatsPage from './pages/StatsPage';
import CalendarPage from './pages/CalendarPage';
import TasksPage from './pages/TasksPage';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthRecovery from './components/auth/AuthRecovery';

function HomeRoute() {
  const { session, loading, authError } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
        <div className="w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-semibold text-slate-300">Đang tải ứng dụng...</p>
      </div>
    );
  }

  if (authError) return <AuthRecovery message={authError} />;

  // Nếu đã đăng nhập: vào thẳng Dashboard
  if (session) {
    return (
      <Layout>
        <Dashboard />
      </Layout>
    );
  }

  // Nếu chưa đăng nhập: hiển thị Landing Page
  return <LandingPage />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" richColors closeButton duration={4000} />
        <Routes>
          {/* Trang Landing Page giới thiệu */}
          <Route path="/landing" element={<LandingPage />} />
          
          {/* Trang Đăng Nhập / Đăng Ký */}
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Route chính: Dashboard khi đã đăng nhập, LandingPage khi chưa đăng nhập */}
          <Route path="/" element={<HomeRoute />} />

          {/* Các route yêu cầu đăng nhập */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/finance" element={<FinancePage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
