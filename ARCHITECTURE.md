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

## Key Features

### Rate Limiting
- Implementation: Time-window based
- Window: Last simulation start time
- Limit: 5 seconds
- Scope: Global (all simulations)

### Goal Scoring Algorithm
```
Every 1 second (for 9 seconds):
  1. Select random match (3 total)
  2. Select random team in match (2 teams)
  3. Increment team score
  4. Broadcast goal:scored event
  5. Broadcast simulation:updated event
```

### Timer Management
- Cleanup: On simulation finish/restart
- Interval: 1-second intervals
- Duration: 9 seconds max
- Auto-finish: After 9 seconds
- Manual finish: User can stop early

### WebSocket Broadcasting
- Pattern: Server emits to all clients
- Events: simulation:updated, goal:scored
- Payload: Full simulation state
- Connection: Persistent, auto-reconnect

## State Management

### Backend State
```
Map {
  'sim-id-1' → { ...Simulation },
  'sim-id-2' → { ...Simulation },
  ...
}

lastSimulationStartTime: number
simulationTimers: Map { 'sim-id' → NodeJS.Timeout }
simulationGoalIntervals: Map { 'sim-id' → NodeJS.Timeout }
```

### Frontend State
```
simulations: Simulation[]
loading: boolean
error: string | null
isConnected: boolean
goals: GoalEvent[] (recent goals)
```

## Sequence Diagrams

### Simulation Lifecycle

```
[IDLE] ──start──> [RUNNING] ──finish/timeout──> [FINISHED]
                      ⬆️
                   restart
                      │
                    [IDLE]
```

### Goal Scoring Flow

```
useSimulation Hook (Auto-increment elapsedTime)
        ⬆️
WebSocket receives 'goal:scored'
        ⬆️
SimulationGateway broadcasts
        ⬆️
SimulationService scores goal
        ⬆️
Timer fires every 1 second
        ⬆️
Simulation running
```

## Performance Considerations

### Backend Optimization
- In-memory storage (O(1) lookups)
- Event-driven WebSocket (vs polling)
- Timer cleanup (prevent memory leaks)
- Lightweight validation

### Frontend Optimization
- Component memoization
- State batching
- Efficient re-renders
- WebSocket debouncing

## Scalability Paths

### Database Integration
Replace Map with PostgreSQL:
- Persistent storage
- Multi-instance compatibility
- Historical data

### Caching Layer
Add Redis:
- Cache frequent queries
- Distributed sessions
- Pub/Sub for multi-server

### Message Queue
Add Bull/RabbitMQ:
- Async job processing
- Distributed workload
- Resilience

## Security Considerations

### Input Validation
- DTO validation in backend
- Regex pattern matching
- Length constraints
- Type checking

### Error Handling
- No stack traces in production
- Meaningful error messages
- Validation error details
- Error logging

### CORS
- Whitelist frontend origin
- Specific methods allowed
- Credentials if needed

## Testing Strategy

### Backend Tests
- Unit: Service business logic
- Integration: Controller + Service
- Gateway: WebSocket event handling
- Coverage: 90%+ target

### Frontend Tests (Future)
- Component: Rendering and props
- Hook: State and effects
- Service: API and WebSocket
- Integration: Full flow

## Deployment Architecture

```
┌──────────────────────┐
│   Developer Machine   │
│  ┌────────────────┐   │
│  │ npm run dev    │   │
│  │ (local dev)    │   │
│  └────────────────┘   │
└──────────────────────┘

┌──────────────────────────────────────────────┐
│        Production Deployment                 │
│  ┌──────────────────────────────────────┐   │
│  │ Backend Container                    │   │
│  │ • Node.js runtime                    │   │
│  │ • Nest.js server                     │   │
│  │ • Port 3000                          │   │
│  └──────────────────────────────────────┘   │
│  ┌──────────────────────────────────────┐   │
│  │ Frontend Container                   │   │
│  │ • Node.js runtime (Vite preview)    │   │
│  │ • React build                        │   │
│  │ • Port 5173                          │   │
│  └──────────────────────────────────────┘   │
│  ┌──────────────────────────────────────┐   │
│  │ Load Balancer / Reverse Proxy        │   │
│  │ (e.g., Nginx)                        │   │
│  └──────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
```

---

For detailed implementation, see:
- [backend/README.md](backend/README.md)
- [frontend/README.md](frontend/README.md)
- Source code comments
