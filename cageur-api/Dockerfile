FROM node:6.6.0
MAINTAINER girikuncoro@gmail.com

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

# App binds to port 5000
# Heroku can't do this yet, useful for local dev
EXPOSE 5000

# Run the app.  CMD is required to run on Heroku
# $PORT is set by Heroku
CMD bash -c "sleep 10; DEBUG=cageur npm start"
