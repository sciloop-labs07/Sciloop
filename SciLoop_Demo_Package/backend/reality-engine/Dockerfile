FROM node:22-alpine

WORKDIR /app

COPY sciloop-backend/package*.json ./sciloop-backend/
RUN cd sciloop-backend && npm install --omit=dev

COPY sciloop-backend ./sciloop-backend
COPY backend ./backend

EXPOSE 5050

CMD ["node", "sciloop-backend/src/server.js"]
