import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Trash2, Ticket, Search, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import { useDummyData } from '../../../shared/mocks/useDummyData';
import { aiApi } from '../../ai/api/aiApi';

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

export default function CopilotPage() {
  const navigate = useNavigate();
  const dummy = useDummyData();
  const [messages, setMessages] = useState<CopilotMessage[]>(
    dummy.enabled
      ? dummy.copilotPageHistory.map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }))
      : []
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [queryCopilot] = aiApi.useCopilotQueryMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: CopilotMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    if (dummy.enabled) {
      const result = dummy.copilotPageResponse(input);
      setTimeout(() => {
        const assistantMessage: CopilotMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.response,
          actions: result.suggestedActions,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 800);
      return;
    }

    try {
      const result = await queryCopilot({
        query: input,
        context: { source: 'copilot_page' },
      }).unwrap();

      const assistantMessage: CopilotMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
        actions: result.suggestedActions,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
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
  };

  const handleClear = () => {
    setMessages([]);
  };

  const handleAction = (action: { type: string; label: string; payload: unknown }) => {
    const payload = action.payload as Record<string, unknown>;
    if (action.type === 'navigate' && payload.ticketId) {
      navigate(`/tickets/${payload.ticketId}`);
    } else if (action.type === 'navigate' && payload.filter) {
      navigate('/tickets');
    } else if (action.type === 'search') {
      navigate('/documents');
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">3SC Copilot</h1>
            <p className="text-sm text-white/80">
              AI-powered assistant for support workflows
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          leftIcon={<Trash2 className="w-4 h-4" />}
          className="text-white hover:bg-white/20"
        >
          Clear
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-purple-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              How can I help you today?
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Ask me about tickets, team performance, knowledge base articles, or
              get help drafting responses.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <button
                onClick={() => setInput('Which tickets are breaching SLA?')}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all text-left"
              >
                <Ticket className="w-5 h-5 text-purple-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">SLA Status</p>
                <p className="text-xs text-gray-500 mt-1">
                  Check tickets at risk
                </p>
              </button>
              <button
                onClick={() => setInput('Search knowledge base for auth issues')}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all text-left"
              >
                <Search className="w-5 h-5 text-blue-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Knowledge Base</p>
                <p className="text-xs text-gray-500 mt-1">Find relevant docs</p>
              </button>
              <button
                onClick={() => setInput('Show team performance this week')}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all text-left"
              >
                <BarChart3 className="w-5 h-5 text-green-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Reports</p>
                <p className="text-xs text-gray-500 mt-1">
                  Team performance stats
                </p>
              </button>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-start space-x-3 max-w-3xl">
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-purple-600" />
                </div>
              )}
              <div
                className={`rounded-2xl px-5 py-3 ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </div>
                {message.actions && message.actions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.actions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAction(action)}
                        className="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-purple-600" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Copilot anything..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
