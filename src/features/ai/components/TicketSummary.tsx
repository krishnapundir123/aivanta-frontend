import { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import Button from '../../../shared/components/ui/Button';

interface TicketSummaryProps {
  summary?: string;
  keyPoints?: string[];
  actionItems?: string[];
  isLoading?: boolean;
  onGenerate?: () => void;
}

export default function TicketSummary({
  summary,
  keyPoints = [],
  actionItems = [],
  isLoading,
  onGenerate,
}: TicketSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-purple-600">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-medium">Generating AI summary...</span>
        </div>
      </div>
    );
  }

  if (!summary && !onGenerate) {
    return null;
  }

  if (!summary && onGenerate) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-600">
            <FileText className="w-5 h-5" />
            <span className="text-sm font-medium">AI Summary</span>
          </div>
          <Button variant="secondary" size="sm" onClick={onGenerate} leftIcon={<Sparkles className="w-4 h-4" />}>
            Generate Summary
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-purple-100/50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-purple-900">AI Summary</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-purple-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-purple-600" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>

          {keyPoints.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-2">
                Key Points
              </h4>
              <ul className="space-y-1">
                {keyPoints.map((point, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {actionItems.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-2">
                Action Items
              </h4>
              <ul className="space-y-1">
                {actionItems.map((item, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-purple-400 mr-2">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {onGenerate && (
            <div className="pt-2">
              <Button variant="ghost" size="sm" onClick={onGenerate} leftIcon={<Sparkles className="w-4 h-4" />}>
                Regenerate Summary
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
