import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface SLAIndicatorProps {
  status: 'ON_TRACK' | 'AT_RISK' | 'BREACHED';
  deadline?: string;
  timeRemaining?: number;
}

export default function SLAIndicator({ status, timeRemaining }: SLAIndicatorProps) {
  if (!status) return null;
  const getStatusStyles = () => {
    switch (status) {
      case 'ON_TRACK':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: <CheckCircle className="w-4 h-4" />,
        };
      case 'AT_RISK':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: <Clock className="w-4 h-4" />,
        };
      case 'BREACHED':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: <AlertTriangle className="w-4 h-4" />,
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          icon: <Clock className="w-4 h-4" />,
        };
    }
  };

  const styles = getStatusStyles();

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    return `${Math.floor(minutes / 1440)}d`;
  };

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${styles.bg} ${styles.text}`}>
      {styles.icon}
      <span>
        SLA: {status?.replace('_', ' ') ?? 'UNKNOWN'}
        {timeRemaining !== undefined && timeRemaining > 0 && (
          <span className="ml-1">({formatTime(timeRemaining)} left)</span>
        )}
      </span>
    </div>
  );
}
