FROM node:18.12.1-alpine as development 
LABEL authors="alymohamedhassan"

ENV tz=africa/cairo

# create app directory
WORKDIR /usr/src/app

# install app dependencies
COPY package*.json ./
RUN apk add bash
RUN npm i --only=development

COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:18.12.1-alpine as production 

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add bash
RUN npm i --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

# CMD ["node", "dist/main"]

