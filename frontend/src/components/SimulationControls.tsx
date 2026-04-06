import React, { useState } from 'react';
import { Simulation } from '../types/simulation';

interface SimulationControlsProps {
  simulation: Simulation;
  onStart: (id: string) => Promise<void>;
  onFinish: (id: string) => Promise<void>;
  onRestart: (id: string) => Promise<void>;
  loading: boolean;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  simulation,
  onStart,
  onFinish,
  onRestart,
  loading,
}) => {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleStart = async () => {
    setActionLoading('start');
    await onStart(simulation.id);
    setActionLoading(null);
  };

  const handleFinish = async () => {
    setActionLoading('finish');
    await onFinish(simulation.id);
    setActionLoading(null);
  };

  const handleRestart = async () => {
    setActionLoading('restart');
    await onRestart(simulation.id);
    setActionLoading(null);
  };

  const isLoading = loading || !!actionLoading;

  return (
    <div className="flex gap-2 mt-4">
      {simulation.status === 'idle' && (
        <button
          onClick={handleStart}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {actionLoading === 'start' ? '⏳ Starting...' : '▶️ Start'}
        </button>
      )}

      {simulation.status === 'running' && (
        <>
          <button
            onClick={handleFinish}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {actionLoading === 'finish' ? '⏳ Finishing...' : '⏹️ Finish'}
          </button>
        </>
      )}

      {simulation.status === 'finished' && (
        <button
          onClick={handleRestart}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {actionLoading === 'restart' ? 'Restarting...' : 'Restart'}
        </button>
      )}
    </div>
  );
};
