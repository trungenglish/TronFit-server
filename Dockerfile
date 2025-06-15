# Dockerfile for a Node.js application
FROM node:22-alpine
# Set the working directory in the container
WORKDIR /torung/tronfit-server
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
# Start the app
CMD ["node", "dist/main"]

#docker build -t tronfit-be .
#docker run -d -p 3000:3000 tronfit-be