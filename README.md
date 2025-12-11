# Vuejs 3 Modern Todo App

Full-stack todo application with Vuejs 3 frontend and Express.js backend, featuring SQLite database persistence.

## 🚀 <a href="https://vuejs-aidd-todo-app.onrender.com/" target="_blank" rel="noopener noreferrer">Live Demo</a>

**Try it now:** <a href="https://vuejs-aidd-todo-app.onrender.com/" target="_blank" rel="noopener noreferrer">https://vuejs-aidd-todo-app.onrender.com/</a>

> **Note:** The app is hosted on Render's free tier and may take 30-60 seconds to wake up on first load.

## Features

### Core Functionality

- ✅ Add new todos with intuitive input
- ✅ Mark todos as complete/incomplete with animated checkboxes
- ✅ Delete todos with smooth fade-out animation
- ✅ Filter todos (All, Completed) with visual feedback
- 💾 **SQLite Database Persistence** - All todos saved to database
- 🔄 **RESTful API** - Express.js backend with proper error handling
- ⚡ **Optimistic Updates** - Instant UI feedback with background sync

### Design & UX

- 🎨 **Futuristic Dark Mode** - Sleek glass morphism design with gradient accents
- 📱 **Mobile-First Responsive** - Optimized for all screen sizes from mobile to desktop
- ✨ **Smooth Animations** - Fade, slide, and scale transitions throughout
- 🎯 **Interactive Hover Effects** - Responsive feedback on all interactive elements
- 🌟 **Ambient Background** - Animated gradient orbs for depth
- 💫 **Micro-interactions** - Button rotations, icon scaling, glow effects
- 🎭 **Glass Morphism** - Modern frosted glass aesthetic with backdrop blur
- 🔮 **Gradient Accents** - Dynamic blue-to-purple color schemes

### Technical Features

- 🔷 Fully typed with TypeScript
- ⚡ Built with Vue 3 Composition API
- 🎪 Icon-rich interface with Iconify
- 🎨 Advanced Tailwind CSS styling
- 📦 Lightweight and performant
- 🗄️ SQLite database with better-sqlite3
- 🔌 RESTful API architecture
- 🔄 Real-time error handling and loading states

## Tech Stack

### Frontend

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Iconify** - Comprehensive icon library with Material Design Icons

### Backend

- **Express.js** - Web framework for Node.js
- **SQLite** - Lightweight embedded database
- **better-sqlite3** - Fast, synchronous SQLite client
- **CORS** - Cross-Origin Resource Sharing support

### Code Quality & Formatting

- **Prettier** - Automatic code formatting on save
- **ESLint** - Code linting with TypeScript and Vue support
- **eslint-config-prettier** - Zero conflicts between ESLint and Prettier
- **Format-on-save** - Automatic formatting and linting in VS Code/Cursor

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start both frontend and backend servers:

```bash
npm run dev
```

This will start:

- **Backend API** on `http://localhost:3001`
- **Frontend App** on `http://localhost:5173`

3. Open your browser and navigate to `http://localhost:5173`

### Code Formatting & Linting

This project is configured with **Prettier** and **ESLint** for automatic code formatting and linting:

#### Automatic (on save)

- Format-on-save is enabled for `.ts`, `.tsx`, and `.vue` files
- Prettier formats your code (spacing, quotes, semicolons, etc.)
- ESLint auto-fixes linting issues (unused imports, etc.)

#### Manual Commands

```bash
# Format all files
npm run format

# Check formatting without changes
npm run format:check

# Lint all files
npm run lint

# Lint and auto-fix issues
npm run lint:fix
```

#### Configuration Files

- `.prettierrc` - Prettier settings (double quotes, 2-space tabs, etc.)
- `.prettierignore` - Files to exclude from formatting
- `eslint.config.js` - ESLint rules with TypeScript & Vue support
- `.vscode/settings.json` - Editor settings for format-on-save

#### Custom Commands

The `.claude/commands/` directory contains AI-assisted documentation. Ask Claude to use these commands:

- `@project-overview` - Complete project explanation and architecture
- `@commits` - Conventional Commits user guide
- `@changelog-architecture` - Technical system deep-dive
- `@prettier` - Prettier setup guide
- `@eslint` - ESLint configuration guide

**Learn more:** See [.claude/commands/README.md](.claude/commands/README.md) for how to use Claude commands

## Commit Message Format

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automatic changelog generation.

### Format

```
<type>(<scope>): <subject>
```

### Common Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Test changes
- `chore` - Build/tooling changes

### Examples

```bash
# Feature
git commit -m "feat(todos): add dark mode toggle"

# Bug fix
git commit -m "fix(api): resolve database timeout"

# Documentation
git commit -m "docs(readme): update installation steps"

# Dependency update
git commit -m "chore(deps): upgrade vue to 3.5.14"
```

### Automatic Changelog

When you commit with conventional format:

1. Your commit is validated automatically
2. Changelog is updated with your changes
3. Changes are documented in `documentation/CHANGELOG.md`

📖 **[Complete Commit Guide](.claude/commands/commits.md)** - Detailed documentation with examples and best practices

🏗️ **[System Architecture](.claude/commands/changelog-architecture.md)** - Technical deep-dive into how the automated changelog system works

### Alternative: Run Servers Separately

**Backend only:**

```bash
npm run dev:server
```

**Frontend only:**

```bash
npm run dev:client
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend servers
npm run dev:server       # Start backend API only (port 3001)
npm run dev:client       # Start frontend dev server only (port 5173)

# Building
npm run build            # Build for production (with type checking)
npm run preview          # Preview production build locally
npm run typecheck        # Run TypeScript type checking

# Code Quality
npm run format           # Format all files with Prettier
npm run format:check     # Check if files are formatted
npm run lint             # Lint all files with ESLint
npm run lint:fix         # Lint and auto-fix issues

# Changelog
npm run changelog        # Update changelog from commits
npm run changelog:reset  # Regenerate entire changelog

# Production
npm start                # Start production server
```

## Deployment

This app is ready to deploy to Render.com (free tier available) with full database persistence!

📖 **[Complete Deployment Guide](documentation/DEPLOYMENT.md)** - Step-by-step instructions for deploying to Render.com

Quick deploy:

1. Push code to GitHub
2. Connect repository to Render.com
3. Deploy automatically using the included `render.yaml` configuration

The app will be live at: `https://your-app-name.onrender.com`

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
├── .claude/                 # Claude AI command documentation
│   └── commands/
│       ├── README.md                # Guide to using Claude commands
│       ├── project-overview.md      # Complete project overview (@project-overview)
│       ├── commits.md               # Conventional Commits guide (@commits)
│       ├── changelog-architecture.md # System architecture (@changelog-architecture)
│       ├── prettier.md              # Prettier setup (@prettier)
│       ├── eslint.md                # ESLint configuration (@eslint)
│       └── workflow-test-results.md # Test results documentation
│
├── .husky/                  # Git hooks (at repository root)
│   ├── commit-msg          # Validate commit messages
│   ├── post-commit         # Auto-update changelog
│   └── prepare-commit-msg  # Commit message template
│
├── .vscode/                 # Editor configuration
│   └── settings.json       # Format-on-save settings
│
├── server/                  # Backend API
│   ├── db/
│   │   ├── init.js         # Database initialization
│   │   ├── schema.sql      # Database schema
│   │   └── todos.db        # SQLite database (auto-generated)
│   ├── routes/
│   │   └── todos.js        # Todo CRUD endpoints
│   ├── index.js            # Express server setup
│   └── README.md           # Backend documentation
│
├── src/                     # Frontend application
│   ├── components/
│   │   ├── TodoInput.vue   # Input component for adding todos
│   │   ├── TodoItem.vue    # Individual todo item component
│   │   ├── TodoList.vue    # List container for todos
│   │   └── TodoFilters.vue # Filter buttons component
│   ├── services/
│   │   └── api.ts          # API service layer
│   ├── types/
│   │   └── todo.ts         # TypeScript type definitions
│   ├── App.vue             # Main app component
│   ├── main.ts             # Application entry point
│   └── style.css           # Tailwind CSS + custom animations
│
├── .commitlintrc.json       # Commit message validation rules
├── .prettierrc              # Prettier configuration
├── .prettierignore          # Prettier ignore patterns
├── eslint.config.js         # ESLint configuration (flat config)
├── documentation/           # Project documentation
│   ├── CHANGELOG.md         # Manually maintained changelog
│   ├── DEPLOYMENT.md        # Deployment guide for Render.com
│   └── QUICKSTART.md        # Quick start guide
├── vite.config.ts           # Vite configuration with proxy
└── package.json             # Dependencies and scripts
```

## Component Overview

### TodoInput

- Gradient-enhanced input field with glass morphism effect
- Animated button with icon rotation on hover
- Mobile-responsive layout (stacks vertically on small screens)
- Focus glow effects and smooth transitions

### TodoItem

- Glass morphism card design with gradient backgrounds
- Custom animated checkbox with completion effects
- Hidden delete button (reveals on hover for cleaner UI)
- Smooth scale animations on hover and click
- Staggered entrance animations for list items

### TodoList

- Scrollable container with custom styled scrollbar
- Staggered item animations with delay
- Beautiful empty state with pulsing icon
- Optimized for touch interactions on mobile

### TodoFilters

- Two-button filter system (All / Completed)
- Responsive filter buttons (flexible on mobile, larger on desktop)
- Live statistics with animated icon effects
- Active state with gradient background and shadow glow
- Smooth transition between filter states

### App.vue

- Animated background with floating gradient orbs
- Glass morphism main container with backdrop blur
- Responsive padding and spacing for all screen sizes
- Entrance animations for all major sections
- State management using Vue 3's Composition API:
  - Reactive todo array synced with database
  - Computed filtered todos
  - CRUD operations with API integration
  - Loading states and error handling
  - Optimistic UI updates

### API Service (api.ts)

- Type-safe API calls with custom error handling
- RESTful endpoint wrappers (GET, POST, PUT, DELETE)
- Centralized fetch logic with error transformation
- Environment-based API URL configuration

## Backend API

The backend provides a RESTful API for managing todos with SQLite persistence.

### Endpoints

- `GET /api/todos` - Fetch all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `GET /api/health` - Health check endpoint

### Full Backend Documentation

For detailed backend documentation including database schema, API specifications, and deployment guides, see:

📖 **[Backend API Documentation](server/README.md)**

## Design System

### Color Palette

- **Primary**: Blue (400-700) - Main actions and focus states
- **Secondary**: Purple (400-600) - Gradient accents
- **Success**: Green/Emerald (400-600) - Completed states
- **Danger**: Red (400-600) - Delete actions
- **Neutral**: Gray (100-950) - Text and backgrounds

### Animation Principles

- **Duration**: 300ms for most transitions
- **Easing**: ease-out for natural motion
- **Hover**: Scale (1.02-1.1) for interactive elements
- **Active**: Scale (0.95-0.98) for pressed states
- **Entrance**: Slide + fade for new elements

### Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (sm-lg)
- **Desktop**: > 1024px (lg+)

## Changelog

For a detailed history of changes, updates, and releases, see the [CHANGELOG.md](documentation/CHANGELOG.md).

## License

MIT
