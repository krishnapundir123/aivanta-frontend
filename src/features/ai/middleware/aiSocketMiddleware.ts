import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';

interface AIEvent {
  type: string;
  payload: unknown;
  timestamp: number;
}

class AISocketManager {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private listeners: Map<string, Set<(event: AIEvent) => void>> = new Map();

  connect(token: string) {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3001'}/ai?token=${token}`;
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('AI WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as AIEvent;
        this.emit(data.type, data);
      } catch (error) {
        console.error('Failed to parse AI WebSocket message:', error);
      }
    };

    this.socket.onclose = () => {
      this.attemptReconnect(token);
    };

    this.socket.onerror = (error) => {
      console.error('AI WebSocket error:', error);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private attemptReconnect(token: string) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max AI WebSocket reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    setTimeout(() => this.connect(token), this.reconnectDelay);
  }

  on(event: string, callback: (event: AIEvent) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: (event: AIEvent) => void) {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: AIEvent) {
    this.listeners.get(event)?.forEach((callback) => callback(data));
    this.listeners.get('*')?.forEach((callback) => callback(data));
  }

  send(type: string, payload: unknown) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type,
          payload,
          timestamp: Date.now(),
        })
      );
    }
  }
}

export const aiSocketManager = new AISocketManager();

export const aiSocketMiddleware: Middleware<unknown, RootState> = (store) => (next) => (action) => {
  const result = next(action);

  const typedAction = action as { type: string; payload?: unknown };
  
  if (typedAction.type === 'auth/setCredentials') {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      aiSocketManager.connect(token);
    }
  }

  if (typedAction.type === 'auth/logout') {
    aiSocketManager.disconnect();
  }

  if (typedAction.type === 'tickets/updateTicket') {
    aiSocketManager.send('ticket_update', typedAction.payload);
  }

  return result;
};
