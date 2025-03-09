FROM node:22.14-alpine3.20

WORKDIR /app

COPY package*.json .

RUN npm install --force

COPY . .

CMD [ "node","app.js" ]
