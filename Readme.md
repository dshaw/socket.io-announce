# socket.io-announce

Lightweight infrastructure broadcast for use with Socket.io RedisStore.

## Install

    npm install socket.io-announce

## Use anywhere in your stack, independent of other socket.io servers.

    var announce = require('socket.io-announce').createClient()
    announce.emit('status', { msg:'Going down for maintenance in 15 minutes', countdown: 15*60*1000 })

## Emit to all users.

    announce.send('Hello, world!')
    announce.emit('quote', { symbol:'APPL', price: 5000 })

## Target socket.io rooms.

    announce.in('boardroom').send('Yoyo yo!')
    announce.in('nodeup').emit('tweet', {
      id: '130749992326533122',
      user:'@dshaw',
      text: 'Keeping things small and tightly focused actually makes solving big problems easier.'
    })

## Target socket.io namespaces (with rooms too).

    var announce = require('socket.io-announce')({ namespace: '/podcast' })
    announce.in('nodeup').emit('episode', {
      url: 'http://www.nodeup.com/twentyfour',
      name: 'NodeUp twentyfour - a secure show'
    })

## Sample Apps

* [Stock Quote Stream](https://github.com/dshaw/socket.io-announce/tree/master/examples/stock-quotes)

## License

(The MIT License)

Copyright (c) 2012 Daniel D. Shaw, http://dshaw.com

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.