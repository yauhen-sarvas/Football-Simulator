import React from 'react';
import { Team } from '../types/simulation';

interface ScoreboardProps {
  homeTeam: Team;
  awayTeam: Team;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ homeTeam, awayTeam }) => {
  return (
    <div className="flex items-center justify-between gap-8 py-6">
      {/* Home Team */}
      <div className="flex-1 text-center">
        <div className="text-5xl mb-3">{homeTeam.flagEmoji}</div>
        <div className="text-sm font-semibold text-gray-600 mb-2">{homeTeam.name}</div>
        <div className="text-5xl font-bold text-accent">{homeTeam.score}</div>
      </div>

      {/* Divider */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-2xl font-bold text-gray-400">vs</div>
        <div className="h-12 w-1 bg-gray-300 rounded"></div>
      </div>

      {/* Away Team */}
      <div className="flex-1 text-center">
        <div className="text-5xl mb-3">{awayTeam.flagEmoji}</div>
        <div className="text-sm font-semibold text-gray-600 mb-2">{awayTeam.name}</div>
        <div className="text-5xl font-bold text-accent">{awayTeam.score}</div>
      </div>
    </div>
  );
};
