FROM node:17-alpine AS build
COPY . .
RUN npm install && npm run build

FROM node:17-alpine
COPY --from=build build/index.js .
COPY input.txt .
CMD node index.js
