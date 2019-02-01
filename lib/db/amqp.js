/**
 * Created by Yogendra Maurya on 6/16/2015.
 */
var lib_amqp = {};
var amqplib = require('amqplib');
var Humanize = require('humanize-plus');

var __config = require('../../config');
var __define = require('../../config/define');
var __logger = require('../../lib/logger');

lib_amqp.rabbit = {
    conn: null,
    channel: {}
};

lib_amqp.close_all = function (__callback) {
    try {
        lib_amqp.rabbit.conn.close();
        for (var q_name in lib_amqp.rabbit.channel) {
            // lib_amqp.rabbit.channel[q_name].close();
        }
    } catch (e) {
        __logger.error('lib_amqp.close_all, exception', {err: e});
    } finally {
        __callback(null);
    }
};

lib_amqp.init = function (__callback) {
    if (!__config.rabbitmq.init) {
        lib_amqp.rabbit.conn = null;
        __callback(null);
        return;
    }
    if (__callback) {
        setTimeout(function () {
            __callback(null);
        }, __config.rabbitmq.delay_connection_callback);
    }
    var all_queues = __define.MQ;
    for (var queue_index in all_queues) {
        var queue = all_queues[queue_index];
        switch (queue.type) {
            case 'queue':
                if (queue.createChannel) {
                    lib_amqp.create_channels_for_queue(queue);
                }
                break;
            case 'exchange':
                lib_amqp.create_exchange(queue.q_name, queue.ex_type, queue.q_options);
                if (queue.createChannel) {
                    lib_amqp.create_channels_for_queue(queue);
                }
                break;
            case 'bind':
                lib_amqp.create_bind(queue.q_name, queue.ex_name, queue.r_key);
                break;
        }
    }
};
lib_amqp.create_exchange = function (exchange_name, exchange_type, options) {
    amqplib.connect(__config.rabbitmq.amqp_url).then(function (conn) {
        __logger.info('lib_amqp.create_exchange, connection established', {amqp_url: __config.rabbitmq.amqp_url});
        conn.createChannel().then(function (ch) {
            __logger.info('lib_amqp.create_exchange, declaring a exchange', {exchange_name: exchange_name});
            var ok = ch.assertExchange(exchange_name, exchange_type, options);
            return ok.then(function (_qok) {
                __logger.info('lib_amqp.create_exchange, exchangeDeclared', {exchange_name: exchange_name});
                ch.close();
                conn.close();
            });
        });
    });
};
lib_amqp.create_bind = function (q_name, exchange_name, routing_key) {
    amqplib.connect(__config.rabbitmq.amqp_url).then(function (conn) {
        __logger.info('lib_amqp.create_bind, connection established', {amqp_url: __config.rabbitmq.amqp_url});
        conn.createChannel().then(function (ch) {
            __logger.info('lib_amqp.create_bind, declaring a bind', {q_name: q_name, exchange_name: exchange_name});

            var ok = ch.bindQueue(q_name, exchange_name, routing_key);

            return ok.then(function (_qok) {
                __logger.info('lib_amqp.create_bind, success', {q_name: q_name, exchange_name: exchange_name});
                ch.close();
                conn.close();
            });
        });
    });
};
lib_amqp.create_channels_for_queue = function (queue) {
    amqplib.connect(__config.rabbitmq.amqp_url).then(function (conn) {
        __logger.info('lib_amqp.init, connection established', {amqp_url: __config.rabbitmq.amqp_url});
        lib_amqp.rabbit.conn = conn;
        conn.once('error', lib_amqp.handle_error);

        conn.createChannel().then(function (ch) {
            lib_amqp.rabbit.channel[queue.q_name] = ch;
            __logger.info('lib_amqp.init, declaring a queue', {q_name: queue.q_name});
            var ok = lib_amqp.rabbit.channel[queue.q_name].assertQueue(queue.q_name, queue.q_options);
            lib_amqp.rabbit.channel[queue.q_name].prefetch(queue.prefetchCount);
            return ok.then(function (_qok) {
                __logger.info('lib_amqp.init, queueDeclared', {q_name: queue.q_name});
            });
        });

    });

};
lib_amqp.handle_error = function (err) {
    __logger.error('lib_amqp.handle_error_and_reconnect, error in connection', {amqp_url: __config.rabbitmq.amqp_url, err: err});
    lib_amqp.rabbit.conn = null;
    process.exit(1);
    var reconnect = setInterval(function () {
        if (lib_amqp.rabbit.conn) {
            clearInterval(reconnect);
        } else {
            lib_amqp.init();
            __logger.warn('lib_amqp.handle_error_and_reconnect, reconnecting', {amqp_url: __config.rabbitmq.amqp_url});
        }
    }, __config.rabbitmq.reconnect_interval);
};

lib_amqp.send_to_queue = function (queue, message, __callback) {
    __logger.debug('lib_amqp.send_to_queue, got request', {q_name: queue.q_name, message: Humanize.truncate(message, 50)});
    if (lib_amqp.rabbit.conn) {
        if (lib_amqp.rabbit.channel[queue.q_name]) {
            lib_amqp.rabbit.channel[queue.q_name].sendToQueue(queue.q_name, new Buffer(message), {persistent: true});
            __logger.debug('lib_amqp.send_to_queue, queued success', {q_name: queue.q_name, message: Humanize.truncate(message, 50)});
            __callback(null);
        } else {
            lib_amqp.rabbit.conn.createChannel().then(function (ch) {
                lib_amqp.rabbit.channel[queue.q_name] = ch;
                var ok = lib_amqp.rabbit.channel[queue.q_name].assertQueue(queue.q_name, queue.q_options);
                return ok.then(function (_qok) {
                    __logger.info('lib_amqp.init, queueDeclared', {q_name: queue.q_name});
                    lib_amqp.rabbit.channel[queue.q_name].sendToQueue(queue.q_name, new Buffer(message), {persistent: true});
                    __logger.debug('lib_amqp.send_to_queue, queued success', {q_name: queue.q_name, message: Humanize.truncate(message, 50)});
                    __callback(null);
                });
            });
        }
    }
    else {
        __logger.error('lib_amqp.send_to_queue, failed due to closed connection', {q_name: queue.q_name, message: message});
        __callback(1);
    }
};

lib_amqp.publish_to_exchange = function (exchange, message, __callback) {
    __logger.debug('lib_amqp.publish_to_exchange, got request', {q_name: exchange.q_name, message: Humanize.truncate(message, 50)});
    if (lib_amqp.rabbit.conn) {
        if (lib_amqp.rabbit.channel[exchange.q_name]) {
            lib_amqp.rabbit.channel[exchange.q_name].publish(exchange.q_name, "", new Buffer(message), {persistent: true});
            __logger.debug('lib_amqp.publish_to_exchange, queued success', {q_name: exchange.q_name, message: Humanize.truncate(message, 50)});
            __callback(null);
        } else {
            lib_amqp.rabbit.conn.createChannel().then(function (ch) {
                lib_amqp.rabbit.channel[exchange.q_name] = ch;
                var ok = lib_amqp.rabbit.channel[exchange.q_name].assertExchange(exchange.q_name, exchange.ex_type, exchange.q_options);
                return ok.then(function (_qok) {
                    __logger.info('lib_amqp.publish_to_exchange, queueDeclared', {q_name: exchange.q_name});
                    lib_amqp.rabbit.channel[exchange.q_name].publish(exchange.q_name, "", new Buffer(message), {persistent: true});
                    __logger.debug('lib_amqp.publish_to_exchange, queued success', {q_name: exchange.q_name, message: Humanize.truncate(message, 50)});
                    __callback(null);
                });
            });
        }
    }
    else {
        __logger.error('lib_amqp.publish_to_exchange, failed due to closed connection', {q_name: queue.q_name, message: message});
        __callback(1);
    }
};

lib_amqp.fetch_from_queue = function (queue, __callback) {
    __logger.debug('lib_amqp.fetch_from_queue, got request', {q_name: queue.q_name});
    if (lib_amqp.rabbit.conn) {
        __logger.debug('lib_amqp.fetch_from_queue, waiting for message');
        lib_amqp.rabbit.channel[queue.q_name].consume(queue.q_name, function (msg) {
            __logger.debug('lib_amqp.fetch_from_queue, got message', {message: Humanize.truncate(msg.content.toString(), 50)});
            __callback(msg, function (err) {
                if (err) {
                    lib_amqp.rabbit.channel[queue.q_name].nack(msg);
                }
                else {
                    lib_amqp.rabbit.channel[queue.q_name].ack(msg);
                }
            });
        }, {noAck: false});

    }
    else {
        __logger.error('lib_amqp.fetch_from_queue, failed due to closed connection', {q_name: queue.q_name});
    }
};

module.exports = lib_amqp;