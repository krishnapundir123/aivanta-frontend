import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bot } from 'lucide-react';
import { useGetTicketQuery } from '../api/ticketsApi';
import TicketSidebar from '../components/TicketSidebar';
import Button from '../../../shared/components/ui/Button';
import {
  CopilotSidebar,
  MessageThread,
  SuggestedResponse,
  AITriageBadge,
  SLAIndicator,
} from '../../ai';
import { useDummyData } from '../../../shared/mocks/useDummyData';

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [copilotOpen, setCopilotOpen] = useState(false);
  const dummy = useDummyData();

  const { data: apiTicket, isLoading: apiLoading } = useGetTicketQuery(id || '');
  const ticket = dummy.enabled ? dummy.getTicket(id || '') : apiTicket;
  const ticketLoading = dummy.enabled ? false : apiLoading;
  const messages = dummy.enabled ? dummy.getMessages(id || '') : [];

  if (ticketLoading || !ticket) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse max-w-7xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/tickets"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  #{ticket.id.slice(0, 8)} {ticket.title}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <AITriageBadge category={ticket.aiCategory} confidence={ticket.aiConfidence} />
                  <SLAIndicator
                    status={ticket.slaStatus as 'ON_TRACK' | 'AT_RISK' | 'BREACHED'}
                    deadline={ticket.slaDeadline}
                    timeRemaining={ticket.slaTimeRemaining}
                  />
                </div>
              </div>
            </div>
            <Button
              variant="secondary"
              leftIcon={<Bot className="w-5 h-5" />}
              onClick={() => setCopilotOpen(true)}
            >
              Copilot
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Messages */}
          <div className="lg:col-span-2 space-y-6">
            <MessageThread ticketId={id || ''} messages={messages} />
            <SuggestedResponse ticketId={id || ''} />
          </div>

          {/* Right Column - AI Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TicketSidebar
                ticketId={id || ''}
                onOpenCopilot={() => setCopilotOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Copilot Sidebar */}
      <CopilotSidebar
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        context={{
          ticketId: id,
          currentView: 'ticket_detail',
          userId: ticket.assignedTo || '',
        }}
      />
    </div>
  );
}
