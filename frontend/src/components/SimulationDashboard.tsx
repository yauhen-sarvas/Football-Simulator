import React, { useState } from 'react';
import { MatchCard } from './MatchCard';
import { useSimulation } from '../hooks/useSimulation';
import { useSimulationAPI } from '../hooks/useSimulationAPI';

export const SimulationDashboard: React.FC = () => {
  const [simulationName, setSimulationName] = useState('');
  const [validationError, setValidationError] = useState<string>('');

  const { simulations, loading, error, isConnected, goals, clearError, addSimulation } = useSimulation();
  const { createSimulation, startSimulation, finishSimulation, restartSimulation, loading: apiLoading } =
    useSimulationAPI();

  // Validate simulation name
  const validateName = (name: string): boolean => {
    if (!name) {
      setValidationError('Simulation name is required');
      return false;
    }
    if (name.length < 8) {
      setValidationError('Name must be at least 8 characters');
      return false;
    }
    if (name.length > 30) {
      setValidationError('Name must be at most 30 characters');
      return false;
    }
    if (!/^[a-zA-Z0-9 ]*$/.test(name)) {
      setValidationError('Only alphanumeric characters and spaces allowed');
      return false;
    }
    return true;
  };

  const handleCreateSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!validateName(simulationName)) {
      return;
    }

    const simulation = await createSimulation({ name: simulationName });
    if (simulation) {
      addSimulation(simulation);
      setSimulationName('');
    }
  };

  const hasRecentGoal = (simulationId: string, matchId: string) => {
    return goals.some((g) => g.simulationId === simulationId && g.matchId === matchId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-center">
            ⚽ Football Simulator
          </h1>
          <p className="text-gray-300 text-center">
            Create and manage live football match simulations
          </p>

          {/* Connection Status */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-300">
              {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </span>
          </div>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 text-red-200 rounded-lg flex items-center justify-between">
            <span>❌ {error}</span>
            <button onClick={clearError} className="text-red-200 hover:text-red-100">
              ✕
            </button>
          </div>
        )}

        {/* Create Simulation Form */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Simulation</h2>
          <form onSubmit={handleCreateSimulation} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Simulation Name *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={simulationName}
                  onChange={(e) => {
                    setSimulationName(e.target.value);
                    setValidationError('');
                  }}
                  placeholder="e.g., World Cup Tournament"
                  maxLength={30}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading || apiLoading}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {loading || apiLoading ? '⏳ Creating...' : '➕ Create'}
                </button>
              </div>
              <div className="flex justify-between items-start mt-2">
                <p className="text-xs text-gray-500">
                  8-30 characters, alphanumeric + spaces only
                </p>
                <span className="text-xs text-gray-400 font-mono">
                  {simulationName.length}/30
                </span>
              </div>
              {validationError && <p className="text-xs text-red-500 mt-1">❌ {validationError}</p>}
            </div>
          </form>
        </div>

        {/* Simulations Grid */}
        {simulations.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚽</div>
            <p className="text-gray-400 text-lg">No simulations yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {simulations.map((simulation) => (
              <MatchCard
                key={simulation.id}
                simulation={simulation}
                onStart={startSimulation}
                onFinish={finishSimulation}
                onRestart={restartSimulation}
                loading={apiLoading}
                hasRecentGoal={(matchId: string) => hasRecentGoal(simulation.id, matchId)}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>🏟️ Real-time football match simulator • WebSocket powered • Built with React & Nest.js</p>
        </div>
      </div>
    </div>
  );
};
