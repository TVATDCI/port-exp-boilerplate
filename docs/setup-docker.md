# Docker Setup Guide for port-exp-boilerplate

> A comprehensive guide to containerizing your portfolio template with Docker, from basics to production deployment.

## Table of Contents

1. [Understanding Docker](#understanding-docker)
2. [Why Docker for This Project](#why-docker-for-this-project)
3. [Prerequisites](#prerequisites)
4. [Docker Concepts Explained](#docker-concepts-explained)
5. [Your Docker Setup](#your-docker-setup)
6. [Quick Start](#quick-start)
7. [Development Workflow](#development-workflow)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)
10. [Advanced Topics](#advanced-topics)

---

## Understanding Docker

### What is Docker?

**Docker is a platform for developing, shipping, and running applications in containers.**

Think of it as **"shipping containers for software"**:

- Just like physical shipping containers revolutionized global trade by standardizing cargo transport
- Docker containers revolutionize software deployment by standardizing application packaging

### The Problem Docker Solves

**Scenario**: You build an app on your laptop:

- Node.js v20
- MongoDB v7
- Specific npm packages
- Environment variables

**It works perfectly on your machine!**

**You deploy to a server:**

- Server has Node.js v18 (older)
- Wrong MongoDB version
- Missing system libraries
- Different OS (Windows vs Linux)

**Result**: App crashes or behaves differently

**Docker solves this**: Package your app + everything it needs into a **container** that runs identically everywhere.

### Key Benefits

✅ **Consistency**: Works the same on laptop, test server, production  
✅ **Isolation**: Each app runs in its own bubble, no conflicts  
✅ **Portability**: Run on any machine with Docker installed  
✅ **Efficiency**: Lightweight compared to virtual machines  
✅ **Scalability**: Easy to replicate and distribute  
✅ **Clean**: Complete removal is just `docker-compose down`

---

## Why Docker for This Project

Your portfolio template has:

- **Frontend** (React + Vite)
- **Backend** (Express + Node)
- **Database** (MongoDB)

Without Docker:

1. New teammate needs to install MongoDB locally
2. Different Node versions cause issues
3. "Works on my machine" problems
4. Production deployment is manual and error-prone

With Docker:

1. Run `docker-compose up` → entire stack runs in 2 minutes
2. Consistent Node version across all machines
3. Identical environments everywhere
4. One command deploys everything

---

## Prerequisites

### Install Docker Desktop

**macOS**:

```bash
# Download from https://www.docker.com/products/docker-desktop
# Or use Homebrew:
brew install --cask docker
```

**Windows**:

```bash
# Download from https://www.docker.com/products/docker-desktop
# Or use Chocolatey:
choco install docker-desktop
```

**Linux (Ubuntu/Debian)**:

```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install ca-certificates curl gnupg

# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add user to docker group (avoids sudo)
sudo usermod -aG docker $USER
# Log out and back in for changes to take effect
```

**Verify installation**:

```bash
docker --version
docker-compose --version
```

---

## Docker Concepts Explained

### 1. Dockerfile (The Recipe)

**What it is**: A text file with instructions to build an image

**Analogy**: Like a recipe that says:

- Start with Node.js v20 (base ingredient)
- Copy my code (add main ingredient)
- Install dependencies (mixing)
- Run the server (baking)

**Your server/Dockerfile**:

```dockerfile
# Multi-stage build for optimized production image
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine
RUN apk add --no-cache dumb-init
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .
USER nodejs
EXPOSE 5001
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5001/api/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
```

**Key components explained**:

- `FROM node:20-alpine`: Base image (Node v20 on Alpine Linux - small & secure)
- `AS builder`: First stage - builds the app
- `RUN npm ci --only=production`: Install only production dependencies
- `FROM node:20-alpine`: Second stage - final image
- `adduser`: Creates non-root user for security
- `COPY --from=builder`: Copies built app from first stage
- `HEALTHCHECK`: Monitors if container is healthy
- `ENTRYPOINT`: Handles signals properly (prevents zombie processes)

### 2. Image (The Blueprint)

**What it is**: A read-only template with app + dependencies

**Analogy**: Like a blueprint for a house. You can create multiple houses from one blueprint.

**Creating an image**:

```bash
docker build -t portfolio-api:v1.0 .
```

**Viewing images**:

```bash
docker images
```

**Your images after building**:

```
REPOSITORY     TAG       SIZE
portfolio-api  v1.0      180MB
node           20-alpine 170MB
mongo          7         600MB
```

### 3. Container (The Running Instance)

**What it is**: A running instance of an image

**Analogy**: Like a house built from a blueprint. You can have many houses (containers) from one blueprint (image).

**Running a container**:

```bash
docker run -p 5001:5001 portfolio-api:v1.0
```

**Viewing containers**:

```bash
docker ps              # Running containers
docker ps -a           # All containers (including stopped)
```

### 4. Docker Compose (The Orchestra Conductor)

**What it is**: Tool to define and run multi-container applications

**Why use it**: Your app needs:

- API container (Node.js)
- Database container (MongoDB)
- Maybe frontend container (React)

Docker Compose orchestrates all these with one file.

**Your docker-compose.yml**:

```yaml
version: "3.8"

services:
  mongo:
    image: mongo:7
    container_name: portfolio-mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: adminpassword
    volumes:
      - mongo-data:/data/db
    networks:
      - portfolio-network
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 30s
      timeout: 10s
      retries: 3

  api:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: portfolio-api
    restart: unless-stopped
    ports:
      - "5001:5001"
    environment:
      NODE_ENV: production
      PORT: 5001
      MONGO_URI: mongodb://admin:adminpassword@mongo:27017/portfolio?authSource=admin
      JWT_SECRET: your-secret-key
    depends_on:
      mongo:
        condition: service_healthy
    networks:
      - portfolio-network

volumes:
  mongo-data:
    driver: local

networks:
  portfolio-network:
    driver: bridge
```

**Key concepts**:

- `services`: Define containers (mongo, api)
- `ports`: Map container port to host port (`HOST:CONTAINER`)
- `environment`: Set environment variables
- `volumes`: Persist data outside containers
- `networks`: Allow containers to communicate
- `depends_on`: Start order (mongo before api)
- `healthcheck`: Ensure service is ready

### 5. Volumes (Persistent Storage)

**What it is**: Persistent storage outside containers

**Why it matters**: Containers are ephemeral (can be deleted/recreated). Volumes preserve data.

**Your MongoDB volume**:

```yaml
volumes:
  mongo-data:
    driver: local
```

**Without volumes**: Delete container → lose all data  
**With volumes**: Delete container → data persists, new container reconnects

### 6. Networks (Container Communication)

**What it is**: Virtual network for container communication

**Your network**:

```yaml
networks:
  portfolio-network:
    driver: bridge
```

**How it works**:

- API container can reach MongoDB via hostname `mongo` (not IP address)
- Isolated from other Docker projects
- Secure internal communication

---

## Your Docker Setup

### Files Created for You

```
port-exp-boilerplate/
├── server/
│   ├── Dockerfile              # API container recipe
│   ├── .dockerignore           # Files to exclude from image
│   └── mongo-init.js           # Database initialization
├── docker-compose.yml          # Development orchestration
├── docker-compose.prod.yml     # Production orchestration
└── .github/workflows/
    ├── ci.yml                  # Automated testing
    └── deploy.yml              # Automated deployment
```

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Your Laptop                        │
│  ┌─────────────────────────────────────────────────────┐│
│  │           Docker Compose Network                    ││
│  │                                                     ││
│  │  ┌──────────────┐       ┌─────────────────────┐   ││
│  │  │   API        │       │     MongoDB         │   ││
│  │  │  Container   │◄─────►│    Container        │   ││
│  │  │  Port: 5001  │       │    Port: 27017      │   ││
│  │  │              │       │    Volume:          │   ││
│  │  │  Node.js 20  │       │    mongo-data       │   ││
│  │  │  Express     │       │                     │   ││
│  │  └──────┬───────┘       └─────────────────────┘   ││
│  │         │                                         ││
│  │         │ Maps to localhost:5001                  ││
│  └─────────┼─────────────────────────────────────────┘│
│            │                                           │
└────────────┼───────────────────────────────────────────┘
             │
             ▼
    http://localhost:5001/api
```

---

## Quick Start

### Step 1: Stop Local Servers

```bash
# Stop your current servers (Ctrl+C in all terminal windows)
```

### Step 2: Start with Docker

```bash
# From project root
docker-compose up
```

**What happens**:

1. Downloads MongoDB image (first time only)
2. Builds your API image
3. Creates network for containers to communicate
4. Starts MongoDB container
5. Waits for MongoDB to be healthy
6. Starts API container
7. Connects API to MongoDB

### Step 3: Verify Everything Works

```bash
# Check health
curl http://localhost:5001/api/health

# Should return:
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00Z",
  "uptime": 30,
  "database": "connected",
  "memory": { "used": 45, "total": 60, "unit": "MB" },
  "version": "1.0.0",
  "environment": "production"
}
```

### Step 4: View Logs

```bash
# All services
docker-compose logs

# Just API
docker-compose logs api

# Just MongoDB
docker-compose logs mongo

# Follow logs (like tail -f)
docker-compose logs -f api
```

### Step 5: Stop Everything

```bash
# Stop containers (Ctrl+C if running in foreground)
# Or in another terminal:
docker-compose down

# Stop and remove volumes (deletes database data!)
docker-compose down -v
```

---

## Development Workflow

### Daily Development

```bash
# Start everything
docker-compose up

# Work on your code (hot reload works for frontend)
# API changes need container restart

# Stop when done
docker-compose down
```

### Code Changes

**Frontend (React)**:

- Changes are immediate (Vite hot module replacement)
- No container restart needed

**Backend (Express)**:

- Changes require container restart:

```bash
docker-compose restart api
```

- Or rebuild if dependencies changed:

```bash
docker-compose up --build
```

### Accessing the Database

```bash
# Connect to MongoDB in container
docker-compose exec mongo mongosh -u admin -p adminpassword --authenticationDatabase admin

# Or use MongoDB Compass
# Connection string: mongodb://admin:adminpassword@localhost:27017/portfolio?authSource=admin
```

### Viewing Container Shell

```bash
# Access API container shell
docker-compose exec api sh

# Inside container, you can:
ls -la                    # View files
node -v                   # Check Node version
env                       # View environment variables
```

---

## Production Deployment

### Using docker-compose.prod.yml

```bash
# Set environment variables
export JWT_SECRET=your-production-secret
export MONGO_ROOT_PASSWORD=strong-password
export CLIENT_URL=https://yourdomain.com

# Start production stack
docker-compose -f docker-compose.prod.yml up -d
```

**Differences from development**:

- No volume mounts (immutable containers)
- Resource limits (CPU/memory)
- Production environment variables
- No hot reload

### CI/CD Deployment (GitHub Actions)

Your `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build Docker image
        run: docker build -t portfolio-api:latest ./server

      - name: Push to registry
        run: |
          docker login -u ${{ secrets.DOCKER_USERNAME }} -p ${{ secrets.DOCKER_PASSWORD }}
          docker push portfolio-api:latest

      # Deploy to your server (SSH example)
      - name: Deploy
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/portfolio
            docker-compose pull
            docker-compose up -d
```

### Manual Production Deployment

```bash
# On production server:

# 1. Pull latest code
git pull origin main

# 2. Build new image
docker-compose -f docker-compose.prod.yml build

# 3. Start with zero downtime
docker-compose -f docker-compose.prod.yml up -d

# 4. Verify health
curl http://localhost:5001/api/health

# 5. Cleanup old images
docker image prune -f
```

---

## Troubleshooting

### Common Issues

**1. Port Already in Use**

```
Error: Ports are not available: exposing port TCP 0.0.0.0:5001 → 0.0.0.0:0: listen tcp 0.0.0.0:5001: bind: address already in use
```

**Solution**:

```bash
# Find what's using port 5001
lsof -i :5001

# Kill it
kill -9 <PID>

# Or use different port in docker-compose.yml
ports:
  - "5002:5001"  # Maps host 5002 to container 5001
```

**2. MongoDB Connection Refused**

```
MongoNetworkError: failed to connect to server [mongo:27017]
```

**Solution**:

```bash
# Check if MongoDB is running
docker-compose ps

# Check MongoDB logs
docker-compose logs mongo

# Restart MongoDB
docker-compose restart mongo

# Wait a moment, then restart API
docker-compose restart api
```

**3. Permission Denied**

```
Error: EACCES: permission denied, open '/app/logs/app.log'
```

**Solution**:

```bash
# File ownership issue - rebuild with correct permissions
docker-compose down
docker-compose up --build
```

**4. Container Exits Immediately**

```bash
# Check logs
docker-compose logs api

# Common causes:
# - Missing environment variables
# - Database not ready
# - Code errors

# Debug: Run container manually
docker run --rm -it portfolio-api sh
```

**5. Hot Reload Not Working**

```bash
# Volume mounts may not be detecting changes
# Restart with explicit volume
docker-compose down
docker-compose up
```

### Debug Commands

```bash
# List all containers
docker ps -a

# Inspect container
docker inspect portfolio-api

# View resource usage
docker stats

# Check network
docker network ls
docker network inspect portfolio-network

# View volumes
docker volume ls

# Container shell access
docker-compose exec api sh

# MongoDB shell
docker-compose exec mongo mongosh
```

---

## Advanced Topics

### Multi-Environment Setup

**Development** (`docker-compose.yml`):

- Volume mounts for hot reload
- Debug logging enabled
- Local database

**Staging** (`docker-compose.staging.yml`):

- Production-like settings
- Test database
- CI/CD testing

**Production** (`docker-compose.prod.yml`):

- No volume mounts
- Optimized builds
- Resource limits
- External database (optional)

### Scaling with Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.prod.yml portfolio

# Scale API to 3 instances
docker service scale portfolio_api=3
```

### Using External MongoDB

```yaml
# docker-compose.prod.yml
services:
  api:
    build: ./server
    environment:
      MONGO_URI: mongodb+srv://user:pass@cluster.mongodb.net/portfolio
    # No mongo service - using Atlas
```

### Monitoring with Prometheus

```yaml
# Add to docker-compose.yml
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
```

### SSL/HTTPS with Traefik

```yaml
# Add reverse proxy
services:
  traefik:
    image: traefik:v2.10
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--entrypoints.websecure.address=:443"
    ports:
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

---

## Best Practices

### 1. Keep Images Small

```dockerfile
# Good: Multi-stage build
FROM node:20-alpine AS builder
# ... build steps

FROM node:20-alpine
# ... copy only built artifacts

# Bad: Single stage with dev dependencies
FROM node:20
COPY . .
RUN npm install  # Includes devDependencies
```

### 2. Use .dockerignore

```
node_modules
npm-debug.log
.env
.git
.vscode
README.md
*.md
coverage
.nyc_output
```

### 3. Non-Root User

```dockerfile
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs
```

### 4. Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:5001/api/health || exit 1
```

### 5. Pin Versions

```dockerfile
# Good: Specific version
FROM node:20.11.0-alpine

# Bad: Latest (unpredictable)
FROM node:latest
```

---

## Learning Path

### Beginner

1. ✅ Install Docker Desktop
2. ✅ Run `docker-compose up`
3. ✅ View logs and test endpoints
4. ✅ Make code changes and restart

### Intermediate

1. Understand Dockerfile layers
2. Modify docker-compose.yml
3. Add new services (Redis, etc.)
4. Debug containers

### Advanced

1. Multi-stage optimizations
2. Docker Swarm/Kubernetes
3. CI/CD pipeline customization
4. Production monitoring

---

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)

---

**Status**: 📋 Ready for learning and implementation

**Last Updated**: After V4 completion (Docker containerization)

---

_Next: Try running `docker-compose up` and explore your containerized portfolio template!_
