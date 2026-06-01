FROM node:18-alpine

WORKDIR /app

# Install frontend dependencies and build
COPY frontend/package.json frontend/pnpm-lock.yaml ./frontend/
RUN npm install -g pnpm && cd frontend && pnpm install

COPY frontend/ ./frontend/
RUN cd frontend && pnpm run build

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

COPY backend/ ./backend/

# Copy frontend build to backend/public
RUN cp -r frontend/dist backend/public

# Copy database
COPY sport-equip.sqlite ./

EXPOSE 5000

CMD ["node", "backend/server.js"]
