# Socket.io RedisStore Lightweight Announcements


## Examples

`var announce = require('socket.io-announce').createClient();`

`announce.emit('status', { msg:'Going down for maintaince in 15 minutes', countdown: 15*60*1000 });`

`announce.emit('quote', { symbol:'APPL', price: 5000 });`

## Rooms

`announce.in('boardroom').send('Yoyo yo!');`

