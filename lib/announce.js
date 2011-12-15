/*!
 * socket.io-announce
 * Copyright(c) 2011 Daniel Shaw <dshaw@dshaw.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var events = require('events')
  , util = require('util')
  , sio = require('socket.io')
  , redis = require('redis')
  , EventEmitter = events.EventEmitter
  , RedisClient = redis.RedisClient
  , parser = sio.parser;

/**
 * Exports
 */

exports = module.exports = Announce;
exports.createClient = createClient;

/**
 * Utils
 */

var slice = Array.prototype.slice;

/**
 * Announce.
 * Options:
 *     - nodeId (string) id that uniquely identifies this node
 *     - pub (object) instance of RedisClient or options to pass in for the pub redis client
 *     - pack (fn) custom packing, defaults to JSON or msgpack if installed
 *
 * @api public
 */

function Announce (options) {
  options || (options = {});

  // node id to uniquely identify this node
  this.nodeId = options.nodeId || (function () { return Math.abs(Math.random() * Math.random() * Date.now() | 0); })();

  // namespace for the announcements
  this.namespace = options.namespace || '';

  // packing mechanism
  if (options.pack) {
    this.pack = options.pack;
  } else {
    try {
      var msgpack = require('msgpack');
      this.pack = msgpack.pack;
    } catch (e) {
      this.pack = JSON.stringify;
    }
  }

  // initialize a redis client for publishing
  if (options.redisPub instanceof RedisClient) {
    this.pub = options.redisPub;
  } else {
    options.redisPub || (options.redisPub = {});
    this.pub = redis.createClient(options.redisPub.port, options.redisPub.host, options.redisPub);
  }

  this.setFlags();
}

/**
 * Inherits from EventEmitter.
 */

util.inherits(Announce, EventEmitter);


/**
 * Send a message.
 * - no acks.
 *
 * @api public
 */

Announce.prototype.send = function (data) {
  var packet = {
      type: this.flags.json ? 'json' : 'message'
    , data: data
  };

  return this.packet(packet);
};

/**
 * Original emit function.
 *
 * @api private
 */

Announce.prototype.$emit = EventEmitter.prototype.emit;

/**
 * Socket.io Emit for custom events.
 * - No acks.
 *
 * @api public
 */

Announce.prototype.emit = function (ev) {
  var args = slice.call(arguments, 1)
    , packet = {
          type: 'event'
        , name: ev
        , args: args
      };

  return this.packet(packet);
};

/**
 * JSON message flag.
 *
 * @api public
 */

Announce.prototype.__defineGetter__('json', function () {
  this.flags.json = true;
  return this;
});

/**
 * Volatile message flag.
 *
 * @api public
 */

Announce.prototype.__defineGetter__('volatile', function () {
  this.flags.volatile = true;
  return this;
});

/**
 * Overrides the room to broadcast messages to (flag)
 *
 * @api public
 */

Announce.prototype.to = Announce.prototype.in = function (room) {
  this.flags.room = room;
  return this;
};

/**
 * Sets the default flags.
 *
 * @api private
 */

Announce.prototype.setFlags = function () {
  this.flags = { endpoint: this.namespace };
  return this;
};

/**
 * Sends out a packet
 *
 * @api private
 */

Announce.prototype.packet = function (packet) {
  packet.endpoint = this.namespace + (this.flags.room ? '/' + this.flags.room : '');

  var volatile = this.flags.volatile
    , exceptions = []
    , packet = parser.encodePacket(packet);

  this.publish('dispatch', this.flags.endpoint, packet, volatile, exceptions);

  this.setFlags();

  return this;
};


/**
 * Publishes a message.
 *
 * @api private
 */

Announce.prototype.publish = function (name) {
  var args = slice.call(arguments, 1);
  this.pub.publish(name, this.pack({ nodeId: this.nodeId, args: args }));
};


/**
 * Create an Announce Client
 *
 * @api public
 */

function createClient (options) {
  return new Announce(options);
}
