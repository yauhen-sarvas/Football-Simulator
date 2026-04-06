import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateSimulationDto {
  @ApiProperty({
    description: 'The display name for the simulation',
    minLength: 8,
    maxLength: 30,
    example: 'Tournament Match 1',
  })
  @IsString()
  @MinLength(8, { message: 'Simulation name must be at least 8 characters long' })
  @MaxLength(30, { message: 'Simulation name must be at most 30 characters long' })
  @Matches(/^[a-zA-Z0-9 ]*$/, {
    message: 'Simulation name must contain only alphanumeric characters and spaces',
  })
  name!: string;
}
