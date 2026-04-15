import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../shared/hooks/useRedux';
import { initializeAuth, setCredentials } from '../features/auth/slices/authSlice';
import { initializeSocket } from '../services/socket.service';
import { DUMMY_MODE, useDummyData } from '../shared/mocks/useDummyData';

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

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }
  
  return <>{children}</>;
};

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const dummy = useDummyData();

  useEffect(() => {
    if (DUMMY_MODE) {
      dispatch(setCredentials({ user: dummy.user, token: dummy.token }));
    } else {
      dispatch(initializeAuth());
    }
  }, [dispatch, dummy.user, dummy.token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      initializeSocket(token);
    }
  }, [isAuthenticated, token]);

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected routes */}
      <Route
        element={
          // <ProtectedRoute>
            <DashboardLayout />
          // </ProtectedRoute>
        }
      >
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
