import { Link } from 'react-router-dom';
import { Copy, ArrowUpRight } from 'lucide-react';
import Badge from '../../../shared/components/ui/Badge';

interface SimilarTicket {
  id: string;
  title: string;
  status: string;
  priority: string;
  similarity: number;
  resolution?: string;
}

interface SimilarTicketsProps {
  tickets: SimilarTicket[];
  isLoading?: boolean;
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  OPEN: 'error',
  ACKNOWLEDGED: 'warning',
  IN_PROGRESS: 'info',
  RESOLVED: 'success',
  CLOSED: 'default',
};

const priorityColors: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  LOW: 'default',
  MEDIUM: 'info',
  HIGH: 'warning',
  CRITICAL: 'error',
};

export default function SimilarTickets({ tickets, isLoading }: SimilarTicketsProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-gray-500">
          <Copy className="w-4 h-4" />
          <span className="text-sm">No similar tickets found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Copy className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900">Similar Tickets</span>
          </div>
          <span className="text-xs text-gray-500">{tickets.length} found</span>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {tickets.map((ticket) => (
          <Link
            key={ticket.id}
            to={`/tickets/${ticket.id}`}
            target="_blank"
            className="block p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate pr-2">
                  {ticket.title}
                </h4>
                
                <div className="mt-2 flex items-center space-x-2">
                  <Badge variant={statusColors[ticket.status] || 'default'} size="sm">
                    {ticket.status}
                  </Badge>
                  <Badge variant={priorityColors[ticket.priority] || 'default'} size="sm">
                    {ticket.priority}
                  </Badge>
                </div>

                {ticket.resolution && (
                  <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                    Resolution: {ticket.resolution}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end space-y-1">
                <span
                  className={`text-xs font-medium ${
                    ticket.similarity > 0.8
                      ? 'text-green-600'
                      : ticket.similarity > 0.6
                      ? 'text-yellow-600'
                      : 'text-gray-500'
                  }`}
                >
                  {Math.round(ticket.similarity * 100)}% match
                </span>
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
