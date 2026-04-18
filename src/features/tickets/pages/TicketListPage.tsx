import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Search, Clock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useRedux';
import { fetchTickets, setFilters } from '../slices/ticketsSlice';
import Button from '../../../shared/components/ui/Button';
import Badge from '../../../shared/components/ui/Badge';
import { formatDistanceToNow } from 'date-fns';

const statusColors = {
  OPEN: 'error',
  ACKNOWLEDGED: 'warning',
  IN_PROGRESS: 'info',
  RESOLVED: 'success',
  CLOSED: 'default',
} as const;

const priorityColors = {
  LOW: 'default',
  MEDIUM: 'info',
  HIGH: 'warning',
  CRITICAL: 'error',
} as const;

export default function TicketListPage() {
  const dispatch = useAppDispatch();
  const { tickets, isLoading, pagination, filters } = useAppSelector((state) => state.tickets);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchTickets({
      page: pagination.page,
      limit: pagination.limit,
      ...filters,
    }));
  }, [dispatch, pagination.page, filters]);

  const handleSearch = () => {
    dispatch(setFilters({ search: searchQuery }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-500">Manage and track support tickets</p>
        </div>
        <Link to="/tickets/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            New Ticket
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <select
          value={filters.status || ''}
          onChange={(e) => dispatch(setFilters({ status: e.target.value || undefined }))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="ACKNOWLEDGED">Acknowledged</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
        <select
          value={filters.priority || ''}
          onChange={(e) => dispatch(setFilters({ priority: e.target.value || undefined }))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
        <Button variant="secondary" leftIcon={<Filter className="w-4 h-4" />}>
          Filters
        </Button>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Loading tickets...
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No tickets found
                  </td>
                </tr>
              ) : (
                tickets.map((ticket: { id: string; title: string; description?: string; aiSummary?: string; status: string; priority: string; assignee?: { firstName: string; lastName: string }; createdAt: string }) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link to={`/tickets/${ticket.id}`} className="block">
                        <p className="font-medium text-primary-600 hover:text-primary-800">
                          {ticket.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-md">
                          {ticket.aiSummary || ticket.description?.slice(0, 100) || ''}...
                        </p>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusColors[ticket.status as keyof typeof statusColors]}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={priorityColors[ticket.priority as keyof typeof priorityColors]}>
                        {ticket.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {ticket.assignee ? (
                        <span className="text-sm text-gray-900">
                          {ticket.assignee.firstName} {ticket.assignee.lastName}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} tickets
            </p>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                disabled={pagination.page === 1}
                onClick={() => dispatch(fetchTickets({ page: pagination.page - 1, limit: pagination.limit }))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => dispatch(fetchTickets({ page: pagination.page + 1, limit: pagination.limit }))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
