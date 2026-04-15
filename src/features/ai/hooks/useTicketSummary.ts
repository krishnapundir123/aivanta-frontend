import { useState, useCallback } from 'react';
import { aiApi } from '../api/aiApi';
import { useDummyData } from '../../../shared/mocks/useDummyData';

interface UseTicketSummaryResult {
  summary: string | null;
  keyPoints: string[];
  actionItems: string[];
  isLoading: boolean;
  generateSummary: () => Promise<void>;
}

export default function useTicketSummary(
  ticketId: string,
  messages?: string[]
): UseTicketSummaryResult {
  const [summary, setSummary] = useState<string | null>(null);
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dummy = useDummyData();

  const [summarize] = aiApi.useSummarizeTicketMutation();

  const generateSummary = useCallback(async () => {
    if (dummy.enabled) {
      setSummary(dummy.summary.summary);
      setKeyPoints(dummy.summary.keyPoints);
      setActionItems(dummy.summary.actionItems);
      return;
    }
    setIsLoading(true);
    try {
      const result = await summarize({
        type: 'ticket',
        ticketId,
        messages,
      }).unwrap();

      if (result.summary) {
        setSummary(result.summary);
        setKeyPoints(result.keyPoints || []);
        setActionItems(result.actionItems || []);
      }
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setIsLoading(false);
    }
  }, [ticketId, messages, summarize, dummy]);

  return {
    summary,
    keyPoints,
    actionItems,
    isLoading,
    generateSummary,
  };
}
