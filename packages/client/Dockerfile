FROM node:lts-alpine
WORKDIR /client
COPY ./dist/packages/client .
ENV PORT=3000
EXPOSE ${PORT}
RUN npm install -g serve
CMD serve -p $PORT -s .
