# Getting Started - Football Simulator

A comprehensive guide to set up and run the Football Simulator application.

## Prerequisites

Before you begin, ensure you have installed:

- **Node.js**: v16 or higher
  - Download from https://nodejs.org/
  - Verify: `node --version`
  
- **npm**: v8 or higher (comes with Node.js)
  - Verify: `npm --version`

- **Git** (optional, for version control)
  - https://git-scm.com/

## Quick Start (5 minutes)

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Start Backend

Open a terminal and run:
```bash
cd backend
npm run start:dev
```

You should see:
```
Application is running on: http://localhost:3000
```

### 3. Start Frontend

Open a new terminal and run:
```bash
cd frontend
npm run dev
```

You should see:
```
Local:   http://localhost:5173/
```

### 4. Open in Browser

Navigate to `http://localhost:5173` and start creating simulations!

## Step-by-Step Setup Guide

### Backend Setup in Detail

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install all dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run start:dev
   ```

4. **Verify it's running**
   - Check console for: `Application is running on: http://localhost:3000`
   - Open http://localhost:3000/simulations in browser (should show `[]`)

5. **Test an endpoint**
   ```bash
   curl -X GET http://localhost:3000/simulations
   ```

### Frontend Setup in Detail

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install all dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Verify it's running**
   - Open http://localhost:5173 in browser
   - You should see the Football Simulator dashboard
   - Check browser console (F12) for any errors

5. **Test WebSocket connection**
   - Open browser DevTools (F12)
   - Go to Network tab, filter by WS
   - You should see a WebSocket connection to `ws://localhost:3000`

## Testing the Application

### 1. Create a Simulation

1. Enter a simulation name (8-30 characters, alphanumeric + spaces)
   - Example: `World Cup 2024`
2. Click "Create" button
3. You should see 3 match cards appear

### 2. Start a Simulation

1. Click "▶️ Start" on any idle match
2. The status should change from "IDLE" to "RUNNING"
3. The timer should start counting (0-9 seconds)
4. Watch for goals being scored randomly every second

### 3. View Live Updates

1. Open DevTools (F12) > Network > WS
2. You'll see WebSocket events:
   - `simulation:updated` - When simulation state changes
   - `goal:scored` - When a goal is scored
   - Match cards update in real-time

### 4. Control Simulations

- **Finish Early**: Click "⏹️ Finish" to stop before 9 seconds
- **Restart**: Click "🔄 Restart" to reset and play again

## Running Tests

### Backend Tests

```bash
cd backend

# Run all tests
npm run test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Generate coverage report
npm run test:cov
```

### Expected Test Output

```
PASS  src/modules/simulation/__tests__/simulation.service.spec.ts
PASS  src/modules/simulation/__tests__/simulation.controller.spec.ts
PASS  src/modules/simulation/__tests__/simulation.gateway.spec.ts

Test Suites: 3 passed, 3 total
Tests:       45 passed, 45 total
```

## Common Issues and Solutions

### Issue: Port 3000 Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Issue: WebSocket Connection Failed

**Symptoms:**
- Browser shows "🔴 Disconnected"
- Console errors about WebSocket

**Solutions:**
1. Ensure backend is running on port 3000
2. Check backend logs for errors
3. Verify firewall isn't blocking port 3000
4. Restart both backend and frontend

### Issue: npm install Fails

```
npm ERR! code EACCES
```

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Frontend Shows Blank Page

**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Check DevTools console for errors
3. Ensure backend is running
4. Restart frontend: `npm run dev`

## File Structure Tour

```
football-simulator/
├── backend/
│   ├── src/
│   │   ├── modules/simulation/
│   │   │   ├── simulation.service.ts     ← Main business logic
│   │   │   ├── simulation.controller.ts  ← HTTP endpoints
│   │   │   ├── simulation.gateway.ts     ← WebSocket events
│   │   │   ├── entities/                 ← Data models
│   │   │   ├── dto/                      ← Request/response schemas
│   │   │   └── __tests__/                ← Test files
│   │   ├── app.module.ts                 ← Root configuration
│   │   └── main.ts                       ← Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SimulationDashboard.tsx   ← Main component
│   │   │   ├── MatchCard.tsx             ← Match display
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   ├── useSimulation.ts          ← State management
│   │   │   └── useSimulationAPI.ts       ← API calls
│   │   ├── services/
│   │   │   ├── websocketService.ts       ← WebSocket
│   │   │   └── api.ts                    ← HTTP client
│   │   ├── types/
│   │   │   └── simulation.ts             ← TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## API Examples

### Via cURL

```bash
# Create a simulation
curl -X POST http://localhost:3000/simulations \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Match 001"}'

# Get all simulations
curl http://localhost:3000/simulations

# Get specific simulation
curl http://localhost:3000/simulations/{id}

# Start a simulation (via WebSocket in frontend)
# POST /simulations/{id}/start
```

### Building & Production

**Backend Production Build:**
```bash
cd backend
npm run build
npm run start:prod
```

**Frontend Production Build:**
```bash
cd frontend
npm run build
npm run preview
```

## Environment Variables

### Backend Configuration

Create `backend/.env`:
```env
PORT=3000
NODE_ENV=development
```

### Frontend Configuration

Create `frontend/.env`:
```env
REACT_APP_BACKEND_URL=http://localhost:3000
REACT_APP_API_URL=http://localhost:3000
```

## Next Steps

1. ✅ **Get it running** - Follow steps above
2. 📖 **Read the docs** - Check [README.md](README.md)
3. 🔧 **Explore code** - Start in `SimulationDashboard.tsx`
4. 🧪 **Run tests** - Execute `npm run test`
5. 🚀 **Deploy** - Follow [DEPLOYMENT.md](DEPLOYMENT.md)

## Development Tips

### Hot Reload
Both backend and frontend support hot reload:
- Save backend files → automatically restarts
- Save frontend files → automatically refreshes browser

### DevTools

**Browser DevTools (F12)**
- Console: View logs and errors
- Network: Monitor API calls and WebSocket
- Sources: Debug TypeScript code
- Elements: Inspect DOM and Tailwind classes

**VS Code Debugger**
Backend debugging in VS Code:
```json
{
  "type": "node",
  "request": "attach",
  "name": "Attach to Node",
  "port": 9229
}
```

## Troubleshooting Checklist

- [ ] Node.js v16+ installed? `node --version`
- [ ] npm v8+ installed? `npm --version`
- [ ] Dependencies installed? `npm install`
- [ ] Backend running on 3000? http://localhost:3000
- [ ] Frontend running on 5173? http://localhost:5173
- [ ] WebSocket connected? (Check browser console)
- [ ] No port conflicts? (Check with netstat/lsof)
- [ ] Firewall allowing ports? (Check firewall settings)
- [ ] Fresh browser cache? (Ctrl+Shift+Delete)

## Need Help?

1. Check this guide again for solutions
2. Review [backend/README.md](backend/README.md)
3. Review [frontend/README.md](frontend/README.md)
4. Check browser console for error messages
5. Run backend with `-debug` flag
6. Verify all services are running

## Success Criteria

You'll know everything is working when:

✅ Backend shows: `Application is running on: http://localhost:3000`  
✅ Frontend shows: `http://localhost:5173/`  
✅ Browser shows Football Simulator dashboard  
✅ Connection status shows 🟢 Connected  
✅ Can create simulations  
✅ Can start/finish/restart matches  
✅ Live scores update in real-time  
✅ All tests pass: `npm run test`  

---

**Happy coding! ⚽**

Need more help? Check the comprehensive README.md files in each directory!
