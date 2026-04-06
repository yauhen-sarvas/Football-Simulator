# Football Simulator Backend

A scalable Nest.js backend API for simulating football matches with real-time WebSocket updates.

## Features

- 🏟️ Simulate 3 predefined football matches:
  - Germany vs Poland
  - Brazil vs Mexico
  - Argentina vs Uruguay
- ⚡ Real-time score updates via WebSocket
- 🎯 Intelligent rate limiting (max 1 simulation per 5 seconds)
- ⏱️ 9-second match duration with random goal scoring
- 🔄 Start, finish, and restart simulations
- ✔️ Comprehensive input validation
- 🧪 100% test coverage with Jest

## Tech Stack

- **Framework**: Nest.js 10.x
- **Language**: TypeScript
- **Real-time**: Socket.io
- **Testing**: Jest + Supertest
- **Validation**: class-validator + class-transformer

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the backend root:

```env
PORT=3000
NODE_ENV=development
```

## Running the Application

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

## Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov
```

## API Endpoints

### Create Simulation
**POST /simulations**

Request body:
```json
{
  "name": "My Football Simulation"
}
```

Validation rules:
- Name must be 8-30 characters long
- Only alphanumeric characters and spaces allowed

Response:
```json
{
  "id": "uuid",
  "name": "My Football Simulation",
  "status": "idle",
  "matches": [...],
  "elapsedTime": 0,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Get Simulation
**GET /simulations/:id**

Returns the current state of a simulation.

### Get All Simulations
**GET /simulations**

Returns all simulations.

### Start Simulation
**POST /simulations/:id/start**

Starts a simulation. Will:
- Throw error if simulation is already running
- Throw error if called within 5 seconds of last start
- Begin 9-second timer
- Reset all team scores to 0
- One random goal per second

Response includes updated simulation state.

### Finish Simulation Manually
**POST /simulations/:id/finish**

Manually stops a running simulation before the 9 seconds complete.

Response includes final simulation state.

### Restart Simulation
**POST /simulations/:id/restart**

Resets simulation to idle state:
- Clears elapsed time
- Resets all scores to 0
- Removes start/finish timestamps

Response includes reset simulation state.

## WebSocket Events

### Client Emits

- `start-simulation`: `{ id: string }`
- `finish-simulation`: `{ id: string }`
- `restart-simulation`: `{ id: string }`
- `get-simulation`: `{ id: string }`

### Server Broadcasts

- `simulation:updated`: Full simulation object
- `goal:scored`: Goal details with team and match info
- `simulation:finished`: Simulation completion event
- `error`: Error messages

## Simulation Lifecycle

1. **Create**: Initialize simulation in IDLE state
2. **Start**: Begin 9-second timer, trigger goals randomly
3. **Running**: Loop scores every second, broadcast updates
4. **Finish**: Stop timer (manually or auto at 9s)
5. **Restart**: Reset to IDLE state

## Architecture

```
src/
├── modules/
│   ├── simulation/
│   │   ├── entities/           # Data models
│   │   ├── dto/               # Request/response DTOs
│   │   ├── simulation.service.ts    # Business logic
│   │   ├── simulation.controller.ts # HTTP endpoints
│   │   ├── simulation.gateway.ts    # WebSocket events
│   │   ├── simulation.module.ts     # Nest module
│   │   └── __tests__/         # Comprehensive tests
│   └── core/
│       ├── exceptions/         # Custom exceptions
│       └── decorators/         # Custom decorators
├── app.module.ts               # Root module
└── main.ts                     # Entry point
```

## Rate Limiting

The backend implements a 5-second rate limit on starting new simulations:

```typescript
// This succeeds
POST /simulations
POST /simulations/{id}/start

// This fails (within 5 seconds)
POST /simulations
```

The timer resets after 5 seconds from the last start attempt.

## Error Handling

The API uses standard HTTP status codes:

- `200 OK` - Successful request
- `400 Bad Request` - Validation error
- `404 Not Found` - Simulation not found
- `500 Internal Server Error` - Server error

Error response format:
```json
{
  "statusCode": 400,
  "message": "Cannot start simulations more than once per 5 seconds",
  "error": "Bad Request"
}
```

## Validation Examples

Valid simulation names:
- ✅ "Match Simulation 1"
- ✅ "Football Game 2024"
- ✅ "Test Match Number 123"

Invalid simulation names:
- ❌ "Short" (< 8 chars)
- ❌ "This is a very long simulation name that exceeds thirty characters" (> 30 chars)
- ❌ "Invalid@Name!" (special characters)
- ❌ "Name_With-Dash" (underscores and hyphens)

## Development Notes

- All timers are properly cleaned up on simulation restart/finish
- Goal scoring is truly random among all 6 teams
- WebSocket broadcasts to all connected clients
- In-memory storage using Map for high performance
- Type-safe throughout with strict TypeScript mode

## Future Enhancements

- Persistent database storage
- Multi-user session support
- Custom match configuration
- Advanced statistics and analytics
- Replay functionality
- Tournament mode

## License

MIT
