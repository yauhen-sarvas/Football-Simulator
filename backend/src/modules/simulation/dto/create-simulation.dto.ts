import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateSimulationDto {
  @IsString()
  @MinLength(8, { message: 'Simulation name must be at least 8 characters long' })
  @MaxLength(30, { message: 'Simulation name must be at most 30 characters long' })
  @Matches(/^[a-zA-Z0-9 ]*$/, {
    message: 'Simulation name must contain only alphanumeric characters and spaces',
  })
  name!: string;
}
