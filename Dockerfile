FROM node:alpine
WORKDIR /app
COPY ./ ./
RUN npm ci --only=production --omit=dev
RUN npm install yarn
CMD ["yarn","start"] 


