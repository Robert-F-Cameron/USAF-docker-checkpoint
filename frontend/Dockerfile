FROM node:current-alpine

# Temporary data storage used by data services like Redis
#VOLUME /tmp

RUN mkdir -p /src/app

# Working directory for this app
WORKDIR /src/app

# Copy this application to a new location
COPY . /src/app

# install app requirements
RUN npm install

EXPOSE 3001

# Build
CMD ["npm", "start"]
