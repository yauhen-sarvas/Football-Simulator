import io, { Socket } from 'socket.io-client';
import { Simulation, GoalEvent } from '../types/simulation';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(BACKEND_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket');
      this.emit('connected', null);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
      this.emit('disconnected', null);
    });

    this.socket.on('simulation:updated', (data: Simulation) => {
      this.emit('simulation:updated', data);
    });

    this.socket.on('goal:scored', (data: GoalEvent) => {
      this.emit('goal:scored', data);
    });

    this.socket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((callback) => callback(data));
  }

  on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  startSimulation(simulationId: string): void {
    if (this.socket) {
      this.socket.emit('start-simulation', { id: simulationId });
    }
  }

  finishSimulation(simulationId: string): void {
    if (this.socket) {
      this.socket.emit('finish-simulation', { id: simulationId });
    }
  }

  restartSimulation(simulationId: string): void {
    if (this.socket) {
      this.socket.emit('restart-simulation', { id: simulationId });
    }
  }

  getSimulation(simulationId: string): void {
    if (this.socket) {
      this.socket.emit('get-simulation', { id: simulationId });
    }
  }

  onSimulationData(callback: (data: Simulation) => void): () => void {
    return this.on('simulation:data', callback);
  }
}

export default new WebSocketService();
