FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

COPY . .

# Bundle app source

RUN npm install nodemon -g

RUN npm install

EXPOSE 3001

CMD [ "npm", "start" ]
