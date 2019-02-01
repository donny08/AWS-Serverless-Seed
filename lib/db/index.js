/**
 * Created by Yogendra Maurya on 6/10/2015.
 */
var db = {};
var async = require('async');

// db.rabbitmq = require('./amqp');
// db.mongo = require('./mongo');
// db.mysql = require('./mysql');
// db.redis = require('./redis');
db.dynamodb = require('./dynamodb');
// db.postgresql = require('./postgresql');
// db.elasticsearch = require('./elasticsearch');

db.close_all = function(__callback) {
    console.info('request for closing all db');
    async.series(
        [
            // db.rabbitmq.close_all,
            // db.mongo.close,
            db.dynamodb.close
            // db.redis.close,
            // db.mysql.close,
            // db.postgresql.close,
            // db.elasticsearch.close
        ],
        function(err, results) {
            if (err) {
                console.error('failed to close all databases', { err: err });
                __callback(err);
            } else {
                __callback(null);
            }
        }
    );
};


db.initialize = function(__callback) {
    async.series(
        [
            // db.rabbitmq.init,
            // db.mongo.init,
            db.dynamodb.init
            // db.redis.init,
            // db.mysql.init,
            // db.postgresql.init,
            // db.elasticsearch.init
        ],
        function(err, results) {
            if (err) {
                console.error('failed to run all databases', { err: err });
                __callback(err);
            } else {
                __callback(null);
            }
        }
    );
};


module.exports = db;