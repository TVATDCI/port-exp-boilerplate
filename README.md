# React + Tailwind v4 Template

A quick-start template for React projects with Tailwind CSS v4, Framer Motion, and React Router.

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19.2.4 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4.2.1 |
| Animation | Framer Motion |
| Routing | React Router DOM 7 |
| Linting | ESLint |
| Formatting | Prettier |

## Project Structure

```
/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ContactForm.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   └── ProjectList.jsx
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Home.jsx
│   │   │   └── Work.jsx
│   │   ├── constants/
│   │   ├── App.jsx
│   │   ├── AppRoutes.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .prettierrc
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

## Getting Started

### 1. Install dependencies

```bash
cd client
npm install
```

### 2. Run development server

```bash
npm run dev
```

### 3. Format code

```bash
npm run prettier
```

### 4. Lint code

```bash
npm run lint
```

## Tailwind CSS v4

This template uses Tailwind CSS v4, which no longer requires `tailwind.config.js`. Configuration is done directly in CSS using `@import "tailwindcss";`.

To customize themes or add plugins, edit `client/src/index.css`.

## License

MIT
