FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force && \
    npm install

COPY . .

EXPOSE 8080

ENV NODE_ENV=development

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 