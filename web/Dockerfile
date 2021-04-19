FROM node:14-alpine3.12

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

COPY --from=builder /build /build

COPY . /build/web

WORKDIR /build/web

RUN yarn build

RUN if [ $NODE_ENV == "production" ]; then yarn install --frozen-lockfile; fi

EXPOSE 3000

CMD ["node", "dist"]