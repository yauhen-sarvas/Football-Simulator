import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Simulation, SimulationStatus } from './entities/simulation.entity';
import { PREDEFINED_MATCHES, Match } from './entities/match.entity';
import { ValidationException } from '../core/exceptions/validation.exception';

@Injectable()
export class SimulationService {
  private simulations: Map<string, Simulation> = new Map();
  private lastSimulationStartTime: number = 0;
  private readonly RATE_LIMIT_SECONDS = 5;
  private readonly SIMULATION_DURATION = 9;
  private simulationTimers: Map<string, NodeJS.Timeout> = new Map();
  private simulationGoalIntervals: Map<string, NodeJS.Timeout> = new Map();

  async createSimulation(name: string): Promise<Simulation> {
    this.validateRateLimit();
    this.validateRateLimit();

    const id = uuidv4();
    const matches = JSON.parse(JSON.stringify(PREDEFINED_MATCHES)) as Match[];

    const simulation: Simulation = {
      id,
      name,
      status: SimulationStatus.IDLE,
      matches,
      elapsedTime: 0,
      createdAt: new Date(),
    };

    this.simulations.set(id, simulation);
    this.lastSimulationStartTime = Date.now();
    return simulation;
  }

  async startSimulation(id: string, onGoal: (simulation: Simulation, match: Match, team: string) => void, onFinished?: (simulation: Simulation) => void): Promise<Simulation> {
    this.validateRateLimit();

    const simulation = await this.getSimulation(id);

    if (simulation.status === SimulationStatus.RUNNING) {
      throw new ValidationException('Simulation is already running');
    }

    simulation.status = SimulationStatus.RUNNING;
    simulation.startedAt = new Date();
    simulation.elapsedTime = 0;

    this.lastSimulationStartTime = Date.now();

    simulation.matches.forEach((match) => {
      match.homeTeam.score = 0;
      match.awayTeam.score = 0;
    });

    let goalCount = 0;
    const goalInterval = setInterval(() => {
      goalCount++;
      
      simulation.elapsedTime = goalCount;
      
      if (goalCount <= this.SIMULATION_DURATION) {
        const randomMatch = simulation.matches[Math.floor(Math.random() * simulation.matches.length)];
        const isHomeTeamScore = Math.random() < 0.5;
        const scoringTeam = isHomeTeamScore ? randomMatch.homeTeam : randomMatch.awayTeam;
        
        scoringTeam.score++;
        
        onGoal(simulation, randomMatch, scoringTeam.name);
      }

      if (goalCount >= this.SIMULATION_DURATION) {
        clearInterval(goalInterval);
        this.simulationGoalIntervals.delete(id);
        
        simulation.status = SimulationStatus.FINISHED;
        simulation.finishedAt = new Date();
        
        if (onFinished) {
          onFinished(simulation);
        }
      }
    }, 1000);

    this.simulationGoalIntervals.set(id, goalInterval);

    return simulation;
  }

  async finishSimulation(id: string): Promise<Simulation> {
    const simulation = await this.getSimulation(id);

    if (simulation.status === SimulationStatus.FINISHED) {
      throw new ValidationException('Simulation is already finished');
    }

    this.cleanupSimulationTimers(id);

    simulation.status = SimulationStatus.FINISHED;
    simulation.finishedAt = new Date();

    return simulation;
  }

  async restartSimulation(id: string): Promise<Simulation> {
    const simulation = await this.getSimulation(id);

    this.cleanupSimulationTimers(id);

    simulation.status = SimulationStatus.IDLE;
    simulation.elapsedTime = 0;
    simulation.startedAt = undefined;
    simulation.finishedAt = undefined;

    simulation.matches.forEach((match) => {
      match.homeTeam.score = 0;
      match.awayTeam.score = 0;
    });

    return simulation;
  }

  async getSimulation(id: string): Promise<Simulation> {
    const simulation = this.simulations.get(id);

    if (!simulation) {
      throw new NotFoundException(`Simulation with id ${id} not found`);
    }

    return simulation;
  }

  async getAllSimulations(): Promise<Simulation[]> {
    return Array.from(this.simulations.values());
  }

  async deleteSimulation(id: string): Promise<void> {
    this.cleanupSimulationTimers(id);
    this.simulations.delete(id);
  }

  private validateRateLimit(): void {
    const now = Date.now();
    const timeSinceLastStart = (now - this.lastSimulationStartTime) / 1000;

    if (timeSinceLastStart < this.RATE_LIMIT_SECONDS && this.lastSimulationStartTime > 0) {
      throw new ValidationException(
        `Cannot start simulations more than once per ${this.RATE_LIMIT_SECONDS} seconds`,
      );
    }
  }

  private cleanupSimulationTimers(id: string): void {
    const goalInterval = this.simulationGoalIntervals.get(id);
    if (goalInterval) {
      clearInterval(goalInterval);
      this.simulationGoalIntervals.delete(id);
    }

    const timer = this.simulationTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.simulationTimers.delete(id);
    }
  }
}
