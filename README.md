# port-exp-boilerplate (React + Tailwind v4 + Express Template)

A production-ready full-stack portfolio template for React developers transitioning from junior to mid-level. Features modern tooling, enterprise-grade security, comprehensive testing, Docker containerization, and CI/CD automation.

**Status**: V4 Complete - Performance optimized, Dockerized, and ready for deployment

## About This Template

**Goal**: Bridge the gap between full-stack bootcamp graduation and professional mid-level development.

This isn't just a portfolio template—it's a **progressive learning system** designed for developers who:

- Completed a full-stack bootcamp or course
- Want to build a professional portfolio while leveling up their skills
- Are preparing for technical interviews
- Need to understand real-world production patterns

### The Journey

**V1** → Basic structure (learn the stack)  
**V2** → Security & validation (think like a professional)  
**V3** → Testing & admin dashboard (build maintainable systems)  
**V4** → Performance & DevOps (think about scale and deployment)

Each phase teaches you not just _how_ to code, but _why_ we make architectural decisions.

### Objectives/Syllabus

- **Architecture**: MVC pattern, separation of concerns
- **Security**: JWT auth, input validation, rate limiting, XSS protection
- **Testing**: Unit tests, integration tests, coverage goals
- **DevOps**: Docker, CI/CD, monitoring, health checks
- **Performance**: Caching, compression, database indexing
- **Real-world patterns**: Error handling, logging, middleware stack

### Who This Is For? - Ask yourself

- **Recent bootcamp grads**: Solidify your learning with a real project
- **Career changers**: Build credibility with production-grade code
- **Self-taught developers**: Learn industry best practices
- **Junior devs**: Prepare for that first promotion

**Result**: You'll have a portfolio that impresses yourself AND the skills to back it up.

## What i put in it ?

### Frontend / being refactored

| Category   | Technology         |
| ---------- | ------------------ |
| Framework  | React 19.2.4       |
| Build Tool | Vite 7             |
| Styling    | Tailwind CSS 4.2.1 |
| Animation  | Framer Motion      |
| Routing    | React Router DOM 7 |

### Backend

| Category    | Technology                  |
| ----------- | --------------------------- |
| Runtime     | Node.js 20                  |
| Framework   | Express 5.2.1               |
| Database    | MongoDB + Mongoose 9.3.3    |
| Auth        | JWT + bcryptjs              |
| Security    | Helmet, CORS, Rate Limiting |
| Validation  | express-validator           |
| Testing     | Jest + Supertest            |
| Performance | compression, node-cache     |
| DevOps      | Docker, GitHub Actions      |

## Project Structure

```text
/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── api/                     # API configuration
│   │   ├── components/              # Reusable components
│   │   │   ├── buttons/
│   │   │   │   └── PrimeBtn.jsx
│   │   │   ├── ContactForm.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── ProjectList.jsx
│   │   │   ├── SvgText.jsx
│   │   │   ├── TerminalLoader.jsx
│   │   │   ├── ThemeToggleBtn.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/                 # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ThemeProvider.jsx
│   │   │   └── themeContext.js
│   │   ├── hooks/
│   │   │   ├── use3DTilt.js        # 3D mouse tilt effect
│   │   │   ├── useInView.js        # Intersection Observer
│   │   │   └── useTheme.js         # Theme toggle hook
│   │   ├── pages/
│   │   │   ├── Admin.jsx           # Admin dashboard
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Work.jsx
│   │   ├── utils/
│   │   │   └── motionPresets.js
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── AppRoutes.jsx
│   │   ├── main.jsx
│   │   └── index.css               # Tailwind v4 theme
│   ├── .env.example
│   ├── .prettierrc
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                          # Express Backend
│   ├── src/
│   │   ├── config/                  # Configuration
│   │   ├── controllers/               # Route handlers
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT + admin guard
│   │   │   ├── cache.js              # Response caching
│   │   │   ├── errorHandler.js       # Error handling
│   │   │   ├── rateLimiter.js        # Rate limiting
│   │   │   └── validation.js         # Input validation
│   │   ├── models/                   # Mongoose schemas
│   │   │   ├── ContactMessage.js
│   │   │   ├── Project.js
│   │   │   └── User.js
│   │   └── routes/                   # API routes
│   ├── scripts/                      # Seed scripts
│   ├── .env.example
│   ├── .env
│   ├── .dockerignore
│   ├── Dockerfile                    # Container image
│   ├── mongo-init.js                 # DB initialization
│   ├── package.json
│   └── server.js
├── docker-compose.yml                # Development stack
├── docker-compose.prod.yml           # Production stack
├── .github/workflows/
│   ├── ci.yml                        # Automated testing
│   └── deploy.yml                    # Automated deployment
├── package.json                      # Root orchestrator
├── .gitignore
└── README.md
```

## Quick Start

```bash
# 1. Install all dependencies (auto-installs client & server)
npm install

# 2. Run both servers simultaneously
npm run dev
```

- **Frontend**: <http://localhost:5173>
- **Backend**: <http://localhost:5001>

## Available Scripts

| Script                  | Description              |
| ----------------------- | ------------------------ |
| `npm run dev`           | Run both client & server |
| `npm run dev:client`    | Run only client          |
| `npm run dev:server`    | Run only server          |
| `npm run format`        | Format all code          |
| `npm run lint`          | Lint client code         |
| `npm test`              | Run Jest test suite      |
| `npm run seed:projects` | Seed projects to MongoDB |

## Environment Variables

### Server (.env)

Copy `server/.env.example` to `server/.env` and configure:

```txt
# Server

MONGO_URI=mongodb://localhost:27017/portfolio
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Admin

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=changeme123

# Auth (required for production)

JWT_SECRET=your-secret-key-here
```

### Client (.env)

Copy `client/.env.example` to `client/.env` (optional - has defaults):

```txt
VITE_API_URL=http://localhost:5001/api
VITE_APP_TITLE=port-exp-bolerplate
```

## API Endpoints

### Public Endpoints

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| GET    | `/api/projects`       | Get all projects    |
| POST   | `/api/contact`        | Submit contact form |
| POST   | `/api/users/register` | Register new user   |
| POST   | `/api/users/login`    | User login          |
| GET    | `/api/health`         | Health check        |

### Protected Endpoints (User)

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| GET    | `/api/users/profile` | Get user profile    |
| PUT    | `/api/users/profile` | Update user profile |

### Admin Endpoints (Admin Only)

| Method | Endpoint                | Description              |
| ------ | ----------------------- | ------------------------ |
| POST   | `/api/projects`         | Create project           |
| PUT    | `/api/projects/:id`     | Update project           |
| DELETE | `/api/projects/:id`     | Delete project           |
| GET    | `/api/contact/messages` | Get all contact messages |
| PATCH  | `/api/contact/:id/read` | Mark message as read     |
| DELETE | `/api/contact/:id`      | Delete contact message   |
| GET    | `/api/users`            | Get all registered users |

## Authentication

The client includes authentication context:

- `useAuth()` hook for accessing auth state
- Login/Register pages included
- Token stored in localStorage

## Performance

V4 brings production-grade performance optimizations:

### Database Indexing

Optimized indexes for faster queries:

- **User**: email (unique), role
- **Project**: category+featured (compound), featured, createdAt
- **ContactMessage**: read+createdAt (compound), email

### API Response Caching

Smart caching with `node-cache`:

- `GET /api/projects` → Cached 10 minutes
- `GET /api/projects/:id` → Cached 5 minutes
- `GET /api/contact` → Cached 2 minutes (admin)
- `GET /api/users` → Cached 5 minutes (admin)
- Auto-invalidated on POST/PUT/DELETE

### Response Compression

Gzip compression for all API responses via `compression` middleware:

- Reduces payload size by 60-80%
- Automatic content-type detection

### Health Check Endpoint

Monitor system health:

```bash
GET /api/health
```

Returns: status, uptime, database connection, memory usage

## Docker & Containerization

Full Docker support for consistent development and deployment:

### Quick Start with Docker

```bash
# Start entire stack (MongoDB + API)
docker-compose up

# Access API
curl http://localhost:5001/api/health

# Stop everything
docker-compose down
```

### Files Included

- `server/Dockerfile` - Multi-stage optimized image
- `docker-compose.yml` - Development stack
- `docker-compose.prod.yml` - Production stack
- `server/.dockerignore` - Files to exclude from image
- `server/mongo-init.js` - Database initialization

### Benefits

- **Consistency**: Same environment on all machines
- **Isolation**: MongoDB runs in container, no local installation needed
- **Portability**: Deploy anywhere Docker runs
- **Clean**: One command removes everything

📖 **Full Docker Guide**: See `docs/setup-docker.md`

## CI/CD Pipeline

Automated testing and deployment with GitHub Actions:

### Continuous Integration

**`.github/workflows/ci.yml`**:

- Runs on every PR and push to main
- Tests on Node 18 & 20
- Jest test suite with coverage
- Prettier format checking
- ESLint linting
- Docker image build
- Security audit

### Continuous Deployment

**`.github/workflows/deploy.yml`**:

- Builds Docker image on release
- Pushes to Docker Hub
- Automated deployment (configure for your platform)
- Health check verification

### A cuo of tea

- **Quality Gates**: No broken code reaches production
- **Automated Testing**: Catch regressions early
- **One-Click Deploys**: Ship with confidence
- **Consistent Environments**: Same build everywhere

## Security

This template includes production-ready security features:

### Rate Limiting

- **Authentication endpoints**: 5 requests per 15 minutes
- **Contact form**: 3 requests per hour
- Prevents brute force attacks and spam

### Input Validation

All POST and PUT endpoints validate:

- Email format and normalization
- Password strength (minimum 8 characters, complexity requirements)
- Required field presence
- XSS sanitization via `.escape()`
- Prevents privilege escalation (role restricted to 'user')

### Security Headers

- Helmet.js middleware adds HTTP security headers
- Protects against XSS, clickjacking, and other attacks
- CORS restricted to `CLIENT_URL`

### JWT Authentication

- Tokens include user ID and role
- Role-based access control (RBAC)
- Server-side token validation
- 7-day expiration (development) / 1-day (production)

## Testing

The server includes a Jest test suite with unit and integration tests:

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Structure

```text
server/src/
├── models/
│   └── __tests__/
│       ├── User.test.js
│       └── ContactMessage.test.js
└── controllers/
    └── __tests__/
        └── contactController.test.js
```

Tests cover:

- User model (password hashing, validation)
- ContactMessage model (schema validation)
- Contact controller (form submission, error handling)

## Seeding Admin User

```bash
cd server && npm run seed
```

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `server/.env`.

## Seeding Projects

```bash
npm run seed:projects
```

Populates the database with sample projects for development.

## Design System (Migrated from framer-port)

This template now includes a complete design system inspired by the framer-port project with terminal-inspired aesthetics.

### Color System

The design system uses OKLCH color space for consistent theming:

**Brand Colors:** for now

- `lagoon` - Primary teal (#4ECDC4)
- `coral` - Warm accent (#FF6B6B)
- `driftwood` - Muted tan (#C4A77D)
- `tide` - Deep blue (#2C3E50)
- `dusk` - Golden highlight (#F39C12)

**Semantic Colors:**

- `surface-base` - Main background
- `surface-elevated` - Card/elevated surfaces
- `text-primary` - Main text
- `text-muted` - Secondary text
- `heading` - Headlines
- `brand-primary` - Primary actions
- `status-success` - Success states
- `status-warning` - Warning states
- `status-error` - Error states

### Typography

- **Display**: Playfair Display (headings)
- **Sans**: Inter (body text)
- **Mono**: JetBrains Mono (code/terminal)
- **Dune**: Dune Rise (special headings)

### Theme Toggle

Dark/light mode is supported via `ThemeProvider`:

- Uses `data-theme` attribute on `<html>` element
- Persists preference to localStorage
- Respects system preference on first visit

```jsx
// Using the theme hook
import useTheme from "./hooks/useTheme";

const { isDarkMode, toggleDarkMode } = useTheme();
```

### Animations

Framer Motion presets available in `utils/motionPresets.js`:

- `FADE_UP`, `FADE_DOWN`, `FADE_IN` - Entry animations
- `HOVER_SCALE`, `HOVER_LIFT` - Hover effects
- `PROJECT_CARD_ENTRY` - 3D card reveal
- `STAGGER_CONTAINER`, `STAGGER_SLOW` - Staggered children
- `SPRING_SOFT`, `SPRING_SNAPPY` - Spring transitions
- `TRANSITION_FAST`, `TRANSITION_NORMAL`, `TRANSITION_SLOW` - Duration presets

### 3D Tilt Effect

The `use3DTilt` hook provides mouse-driven 3D rotation:

```jsx
const { rotateX, rotateY, handleMouseMove, handleMouseLeave, isHovered } =
  use3DTilt({
    stiffness: 150, // Spring stiffness
    damping: 20, // Spring damping
    rotationRange: 8, // Max rotation in degrees
    mouseRange: [-0.5, 0.5], // Input range
    elementRelative: true, // Use element vs window coords
    disabled: false, // Disable for prefers-reduced-motion
  });

// Apply to motion.div
<motion.div
  style={{ rotateX, rotateY, perspective: 1000 }}
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
/>;
```

## Component Patterns

### Terminal Window Style

Components like `ContactForm` and `TerminalLoader` use terminal aesthetics:

- Command-style input labels (`$` prefix)
- Traffic light window controls
- Monospace typography
- Status output areas

### Button Variants

The `PrimeBtn` component supports:

- `variant`: 'solid', 'outline', 'gradient'
- `tone`: 'primary', 'secondary', 'white'

```jsx
<PrimeBtn variant="gradient" tone="primary">
  Click Me
</PrimeBtn>
```

## Tailwind CSS v4

This template uses Tailwind CSS v4, which no longer requires `tailwind.config.js`. Configuration is done directly in CSS using `@import "tailwindcss";` with `@theme` directive.

### Custom CSS Properties

The design system defines these custom properties in `index.css`:

- Font families (`--font-dune`, `--font-mono`, etc.)
- Color scales (`--color-primary-*`, `--color-avocado-*`, etc.)
- Semantic colors (`--color-surface-base`, `--color-text-primary`, etc.)
- Animation tokens (`--animate-blink`, `--animate-grain`, `--animate-glow-pulse`)
- Easing curves (`--ease-smooth`, `--ease-spring`)
- Duration tokens (`--duration-fast`, `--duration-normal`, `--duration-slow`)This template uses Tailwind CSS v4, which no longer requires `tailwind.config.js`. Configuration is done directly in CSS using `@import "tailwindcss";` with `@theme` directive.

### Custom CSS Properties - flexible to the size of styling

The design system defines these custom properties in `index.css`:

- Font families (`--font-dune`, `--font-mono`, etc.)
- Color scales (`--color-primary-*`, `--color-avocado-*`, etc.)
- Semantic colors (`--color-surface-base`, `--color-text-primary`, etc.)
- Animation tokens (`--animate-blink`, `--animate-grain`, `--animate-glow-pulse`)
- Easing curves (`--ease-smooth`, `--ease-spring`)
- Duration tokens (`--duration-fast`, `--duration-normal`, `--duration-slow`)

### TBC

## License

MIT
