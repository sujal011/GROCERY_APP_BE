FROM node:22.14-alpine3.20

WORKDIR /app

COPY package*.json .

RUN npm install --force

COPY . .

EXPOSE 5000
EXPOSE 1000
EXPOSE 80

CMD [ "node","app.js" ]