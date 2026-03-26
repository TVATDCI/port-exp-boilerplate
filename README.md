# React + Tailwind v4 + Express Template

A full-stack quick-start template for React projects with Tailwind CSS v4, Express backend, MongoDB, and authentication.

## Tech Stack

### Frontend
| Category | Technology |
|----------|------------|
| Framework | React 19.2.4 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4.2.1 |
| Animation | Framer Motion |
| Routing | React Router DOM 7 |

### Backend
| Category | Technology |
|----------|------------|
| Runtime | Node.js |
| Framework | Express 5.2.1 |
| Database | MongoDB + Mongoose 9.3.3 |
| Auth | bcryptjs |

## Project Structure

```
/
├── client/
│   ├── src/
│   │   ├── api/                 # API configuration
│   │   ├── components/          # Reusable components
│   │   │   ├── ContactForm.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── ProjectList.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/             # React Context (Auth)
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Work.jsx
│   │   ├── constants/           # Mock data (optional)
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── AppRoutes.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── .prettierrc
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/              # DB & env config
│   │   ├── controllers/         # Route handlers
│   │   ├── models/             # Mongoose schemas
│   │   └── routes/             # Express routes
│   ├── scripts/                 # Seed scripts
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── package.json                 # Root package (runs both)
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

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5001

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run both client & server |
| `npm run dev:client` | Run only client |
| `npm run dev:server` | Run only server |
| `npm run format` | Format all code |
| `npm run lint` | Lint client code |

## Environment Variables

### Server (.env)
Copy `server/.env.example` to `server/.env` and configure:

```
# Server
MONGO_URI=mongodb://localhost:27017/portfolio
PORT=5001
NODE_ENV=development

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
VITE_APP_TITLE=My Portfolio
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/projects` | Get all projects | Public |
| POST | `/api/contact` | Submit contact form | Public |
| POST | `/api/users/register` | Register new user | Public |
| POST | `/api/users/login` | User login | Public |
| GET | `/api/users/profile` | Get user profile | Protected |

## Authentication

The client includes authentication context:
- `useAuth()` hook for accessing auth state
- Login/Register pages included
- Token stored in localStorage

## Seeding Admin User

```bash
cd server && npm run seed
```

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `server/.env`.

## Tailwind CSS v4

This template uses Tailwind CSS v4, which no longer requires `tailwind.config.js`. Configuration is done directly in CSS using `@import "tailwindcss";`.

## Troubleshooting

### Port already in use
Kill existing processes:
```bash
lsof -ti:5001 | xargs kill -9  # Server
lsof -ti:5173 | xargs kill -9  # Client
```

### MongoDB connection error
- Check your `MONGO_URI` in `server/.env`
- Ensure your IP is whitelisted in MongoDB Atlas

## License

MIT
