var lib_mysql = {};
var mysql = require('mysql');
var config = require('../../config');
var __logger = require('../../lib/logger');



lib_mysql.close = function (__callback) {
    if (config.mysql.init) {
        __logger.warn('lib_mysql.close, function called', {host: config.mysql.options.host});
        lib_mysql.conn.end();
        __callback(null);
    } else {
        __callback(null);
    }
};

lib_mysql.init = function (__callback) {
    var __m = 'lib_mysql.init';
    if (!config.mysql.init) {
        lib_mysql.conn = null;
        __callback(null);
        return;
    }
    var pool = mysql.createPool({
        connectionLimit: config.mysql.options.connection_limit,
        host: config.mysql.options.host,
        user: config.mysql.options.user,
        password: config.mysql.options.password,
        database: config.mysql.options.database
    });
    setTimeout(function () {
        __logger.info('connecting with mysql', {method: __m, host: config.mysql.options.host});
        pool.getConnection(function (err, connection) {
            if (err) {
                __logger.error('connection failed with mysql', {method: __m, host: config.mysql.options.host});
                __callback({message: 'mysql connection failed', err: err, mysql: config.mysql});
            }
            else {
                __logger.info('connection established with mysql', {method: __m, host: config.mysql.options.host});
                connection.release();
                lib_mysql.conn = pool;
                __callback(null);
            }
        });
    }, 1000);
};
module.exports = lib_mysql;