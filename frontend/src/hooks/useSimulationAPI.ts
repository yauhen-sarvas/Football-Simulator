import { useCallback, useState } from 'react';
import { Simulation, SimulationFormData } from '../types/simulation';
import apiService from '../services/api';
import websocketService from '../services/websocketService';

export const useSimulationAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createSimulation = useCallback(
    async (data: SimulationFormData): Promise<Simulation | null> => {
      setLoading(true);
      setError(null);
      try {
        const simulation = await apiService.createSimulation(data);
        setLoading(false);
        return simulation;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to create simulation';
        setError(errorMessage);
        setLoading(false);
        return null;
      }
    },
    [],
  );

  const startSimulation = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      websocketService.startSimulation(id);
      setLoading(false);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to start simulation';
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  const finishSimulation = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      websocketService.finishSimulation(id);
      setLoading(false);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to finish simulation';
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  const restartSimulation = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      websocketService.restartSimulation(id);
      setLoading(false);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to restart simulation';
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createSimulation,
    startSimulation,
    finishSimulation,
    restartSimulation,
    clearError,
  };
};
