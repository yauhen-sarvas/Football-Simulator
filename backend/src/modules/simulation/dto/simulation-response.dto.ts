import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SimulationStatus } from '../entities/simulation.entity';

export class TeamDto {
  @ApiProperty({ example: 'germany' })
  id!: string;

  @ApiProperty({ example: 'Germany' })
  name!: string;

  @ApiProperty({ example: '🇩🇪' })
  flagEmoji!: string;

  @ApiProperty({ example: 0 })
  score!: number;
}

export class MatchDto {
  @ApiProperty({ example: 'match-1' })
  id!: string;

  @ApiProperty({ example: 'Germany vs Poland' })
  name!: string;

  @ApiProperty({ type: TeamDto })
  homeTeam!: TeamDto;

  @ApiProperty({ type: TeamDto })
  awayTeam!: TeamDto;
}

export class SimulationResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6' })
  id!: string;

  @ApiProperty({ example: 'Tournament Match 1' })
  name!: string;

  @ApiProperty({ enum: SimulationStatus, example: SimulationStatus.IDLE })
  status!: SimulationStatus;

  @ApiProperty({ type: [MatchDto] })
  matches!: MatchDto[];

  @ApiProperty({ example: 0 })
  elapsedTime!: number;

  @ApiProperty({ type: String, example: new Date().toISOString() })
  createdAt!: Date;

  @ApiPropertyOptional({ type: String, example: new Date().toISOString() })
  startedAt?: Date;

  @ApiPropertyOptional({ type: String, example: new Date().toISOString() })
  finishedAt?: Date;
}
