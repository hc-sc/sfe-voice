FROM node:latest as build-dev
# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json /apop/

# Download and install packages
RUN npm install
COPY ./ /app/
ARG env=prod
RUN npm run build -- --prod

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]