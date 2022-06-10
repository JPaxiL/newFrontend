FROM node:12.16.1-alpine As builder
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:1.15.8-alpine
RUN export NODE_OPTIONS="--max-old-space-size=8192"
COPY --from=builder /usr/src/app/dist/my-app/ /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/
