###
# Base
###

# Build base from node 8 image
FROM node:8 as base

# Install rsync
RUN apt-get -yqq update
RUN apt-get -yqq install rsync

# Install dependencies in temp folder (forces caching until change in package)
COPY package*.json /tmp/
RUN cd /tmp && npm install --only=production

# Create app directory and transfer dependencies
WORKDIR /home/apps/sfe-voice
RUN mv /tmp/node_modules ./

###
# Application
###

FROM base as application

# Copy and build source
COPY . .
RUN npm run build

# Give node user permission to serve static assets
RUN chown -Rv node /home/apps/sfe-voice/lib/app/static/assets

###
# Run
###

FROM application as run

# Set and export port value
ENV PORT=8080
EXPOSE 8080

# Change from root to node
USER node

# Start application
CMD [ "node", "lib/app/server.js" ]
