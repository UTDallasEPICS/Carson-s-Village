FROM --platform=linux/arm64 node:alpine
COPY ./.output /
EXPOSE 3000
CMD ["node", "./server/index.mjs"]
