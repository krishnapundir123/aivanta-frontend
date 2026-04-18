import { useEffect, useCallback } from 'react';
import { getSocket } from '../../services/socket.service';

export function useSocket(event: string, handler: (data: unknown) => void) {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, [event, handler]);
}

export function useSocketEmit() {
  const emit = useCallback((event: string, data: unknown) => {
    const socket = getSocket();
    if (socket) {
      socket.emit(event, data);
    }
  }, []);

  return emit;
}

export function useTicketSubscription(ticketId: string | undefined) {
  useEffect(() => {
    if (!ticketId) return;

    const socket = getSocket();
    if (!socket) return;

    socket.emit('ticket:subscribe', ticketId);

    return () => {
      socket.emit('ticket:unsubscribe', ticketId);
    };
  }, [ticketId]);
}
