/**
 *
 * @author deepak.ambekar [6/28/2017].
 */
var lib_postgresql = {};
var __config = require('../../config');
var __logger = require('../logger');
const pg = require('pg'); //postgresql package

lib_postgresql.close = function (_callback) {
    var __m = 'lib_postgresql.close';
    if (__config.postgresql.init) {
        __logger.warn('connection closed ', {m: __m, host: __config.postgresql.options.host});
        lib_postgresql.conn.end();
        _callback(null);
    } else {
        _callback(null);
    }
}

lib_postgresql.init = function (_callback) {
    var __m = 'lib_postgresql.init';
    if (!__config.postgresql.init) {
        lib_postgresql.conn = null;
        return _callback(null);
    }
    var pgConfig = {
        user: __config.postgresql.options.user, //env var: PGUSER
        database: __config.postgresql.options.database, //env var: PGDATABASE
        password: __config.postgresql.options.password, //env var: PGPASSWORD
        host: __config.postgresql.options.host, // Server hosting the postgres database
        port: __config.postgresql.options.port, //env var: PGPORT
        max: __config.postgresql.options.max_connection // max number of clients in the pool
    };
    const pool = new pg.Pool(pgConfig);
    pool.on('error', function (err, client) {
        __logger.error('client error::', {m: __m, host: __config.postgresql.options.host, err_msg: err.message, err_stack: err.stack});
    });
    pool.query('SELECT $1::text as name', ['postgresql'], function (err, result) {
        if (err) {
            __logger.error('connection failed with postgresql', {m: __m, host: __config.postgresql.options.host});
            return _callback({message: 'postgresql connection failed', err: err, postgresql: __config.postgresql});
        }
        __logger.info('success connection to postgresql:', {m: __m, host: __config.postgresql.options.host});
        lib_postgresql.conn = pool;
        _callback(null);
    });
};

lib_postgresql.__getClient = function (__cb) {
    var __m = 'lib_postgresql.__getClient';
    __logger.debug('got request for postgresql client connection', {m: __m, host: __config.postgresql.options.host});
    if (lib_postgresql.conn) {
        lib_postgresql.conn.connect(function (err, client, release) {
            __cb(err, client, release);
        });
    }
    else {
        __logger.error('not connected:', {m: __m, host: __config.postgresql.options.host});
        __cb(new Error('not connected'));
    }
};

lib_postgresql.__query = function (pgQuery, queryParam, __cb) {
    var __m = 'lib_postgresql.__query';
    __logger.debug('got request for postgresql query', {m: __m, host: __config.postgresql.options.host});
    if (lib_postgresql.conn) {
        lib_postgresql.conn.query(pgQuery, queryParam, function (err, result) {
            if (err) {
                __logger.error('Query Error:', {m: __m, host: __config.postgresql.options.host, query: pgQuery, queryParam: queryParam});
                __cb(err, null);
            } else {
                __logger.debug('Query success:', {m: __m, host: __config.postgresql.options.host, query: pgQuery, queryParam: queryParam});
                __cb(null, result);
            }
        });
    }
    else {
        __logger.error('not connected:', {m: __m, host: __config.postgresql.options.host});
        __cb(new Error('not connected'));
    }
};

module.exports = lib_postgresql;