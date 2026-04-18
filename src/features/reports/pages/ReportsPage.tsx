import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  TrendingUp,
  TrendingDown,
  Users,
} from 'lucide-react';
import { useDummyData } from '../../../shared/mocks/useDummyData';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ReportsPage() {
  const dummy = useDummyData();
  const [dateRange, setDateRange] = useState('7d');

  const reports = dummy.enabled ? dummy.reports : null;

  if (!reports) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
        <TrendingUp className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-gray-500">No report data available</p>
      </div>
    );
  }

  const overview = reports.overview;

  const stats = [
    {
      label: 'Total Tickets',
      value: overview.totalTickets,
      icon: Ticket,
      color: 'bg-blue-100 text-blue-600',
      change: '+12%',
      positive: true,
    },
    {
      label: 'Open Tickets',
      value: overview.openTickets,
      icon: AlertTriangle,
      color: 'bg-yellow-100 text-yellow-600',
      change: '-5%',
      positive: true,
    },
    {
      label: 'Resolved This Week',
      value: overview.resolvedThisWeek,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600',
      change: '+18%',
      positive: true,
    },
    {
      label: 'Avg Resolution',
      value: `${overview.avgResolutionHours}h`,
      icon: Clock,
      color: 'bg-purple-100 text-purple-600',
      change: '-0.8h',
      positive: true,
    },
    {
      label: 'SLA Breach Rate',
      value: `${Math.round(overview.slaBreachRate * 100)}%`,
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-600',
      change: '-2%',
      positive: true,
    },
    {
      label: 'CSAT Score',
      value: overview.customerSatisfaction,
      icon: Star,
      color: 'bg-amber-100 text-amber-600',
      change: '+0.3',
      positive: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500">Performance metrics and ticket insights</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-lg shadow border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div
                className={`flex items-center text-sm font-medium ${
                  stat.positive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.positive ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets by Status */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Tickets by Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reports.ticketsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, count }) => `${status}: ${count}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="status"
              >
                {reports.ticketsByStatus.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tickets by Priority */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Tickets by Priority
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reports.ticketsByPriority}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Trend */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Ticket Volume Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reports.volumeByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="created"
                stroke="#3b82f6"
                name="Created"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="resolved"
                stroke="#10b981"
                name="Resolved"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Agent Performance */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Agent Performance
          </h3>
          <div className="space-y-4">
            {reports.agentPerformance.map((agent) => (
              <div key={agent.agentId} className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {agent.agentName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {agent.resolved} resolved
                    </p>
                  </div>
                  <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                    <span>Avg: {agent.avgHours}h</span>
                    <span>CSAT: {agent.satisfaction}/5</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min((agent.resolved / 25) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tickets by Category */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Tickets by Category
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reports.ticketsByCategory} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="category" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
