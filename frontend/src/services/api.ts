import axios, { AxiosInstance } from 'axios';
import { Simulation, SimulationFormData } from '../types/simulation';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async createSimulation(data: SimulationFormData): Promise<Simulation> {
    try {
      const response = await this.api.post<Simulation>('/simulations', data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to create simulation',
      );
    }
  }

  async getSimulation(id: string): Promise<Simulation> {
    try {
      const response = await this.api.get<Simulation>(`/simulations/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to get simulation',
      );
    }
  }

  async getAllSimulations(): Promise<Simulation[]> {
    try {
      const response = await this.api.get<Simulation[]>('/simulations');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to get simulations',
      );
    }
  }

  async startSimulation(id: string): Promise<Simulation> {
    try {
      const response = await this.api.post<Simulation>(`/simulations/${id}/start`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to start simulation',
      );
    }
  }

  async finishSimulation(id: string): Promise<Simulation> {
    try {
      const response = await this.api.post<Simulation>(`/simulations/${id}/finish`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to finish simulation',
      );
    }
  }

  async restartSimulation(id: string): Promise<Simulation> {
    try {
      const response = await this.api.post<Simulation>(`/simulations/${id}/restart`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to restart simulation',
      );
    }
  }
}

export default new ApiService();
