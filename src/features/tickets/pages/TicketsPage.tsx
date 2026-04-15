import { useState } from 'react';
import { useGetTicketsQuery } from '../api/ticketsApi';
import { useDummyData } from '../../../shared/mocks/useDummyData';
import TicketList from '../components/TicketList';
import TicketFilters from '../components/TicketFilters';
import CreateTicketModal from '../components/CreateTicketModal';
import Button from '../../../shared/components/ui/Button';
import { Plus, Filter } from 'lucide-react';

export default function TicketsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    assignedToMe: false,
  });

  const dummy = useDummyData();
  const { data: tickets, isLoading } = useGetTicketsQuery(filters);
  const resolvedTickets = dummy.enabled ? dummy.tickets : tickets;
  const resolvedLoading = dummy.enabled ? false : isLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and respond to customer support requests
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                leftIcon={<Filter className="w-4 h-4" />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
              <Button
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setIsCreateModalOpen(true)}
              >
                New Ticket
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <TicketFilters filters={filters} onChange={setFilters} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TicketList tickets={resolvedTickets || []} isLoading={resolvedLoading} />
      </div>

      {/* Create Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
