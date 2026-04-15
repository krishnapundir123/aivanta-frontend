import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

let socket: Socket | null = null;

export function initializeSocket(token: string): Socket {
  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
    autoConnect: true,
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function subscribeToTicket(ticketId: string): void {
  if (socket) {
    socket.emit('ticket:subscribe', ticketId);
  }
}

export function unsubscribeFromTicket(ticketId: string): void {
  if (socket) {
    socket.emit('ticket:unsubscribe', ticketId);
  }
}

export function sendMessage(ticketId: string, content: string): void {
  if (socket) {
    socket.emit('ticket:message', { ticketId, content });
  }
}

export function sendCopilotMessage(query: string, context: Record<string, unknown>): void {
  if (socket) {
    socket.emit('copilot:message', { query, context });
  }
}

export function sendAssistantMessage(query: string, sessionId: string): void {
  if (socket) {
    socket.emit('assistant:message', { query, sessionId });
  }
}
