# DevEx

The built-from-scratch live-streaming platform for all developers. Share your coding sessions live to the world for everyone to enjoy!

## Table of contents

- [Getting started](#getting-started)
  - [Install the project](#install-the-project)
  - [Project setup](#project-setup)
  - [Available commands](#available-commands)
- [Tech stack](#tech-stack)
  - [API package](#api-package)
  - [Stream package](#stream-package)
  - [Web package](#web-package)
- [Features](#features)
  - [Must haves](#must-haves)
  - [Should haves](#should-haves)
  - [Could haves](#could-haves)
  - [Would like to haves](#would-like-to-haves)
- [Sketches](#sketches)
- [Data lifecycles](#data-lifecycles)
- [What I've learned](#what-ive-learned)

## Getting started

This project uses workspaces, and prefers [Yarn classic](https://classic.yarnpkg.com/lang/en/) over NPM as its package manager. For the best developer experience, use [Docker][docker] so you don't have to install [FFmpeg][ffmpeg] locally and setup environment variables yourself.

This project also uses [Firebase](https://firebase.google.com). After you've set-up the project, create a Firebase app, add a service account for the Firestore and put the downloaded JSON file inside the `api` folder as `firebase.json`. Docker will do the rest. If you've never worked with Firebase before, [get started here](https://firebase.google.com/docs/guides).

### Install the project

```shell
$ git clone https://github.com/theonejonahgold/real-time-web-2021 rtw
$ cd rtw
$ yarn || npm install
```

### Project setup

```
└─ real-time-web-2021
   ├─ api - NodeJS CRUD api for 'web' and 'stream' packages.
   ├─ docs - Documentation folder.
   ├─ stream - Node-media-server for ingesting RTMP streams and processing them to HLS.
   └─ web - The web app you see at https://devex.jonahgold.dev.
```

### Available commands

```shell
$ yarn dev:up # Runs 'stream' and 'api' packages in docker and web outside of it due to a bug with SvelteKit.
$ yarn dev:down # Shuts down docker containers for 'stream' and 'api'
$ yarn prod # Run all packages inside of docker (for production).
$ yarn format # Run prettier to format all project files.
$ yarn lint # Run prettier to check formatting on all files.
```

These commands are available from the root of the project, but every package has their own `build`, `dev` and `start` script as well.

## Tech stack

- [Docker][docker]
- [NodeJS](https://nodejs.org)
- [TypeScript](https://typescriptlang.org)
- [Prettier](https://prettier.io)
- [Commitizen](https://commitizen.github.io/cz-cli/)
- [Commitlint](https://commitlint.js.org/)
- [Husky](https://typicode.github.io/husky/)

### API package

- [KoaJS](https://koajs.com)
- [Firebase Firestore](http://firebase.google.com)
- [Socket.IO](https://socket.io)
- [Passport.JS](http://www.passportjs.org)
- [Argon2](https://github.com/ranisalt/node-argon2#readme)

### Stream package

- [Node Media Server](https://github.com/illuspas/Node-Media-Server#readme)
- [Node Fetch](https://github.com/bitinn/node-fetch)
- [FFmpeg][ffmpeg]

### Web package

- [Svelte](https://svelte.dev)
- [Socket.IO](https://socket.io)
- [SvelteKit](https://kit.svelte.dev)
- [PostCSS](https://postcss.org)

## Features

### Must haves

- [x] Register.
- [x] Log in.
- [x] Live stream video from broadcasting software like OBS.
  - [x] Authenticate your stream with a stream key.
- [x] View streams.
- [x] Chat on other people's streams.

### Should haves

- [ ] Have a nice onboarding experience.
- [x] Follow other profiles.
- [x] Set stream title.
- [x] Set programming language.
- [x] Discover live channels on programming language.
- [x] Have a stream thumbnail.

### Could haves

- [x] Show when someone you follow is live or offline.
- [ ] Chat emotes.
- [ ] Follow notifications in chat. 

### Would like to haves

- [ ] Chat moderators.
- [ ] Persistent chat message storage.
- [ ] Video on-demand.

## Sketches

![Sketch of the discovery page](docs/discover.png)

The Discovery has a list of channels that are live. In the always-present sidebar you can see your followed channels. And watch them from anywhere.

![Sketch of the languages page](docs/languages.png)

The Languages page shows all programming languages, so you don't have to sift through programming languages you don't like to watch.

![Sketch of the stream page](docs/stream.png)

The Stream page shows a live stream, with the corresponding chat next to it.

## Data Lifecycles

### For live streaming

![Data lifecycle of live streaming flow](docs/streamer-lifecycle.png)

### For website

![Data lifecycle of web data flow](docs/web-lifecycle.png)

## What I've learned

<!-- TODO: Write what I've learned -->

[docker]: https://docker.com
[ffmpeg]: http://ffmpeg.org
