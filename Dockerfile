FROM node:12.16.1
WORKDIR /app
COPY . ./
RUN yarn
RUN yarn build
RUN yarn global add serve

EXPOSE 5000
CMD ["serve", "-s", "build"]