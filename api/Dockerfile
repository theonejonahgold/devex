FROM node:14-alpine3.12

COPY --from=builder /build /build

COPY . /build/api

WORKDIR /build/api

RUN yarn build

RUN yarn --production --frozen-lockfile

EXPOSE 5000

CMD ["yarn", "start"]