var sia = require('..')
  , sio = require('socket.io')
  , client = require('socket.io-client')
  , tap = require('tap')
  , test = tap.test
  , port = 15200

test('Announce rooms', function (t) {
  t.plan(1)
  port++;

  var announce = sia()
    , io = sio.listen(port, { store: new sio.RedisStore })
    , cl = client.connect('http://localhost:'+port)

  io.on('connection', function (socket) {
    socket.join('ann-room')
  })

  cl.on('connect', function () {
    announce.in('ann-room').emit('ann', 'dshaw')
  })

  cl.on('ann', function (data) {
    t.equal(data, 'dshaw', 'ann received dshaw')
    cl.disconnect()
    io.server.close()
    t.end()
  })
})
