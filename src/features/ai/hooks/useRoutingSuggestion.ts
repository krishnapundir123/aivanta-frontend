import { useState, useCallback } from 'react';
import { aiApi } from '../api/aiApi';
import { useDummyData } from '../../../shared/mocks/useDummyData';

interface RoutingOption {
  agentId: string;
  agentName: string;
  confidence: number;
  reason: string;
  expertise: number;
  workload: number;
  slaUrgency: number;
}

interface UseRoutingSuggestionResult {
  recommended: RoutingOption | null;
  alternatives: RoutingOption[];
  isLoading: boolean;
  fetchSuggestion: () => Promise<void>;
}

export default function useRoutingSuggestion(
  ticketId: string,
  ticketContent: { title: string; description: string; priority: string; category: string }
): UseRoutingSuggestionResult {
  const [recommended, setRecommended] = useState<RoutingOption | null>(null);
  const [alternatives, setAlternatives] = useState<RoutingOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dummy = useDummyData();

  const [getSuggestions] = aiApi.useLazyGetRoutingSuggestionsQuery();

  const fetchSuggestion = useCallback(async () => {
    if (dummy.enabled) {
      const d = dummy.routingSuggestion;
      setRecommended({
        agentId: d.recommendedAssignee.agentId,
        agentName: d.recommendedAssignee.agentName,
        confidence: d.recommendedAssignee.confidence,
        reason: `Expertise match: ${Math.round(d.reasoning.expertiseMatch * 100)}%`,
        expertise: d.reasoning.expertiseMatch,
        workload: d.reasoning.workloadFactor,
        slaUrgency: d.reasoning.slaUrgency,
      });
      setAlternatives(
        d.alternatives.map((a) => ({
          agentId: a.agentId,
          agentName: a.agentName,
          confidence: a.confidence,
          reason: a.reason,
          expertise: 0,
          workload: 0,
          slaUrgency: 0,
        }))
      );
      return;
    }
    setIsLoading(true);
    try {
      const result = await getSuggestions({
        ticketId,
        ...ticketContent,
      }).unwrap();

      if (result.recommendedAssignee) {
        setRecommended({
          agentId: result.recommendedAssignee.agentId,
          agentName: result.recommendedAssignee.agentName || 'Unknown Agent',
          confidence: result.recommendedAssignee.confidence,
          reason: result.reasoning?.expertiseMatch
            ? `Expertise match: ${Math.round(result.reasoning.expertiseMatch * 100)}%`
            : 'Best match based on analysis',
          expertise: result.reasoning?.expertiseMatch || 0,
          workload: result.reasoning?.workloadFactor || 0,
          slaUrgency: result.reasoning?.slaUrgency || 0,
        });

        setAlternatives(
          result.alternatives?.map((alt: { agentId: string; agentName?: string; confidence: number; reason: string }) => ({
            agentId: alt.agentId,
            agentName: alt.agentName || 'Unknown Agent',
            confidence: alt.confidence,
            reason: alt.reason,
            expertise: 0,
            workload: 0,
            slaUrgency: 0,
          })) || []
        );
      }
    } catch (error) {
      console.error('Failed to fetch routing suggestion:', error);
    } finally {
      setIsLoading(false);
    }
  }, [ticketId, ticketContent, getSuggestions, dummy]);

  return {
    recommended,
    alternatives,
    isLoading,
    fetchSuggestion,
  };
}
