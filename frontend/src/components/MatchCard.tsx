import React from 'react';
import { Simulation } from '../types/simulation';
import { Scoreboard } from './Scoreboard';
import { StatusIndicator } from './StatusIndicator';
import { SimulationControls } from './SimulationControls';

interface MatchCardProps {
  simulation: Simulation;
  onStart: (id: string) => Promise<void>;
  onFinish: (id: string) => Promise<void>;
  onRestart: (id: string) => Promise<void>;
  loading: boolean;
  hasRecentGoal?: (matchId: string) => boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  simulation,
  onStart,
  onFinish,
  onRestart,
  loading,
  hasRecentGoal = () => false,
}) => {
  const getBackgroundColor = () => {
    if (simulation.status === 'running') {
      return 'bg-blue-50 border-blue-200';
    }
    if (simulation.status === 'finished') {
      return 'bg-gray-50 border-gray-200';
    }
    return 'bg-white border-gray-200';
  };

  return (
    <div
      className={`
        ${getBackgroundColor()}
        border-2 rounded-xl p-6 shadow-lg transition-all duration-300
      `}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{simulation.name}</h3>
            <p className="text-sm text-gray-500">{simulation.matches.length} matches in this simulation</p>
          </div>
          <div className="text-right text-xs text-gray-500">
            Created at: {new Date(simulation.createdAt).toLocaleString()}
          </div>
        </div>

        <StatusIndicator status={simulation.status} elapsedTime={simulation.elapsedTime} />

        <div className="space-y-6">
          {simulation.matches.map((match) => (
            <div
              key={match.id}
              className={`rounded-2xl border p-4 ${hasRecentGoal(match.id) ? 'border-blue-300 bg-blue-50 animate-pulse-goal' : 'border-gray-200 bg-white'}`}
            >
              <h4 className="text-sm font-semibold text-gray-600 mb-3">{match.name}</h4>
              <Scoreboard homeTeam={match.homeTeam} awayTeam={match.awayTeam} />
            </div>
          ))}
        </div>

        <SimulationControls
          simulation={simulation}
          onStart={onStart}
          onFinish={onFinish}
          onRestart={onRestart}
          loading={loading}
        />
      </div>
    </div>
  );
};
