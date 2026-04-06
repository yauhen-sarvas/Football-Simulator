import { Test, TestingModule } from '@nestjs/testing';
import { SimulationController } from '../simulation.controller';
import { SimulationService } from '../simulation.service';
import { CreateSimulationDto } from '../dto/create-simulation.dto';
import { SimulationStatus } from '../entities/simulation.entity';

describe('SimulationController', () => {
  let controller: SimulationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimulationController],
      providers: [SimulationService],
    }).compile();

    controller = module.get<SimulationController>(SimulationController);
  });

  describe('create', () => {
    it('should create a simulation with valid DTO', async () => {
      const createDto: CreateSimulationDto = { name: 'Valid Simulation Name' };
      const result = await controller.create(createDto);

      expect(result).toBeDefined();
      expect(result.name).toBe('Valid Simulation Name');
      expect(result.status).toBe(SimulationStatus.IDLE);
    });

    it('should reject name less than 8 characters', async () => {
      const createDto = { name: 'Short' };
      
      await expect(controller.create(createDto)).rejects.toThrow();
    });

    it('should reject name more than 30 characters', async () => {
      const createDto = { name: 'This is a very long simulation name that exceeds thirty characters' };
      
      await expect(controller.create(createDto)).rejects.toThrow();
    });

    it('should reject name with special characters', async () => {
      const createDto = { name: 'Invalid@Simulation#Name' };
      
      await expect(controller.create(createDto)).rejects.toThrow();
    });

    it('should accept name with spaces', async () => {
      const createDto = { name: 'Valid Simulation Name' };
      const result = await controller.create(createDto);

      expect(result.name).toBe('Valid Simulation Name');
    });

    it('should accept name with numbers', async () => {
      const createDto = { name: 'Simulation 123 Test' };
      const result = await controller.create(createDto);

      expect(result.name).toBe('Simulation 123 Test');
    });
  });

  describe('getOne', () => {
    it('should return a simulation by id', async () => {
      const createDto: CreateSimulationDto = { name: 'Get One Test Sim' };
      const created = await controller.create(createDto);
      const retrieved = await controller.getOne(created.id);

      expect(retrieved.id).toBe(created.id);
      expect(retrieved.name).toBe('Get One Test Sim');
    });

    it('should throw NotFoundException for non-existent id', async () => {
      await expect(controller.getOne('non-existent-id')).rejects.toThrow();
    });
  });

  describe('getAll', () => {
    it('should return all simulations', async () => {
      const createDto: CreateSimulationDto = { name: 'Get All Test Sim' };
      await controller.create(createDto);

      const all = await controller.getAll();

      expect(Array.isArray(all)).toBe(true);
      expect(all.length).toBeGreaterThan(0);
    });
  });

  describe('start', () => {
    it('should start a simulation', async () => {
      const createDto: CreateSimulationDto = { name: 'Start Test Sim123' };
      const created = await controller.create(createDto);
      
      // Wait for rate limit
      await new Promise(resolve => setTimeout(resolve, 5100));
      
      const started = await controller.start(created.id);

      expect(started.status).toBe(SimulationStatus.RUNNING);
      expect(started.startedAt).toBeDefined();
    }, 15000);

    it('should throw error when starting non-existent simulation', async () => {
      await expect(controller.start('non-existent-id')).rejects.toThrow();
    });
  });

  describe('finish', () => {
    it('should finish a running simulation', async () => {
      const createDto: CreateSimulationDto = { name: 'Finish Test Sim12' };
      const created = await controller.create(createDto);
      
      // Wait for rate limit
      await new Promise(resolve => setTimeout(resolve, 5100));
      
      await controller.start(created.id);
      const finished = await controller.finish(created.id);

      expect(finished.status).toBe(SimulationStatus.FINISHED);
      expect(finished.finishedAt).toBeDefined();
    }, 15000);

    it('should finish idle simulation', async () => {
      const createDto: CreateSimulationDto = { name: 'Finish Idle Sim12' };
      const created = await controller.create(createDto);
      const finished = await controller.finish(created.id);

      expect(finished.status).toBe(SimulationStatus.FINISHED);
    });
  });

  describe('restart', () => {
    it('should restart a running simulation', async () => {
      const createDto: CreateSimulationDto = { name: 'Restart Test Sim1' };
      const created = await controller.create(createDto);
      
      // Wait for rate limit
      await new Promise(resolve => setTimeout(resolve, 5100));
      
      await controller.start(created.id);
      const restarted = await controller.restart(created.id);

      expect(restarted.status).toBe(SimulationStatus.IDLE);
      expect(restarted.elapsedTime).toBe(0);
    }, 15000);

    it('should restart from idle state', async () => {
      const createDto: CreateSimulationDto = { name: 'Restart Idle Sim1' };
      const created = await controller.create(createDto);
      const restarted = await controller.restart(created.id);

      expect(restarted.status).toBe(SimulationStatus.IDLE);
    });
  });
});
