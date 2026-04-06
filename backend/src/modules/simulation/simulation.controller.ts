import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { SimulationResponseDto } from './dto/simulation-response.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Controller('simulations')
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  @Post()
  async create(@Body() createSimulationDto: CreateSimulationDto): Promise<SimulationResponseDto> {
    const dto = plainToClass(CreateSimulationDto, createSimulationDto);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}).join(', '))
        .join('; ');
      throw new BadRequestException(errorMessages);
    }

    return this.simulationService.createSimulation(dto.name);
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<SimulationResponseDto> {
    return this.simulationService.getSimulation(id);
  }

  @Get()
  async getAll(): Promise<SimulationResponseDto[]> {
    return this.simulationService.getAllSimulations();
  }

  @Post(':id/start')
  async start(@Param('id') id: string): Promise<SimulationResponseDto> {
    return this.simulationService.startSimulation(id, () => {}, () => {});
  }

  @Post(':id/finish')
  async finish(@Param('id') id: string): Promise<SimulationResponseDto> {
    return this.simulationService.finishSimulation(id);
  }

  @Post(':id/restart')
  async restart(@Param('id') id: string): Promise<SimulationResponseDto> {
    return this.simulationService.restartSimulation(id);
  }
}
