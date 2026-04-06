import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SimulationService } from './simulation.service';
import { Simulation } from './entities/simulation.entity';
import { Match } from './entities/match.entity';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class SimulationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly simulationService: SimulationService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('start-simulation')
  async handleStartSimulation(client: Socket, data: { id: string }) {
    try {
      const goalCallback = (simulation: Simulation, match: Match, teamName: string) => {
        this.server.emit('goal:scored', {
          simulationId: simulation.id,
          matchId: match.id,
          matchName: match.name,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          teamName,
          timestamp: new Date(),
        });
        this.server.emit('simulation:updated', simulation);
      };

      const finishedCallback = (simulation: Simulation) => {
        this.server.emit('simulation:updated', simulation);
      };

      const simulation = await this.simulationService.startSimulation(
        data.id,
        goalCallback,
        finishedCallback,
      );

      this.server.emit('simulation:updated', simulation);
    } catch (error) {
      client.emit('error', {
        message: error.message,
      });
    }
  }

  @SubscribeMessage('finish-simulation')
  async handleFinishSimulation(client: Socket, data: { id: string }) {
    try {
      const simulation = await this.simulationService.finishSimulation(data.id);
      this.server.emit('simulation:updated', simulation);
    } catch (error) {
      client.emit('error', {
        message: error.message,
      });
    }
  }

  @SubscribeMessage('restart-simulation')
  async handleRestartSimulation(client: Socket, data: { id: string }) {
    try {
      const simulation = await this.simulationService.restartSimulation(data.id);
      this.server.emit('simulation:updated', simulation);
    } catch (error) {
      client.emit('error', {
        message: error.message,
      });
    }
  }

  @SubscribeMessage('get-simulation')
  async handleGetSimulation(client: Socket, data: { id: string }) {
    try {
      const simulation = await this.simulationService.getSimulation(data.id);
      client.emit('simulation:data', simulation);
    } catch (error) {
      client.emit('error', {
        message: error.message,
      });
    }
  }

  broadcastSimulationUpdate(simulation: Simulation) {
    this.server.emit('simulation:updated', simulation);
  }

  broadcastGoal(simulation: Simulation, match: Match, teamName: string) {
    this.server.emit('goal:scored', {
      simulationId: simulation.id,
      matchId: match.id,
      matchName: match.name,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      teamName,
      timestamp: new Date(),
    });
  }
}
