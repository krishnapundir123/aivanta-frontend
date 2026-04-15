import { useState } from 'react';
import { UserCheck, Target, Clock, TrendingUp } from 'lucide-react';
import Button from '../../../shared/components/ui/Button';
import Avatar from '../../../shared/components/ui/Avatar';
import Badge from '../../../shared/components/ui/Badge';

interface RoutingOption {
  agentId: string;
  agentName: string;
  confidence: number;
  reason: string;
  expertise: number;
  workload: number;
  slaUrgency: number;
}

interface RoutingSuggestionProps {
  recommended: RoutingOption;
  alternatives: RoutingOption[];
  onAssign?: (agentId: string) => void;
  isLoading?: boolean;
}

export default function RoutingSuggestion({
  recommended,
  alternatives,
  onAssign,
  isLoading,
}: RoutingSuggestionProps) {
  const [showAlternatives, setShowAlternatives] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="animate-pulse flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-400" />
          <span className="text-sm text-blue-600">Analyzing routing options...</span>
        </div>
      </div>
    );
  }

  const confidenceColor =
    recommended.confidence > 0.8 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">AI Routing Suggestion</span>
          </div>
          <Badge variant={recommended.confidence > 0.8 ? 'success' : 'warning'}>
            {Math.round(recommended.confidence * 100)}% confidence
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar name={recommended.agentName} size="lg" />
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-medium text-gray-900">{recommended.agentName}</h4>
            <p className="text-sm text-gray-500 mt-1">{recommended.reason}</p>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="flex items-center justify-center text-indigo-600">
                  <Target className="w-4 h-4 mr-1" />
                  <span className="text-xs font-medium">
                    {Math.round(recommended.expertise * 100)}%
                  </span>
                </div>
                <span className="text-xs text-gray-500">Expertise</span>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="flex items-center justify-center text-blue-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-xs font-medium">
                    {Math.round(recommended.workload * 100)}%
                  </span>
                </div>
                <span className="text-xs text-gray-500">Workload</span>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="flex items-center justify-center text-purple-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-xs font-medium">
                    {Math.round(recommended.slaUrgency * 100)}%
                  </span>
                </div>
                <span className="text-xs text-gray-500">SLA Fit</span>
              </div>
            </div>
          </div>
        </div>

        {onAssign && (
          <div className="mt-4">
            <Button
              fullWidth
              leftIcon={<UserCheck className="w-4 h-4" />}
              onClick={() => onAssign(recommended.agentId)}
            >
              Assign to {recommended.agentName}
            </Button>
          </div>
        )}
      </div>

      {alternatives.length > 0 && (
        <div className="border-t border-gray-100">
          <button
            onClick={() => setShowAlternatives(!showAlternatives)}
            className="w-full px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            {showAlternatives ? 'Hide' : 'Show'} {alternatives.length} alternative
            {alternatives.length > 1 ? 's' : ''}
          </button>

          {showAlternatives && (
            <div className="px-4 pb-4 space-y-2">
              {alternatives.map((alt) => (
                <div
                  key={alt.agentId}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                >
                  <div className="flex items-center space-x-2">
                    <Avatar name={alt.agentName} size="sm" />
                    <div>
                      <span className="text-sm font-medium text-gray-900">{alt.agentName}</span>
                      <p className="text-xs text-gray-500">{alt.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {Math.round(alt.confidence * 100)}%
                    </span>
                    {onAssign && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAssign(alt.agentId)}
                      >
                        Assign
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
