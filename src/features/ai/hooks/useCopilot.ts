import { useState, useCallback } from 'react';
import { aiApi } from '../api/aiApi';
import { useDummyData } from '../../../shared/mocks/useDummyData';

interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: Array<{
    type: string;
    label: string;
    payload: unknown;
  }>;
  timestamp: Date;
}

interface UseCopilotResult {
  messages: CopilotMessage[];
  isLoading: boolean;
  sendMessage: (message: string, context: object) => Promise<void>;
  clearMessages: () => void;
}

export default function useCopilot(): UseCopilotResult {
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dummy = useDummyData();

  const [queryCopilot] = aiApi.useCopilotQueryMutation();

  const sendMessage = useCallback(
    async (message: string, context: object) => {
      const userMessage: CopilotMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      if (dummy.enabled) {
        const result = dummy.copilotResponse(message);
        const assistantMessage: CopilotMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.response,
          actions: result.suggestedActions,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      try {
        const result = await queryCopilot({
          query: message,
          context,
        }).unwrap();

        const assistantMessage: CopilotMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.response,
          actions: result.suggestedActions,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        const errorMessage: CopilotMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [queryCopilot]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
}
