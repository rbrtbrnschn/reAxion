FROM node:14-alpine

WORKDIR /app

COPY . .

RUN apk add --no-cache build-base
RUN apk add python3 make
RUN yarn
