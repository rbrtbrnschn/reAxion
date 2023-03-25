FROM node:lts-alpine
WORKDIR /server
COPY ./dist/packages/server .
ENV PORT=8080
EXPOSE ${PORT}
RUN npm install --production
RUN npm install tslib @nestjs/platform-express
CMD node ./main.js
