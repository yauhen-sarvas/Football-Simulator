# Football Simulator

## Deployment Guide

### Local Development

1. **Prerequisites**
   ```bash
   Node.js 16+ 
   npm 8+
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

3. **Frontend Setup** (in new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Open http://localhost:5173

### Production Build

#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

### Environment Variables

Create `.env` files:

**backend/.env**
```env
PORT=3000
NODE_ENV=production
```

**frontend/.env**
```env
REACT_APP_BACKEND_URL=http://api.example.com
REACT_APP_API_URL=http://api.example.com
```

### Available Commands

#### Backend
```bash
npm run start:dev      # Development mode
npm run start:prod     # Production mode
npm run build          # Build TypeScript
npm run test           # Run tests
npm run test:cov       # Coverage report
npm run lint           # Lint code
```

#### Frontend
```bash
npm run dev           # Development server
npm run build         # Build for production
npm run preview       # Preview production build
npm run type-check    # TypeScript check
npm run lint          # Lint code
```

### Troubleshooting

**Backend won't start:**
- Ensure port 3000 is available
- Check Node version: `node --version`
- Clear node_modules: `rm -rf node_modules && npm install`

**Frontend won't connect:**
- Verify backend is running and accessible
- Check URL in `src/services/websocketService.ts`
- Open browser console for WebSocket errors
- Verify CORS is enabled on backend

**Tests failing:**
- Clear cache: `npm run test -- --clearCache`
- Reinstall: `rm -rf node_modules && npm install`
- Check Node version compatibility

### Performance Tips

- Use production builds for deployment
- Enable gzip compression on server
- Set up caching headers
- Monitor WebSocket connection health
- Use environment variables for sensitive data

### Security Best Practices

- Never commit .env files
- Use HTTPS in production
- Validate all inputs
- Rate limit API endpoints
- Implement authentication when scaling
- Use environment-based configuration

## License

MIT
