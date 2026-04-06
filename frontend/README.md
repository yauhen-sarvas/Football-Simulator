# Football Simulator Frontend

A modern React dashboard for simulating and viewing live football match results with real-time WebSocket updates.

## Features

- 🏟️ Display 3 live football matches
- ⚡ Real-time score updates via WebSocket
- 🎮 Intuitive simulation controls (Start, Finish, Restart)
- 🔔 Visual feedback for goal scoring
- 📊 Live elapsed time tracking
- ✔️ Input validation with helpful error messages
- 📱 Fully responsive design
- 🎨 Beautiful Tailwind CSS styling

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Real-time**: socket.io-client
- **HTTP Client**: Axios

## Installation

```bash
npm install
```

## Configuration

The frontend connects to the backend at `http://localhost:3000`. Modify the API server address in [services/api.ts](src/services/api.ts) if needed.

## Running the Application

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

### Type Checking

```bash
npm run type-check
```

## Project Structure

```
src/
├── components/
│   ├── SimulationDashboard.tsx    # Main dashboard component
│   ├── MatchCard.tsx              # Individual match display
│   ├── SimulationControls.tsx     # Control buttons and status
│   ├── Scoreboard.tsx             # Score display
│   └── StatusIndicator.tsx        # Status/progress indicator
├── hooks/
│   ├── useSimulation.ts          # Simulation state management
│   └── useSimulationAPI.ts       # API interaction hook
├── services/
│   ├── websocketService.ts       # WebSocket connection management
│   └── api.ts                    # HTTP API calls
├── types/
│   └── simulation.ts             # TypeScript interfaces
├── styles/
│   └── index.css                 # Global styles
├── App.tsx                       # Root component
├── App.css                       # App-level styles
└── main.tsx                      # Entry point
```

## Usage Guide

### Creating a Simulation

1. Enter a simulation name (8-30 alphanumeric characters)
2. Click "Create Simulation"
3. The simulation appears in idle state

### Starting a Simulation

1. Click "Start Simulation" on any idle simulation
2. The timer begins counting (0-9 seconds)
3. Random goals are scored every second
4. Live updates appear in real-time

### Controlling Simulations

- **Start**: Begin an idle simulation
- **Finish**: Stop a running simulation early
- **Restart**: Reset a finished simulation back to idle

### Viewing Live Updates

- Match scores update in real-time
- Goal animation provides visual feedback
- Status indicator shows running/finished state
- Elapsed time displays countdown

## Component Details

### SimulationDashboard
Main component that orchestrates the entire interface. Manages simulation creation form and displays all matches.

### MatchCard
Displays individual match information:
- Team names with flag emojis
- Current scores
- Dynamic background color based on status

### Scoreboard
Shows team-specific score for a match with large, readable numbers.

### StatusIndicator
Visual indicator displaying:
- Running state (animated timer)
- Finished state (completion badge)
- Elapsed time (0-9 seconds)

### SimulationControls
Control buttons with:
- Action buttons (Start/Finish/Restart)
- Dynamic enablement based on simulation state
- Loading indicators during API calls

## WebSocket Events

### Receiving Events

```typescript
// Simulation state updated
socket.on('simulation:updated', (simulation) => {
  // Update UI with new state
});

// Goal scored
socket.on('goal:scored', (data) => {
  // Animate goal celebration
  // Update match scores
});

// Simulation finished
socket.on('simulation:finished', (simulation) => {
  // Show completion message
});

// Errors
socket.on('error', (error) => {
  // Display error message
});
```

### Emitting Events

```typescript
// Start a simulation
socket.emit('start-simulation', { id: simulationId });

// Finish a simulation
socket.emit('finish-simulation', { id: simulationId });

// Restart a simulation
socket.emit('restart-simulation', { id: simulationId });

// Get simulation data
socket.emit('get-simulation', { id: simulationId });
```

## Validation Rules

### Simulation Name

- **Length**: 8-30 characters (inclusive)
- **Characters**: Alphanumeric (a-z, A-Z, 0-9) and spaces only
- **Examples**:
  - ✅ "Match Simulation 1"
  - ✅ "Football Game 2024"
  - ❌ "Short" (too short)
  - ❌ "Invalid@Name!" (special characters)

## Real-time Updates

The frontend automatically:
- Connects to WebSocket on mount
- Reconnects on connection loss
- Subscribes to simulation updates
- Displays live score changes
- Shows goal animations
- Updates elapsed time every second

## Error Handling

The application handles and displays:
- Validation errors
- Network errors
- WebSocket connection failures
- API errors with helpful messages

Error messages appear inline with the form and in individual match cards.

## Responsive Design

The dashboard is fully responsive:
- **Desktop**: Grid layout with 3 columns
- **Tablet**: 2 column layout
- **Mobile**: Single column layout with scrolling

## Accessibility Features

- Semantic HTML elements
- ARIA labels where appropriate
- Keyboard-friendly interactions
- Color contrast compliance

## Performance Optimizations

- Memoized components to prevent unnecessary re-renders
- Efficient state updates
- WebSocket message debouncing
- Lazy CSS loading with Tailwind

## Development Tips

### Adding a New Match

Edit [src/types/simulation.ts](src/types/simulation.ts) to modify the match interface and update [SimulationDashboard.tsx](src/components/SimulationDashboard.tsx) to display additional matches.

### Customizing Styling

Update [tailwind.config.js](tailwind.config.js) to modify theme colors and animations.

### Debugging

Enable debug logging in [websocketService.ts](src/services/websocketService.ts):

```typescript
const socket = io(BACKEND_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  debug: true, // Enable debug mode
});
```

## Troubleshooting

### WebSocket Connection Fails

- Ensure backend is running on `http://localhost:3000`
- Check browser console for connection errors
- Verify CORS is enabled on backend

### No Goal Updates

- Check WebSocket connection status
- Verify simulation is in RUNNING state
- Check browser console for errors

### Form Validation Not Working

- Clear browser cache
- Verify TypeScript types are correct
- Check class-validator in backend

## Future Enhancements

- Tournament bracket visualization
- Match replay functionality
- Advanced statistics dashboard
- Player performance metrics
- Multi-language support
- Dark/light theme toggle
- Match result history
- Custom team selection

## License

MIT
