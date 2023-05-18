FROM node:14.16

EXPOSE 3000

CMD node ./dist/app/index.js

HEALTHCHECK --interval=30s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3000/healthcheck || exit 1

WORKDIR /home/node/app

COPY .yarn ./.yarn
COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install \
  && yarn cache clean

COPY . .

RUN yarn dist
