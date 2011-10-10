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
  , parser = sio.parser
  , redis = require('redis')
  , RedisClient = redis.RedisClient;

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
}

/**
 * Inherits from EventEmitter.
 */

util.inherits(Announce, events.EventEmitter);


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

Socket.prototype.__defineGetter__('json', function () {
  this.flags.json = true;
  return this;
});

/**
 * Volatile message flag.
 *
 * @api public
 */

Socket.prototype.__defineGetter__('volatile', function () {
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
  packet.endpoint = this.namespace;

  var volatile = this.flags.volatile
    , packet = parser.encodePacket(packet);

  this.publish('dispatch', packet.endpoint, packet, volatile);

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
