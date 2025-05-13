FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Development mode
CMD ["npm", "run", "dev"]

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"] 