FROM node:16.3.0-alpine As builder
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN export NODE_OPTIONS="--max-old-space-size=16192"
RUN npm run build
FROM nginx:1.15.8-alpine
COPY --from=builder /usr/src/app/dist/my-app/ /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/
