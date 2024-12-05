FROM node:18

WORKDIR /usr/src/app

COPY backend/package*.json ./backend/

RUN npm install --prefix ./backend

COPY ./backend ./backend

COPY ./frontend/public ./frontend/public

EXPOSE 3000

CMD ["npm", "start", "--prefix", "backend"]
