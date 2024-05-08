# Use a Node.js base image
FROM node:18

RUN apt-get update && apt-get install -y libc6

# Set the working directory inside the container
WORKDIR /app

# Install Node.js dependencies
COPY package*.json ./
RUN npm install


COPY . .

EXPOSE 3000

# Command to run the application
CMD ["node", "index.js"]
