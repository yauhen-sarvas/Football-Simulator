# Football Simulator

A complete full-stack football match simulator application with real-time WebSocket updates built with Nest.js backend and React frontend.

## 🎯 Project Overview

Football Simulator is a scalable application that simulates live football matches with:
- **3 Predefined Matches**: Germany vs Poland, Brazil vs Mexico, Argentina vs Uruguay
- **Real-time Updates**: WebSocket-powered live score updates
- **Simulation Lifecycle**: Start, finish, and restart matches
- **Smart Rate Limiting**: Prevent API abuse with intelligent rate limiting
- **Comprehensive Testing**: Full test coverage on backend
- **Responsive Design**: Works beautifully on all devices

## 📋 Features

### Backend Features
✅ TypeScript-based Nest.js API  
✅ WebSocket real-time communication  
✅ In-memory data storage  
✅ Input validation with class-validator  
✅ Rate limiting (1 simulation per 5 seconds)  
✅ Comprehensive Jest test suite  
✅ CORS support for frontend integration  
✅ Clean modular architecture  

### Frontend Features
✅ React 18+ with TypeScript  
✅ Real-time WebSocket connection  
✅ Live score updates and animations  
✅ Form validation with helpful feedback  
✅ Fully responsive design  
✅ Beautiful Tailwind CSS styling  
✅ Automatic reconnection handling  
✅ Visual goal-scoring feedback  

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

The backend API will be available at `http://localhost:3000`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## 🐳 Docker Setup

Run both services with Docker Compose:

```bash
docker-compose up --build
```

- Backend: http://localhost:3000
- Frontend: http://localhost:5173

## 📁 Project Structure

```
football-simulator/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── simulation/        # Core simulation module
│   │   │   └── core/              # Cross-cutting concerns
│   │   ├── app.module.ts          # Root module
│   │   └── main.ts                # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   └── README.md                  # Backend documentation
│
├── frontend/
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── services/              # API and WebSocket
│   │   ├── types/                 # TypeScript interfaces
│   │   ├── styles/                # Global styles
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── README.md                  # Frontend documentation
│
├── docker-compose.yml
└── README.md                      # This file
```

## 🔌 API Documentation

### REST Endpoints

#### Create Simulation
```http
POST /simulations
Content-Type: application/json

{
  "name": "My Football Simulation"
}
```

**Validation Rules:**
- Name: 8-30 characters, alphanumeric + spaces only

#### Get Simulation
```http
GET /simulations/:id
```

#### Get All Simulations
```http
GET /simulations
```

#### Start Simulation
```http
POST /simulations/:id/start
```

#### Finish Simulation
```http
POST /simulations/:id/finish
```

#### Restart Simulation
```http
POST /simulations/:id/restart
```

### WebSocket Events

**Client emits:**
- `start-simulation`: { id: string }
- `finish-simulation`: { id: string }
- `restart-simulation`: { id: string }
- `get-simulation`: { id: string }

**Server broadcasts:**
- `simulation:updated`: Full simulation state
- `goal:scored`: Goal event details
- `simulation:finished`: Completion notification
- `error`: Error messages

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov
```

Test files include:
- ✅ Service tests (business logic)
- ✅ Controller tests (HTTP endpoints)
- ✅ Gateway tests (WebSocket events)

## 🔧 Development

### Backend Development

```bash
cd backend

# Start in watch mode
npm run start:dev

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

### Frontend Development

```bash
cd frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📊 Simulation Lifecycle

1. **Create**: Initialize simulation (IDLE state)
2. **Start**: Begin 9-second timer (RUNNING state)
3. **Goal**: Random team scores every second
4. **Finish**: Stop simulation (FINISHED state)
   - Can be manual or automatic after 9 seconds
5. **Restart**: Reset to IDLE with scores cleared

## 🌍 How It Works

### Rate Limiting
- Max 1 simulation start per 5 seconds
- Prevents API abuse
- Enforced on the 5-second window

### Goal Scoring
- Every 1 second during the 9-second simulation
- Random team selected from all 6 teams
- Score incremented immediately
- Broadcast to all connected clients

### WebSocket Broadcasting
- All connected clients receive live updates
- Automatic reconnection on disconnect
- Real-time score synchronization

## 🎨 UI/UX Features

- **Responsive Grid Layout**: 3 columns on desktop, 2 on tablet, 1 on mobile
- **Live Animations**: Goal scoring animations and status indicators
- **Real-time Timer**: Displays elapsed time (0-9 seconds)
- **Status Badges**: Visual indicators for running/finished/idle states
- **Error Feedback**: Inline validation and error messages
- **Loading States**: Button states during API calls
- **Dark Theme**: Eye-friendly dark gradient interface

## 🔐 Validation Rules

### Simulation Name
- ✅ Length: 8-30 characters
- ✅ Characters: a-z, A-Z, 0-9, spaces
- ❌ Special characters not allowed
- ❌ Numbers cannot exceed length requirements

### Examples

Valid names:
- "World Cup 2024"
- "Football Match 1"
- "Test Simulation 123"

Invalid names:
- "Short" (< 8 chars)
- "This name is way too long to be valid for simulation" (> 30 chars)
- "Invalid@Name!" (special characters)

## 📦 Dependencies

### Backend
- `@nestjs/common`: Core framework
- `@nestjs/platform-socket.io`: WebSocket support
- `class-validator`: Input validation
- `class-transformer`: DTO transformation

### Frontend
- `react`: UI library
- `socket.io-client`: WebSocket client
- `axios`: HTTP client
- `tailwindcss`: Utility-first CSS
- `vite`: Build tool

## 🚨 Error Handling

The application handles and displays:
- Validation errors (form submission)
- Network errors (API failures)
- WebSocket connection issues
- Business logic errors (rate limiting, state validation)

Error messages are user-friendly and provide guidance for resolution.

## 💡 Best Practices Implemented

- **Type Safety**: Strict TypeScript throughout
- **Modular Architecture**: Separation of concerns
- **Comprehensive Testing**: Full test coverage
- **Clean Code**: Readable and maintainable
- **Performance**: Optimized re-renders and updates
- **Security**: Input validation and sanitization
- **Scalability**: Ready for database integration
- **Documentation**: Inline comments and README files

## 🎓 Learning Opportunities

This project demonstrates:
- Nest.js modular architecture
- WebSocket implementation with Socket.io
- React hooks and state management
- TypeScript advanced features
- Tailwind CSS responsive design
- Jest unit testing
- Docker containerization
- CORS and REST API design

## 🔄 Future Enhancements

- [ ] Database persistence (PostgreSQL)
- [ ] User authentication
- [ ] Match history and replays
- [ ] Advanced statistics
- [ ] Player performance tracking
- [ ] Tournament bracket support
- [ ] Custom team selection
- [ ] Multi-language support
- [ ] Dark/light theme toggle
- [ ] Mobile app (React Native)

## 📝 Environment Variables

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:3000
REACT_APP_API_URL=http://localhost:3000
```

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

Football Simulator - A comprehensive demo application showcasing modern full-stack development practices.

## 🆘 Support

For issues, questions, or suggestions:
1. Check the backend [README.md](backend/README.md)
2. Check the frontend [README.md](frontend/README.md)
3. Review the source code comments
4. Check WebSocket connection status in browser console

## 📚 Additional Resources

- [Nest.js Documentation](https://docs.nestjs.com)
- [React Documentation](https://react.dev)
- [Socket.io Documentation](https://socket.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Happy Simulating! ⚽**
