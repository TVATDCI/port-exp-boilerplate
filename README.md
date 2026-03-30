# port-exp-bolerplate (React + Tailwind v4 + Express Template)

A full-stack basic quick-start template for React projects with Tailwind CSS v4, Express backend, MongoDB, and authentication.

## Tech Stack

### Frontend

| Category   | Technology         |
| ---------- | ------------------ |
| Framework  | React 19.2.4       |
| Build Tool | Vite 7             |
| Styling    | Tailwind CSS 4.2.1 |
| Animation  | Framer Motion      |
| Routing    | React Router DOM 7 |

### Backend

| Category  | Technology               |
| --------- | ------------------------ |
| Runtime   | Node.js                  |
| Framework | Express 5.2.1            |
| Database  | MongoDB + Mongoose 9.3.3 |
| Auth      | bcryptjs                 |

## Project Structure

```text
/
├── client/
│ ├── src/
│ │ ├── api/ # API configuration
│ │ ├── components/ # Reusable components
│ │ │ ├── buttons/
│ │ │ │ └── PrimeBtn.jsx
│ │ │ ├── ContactForm.jsx
│ │ │ ├── Footer.jsx
│ │ │ ├── Hero.jsx
│ │ │ ├── Layout.jsx
│ │ │ ├── Navbar.jsx
│ │ │ ├── ProjectCard.jsx
│ │ │ ├── ProjectList.jsx
│ │ │ ├── SvgText.jsx
│ │ │ ├── TerminalLoader.jsx
│ │ │ ├── ThemeToggleBtn.jsx
│ │ │ └── Toast.jsx
│ │ ├── context/ # React Context
│ │ │ ├── AuthContext.jsx
│ │ │ ├── ThemeProvider.jsx
│ │ │ └── themeContext.js
│ │ ├── hooks/
│ │ │ ├── use3DTilt.js # 3D mouse tilt effect
│ │ │ ├── useInView.js # Intersection Observer hook
│ │ │ └── useTheme.js # Theme toggle hook
│ │ ├── pages/
│ │ │ ├── About.jsx
│ │ │ ├── Contact.jsx
│ │ │ ├── Home.jsx
│ │ │ ├── Login.jsx
│ │ │ ├── Register.jsx
│ │ │ └── Work.jsx
│ │ ├── utils/
│ │ │ └── motionPresets.js # Framer Motion variants
│ │ ├── constants/ # Mock data (optional)
│ │ ├── assets/
│ │ ├── App.jsx
│ │ ├── AppRoutes.jsx
│ │ ├── main.jsx
│ │ └── index.css # Tailwind v4 theme + styles
│ ├── .env.example
│ ├── .prettierrc
│ ├── eslint.config.js
│ ├── index.html
│ ├── package.json
│ └── vite.config.js
├── server/
│ ├── src/
│ │ ├── config/ # DB & env config
│ │ ├── controllers/ # Route handlers
│ │ ├── middleware/ # Express middleware
│ │ │ ├── authMiddleware.js
│ │ │ ├── rateLimiter.js
│ │ │ ├── validation.js
│ │ │ └── errorHandler.js
│ │ ├── models/ # Mongoose schemas
│ │ │ └── __tests__/ # Model unit tests
│ │ └── routes/ # Express routes
│ ├── scripts/ # Seed scripts
│ ├── .env
│ ├── .env.example
│ ├── package.json
│ └── server.js
├── package.json # Root package (runs both)
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

```
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

```
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

## Security

This template includes production-ready security features:

### Rate Limiting

- **Authentication endpoints**: 5 requests per 15 minutes
- **Contact form**: 3 requests per hour
- Prevents brute force attacks and spam

### Input Validation

All POST and PUT endpoints validate:

- Email format and normalization
- Password strength (minimum 8 characters)
- Required field presence
- Prevents XSS and injection attacks

### Security Headers

- Helmet.js middleware adds HTTP security headers
- Protects against XSS, clickjacking, and other attacks

### CORS Configuration

- Restricted to `CLIENT_URL` environment variable
- Prevents unauthorized cross-origin requests

## Testing

The server includes a Jest test suite with unit and integration tests:

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Structure

```
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

**Brand Colors:**

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

### Custom CSS Properties

The design system defines these custom properties in `index.css`:

- Font families (`--font-dune`, `--font-mono`, etc.)
- Color scales (`--color-primary-*`, `--color-avocado-*`, etc.)
- Semantic colors (`--color-surface-base`, `--color-text-primary`, etc.)
- Animation tokens (`--animate-blink`, `--animate-grain`, `--animate-glow-pulse`)
- Easing curves (`--ease-smooth`, `--ease-spring`)
- Duration tokens (`--duration-fast`, `--duration-normal`, `--duration-slow`)

**TBC**

## License

MIT
