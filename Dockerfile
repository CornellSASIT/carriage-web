FROM node:16
ARG REACT_APP_PUBLIC_VAPID_KEY

WORKDIR /usr/src/app

COPY . .

RUN export REACT_APP_PUBLIC_VAPID_KEY=${REACT_APP_PUBLIC_VAPID_KEY} && npm install && npm install -g dynamoose moment && npm run postinstall && npm run heroku-postbuild && rm -rf node_modules && npm install --production && \
  cd server && npm install --production && cd - && \
  chmod 755 /usr/src/app/secrets-entrypoint.sh && \
  rm -rf /usr/src/app/.git && \
  chown -R node:node /usr/src/app

# we need pm2 globally
RUN yarn global add pm2
RUN apt-get update && apt-get install -y python-pip && \
      pip install awscli && \
      apt-get clean


USER node

EXPOSE 4300

ENV NODE_ENV production

WORKDIR /usr/src/app

# Overwrite the entry-point script
ENTRYPOINT ["/usr/src/app/secrets-entrypoint.sh"]

CMD ["node",  "server/build/app.js"]
RUN echo $REACT_APP_PUBLIC_VAPID_KEY

