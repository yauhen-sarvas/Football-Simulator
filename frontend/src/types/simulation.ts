export type SimulationStatus = 'idle' | 'running' | 'finished';

export interface Team {
  id: string;
  name: string;
  flagEmoji: string;
  score: number;
}

export interface Match {
  id: string;
  name: string;
  homeTeam: Team;
  awayTeam: Team;
}

export interface Simulation {
  id: string;
  name: string;
  status: SimulationStatus;
  matches: Match[];
  elapsedTime: number;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
}

export interface GoalEvent {
  simulationId: string;
  matchId: string;
  matchName: string;
  homeTeam: Team;
  awayTeam: Team;
  teamName: string;
  timestamp: string;
}

export interface SimulationFormData {
  name: string;
}
