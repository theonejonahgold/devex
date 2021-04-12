# From https://stackoverflow.com/a/51866862
FROM node:14-alpine3.12

COPY --from=mwader/static-ffmpeg:4.4.0 /ffmpeg /usr/local/bin/
COPY --from=mwader/static-ffmpeg:4.4.0 /ffprobe /usr/local/bin/
COPY --from=mwader/static-ffmpeg:4.4.0 /qt-faststart /usr/local/bin/

COPY --from=builder /build /build

COPY . /build/stream

WORKDIR /build/stream

RUN yarn build

RUN which ffmpeg

RUN yarn --production --frozen-lockfile

EXPOSE 8000

EXPOSE 1935

CMD ["yarn", "start"]