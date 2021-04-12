FROM node:14-alpine3.12

COPY --from=builder /build /build

COPY . /build/web

WORKDIR /build/web

RUN yarn build

RUN yarn --frozen-lockfile --production

EXPOSE 3000

CMD ["node", "dist"]