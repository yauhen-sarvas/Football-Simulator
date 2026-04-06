import React from 'react';
import { SimulationStatus } from '../types/simulation';

interface StatusIndicatorProps {
  status: SimulationStatus;
  elapsedTime: number;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, elapsedTime }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'running':
        return 'bg-blue-500';
      case 'finished':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'running':
        return 'RUNNING';
      case 'finished':
        return 'FINISHED';
      default:
        return 'IDLE';
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()} ${status === 'running' ? 'animate-pulse' : ''}`}></div>
        <span className="text-sm font-semibold text-gray-600">{getStatusText()}</span>
      </div>
      <div className="text-sm font-mono text-gray-500">
        <span className={status === 'running' ? 'font-bold text-accent' : ''}>
          {elapsedTime}
        </span>
        <span> / 9s</span>
      </div>
    </div>
  );
};
