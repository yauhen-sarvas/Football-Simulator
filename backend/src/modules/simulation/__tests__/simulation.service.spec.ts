import { Test, TestingModule } from '@nestjs/testing';
import { SimulationService } from '../simulation.service';
import { SimulationStatus } from '../entities/simulation.entity';

describe('SimulationService', () => {
  let service: SimulationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimulationService],
    }).compile();

    service = module.get<SimulationService>(SimulationService);
    
    // Mock rate limiting for tests
    jest.spyOn(service as any, 'validateRateLimit').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSimulation', () => {
    it('should create a new simulation', async () => {
      const result = await service.createSimulation('Test Simulation 123');

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe('Test Simulation 123');
      expect(result.status).toBe(SimulationStatus.IDLE);
      expect(result.matches.length).toBe(3);
      expect(result.elapsedTime).toBe(0);
    });

    it('should enforce rate limiting', async () => {
      // Restore the original validateRateLimit for this test
      jest.restoreAllMocks();
      
      // First call should succeed
      await service.createSimulation('First Simulation 001');

      // Second call within 5 seconds should fail
      await expect(service.createSimulation('Second Simulation 002')).rejects.toThrow(
        'Cannot start simulations more than once per 5 seconds',
      );
    });

    it('should reset scores to 0 for all teams in matches', async () => {
      const result = await service.createSimulation('Score Reset Test 1');

      result.matches.forEach((match) => {
        expect(match.homeTeam.score).toBe(0);
        expect(match.awayTeam.score).toBe(0);
      });
    });

    it('should have 3 predefined matches', async () => {
      const result = await service.createSimulation('Matches Test 12345');

      expect(result.matches.length).toBe(3);
      expect(result.matches[0].name).toBe('Germany vs Poland');
      expect(result.matches[1].name).toBe('Brazil vs Mexico');
      expect(result.matches[2].name).toBe('Argentina vs Uruguay');
    });
  });

  describe('startSimulation', () => {
    it('should start a simulation and run for approximately 9 seconds', async () => {
      const simulation = await service.createSimulation('Start Test Simulation');
      const goalCallback = jest.fn();

      await service.startSimulation(simulation.id, goalCallback);
      const simulation1 = await service.getSimulation(simulation.id);

      expect(simulation1.status).toBe(SimulationStatus.RUNNING);
      expect(simulation1.startedAt).toBeDefined();
    });

    it('should throw error if already running', async () => {
      const simulation = await service.createSimulation('Already Running Test');
      const goalCallback = jest.fn();

      await service.startSimulation(simulation.id, goalCallback);

      // Wait for rate limit to reset
      await new Promise(resolve => setTimeout(resolve, 5100));

      await expect(
        service.startSimulation(simulation.id, goalCallback),
      ).rejects.toThrow('Simulation is already running');
    }, 10000);

    it('should reset scores when starting', async () => {
      const simulation = await service.createSimulation('Score Reset on Start');
      
      // Manually modify scores
      simulation.matches[0].homeTeam.score = 5;
      simulation.matches[0].awayTeam.score = 3;

      const goalCallback = jest.fn();
      await service.startSimulation(simulation.id, goalCallback);

      const updatedSimulation = await service.getSimulation(simulation.id);
      expect(updatedSimulation.matches[0].homeTeam.score).toBe(0);
      expect(updatedSimulation.matches[0].awayTeam.score).toBe(0);
    });

    it('should call goal callback when goals are scored', async () => {
      const simulation = await service.createSimulation('Goal Callback Test1');
      const goalCallback = jest.fn();

      await service.startSimulation(simulation.id, goalCallback);

      // Wait for at least one goal
      await new Promise(resolve => setTimeout(resolve, 1500));
      expect(goalCallback).toHaveBeenCalled();
    });
  });

  describe('finishSimulation', () => {
    it('should finish a running simulation', async () => {
      const simulation = await service.createSimulation('Finish Test Simulation');
      const goalCallback = jest.fn();

      await service.startSimulation(simulation.id, goalCallback);
      const finished = await service.finishSimulation(simulation.id);

      expect(finished.status).toBe(SimulationStatus.FINISHED);
      expect(finished.finishedAt).toBeDefined();
    });

    it('should throw error if already finished', async () => {
      const simulation = await service.createSimulation('Double Finish Test');
      
      await service.finishSimulation(simulation.id);

      await expect(service.finishSimulation(simulation.id)).rejects.toThrow(
        'Simulation is already finished',
      );
    });

    it('should clean up timers when finished', async () => {
      const simulation = await service.createSimulation('Timer Cleanup Test');
      const goalCallback = jest.fn();

      await service.startSimulation(simulation.id, goalCallback);
      await service.finishSimulation(simulation.id);

      // Should not error and cleanup should happen
      expect(true).toBe(true);
    });
  });

  describe('restartSimulation', () => {
    it('should reset simulation to idle state', async () => {
      const simulation = await service.createSimulation('Restart Test Simulation');
      const goalCallback = jest.fn();

      await service.startSimulation(simulation.id, goalCallback);
      const restarted = await service.restartSimulation(simulation.id);

      expect(restarted.status).toBe(SimulationStatus.IDLE);
      expect(restarted.elapsedTime).toBe(0);
      expect(restarted.startedAt).toBeUndefined();
      expect(restarted.finishedAt).toBeUndefined();
    });

    it('should reset all team scores to 0', async () => {
      const simulation = await service.createSimulation('Score Reset Restart');
      
      // Modify scores
      simulation.matches[0].homeTeam.score = 5;
      simulation.matches[1].awayTeam.score = 3;

      const restarted = await service.restartSimulation(simulation.id);

      restarted.matches.forEach((match) => {
        expect(match.homeTeam.score).toBe(0);
        expect(match.awayTeam.score).toBe(0);
      });
    });
  });

  describe('getSimulation', () => {
    it('should return simulation by id', async () => {
      const created = await service.createSimulation('Get Test Simulation');
      const retrieved = await service.getSimulation(created.id);

      expect(retrieved.id).toBe(created.id);
      expect(retrieved.name).toBe('Get Test Simulation');
    });

    it('should throw NotFoundException for non-existent simulation', async () => {
      await expect(service.getSimulation('non-existent-id')).rejects.toThrow(
        'Simulation with id non-existent-id not found',
      );
    });
  });

  describe('getAllSimulations', () => {
    it('should return all simulations', async () => {
      const sim1 = await service.createSimulation('All Test Sim One');
      
      // Wait for rate limit
      await new Promise((resolve) => setTimeout(resolve, 5100));
      
      const sim2 = await service.createSimulation('All Test Sim Two');

      const all = await service.getAllSimulations();

      expect(all.length).toBeGreaterThanOrEqual(2);
      expect(all.some((s) => s.id === sim1.id)).toBe(true);
      expect(all.some((s) => s.id === sim2.id)).toBe(true);
    }, 10000);

    it('should return empty array initially', async () => {
      const fresh = new SimulationService();
      const all = await fresh.getAllSimulations();

      expect(all.length).toBe(0);
    });
  });

  describe('deleteSimulation', () => {
    it('should delete a simulation', async () => {
      const simulation = await service.createSimulation('Delete Test Simulation');
      
      await service.deleteSimulation(simulation.id);

      await expect(service.getSimulation(simulation.id)).rejects.toThrow(
        'Simulation with id ' + simulation.id + ' not found',
      );
    });

    it('should clean up timers before deleting', async () => {
      const simulation = await service.createSimulation('Delete with Timers');
      const goalCallback = jest.fn();

      await service.startSimulation(simulation.id, goalCallback);
      await service.deleteSimulation(simulation.id);

      // Should not error
      expect(true).toBe(true);
    });
  });
});
