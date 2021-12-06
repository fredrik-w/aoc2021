FROM node:17-slim AS build
COPY . .
RUN npm install && npm run build

FROM node:17-slim
COPY --from=build build/index.js .
COPY input.txt .
CMD node index.js
