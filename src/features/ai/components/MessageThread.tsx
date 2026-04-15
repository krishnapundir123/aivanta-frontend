import { useEffect, useRef } from 'react';
import Avatar from '../../../shared/components/ui/Avatar';
import { format } from 'date-fns';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  isInternal?: boolean;
  attachments?: Array<{
    id: string;
    filename: string;
    url: string;
  }>;
}

interface MessageThreadProps {
  ticketId: string;
  messages: Message[];
}

export default function MessageThread({ messages }: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">Conversation</h3>
      </div>

      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No messages yet</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex space-x-3 ${message.isInternal ? 'opacity-75' : ''}`}
            >
              <Avatar name={message.sender.name} src={message.sender.avatar} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{message.sender.name}</span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(message.createdAt), 'MMM d, h:mm a')}
                  </span>
                  {message.isInternal && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                      Internal
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                  {message.content}
                </p>
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {message.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-xs text-purple-600 hover:text-purple-700 bg-purple-50 px-2 py-1 rounded"
                      >
                        📎 {attachment.filename}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
