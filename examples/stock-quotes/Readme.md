# Stock Quote Stream powered by socket.io-announce

### Setup
Runs on Node.js v0.5.9+.

* `npm install`

### Running manually
* `node data` - start data stream.
* `node app [port] [nodeId]` - start the socket.io app.

### Managed cluster
* `node exec [n]` - manage all processes, creating a data stream and n socket.io apps. defaults to 4.
