FROM node:18-alpine

WORKDIR /app

# Install frontend dependencies and build
COPY frontend/package.json frontend/pnpm-lock.yaml ./frontend/
RUN npm install -g pnpm && cd frontend && pnpm install

COPY frontend/ ./frontend/

ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL

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
