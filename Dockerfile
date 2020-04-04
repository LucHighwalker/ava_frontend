FROM node:12.16.1 as react-build
WORKDIR /app
COPY . ./
RUN yarn
RUN yarn build

FROM nginx:alpine

# incase react router is broken - https://medium.com/greedygame-engineering/so-you-want-to-dockerize-your-react-app-64fbbb74c217
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]