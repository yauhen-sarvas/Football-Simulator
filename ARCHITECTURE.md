# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Browser                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         React Application (TypeScript)              │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │  SimulationDashboard Component             │   │  │
│  │  │  └─ MatchCard (x3)                         │   │  │
│  │  │     ├─ Scoreboard                          │   │  │
│  │  │     ├─ StatusIndicator                     │   │  │
│  │  │     └─ SimulationControls                  │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  │                     ⬆️ ⬇️                              │  │
│  │         HTTP (REST) + WebSocket                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ⬆️
                              ⬇️
┌─────────────────────────────────────────────────────────────┐
│        Backend Server (Node.js + Nest.js)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           AppModule (Root Module)                    │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │   SimulationModule                          │    │  │
│  │  │  ┌──────────────────────────────────────┐  │    │  │
│  │  │  │ SimulationController (REST)          │  │    │  │
│  │  │  │ ├─ POST /simulations                 │  │    │  │
│  │  │  │ ├─ GET /simulations                  │  │    │  │
│  │  │  │ ├─ GET /simulations/:id              │  │    │  │
│  │  │  │ ├─ POST /simulations/:id/start       │  │    │  │
│  │  │  │ ├─ POST /simulations/:id/finish      │  │    │  │
│  │  │  │ └─ POST /simulations/:id/restart     │  │    │  │
│  │  │  └──────────────────────────────────────┘  │    │  │
│  │  │  ┌──────────────────────────────────────┐  │    │  │
│  │  │  │ SimulationGateway (WebSocket)        │  │    │  │
│  │  │  │ ├─ simulation:updated                │  │    │  │
│  │  │  │ ├─ goal:scored                       │  │    │  │
│  │  │  │ ├─ simulation:finished               │  │    │  │
│  │  │  │ └─ error                             │  │    │  │
│  │  │  └──────────────────────────────────────┘  │    │  │
│  │  │  ┌──────────────────────────────────────┐  │    │  │
│  │  │  │ SimulationService (Business Logic)   │  │    │  │
│  │  │  │ ├─ createSimulation()                │  │    │  │
│  │  │  │ ├─ startSimulation()                 │  │    │  │
│  │  │  │ ├─ finishSimulation()                │  │    │  │
│  │  │  │ ├─ restartSimulation()               │  │    │  │
│  │  │  │ └─ validateRateLimit()               │  │    │  │
│  │  │  └──────────────────────────────────────┘  │    │  │
│  │  │  ┌──────────────────────────────────────┐  │    │  │
│  │  │  │ In-Memory Data Store                 │  │    │  │
│  │  │  │ ├─ Map<id, Simulation>               │  │    │  │
│  │  │  │ ├─ lastSimulationStartTime           │  │    │  │
│  │  │  │ └─ Timers & Intervals                │  │    │  │
│  │  │  └──────────────────────────────────────┘  │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Creating a Simulation

```
Frontend                          Backend
  │                                 │
  ├─ Form Input: name               │
  ├─ Validate locally               │
  ├─ HTTP POST /simulations ────────→ SimulationController
  │                                 ├─ Validate DTO
  │                                 ├─ Call SimulationService
  │                                 ├─ Create Simulation
  │                                 ├─ Store in Map
  │  Response with Simulation ─────← 
  │  Update UI with new matches      │
  │                                 │
```

### Starting a Simulation

```
Frontend                          Backend
  │                                 │
  ├─ Click "Start" button           │
  ├─ Emit WebSocket event ─────────→ SimulationGateway
  │  'start-simulation' { id }       ├─ Validate rate limit
  │                                 ├─ Update status → RUNNING
  │                                 ├─ Start 9-second timer
  │                                 ├─ Every 1s: score goal
  │  Every 1s emit ─────────────────→ 'simulation:updated'
  │  'goal:scored' (team, match)     ├─ 'goal:scored'
  │  Update scores in UI             │
  │                                 ├─ After 9s: Auto-finish
  │  Emit 'simulation:finished' ────→
  │  Show completion                 │
  │                                 │
```

## Data Models

### Simulation Entity
```typescript
{
  id: string (UUID)
  name: string (8-30 chars, alphanumeric + spaces)
  status: 'idle' | 'running' | 'finished'
  matches: Match[] (3 matches)
  elapsedTime: number (0-9)
  createdAt: Date
  startedAt?: Date
  finishedAt?: Date
}
```

### Match Entity
```typescript
{
  id: string
  name: string (e.g., "Germany vs Poland")
  homeTeam: Team
  awayTeam: Team
}
```

### Team Entity
```typescript
{
  id: string
  name: string
  flagEmoji: string
  score: number
}
```

## Technology Stack

### Backend
- **Framework**: Nest.js 10.x
  - Modular architecture
  - Dependency injection
  - Decorators for routing
  
- **Runtime**: Node.js 20+
  - Non-blocking I/O
  - Event-driven
  
- **Real-time**: Socket.io
  - WebSocket communication
  - Automatic fallback
  - Broadcasting
  
- **Validation**: class-validator
  - Decorator-based validation
  - DTO pattern
  
- **Testing**: Jest
  - Unit testing
  - Mocking
  - Coverage reporting

### Frontend
- **Framework**: React 18+
  - Hooks-based
  - Functional components
  - Re-render optimization
  
- **Language**: TypeScript
  - Type safety
  - IDE support
  - Compile-time checks
  
- **Build Tool**: Vite
  - Fast dev server
  - Optimized build
  - Hot module replacement
  
- **Real-time**: socket.io-client
  - Client-side WebSocket
  - Automatic reconnection
  
- **HTTP**: Axios
  - Promise-based
  - Request/response interceptors
  
- **Styling**: Tailwind CSS
  - Utility-first CSS
  - Responsive design
  - Custom animations
