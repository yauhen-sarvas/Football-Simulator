import { Match } from '../entities/match.entity';
import { SimulationStatus } from '../entities/simulation.entity';

export class SimulationResponseDto {
  id!: string;
  name!: string;
  status!: SimulationStatus;
  matches!: Match[];
  elapsedTime!: number;
  createdAt!: Date;
  startedAt?: Date;
  finishedAt?: Date;
}
