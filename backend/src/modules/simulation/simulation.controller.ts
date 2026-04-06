import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { SimulationService } from './simulation.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { SimulationResponseDto } from './dto/simulation-response.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@ApiTags('simulations')
@Controller('simulations')
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  @Post()
  @ApiBody({ type: CreateSimulationDto })
  @ApiCreatedResponse({ type: SimulationResponseDto })
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
  @ApiParam({ name: 'id', description: 'Simulation UUID' })
  @ApiOkResponse({ type: SimulationResponseDto })
  async getOne(@Param('id') id: string): Promise<SimulationResponseDto> {
    return this.simulationService.getSimulation(id);
  }

  @Get()
  @ApiOkResponse({ type: [SimulationResponseDto] })
  async getAll(): Promise<SimulationResponseDto[]> {
    return this.simulationService.getAllSimulations();
  }

  @Post(':id/start')
  @ApiParam({ name: 'id', description: 'Simulation UUID' })
  @ApiOkResponse({ type: SimulationResponseDto })
  async start(@Param('id') id: string): Promise<SimulationResponseDto> {
    return this.simulationService.startSimulation(id, () => {}, () => {});
  }

  @Post(':id/finish')
  @ApiParam({ name: 'id', description: 'Simulation UUID' })
  @ApiOkResponse({ type: SimulationResponseDto })
  async finish(@Param('id') id: string): Promise<SimulationResponseDto> {
    return this.simulationService.finishSimulation(id);
  }

  @Post(':id/restart')
  @ApiParam({ name: 'id', description: 'Simulation UUID' })
  @ApiOkResponse({ type: SimulationResponseDto })
  async restart(@Param('id') id: string): Promise<SimulationResponseDto> {
    return this.simulationService.restartSimulation(id);
  }
}
