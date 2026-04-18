
import { Link } from 'react-router-dom';
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useRedux';
import Badge from '../../../shared/components/ui/Badge';
import { useDummyData } from '../../../shared/mocks/useDummyData';
import { useGetTicketsQuery } from '../../tickets/api/ticketsApi';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const dummy = useDummyData();

  // Real API — kept intact for when the backend is ready
  const { data: apiTickets, isLoading: apiLoading } = useGetTicketsQuery({ status: '', priority: '', category: '' });

  const tickets = dummy.enabled ? dummy.tickets : (apiTickets?.data ?? []);
  const isLoading = dummy.enabled ? false : apiLoading;

  // dispatch is available for future use (e.g. filters, actions)
  void dispatch;

  // Calculate stats
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'OPEN').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter(t => t.status === 'RESOLVED').length,
  };

  const quickActions = [
    { name: 'New Ticket', icon: Ticket, href: '/tickets/new', color: 'bg-blue-500' },
    { name: 'View Tickets', icon: MessageSquare, href: '/tickets', color: 'bg-green-500' },
    { name: 'AI Copilot', icon: TrendingUp, href: '/copilot', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="mt-1 text-gray-500">
          Here's what's happening with your support tickets today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            to={action.href}
            className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className={`${action.color} p-3 rounded-lg`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <span className="ml-4 font-medium text-gray-900">{action.name}</span>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Ticket className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Open</p>
              <p className="text-2xl font-bold text-gray-900">{stats.open}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Tickets</h2>
          <Link to="/tickets" className="text-sm text-primary-600 hover:text-primary-800">
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <div className="px-6 py-8 text-center text-gray-500">Loading...</div>
          ) : tickets.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">No tickets yet</div>
          ) : (
            tickets.slice(0, 5).map((ticket) => (
              <Link
                key={ticket.id}
                to={`/tickets/${ticket.id}`}
                className="block px-6 py-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {ticket.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {((ticket as unknown) as { aiSummary?: string; description?: string }).aiSummary || ((ticket as unknown) as { description?: string }).description?.slice(0, 60) || ''}...
                    </p>
                  </div>
                  <div className="ml-4 flex items-center space-x-2">
                    <Badge variant={ticket.priority === 'CRITICAL' ? 'error' : ticket.priority === 'HIGH' ? 'warning' : 'default'}>
                      {ticket.priority}
                    </Badge>
                    <Badge variant={ticket.status === 'OPEN' ? 'error' : ticket.status === 'RESOLVED' ? 'success' : 'info'}>
                      {ticket.status}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
