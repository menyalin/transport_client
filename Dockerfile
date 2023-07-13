FROM node:lts-alpine as build
WORKDIR /app
ENV VUE_APP_API_URL=https://s4log.ru/api
ENV VUE_APP_API_WS_URL=https://s4log.ru
ENV VUE_APP_STATIC_URL=https://s4log.ru  
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /var/www/html
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]