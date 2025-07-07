# OpenTiv2d Multiplayer Server

This is the server used to run a multiplayer Tivect game. The singleplayer game works perfectly fine statically, without a server.

In terms of development, this is very much a work in progress and remains mostly in the state from when it was taken from the original repository (see top-level readme for credits). Architecture documentation will go here.

## Running the server

Install modules
```sh
npm install
```

Run the server
```sh
npm run start
```

## Connecting to the server

To access your local server, type `ws://localhost:PORT` (with `PORT` replaced by your port number, such as `5002`).

However, `ws` is insecure so using `wss` is preferred. According to the original developer, `wss` requires an SSL certificate and is needed to run if others want to connect to your server.
