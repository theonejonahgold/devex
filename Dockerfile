FROM node:14-alpine3.12

COPY --from=builder /build /build

WORKDIR /build

RUN yarn --frozen-lockfile

CMD ["true"]