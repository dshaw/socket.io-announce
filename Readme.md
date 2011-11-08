# socket.io-announce
Lightweight infrastructure broadcast for use with Socket.io RedisStore

## Install

```
npm install socket.io-announce
```

## Use anywhere in your stack, independent of other socket.io servers.

```javascript
var announce = require('socket.io-announce').createClient();
announce.emit('status', { msg:'Going down for maintaince in 15 minutes', countdown: 15*60*1000 });
```

## Emit to all users.

```javascript
announce.send('Hello, world!');
announce.emit('quote', { symbol:'APPL', price: 5000 });
```

## Target specific rooms or namespaces.

```javascript
announce.in('boardroom').send('Yoyo yo!');`
announce.in('nodeup').emit('tweet', {
  id: '130749992326533122',
  user:'@dshaw',
  text: 'Keeping things small and tightly focused actually makes solving big problems easier.'
});
```

## Sample Apps

* [Stock Quote Stream](https://github.com/dshaw/socket.io-announce/tree/master/examples/stock-quotes)

## License

* MIT
