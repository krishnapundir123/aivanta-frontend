import { useState } from 'react';
import { Sparkles, Check, RefreshCw } from 'lucide-react';
import Button from '../../../shared/components/ui/Button';

interface Suggestion {
  id: string;
  text: string;
  confidence: number;
  type: 'full_response' | 'template' | 'follow_up';
  sources?: Array<{ type: string; title: string }>;
}

interface AISuggestionPanelProps {
  suggestions: Suggestion[];
  onApply: (suggestion: Suggestion) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function AISuggestionPanel({
  suggestions,
  onApply,
  onRefresh,
  isLoading,
}: AISuggestionPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-blue-600">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">AI is generating suggestions...</span>
        </div>
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-600">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">AI Suggestions</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onRefresh} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Generate
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-blue-100 border-b border-blue-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-900">AI Suggested Responses</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onRefresh} leftIcon={<RefreshCw className="w-4 h-4" />}>
          Refresh
        </Button>
      </div>

      <div className="divide-y divide-blue-100">
        {suggestions.map((suggestion, index) => (
          <div
            key={suggestion.id || index}
            className={`p-4 cursor-pointer transition-colors ${
              selectedId === suggestion.id ? 'bg-blue-100' : 'hover:bg-blue-50'
            }`}
            onClick={() => setSelectedId(suggestion.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{suggestion.text}</p>
                
                {suggestion.sources && suggestion.sources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {suggestion.sources.map((source, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700"
                      >
                        {source.type}: {source.title}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-2 flex items-center space-x-3">
                  <span
                    className={`text-xs font-medium ${
                      suggestion.confidence > 0.8
                        ? 'text-green-600'
                        : suggestion.confidence > 0.6
                        ? 'text-yellow-600'
                        : 'text-gray-500'
                    }`}
                  >
                    Confidence: {Math.round(suggestion.confidence * 100)}%
                  </span>
                  <span className="text-xs text-gray-400">
                    {suggestion.type === 'full_response' ? 'Full Response' : 
                     suggestion.type === 'template' ? 'Template' : 'Follow-up'}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApply(suggestion);
                  }}
                  leftIcon={<Check className="w-4 h-4" />}
                >
                  Use
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
