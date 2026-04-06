import { Match } from './match.entity';

export enum SimulationStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  FINISHED = 'finished',
}

export interface Simulation {
  id: string;
  name: string;
  status: SimulationStatus;
  matches: Match[];
  elapsedTime: number;
  createdAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
}
