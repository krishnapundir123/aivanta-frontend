import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  MessageSquare,
  Phone,
  MessageCircle,
  Clock,
  Search,
  Filter,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { useDummyData } from '../../../shared/mocks/useDummyData';
import Badge from '../../../shared/components/ui/Badge';
import Avatar from '../../../shared/components/ui/Avatar';

const channelIcons = {
  EMAIL: Mail,
  CHAT: MessageCircle,
  PHONE: Phone,
} as const;

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  OPEN: 'error',
  IN_PROGRESS: 'info',
  RESOLVED: 'success',
  CLOSED: 'default',
};

export default function MessagesPage() {
  const dummy = useDummyData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const conversations = dummy.enabled
    ? dummy.inboxConversations
    : [];

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      !searchQuery ||
      conv.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || conv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-500">Unified inbox for all customer conversations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
        <button className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Conversations List */}
      <div className="bg-white rounded-lg shadow border border-gray-200 divide-y divide-gray-200">
        {filteredConversations.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No conversations found</p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const ChannelIcon = channelIcons[conv.channel as keyof typeof channelIcons] || Mail;
            return (
              <Link
                key={conv.id}
                to={`/tickets/${conv.ticketId}`}
                className="flex items-start px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <Avatar name={conv.customer.name} size="md" />
                  {conv.unread && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">
                      {conv.customer.name}
                    </h3>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDistanceToNow(new Date(conv.lastMessageAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mt-0.5 truncate">
                    {conv.subject}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5 truncate">
                    {conv.lastMessage}
                  </p>

                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant={statusColors[conv.status] || 'default'} size="sm">
                      {conv.status}
                    </Badge>
                    <span className="inline-flex items-center text-xs text-gray-400">
                      <ChannelIcon className="w-3 h-3 mr-1" />
                      {conv.channel}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
