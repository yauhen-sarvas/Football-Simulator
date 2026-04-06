import { useState, useEffect, useCallback } from 'react';
import { Simulation, GoalEvent } from '../types/simulation';
import websocketService from '../services/websocketService';

export const useSimulation = () => {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [goals, setGoals] = useState<GoalEvent[]>([]);

  // Initialize WebSocket connection
  useEffect(() => {
    websocketService.connect();
    setIsConnected(websocketService.isConnected());

    // Subscribe to connection events
    const unsubscribeConnected = websocketService.on('connected', () => {
      setIsConnected(true);
    });

    const unsubscribeDisconnected = websocketService.on('disconnected', () => {
      setIsConnected(false);
    });

    // Subscribe to simulation updates
    const unsubscribeUpdate = websocketService.on('simulation:updated', (simulation: Simulation) => {
      setSimulations((prev) => {
        const index = prev.findIndex((s) => s.id === simulation.id);
        if (index > -1) {
          const updated = [...prev];
          updated[index] = simulation;
          return updated;
        }
        return [...prev, simulation];
      });
      setError(null);
    });

    // Subscribe to goal events
    const unsubscribeGoal = websocketService.on('goal:scored', (goal: GoalEvent) => {
      setGoals((prev) => [...prev, goal]);
      // Clear goal after 1 second
      setTimeout(() => {
        setGoals((prev) => prev.filter((g) => g !== goal));
      }, 1000);
    });

    // Subscribe to errors
    const unsubscribeError = websocketService.on('error', (errorData: any) => {
      setError(errorData?.message || 'An error occurred');
    });

    return () => {
      unsubscribeConnected();
      unsubscribeDisconnected();
      unsubscribeUpdate();
      unsubscribeGoal();
      unsubscribeError();
    };
  }, []);

  // Auto-finish simulations when elapsedTime reaches 9
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulations((prev) =>
        prev.map((sim) =>
          sim.elapsedTime >= 9 && sim.status !== 'finished'
            ? { ...sim, status: 'finished', finishedAt: new Date().toISOString() }
            : sim
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateSimulation = useCallback((simulation: Simulation) => {
    setSimulations((prev) => {
      const index = prev.findIndex((s) => s.id === simulation.id);
      if (index > -1) {
        const updated = [...prev];
        updated[index] = simulation;
        return updated;
      }
      return [...prev, simulation];
    });
  }, []);

  const addSimulation = useCallback((simulation: Simulation) => {
    setSimulations((prev) => [...prev, simulation]);
  }, []);

  const removeSimulation = useCallback((simulationId: string) => {
    setSimulations((prev) => prev.filter((s) => s.id !== simulationId));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    simulations,
    loading,
    error,
    isConnected,
    goals,
    updateSimulation,
    addSimulation,
    removeSimulation,
    clearError,
    setLoading,
    setError,
  };
};
