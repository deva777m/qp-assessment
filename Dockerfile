FROM node:18-alpine AS base

WORKDIR /usr/src/app

COPY package.*json ./

RUN npm i

COPY . .


FROM base AS dev

EXPOSE 3000

CMD ["npm", "run", "dev"]


FROM base AS prod

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]


