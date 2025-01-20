FROM node:22.13

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# Bundle app source
COPY . .

RUN npm run format

RUN npm run lint

RUN npm run build

EXPOSE $PORT

CMD [ "npm", "run start:dev" ]