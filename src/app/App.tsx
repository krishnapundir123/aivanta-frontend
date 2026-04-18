import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../shared/hooks/useRedux';
import { initializeAuth, setCredentials, logout } from '../features/auth/slices/authSlice';
import { initializeSocket, disconnectSocket } from '../services/socket.service';
import { DUMMY_MODE, useDummyData } from '../shared/mocks/useDummyData';
import toast from 'react-hot-toast';

// Layouts
import DashboardLayout from '../shared/components/layouts/DashboardLayout';
import AuthLayout from '../shared/components/layouts/AuthLayout';

// Pages
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import TicketListPage from '../features/tickets/pages/TicketListPage';
import TicketDetailPage from '../features/tickets/pages/TicketDetailPage';
import TicketCreatePage from '../features/tickets/pages/TicketCreatePage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import MessagesPage from '../features/messages/pages/MessagesPage';
import DocumentsPage from '../features/documents/pages/DocumentsPage';
import CopilotPage from '../features/copilot/pages/CopilotPage';
import ReportsPage from '../features/reports/pages/ReportsPage';
import TeamPage from '../features/team/pages/TeamPage';
import SettingsPage from '../features/settings/pages/SettingsPage';
import NotFoundPage from '../shared/components/pages/NotFoundPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-primary-200 rounded-xl mb-4" />
          <div className="text-gray-500 text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-primary-200 rounded-xl mb-4" />
          <div className="text-gray-500 text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token, error } = useAppSelector((state) => state.auth);
  const dummy = useDummyData();

  // Warn if API URL is misconfigured in production
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const isProd = !import.meta.env.DEV;

    if (isProd && (!apiUrl || apiUrl.includes('localhost'))) {
      // eslint-disable-next-line no-console
      console.error(
        '[AiVanta] CRITICAL: VITE_API_URL is not set or points to localhost in production. ' +
        'Current value:', apiUrl,
        'Please set VITE_API_URL in your Railway dashboard (e.g. https://your-api.up.railway.app/api/v1) ' +
        'and trigger a redeploy.'
      );
    }
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    if (DUMMY_MODE) {
      dispatch(setCredentials({ user: dummy.user, token: dummy.token }));
    } else {
      dispatch(initializeAuth());
    }
  }, [dispatch, dummy.user, dummy.token]);

  // Connect/disconnect socket based on auth state
  useEffect(() => {
    if (token) {
      initializeSocket(token);
    } else {
      disconnectSocket();
    }
  }, [token]);

  // Handle auth errors (session expired, etc.)
  useEffect(() => {
    if (error === 'Your session has expired. Please sign in again.') {
      toast.error(error);
      dispatch(logout());
      navigate('/login');
    }
  }, [error, dispatch, navigate]);

  return (
    <Routes>
      {/* Public routes — redirect to dashboard if already logged in */}
      <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected routes — redirect to login if not authenticated */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tickets" element={<TicketListPage />} />
        <Route path="/tickets/new" element={<TicketCreatePage />} />
        <Route path="/tickets/:id" element={<TicketDetailPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/copilot" element={<CopilotPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
