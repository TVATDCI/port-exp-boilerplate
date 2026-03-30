# Codebase Documentation

## Project Overview

**port-exp-boilerplate** is a full-stack portfolio template designed as a learning system and quick-start foundation for React-based projects. It demonstrates modern web development practices by combining a polished frontend with a RESTful backend, serving as both a functional portfolio showcase and an educational codebase for understanding full-stack architecture.

### Core Purpose

- Provide a complete, production-ready portfolio template
- Serve as a learning resource for React + Express + MongoDB stack
- Demonstrate modern animation techniques and design systems
- Offer a foundation for rapid project prototyping

### Architecture Pattern

The project follows a **layered MVC architecture** on the backend and **component-based architecture** on the frontend:

- **Backend**: Models → Controllers → Routes (MVC)
- **Frontend**: Components → Pages → Context Providers (Component-based)

---

## Folder Structure

```
/home/vladi/Projects/new-portfolio/port-exp-boilerplate/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── api/                     # API configuration & endpoints
│   │   │   └── index.js             # Base URL and endpoint constants
│   │   ├── components/              # Reusable UI components
│   │   │   ├── buttons/
│   │   │   │   └── PrimeBtn.jsx     # Primary button component
│   │   │   ├── ContactForm.jsx      # Terminal-styled contact form
│   │   │   ├── Footer.jsx           # Site footer
│   │   │   ├── Hero.jsx             # Hero section with 3D effects
│   │   │   ├── Layout.jsx           # Page layout wrapper
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   ├── ProjectCard.jsx      # 3D tilt project card
│   │   │   ├── ProjectList.jsx      # Filterable project grid
│   │   │   ├── SvgText.jsx          # SVG animated text
│   │   │   ├── TerminalLoader.jsx   # Boot sequence loader
│   │   │   ├── ThemeToggleBtn.jsx   # Dark/light mode toggle
│   │   │   └── Toast.jsx            # Notification component
│   │   ├── context/                 # React Context providers
│   │   │   ├── AuthContext.jsx      # Authentication state
│   │   │   ├── ThemeProvider.jsx    # Theme state management
│   │   │   └── themeContext.js      # Theme context definition
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── use3DTilt.js         # 3D mouse tilt effect
│   │   │   ├── useInView.js         # Intersection Observer hook
│   │   │   └── useTheme.js          # Theme access hook
│   │   ├── pages/                   # Route-level page components
│   │   │   ├── About.jsx            # About page
│   │   │   ├── Contact.jsx          # Contact page
│   │   │   ├── Home.jsx             # Home page
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Register.jsx         # Registration page
│   │   │   └── Work.jsx             # Projects showcase page
│   │   ├── utils/                   # Utility functions
│   │   │   └── motionPresets.js     # Framer Motion animation presets
│   │   ├── constants/               # Constant values
│   │   │   └── index.js             # (Commented sample data)
│   │   ├── assets/                  # Static assets
│   │   ├── App.jsx                  # Root application component
│   │   ├── AppRoutes.jsx            # Route definitions
│   │   ├── main.jsx                 # Application entry point
│   │   └── index.css                # Global styles & Tailwind v4 config
│   ├── .env.example                 # Client environment template
│   ├── .gitignore
│   ├── index.html                   # HTML entry point
│   ├── package.json                 # Frontend dependencies
│   └── vite.config.js               # Vite configuration
├── server/                          # Express Backend
│   ├── src/
│   │   ├── config/                  # Configuration files
│   │   │   ├── database.js          # MongoDB connection setup
│   │   │   └── index.js             # Environment variable loader
│   │   ├── controllers/             # Route handlers (business logic)
│   │   │   ├── contactController.js # Contact form handler
│   │   │   ├── projectController.js # Projects CRUD operations
│   │   │   ├── userController.js    # User auth operations
│   │   │   └── index.js             # Controller exports
│   │   ├── middleware/              # Express middleware
│   │   │   └── authMiddleware.js    # JWT authentication guard
│   │   ├── models/                  # Mongoose data models
│   │   │   ├── Project.js           # Project schema
│   │   │   └── User.js              # User schema with password hashing
│   │   └── routes/                  # API route definitions
│   │       ├── api.js               # (Legacy/backup routes)
│   │       └── index.js             # Main route aggregator
│   ├── scripts/                     # Utility scripts
│   │   └── seedAdmin.js             # Admin user seeder
│   ├── .env.example                 # Server environment template
│   ├── .gitignore
│   ├── package.json                 # Backend dependencies
│   └── server.js                    # Application entry point
├── docs/                            # Documentation
│   ├── base-template.md             # Agent workflow template
│   └── decisions.md                 # Architecture decisions & improvements
├── package.json                     # Root package (orchestrates both)
├── README.md                        # Project documentation
└── .gitignore
```

---

## Layer Responsibilities

### Backend Layers

#### Models (`server/src/models/`)

- **Purpose**: Define data schemas and business rules for MongoDB documents
- **Key Files**:
  - `Project.js`: Project schema with title, description, imageUrl, tags, category, featured fields
  - `User.js`: User schema with email, password (bcrypt hashed), role; includes pre-save password hashing and comparison method

#### Controllers (`server/src/controllers/`)

- **Purpose**: Handle HTTP requests, execute business logic, return responses
- **Key Files**:
  - `projectController.js`: Returns hardcoded sample projects (NOT connected to database)
  - `userController.js`: Handles registration, login with JWT generation, profile retrieval
  - `contactController.js`: Logs contact form submissions to console (no persistence)
  - `index.js`: Re-exports all controller functions

#### Routes (`server/src/routes/`)

- **Purpose**: Define API endpoints and map to controller functions
- **Key Files**:
  - `index.js`: Main router aggregating all routes (projects, contact, users)
  - `api.js`: Backup/legacy route definitions (redundant with index.js)

#### Middleware (`server/src/middleware/`)

- **Purpose**: Cross-cutting concerns like authentication
- **Key Files**:
  - `authMiddleware.js`: JWT token validation, attaches user to request object

#### Config (`server/src/config/`)

- **Purpose**: Centralized configuration management
- **Key Files**:
  - `database.js`: MongoDB connection using Mongoose
  - `index.js`: Environment variable loader with defaults

### Frontend Layers

#### Components (`client/src/components/`)

- **Purpose**: Reusable UI building blocks
- **Key Components**:
  - `Layout.jsx`: Page wrapper with background, Navbar, Footer, Toast
  - `Navbar.jsx`: Navigation with auth state, theme toggle
  - `Hero.jsx`: Landing section with 3D tilt effect, terminal loader
  - `ProjectCard.jsx`: 3D interactive project card with parallax
  - `ProjectList.jsx`: Filterable grid of projects by category
  - `ContactForm.jsx`: Terminal-styled form with async submission
  - `TerminalLoader.jsx`: Boot sequence animation on page load
  - `PrimeBtn.jsx`: Styled button component with variants

#### Pages (`client/src/pages/`)

- **Purpose**: Route-level components that compose lower-level components
- **Key Pages**:
  - `Home.jsx`: Hero section with animations
  - `Work.jsx`: Project showcase with filtering
  - `About.jsx`: Static about page
  - `Contact.jsx`: Contact form page
  - `Login.jsx` / `Register.jsx`: Authentication pages

#### Context (`client/src/context/`)

- **Purpose**: Global state management without prop drilling
- **Key Contexts**:
  - `AuthContext.jsx`: User authentication state, login/logout/registration functions
  - `ThemeProvider.jsx`: Dark/light mode state with localStorage persistence
  - `themeContext.js`: Context definition for theme

#### Hooks (`client/src/hooks/`)

- **Purpose**: Reusable stateful logic
- **Key Hooks**:
  - `use3DTilt.js`: Mouse-driven 3D rotation effect using Framer Motion
  - `useInView.js`: Intersection Observer for scroll-triggered animations
  - `useTheme.js`: Theme context consumer hook

#### Utils (`client/src/utils/`)

- **Purpose**: Helper functions and constants
- **Key Files**:
  - `motionPresets.js`: Predefined Framer Motion animation variants (fade, stagger, spring)

---

## Data Flow

### Request-Response Cycle (Backend)

```
Client Request
     ↓
Express Routes (index.js) — matches URL pattern
     ↓
Middleware (authMiddleware.js) — validates JWT if required
     ↓
Controller — executes business logic
     ↓
Mongoose Model — queries MongoDB (except projects which uses hardcoded data)
     ↓
Controller — formats response
     ↓
JSON Response to Client
```

### Authentication Flow

```
Login Request
     ↓
userController.loginUser()
     ↓
User.findOne() — retrieves user from DB
     ↓
user.correctPassword() — compares bcrypt hashes
     ↓
jwt.sign() — generates token with user ID
     ↓
Returns { _id, email, role, token }
     ↓
Client stores token in localStorage
```

### Protected Route Flow

```
Request with Authorization: Bearer <token> header
     ↓
authMiddleware.protect()
     ↓
jwt.verify() — validates token
     ↓
Attaches decoded user to req.user
     ↓
Next middleware/controller
```

### Frontend Data Flow

```
Component Mounts (e.g., ProjectList)
     ↓
useEffect triggers fetch(API_ENDPOINTS.projects)
     ↓
API call to backend
     ↓
Data stored in component state (useState)
     ↓
Conditional rendering (loading → error → data)
     ↓
Components receive data via props
     ↓
Framer Motion animations applied
     ↓
User interaction updates state
     ↓
Re-render with new data
```

### Theme Toggle Flow

```
User clicks theme button
     ↓
toggleDarkMode() from ThemeContext
     ↓
Updates isDarkMode state
     ↓
useEffect updates data-theme attribute on <html>
     ↓
CSS variables update based on [data-theme='dark'] selector
     ↓
Components re-render with new colors
```

---

## Key Dependencies

### Backend Dependencies

| Package      | Version | Purpose                                  |
| ------------ | ------- | ---------------------------------------- |
| express      | 5.2.1   | Web framework, HTTP request handling     |
| mongoose     | 9.3.3   | MongoDB ODM, schema modeling             |
| bcryptjs     | 3.0.2   | Password hashing for secure storage      |
| jsonwebtoken | 9.0.3   | JWT generation and verification          |
| cors         | 2.8.6   | Cross-Origin Resource Sharing middleware |
| dotenv       | 17.3.1  | Environment variable management          |

### Frontend Dependencies

| Package           | Version  | Purpose                                     |
| ----------------- | -------- | ------------------------------------------- |
| react             | 19.2.4   | UI library, component-based architecture    |
| react-dom         | 19.2.4   | DOM rendering for React                     |
| react-router-dom  | 7.9.6    | Client-side routing                         |
| framer-motion     | 12.23.24 | Animation library with physics-based motion |
| clsx              | 2.1.1    | Conditional CSS class construction          |
| tailwindcss       | 4.2.1    | Utility-first CSS framework (v4)            |
| @tailwindcss/vite | 4.2.1    | Tailwind Vite plugin                        |
| vite              | 7.2.4    | Build tool and dev server                   |

---

## Environment Variables

### Server (.env)

```
MONGO_URI=mongodb://localhost:27017/portfolio    # MongoDB connection string
PORT=5001                                        # Server port
NODE_ENV=development                             # Environment mode
ADMIN_EMAIL=admin@example.com                    # Admin email for seeding
ADMIN_PASSWORD=changeme123                       # Admin password for seeding
JWT_SECRET=your-secret-key-here                  # JWT signing secret
JWT_EXPIRES_IN=7d                                # Token expiration time
```

### Client (.env)

```
VITE_API_URL=http://localhost:5001/api           # Backend API base URL
VITE_APP_TITLE=port-exp-boilerplate              # App title
```

---

## API Endpoints

| Method | Endpoint              | Description         | Auth Required |
| ------ | --------------------- | ------------------- | ------------- |
| GET    | `/api/projects`       | Get all projects    | No            |
| POST   | `/api/contact`        | Submit contact form | No            |
| POST   | `/api/users/register` | Register new user   | No            |
| POST   | `/api/users/login`    | User login          | No            |
| GET    | `/api/users/profile`  | Get user profile    | Yes (JWT)     |

---

## Design System

### Color Architecture (Tailwind v4 + OKLCH)

The project uses OKLCH color space for perceptually uniform colors with proper dark mode support.

**Brand Colors:**

- `lagoon` — Primary teal (#4ECDC4)
- `coral` — Warm accent (#FF6B6B)
- `driftwood` — Muted tan (#C4A77D)
- `tide` — Deep blue (#2C3E50)
- `dusk` — Golden highlight (#F39C12)

**Semantic Colors:**

- `surface-base` — Main background
- `surface-elevated` — Card/elevated surfaces
- `text-primary` — Main text
- `text-muted` — Secondary text
- `heading` — Headlines
- `brand-primary` — Primary actions
- `status-success` — Success states
- `status-warning` — Warning states
- `status-error` — Error states

### Typography

- **Display**: Playfair Display (headings)
- **Sans**: Inter (body text)
- **Mono**: JetBrains Mono (code/terminal)
- **Dune**: Dune Rise (special headings)

### Animation System

**Motion Presets** (defined in `motionPresets.js`):

- `FADE_UP`, `FADE_DOWN`, `FADE_IN` — Entry animations
- `HOVER_SCALE`, `HOVER_LIFT` — Hover effects
- `PROJECT_CARD_ENTRY` — 3D card reveal with spring physics
- `STAGGER_CONTAINER` — Staggered children animations
- `SPRING_SOFT`, `SPRING_SNAPPY` — Spring transition presets
- `TRANSITION_FAST`, `TRANSITION_NORMAL`, `TRANSITION_SLOW` — Duration presets

**3D Tilt Effect** (`use3DTilt.js`):

- Mouse-driven rotation using Framer Motion springs
- Configurable stiffness, damping, rotation range
- Respects `prefers-reduced-motion` accessibility setting

---

## Important Implementation Notes

### Current Data Source Discrepancy

The `projectController.js` currently returns **hardcoded sample data** instead of querying the MongoDB database. The `Project` model exists but is unused for reads. This is intentional for demo purposes but should be connected to the database for production use.

### Authentication Token Storage Bug

In `AuthContext.jsx` line 38, the code stores `data._id` instead of `data.token` in localStorage:

```javascript
localStorage.setItem("token", data._id); // BUG: Should be data.token
```

### Route Redundancy

Two route files exist (`api.js` and `index.js`) with similar content. The main application uses `index.js` via `server.js`.

### Contact Form Persistence

The contact form controller only logs to console. No database persistence or email service integration is implemented.

### Missing Standard Middleware

The application lacks:

- Request validation middleware
- Rate limiting
- Error handling middleware
- Request logging
- Security headers (Helmet)

---

## Build & Development

### Root Commands

```bash
npm install          # Installs all dependencies (client + server)
npm run dev          # Runs both client and server concurrently
npm run dev:client   # Frontend only (port 5173)
npm run dev:server   # Backend only (port 5001)
npm run format       # Formats all code with Prettier
npm run lint         # Lints client code with ESLint
```

### Server Commands

```bash
cd server && npm run seed    # Seeds admin user from .env
```

---

## Learning Path Integration

This codebase serves as a progressive learning resource:

1. **V1 (Current)**: Basic CRUD structure, hardcoded data, simple auth
2. **V2 Goals**: Connect to real database, add validation, error handling
3. **V3 Goals**: Testing, logging, security hardening, performance optimization

The `decisions.md` file documents architectural decisions and proposed improvements for evolution.

---

_Generated as part of the AI-assisted development system documentation._
