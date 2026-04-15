import { useState, useCallback } from 'react';
import { aiApi } from '../api/aiApi';
import { useDummyData } from '../../../shared/mocks/useDummyData';

interface SimilarTicket {
  id: string;
  title: string;
  status: string;
  priority: string;
  similarity: number;
  resolution?: string;
}

interface UseSimilarTicketsResult {
  tickets: SimilarTicket[];
  isLoading: boolean;
  fetchSimilarTickets: () => Promise<void>;
}

export default function useSimilarTickets(
  ticketId: string,
  query?: string
): UseSimilarTicketsResult {
  const [tickets, setTickets] = useState<SimilarTicket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dummy = useDummyData();

  const [search] = aiApi.useSemanticSearchMutation();

  const fetchSimilarTickets = useCallback(async () => {
    if (dummy.enabled) {
      setTickets(dummy.similarTickets);
      return;
    }
    setIsLoading(true);
    try {
      const result = await search({
        query: query || ticketId,
        type: 'ticket',
        limit: 5,
      }).unwrap();

      setTickets(result.results || []);
    } catch (error) {
      console.error('Failed to fetch similar tickets:', error);
    } finally {
      setIsLoading(false);
    }
  }, [ticketId, query, search, dummy]);

  return {
    tickets,
    isLoading,
    fetchSimilarTickets,
  };
}
