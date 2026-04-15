import Badge from '../../../shared/components/ui/Badge';

interface AITriageBadgeProps {
  category?: string;
  confidence?: number;
}

const categoryColors: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  BUG: 'error',
  FEATURE_REQUEST: 'info',
  QUESTION: 'success',
  INCIDENT: 'error',
  DATA_ISSUE: 'warning',
};

export default function AITriageBadge({ category, confidence }: AITriageBadgeProps) {
  if (!category) return null;

  return (
    <Badge variant={categoryColors[category] || 'default'} size="sm">
      AI: {category.replace('_', ' ')}
      {confidence !== undefined && ` (${Math.round(confidence * 100)}%)`}
    </Badge>
  );
}
