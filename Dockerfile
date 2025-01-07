FROM node:lts-alpine

# Set environment variables
# ENV NODE_ENV=production # This is not needed since it is set in the package.json
ENV RUNNING_MODE=docker
ENV CORS_ORIGIN=http://localhost:80

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 8000

# Change ownership and set user
RUN chown -R node /usr/src/app
USER node

# Start the application
CMD ["npm", "start"]