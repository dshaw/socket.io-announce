var sia = require('..')
  , test = require('tap').test

test('Announce', function (t) {
  var EventEmitter = require('events').EventEmitter
    , RedisClient = require('redis').RedisClient
    , Announce = sia
    , announce = sia()

  t.plan(5)

  t.isa(announce, EventEmitter, 'announce should be instanceof EventEmitter')
  t.isa(announce, Announce, 'announce should be instanceof Announce')
  t.isa(announce.pub, RedisClient, 'pub should be instanceof RedisClient')

  t.ok(announce.nodeId, 'nodeId is defined')
  t.equal(announce.namespace, '', 'default namespace should be empty string')

  t.end()
})
