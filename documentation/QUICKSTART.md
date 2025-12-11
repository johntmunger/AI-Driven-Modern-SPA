# Quick Start Guide

## 🚀 Getting Started

This guide will help you get the full-stack Todo app running in minutes.

## Prerequisites

- Node.js v16 or higher
- npm (comes with Node.js)

## Installation & Running

1. **Install all dependencies:**
   ```bash
   npm install
   ```

2. **Start the application:**
   ```bash
   npm run dev
   ```

   This single command starts both:
   - 🔵 **Backend API** on http://localhost:3001
   - 🟣 **Frontend App** on http://localhost:5173

3. **Open your browser:**
   
   Navigate to http://localhost:5173 and start using the app!

## What Just Happened?

When you ran `npm run dev`:

1. ✅ The SQLite database was automatically created at `server/db/todos.db`
2. ✅ Database tables and indexes were initialized
3. ✅ Express server started listening on port 3001
4. ✅ Vite dev server started with hot module reload
5. ✅ API proxy was configured to forward `/api/*` requests to the backend

## Testing the Backend

You can test the backend API directly:

```bash
# Health check
curl http://localhost:3001/api/health

# Get all todos
curl http://localhost:3001/api/todos

# Create a todo
curl -X POST http://localhost:3001/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text":"Test todo from API"}'
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:client` | Start only the frontend (Vite) |
| `npm run dev:server` | Start only the backend (Express) |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |

## Project Structure

```
AIDD/
├── server/              # Backend API (Express + SQLite)
│   ├── db/             # Database files and initialization
│   ├── routes/         # API endpoints
│   └── index.js        # Server entry point
│
├── src/                # Frontend (Vue 3 + TypeScript)
│   ├── components/     # Vue components
│   ├── services/       # API service layer
│   └── types/          # TypeScript types
│
└── vite.config.ts      # Vite config with API proxy
```

## Features

✅ Full CRUD operations (Create, Read, Update, Delete)
✅ SQLite database persistence
✅ RESTful API with Express.js
✅ Real-time loading states
✅ Error handling with user feedback
✅ Optimistic UI updates
✅ Futuristic dark mode design
✅ Mobile-first responsive layout
✅ Smooth animations and transitions

## Troubleshooting

### Port Already in Use

If port 3001 or 5173 is already in use:

```bash
# For backend
PORT=3002 npm run dev:server

# For frontend
PORT=5174 npm run dev:client
```

### Database Issues

To reset the database, simply delete it:

```bash
rm server/db/todos.db
```

The database will be recreated automatically when you restart the server.

### Cannot Connect to Backend

1. Make sure the backend is running (check terminal output)
2. Verify it's listening on port 3001
3. Check that no firewall is blocking the connection

## Next Steps

- 📖 Read the full [README.md](readme.md) for detailed documentation
- 🔧 Check [server/README.md](server/README.md) for backend API reference
- 🎨 Explore the futuristic UI and animations
- 💡 Add your own features!

## Need Help?

- Check the console for error messages
- Review the API logs in the terminal
- Ensure all dependencies are installed
- Try restarting both servers

---

**Happy coding! 🎉**

