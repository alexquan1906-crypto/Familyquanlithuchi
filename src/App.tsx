import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import FinancePage from './pages/FinancePage';
import StatsPage from './pages/StatsPage';
import CalendarPage from './pages/CalendarPage';
import TasksPage from './pages/TasksPage';
import AIChatPage from './pages/AIChatPage';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/chat" element={<AIChatPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
