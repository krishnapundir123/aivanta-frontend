import { useState, useCallback } from 'react';
import { Sparkles, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../../../shared/components/ui/Button';

interface Suggestion {
  text: string;
  confidence: number;
  sources: Array<{
    id: string;
    type: string;
    title: string;
    relevance: number;
  }>;
}

interface SuggestedResponseProps {
  ticketId: string;
  onUseSuggestion?: (text: string) => void;
}

export default function SuggestedResponse({
  ticketId,
  onUseSuggestion,
}: SuggestedResponseProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const generateSuggestions = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call the AI API
      // const result = await generateSuggestion(ticketId);
      // setSuggestions(result.suggestions);
      
      // Mock for now
      setTimeout(() => {
        setSuggestions([
          {
            text: "Thank you for reporting this issue. I've reviewed your request and will investigate the data inconsistency in the supply chain dashboard. Could you please provide the specific date range when you first noticed this discrepancy?",
            confidence: 0.92,
            sources: [
              { id: '1', type: 'kb', title: 'Data Inconsistency Troubleshooting', relevance: 0.95 },
              { id: '2', type: 'ticket', title: 'Similar: Dashboard sync issue #1234', relevance: 0.88 },
            ],
          },
        ]);
        setIsLoading(false);
      }, 1500);
    } catch {
      setIsLoading(false);
    }
  }, [ticketId]);

  const handleUse = () => {
    if (suggestions[currentIndex] && onUseSuggestion) {
      onUseSuggestion(suggestions[currentIndex].text);
    }
  };

  const handleDismiss = () => {
    setSuggestions([]);
    setCurrentIndex(0);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % suggestions.length);
  };

  if (!suggestions.length && !isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">AI Response Suggestions</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={generateSuggestions}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Generate
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-purple-600">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-medium">Generating response suggestions...</span>
        </div>
      </div>
    );
  }

  const current = suggestions[currentIndex];

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-purple-100/50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-purple-900">Suggested Response</span>
          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
            {Math.round(current.confidence * 100)}% match
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-purple-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-purple-600" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-700 leading-relaxed">{current.text}</p>

            {/* Sources */}
            {current.sources.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowSources(!showSources)}
                  className="text-xs text-purple-600 hover:text-purple-700 flex items-center"
                >
                  {showSources ? 'Hide' : 'Show'} {current.sources.length} source
                  {current.sources.length > 1 ? 's' : ''}
                </button>
                {showSources && (
                  <ul className="mt-2 space-y-1">
                    {current.sources.map((source) => (
                      <li
                        key={source.id}
                        className="text-xs text-gray-500 flex items-center justify-between"
                      >
                        <span>
                          {source.type === 'kb' ? 'KB:' : 'Ticket:'} {source.title}
                        </span>
                        <span className="text-purple-500">
                          {Math.round(source.relevance * 100)}% relevance
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {suggestions.length > 1 && (
                <Button variant="ghost" size="sm" onClick={handleNext}>
                  Next suggestion ({currentIndex + 1}/{suggestions.length})
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handleDismiss} leftIcon={<X className="w-4 h-4" />}>
                Dismiss
              </Button>
              <Button onClick={handleUse} leftIcon={<Check className="w-4 h-4" />}>
                Use Response
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
