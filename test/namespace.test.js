var sia = require('..')
  , sio = require('socket.io')
  , client = require('socket.io-client')
  , tap = require('tap')
  , test = tap.test
  , port = 15100

test('Announce namespace', function (t) {
  t.plan(1)
  port++;

  var announce = sia({ namespace: '/news' })
    , io = sio.listen(port, { store: new sio.RedisStore })
    , cl = client.connect('http://localhost:'+port+'/news')

  var news = io.of('/news').on('connection', function (socket) {});

  cl.on('connect', function () {
    announce.emit('ann', 'dshaw')
  })

  cl.on('ann', function (data) {
    t.equal(data, 'dshaw', 'news ann received in news-room')
    cl.disconnect()
    io.server.close()
    t.end()
  })
})
