import { useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { useGetTicketQuery } from '../api/ticketsApi';
import {
  TicketSummary,
  SimilarTickets,
  RoutingSuggestion,
  useTicketSummary,
  useSimilarTickets,
  useRoutingSuggestion,
} from '../../ai';
import Button from '../../../shared/components/ui/Button';
import { Bot, Sparkles } from 'lucide-react';

interface TicketSidebarProps {
  ticketId: string;
  onOpenCopilot: () => void;
}

export default function TicketSidebar({ ticketId, onOpenCopilot }: TicketSidebarProps) {
  const { data: ticket } = useGetTicketQuery(ticketId);
  const user = useAppSelector((state) => state.auth.user);

  const { summary, keyPoints, actionItems, isLoading: summaryLoading, generateSummary } = useTicketSummary(ticketId);
  const { tickets: similarTickets, isLoading: similarLoading, fetchSimilarTickets } = useSimilarTickets(ticketId);
  const { recommended, alternatives, isLoading: routingLoading, fetchSuggestion } = useRoutingSuggestion(
    ticketId,
    {
      title: ticket?.title || '',
      description: ticket?.description || '',
      priority: ticket?.priority || '',
      category: ticket?.category || '',
    }
  );

  const [aiFeaturesRequested, setAiFeaturesRequested] = useState({
    summary: false,
    similar: false,
    routing: false,
  });

  const handleGenerateSummary = async () => {
    setAiFeaturesRequested((prev) => ({ ...prev, summary: true }));
    await generateSummary();
  };

  const handleFetchSimilar = async () => {
    setAiFeaturesRequested((prev) => ({ ...prev, similar: true }));
    await fetchSimilarTickets();
  };

  const handleFetchRouting = async () => {
    setAiFeaturesRequested((prev) => ({ ...prev, routing: true }));
    await fetchSuggestion();
  };

  const canAssign = user?.role === 'ADMIN' || user?.role === 'SUPPORT_MANAGER';

  return (
    <div className="space-y-6">
      {/* AI Actions */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Bot className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-gray-900">AI Assistant</span>
        </div>
        <Button
          fullWidth
          variant="secondary"
          leftIcon={<Sparkles className="w-4 h-4" />}
          onClick={onOpenCopilot}
        >
          Open Copilot
        </Button>
      </div>

      {/* Ticket Summary */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Summary</h3>
          {!aiFeaturesRequested.summary && (
            <button
              onClick={handleGenerateSummary}
              className="text-xs text-purple-600 hover:text-purple-700"
            >
              Generate
            </button>
          )}
        </div>
        <TicketSummary
          summary={summary || undefined}
          keyPoints={keyPoints}
          actionItems={actionItems}
          isLoading={summaryLoading}
          onGenerate={aiFeaturesRequested.summary ? handleGenerateSummary : undefined}
        />
      </div>

      {/* Similar Tickets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Similar Tickets</h3>
          {!aiFeaturesRequested.similar && (
            <button
              onClick={handleFetchSimilar}
              className="text-xs text-purple-600 hover:text-purple-700"
            >
              Find
            </button>
          )}
        </div>
        <SimilarTickets tickets={similarTickets} isLoading={similarLoading} />
      </div>

      {/* Routing Suggestion */}
      {canAssign && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Routing</h3>
            {!aiFeaturesRequested.routing && (
              <button
                onClick={handleFetchRouting}
                className="text-xs text-purple-600 hover:text-purple-700"
              >
                Suggest
              </button>
            )}
          </div>
          {recommended && (
            <RoutingSuggestion
              recommended={recommended}
              alternatives={alternatives}
              isLoading={routingLoading}
            />
          )}
        </div>
      )}
    </div>
  );
}
