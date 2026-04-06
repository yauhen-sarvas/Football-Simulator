import { Test, TestingModule } from '@nestjs/testing';
import { SimulationGateway } from '../simulation.gateway';
import { SimulationService } from '../simulation.service';
import { Server, Socket } from 'socket.io';

describe('SimulationGateway', () => {
  let gateway: SimulationGateway;
  let service: SimulationService;
  let mockServer: Partial<Server>;
  let mockClient: Partial<Socket>;
  let mockEmit: jest.SpyInstance;

  beforeEach(async () => {
    mockServer = {
      emit: jest.fn(),
    } as Partial<Server>;

    mockClient = {
      id: 'test-client-id',
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [SimulationGateway, SimulationService],
    }).compile();

    gateway = module.get<SimulationGateway>(SimulationGateway);
    service = module.get<SimulationService>(SimulationService);

    gateway.server = mockServer as Server;
    
    // Mock rate limiting for tests
    jest.spyOn(service as any, 'validateRateLimit').mockImplementation(() => {});

    // Spy on the server emit
    mockEmit = jest.spyOn(gateway.server, 'emit');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleConnection', () => {
    it('should log client connection', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      gateway.handleConnection(mockClient as Socket);

      expect(consoleSpy).toHaveBeenCalledWith('Client connected: test-client-id');
      consoleSpy.mockRestore();
    });
  });

  describe('handleDisconnect', () => {
    it('should log client disconnection', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      gateway.handleDisconnect(mockClient as Socket);

      expect(consoleSpy).toHaveBeenCalledWith('Client disconnected: test-client-id');
      consoleSpy.mockRestore();
    });
  });

  describe('handleStartSimulation', () => {
    it('should start simulation and emit update', async () => {
      const simulation = await service.createSimulation('Gateway Start Test');
      
      await gateway.handleStartSimulation(mockClient as Socket, { id: simulation.id });

      expect(mockEmit).toHaveBeenCalledWith('simulation:updated', expect.objectContaining({
        id: simulation.id,
      }));
    });

    it('should emit error on invalid simulation', async () => {
      await gateway.handleStartSimulation(mockClient as Socket, { id: 'non-existent' });

      expect(mockClient.emit).toHaveBeenCalledWith('error', expect.objectContaining({
        message: expect.any(String),
      }));
    });
  });

  describe('handleFinishSimulation', () => {
    it('should finish simulation and emit finished event', async () => {
      const simulation = await service.createSimulation('Gateway Finish Test');
      await service.startSimulation(simulation.id, () => {});

      await gateway.handleFinishSimulation(mockClient as Socket, { id: simulation.id });

      expect(mockEmit).toHaveBeenCalledWith('simulation:updated', expect.any(Object));
    });

    it('should emit error on invalid simulation', async () => {
      await gateway.handleFinishSimulation(mockClient as Socket, { id: 'non-existent' });

      expect(mockClient.emit).toHaveBeenCalledWith('error', expect.any(Object));
    });
  });

  describe('handleRestartSimulation', () => {
    it('should restart simulation and emit update', async () => {
      const simulation = await service.createSimulation('Gateway Restart Test');
      await service.startSimulation(simulation.id, () => {});

      await gateway.handleRestartSimulation(mockClient as Socket, { id: simulation.id });

      expect(mockEmit).toHaveBeenCalledWith('simulation:updated', expect.any(Object));
    });
  });

  describe('handleGetSimulation', () => {
    it('should retrieve simulation and send to client', async () => {
      const simulation = await service.createSimulation('Gateway Get Test');

      await gateway.handleGetSimulation(mockClient as Socket, { id: simulation.id });

      expect(mockClient.emit).toHaveBeenCalledWith('simulation:data', expect.any(Object));
    });

    it('should emit error on invalid simulation', async () => {
      await gateway.handleGetSimulation(mockClient as Socket, { id: 'non-existent' });

      expect(mockClient.emit).toHaveBeenCalledWith('error', expect.any(Object));
    });
  });

  describe('broadcastSimulationUpdate', () => {
    it('should broadcast simulation update to all clients', async () => {
      const simulation = await service.createSimulation('Broadcast Test 123');

      gateway.broadcastSimulationUpdate(simulation);

      expect(mockServer.emit).toHaveBeenCalledWith('simulation:updated', simulation);
    });
  });

  describe('broadcastGoal', () => {
    it('should broadcast goal scored event', async () => {
      const simulation = await service.createSimulation('Broadcast Goal Test');
      const match = simulation.matches[0];

      gateway.broadcastGoal(simulation, match, match.homeTeam.name);

      expect(mockServer.emit).toHaveBeenCalledWith('goal:scored', expect.objectContaining({
        simulationId: simulation.id,
        matchId: match.id,
        teamName: match.homeTeam.name,
      }));
    });
  });
});
