# From https://stackoverflow.com/a/51866862
FROM node:14-alpine3.12

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

COPY --from=mwader/static-ffmpeg:4.4.0 /ffmpeg /usr/local/bin/
COPY --from=mwader/static-ffmpeg:4.4.0 /ffprobe /usr/local/bin/
COPY --from=mwader/static-ffmpeg:4.4.0 /qt-faststart /usr/local/bin/

COPY --from=builder /build /build

COPY . /build/stream

WORKDIR /build/stream

RUN if [ $NODE_ENV == "production" ]; then yarn build; fi

RUN if [ $NODE_ENV == "production" ]; then yarn install --frozen-lockfile; fi

EXPOSE 8000

EXPOSE 1935

CMD ["yarn", "start"]