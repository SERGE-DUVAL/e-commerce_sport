FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
COPY backend/.env.example ./backend/

RUN cd backend && npm install

COPY backend/ ./backend/

EXPOSE 5000

CMD ["node", "backend/server.js"]
