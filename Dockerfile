FROM node:16-alpine
ARG password
ENV DB_USER=subathontimer
ENV DB_PASS=$password
ENV DB=subathontimer
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 80
CMD ["node", "app.js"]