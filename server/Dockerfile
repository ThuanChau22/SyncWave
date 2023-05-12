FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm clean-install --omit=dev
COPY . .
CMD ["npm","run", "prod"]