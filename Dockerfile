FROM node:16-alpine
ARG password
ENV DB_USER=admin
ENV DB_PASS=$password
ENV DB=subathontimer
ENV REDIS_PASS=$redis_password
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 80
CMD ["node", "app.js"]