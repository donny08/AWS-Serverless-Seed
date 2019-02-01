/**
 *
 * @author deepak.ambekar [7/3/2017].
 */

var lib_es = {};
var __config = require('../../config');
var __logger = require('../logger');
const elasticsearch = require('elasticsearch');

lib_es.close = function (__callback) {
    var __m = 'lib_es.close';
    if (__config.elasticsearch.init) {
        __logger.warn('elasticsearch connection closed ', {m: __m, host: __config.elasticsearch.options.host});
        lib_es.conn.close();
        __callback(null);
    } else {
        __callback(null);
    }
};

lib_es.init = function (__callback) {
    var __m = 'lib_es.init';
    if (!__config.elasticsearch.init) {
        lib_es.conn = null;
        return __callback(null);
    }
    var esHost = {
        host: __config.elasticsearch.options.host,
        protocol: __config.elasticsearch.options.protocol,
        port: __config.elasticsearch.options.port
    };
    if (__config.elasticsearch.use_auth)
        esHost.auth = __config.elasticsearch.options.username + ":" + __config.elasticsearch.options.password;
    var esConfig = {
        host: [esHost],
        apiVersion: __config.elasticsearch.options.apiVersion,
        log: __config.elasticsearch.options.log || ''
    };
    var client = new elasticsearch.Client(esConfig);
    __logger.info('success connection to elasticsearch:', {m: __m, host: __config.elasticsearch.options.host});
    lib_es.conn = client;

    lib_es.conn.ping({
        requestTimeout: 3000
    }, function (error) {
        if (error) {
            __logger.error('elasticsearch cluster is down!', {m: __m, host: __config.elasticsearch.options.host});
        } else {
            __logger.info('elasticsearch cluster is working!', {m: __m, host: __config.elasticsearch.options.host});
        }
    });
    __callback(null);
};

lib_es.__callAPI = function (apiType, esQuery, __cb) {
    var __m = 'lib_es.__count';
    __logger.debug('request for elasticsearch API "' + apiType+'"', {m: __m, host: __config.elasticsearch.options.host});
    if (lib_es.conn) {
        try {
            lib_es.conn[apiType](esQuery, function (error, response) {
                if (error) {
                    __logger.error('Query Error:', {m: __m, host: __config.elasticsearch.options.host, query: esQuery});
                    __cb(error, null);
                } else {
                    __logger.debug('Query Success:', {m: __m, host: __config.elasticsearch.options.host, query: esQuery});
                    __cb(null, response);
                }
            });
        }
        catch (e) {
            __logger.error('Error in elasticsearch API "' + apiType + '".Invalid request.', {m: __m, host: __config.elasticsearch.options.host});
            __cb(new Error('Invalid API request'));
        }
    }
    else {
        __logger.error('not connected:', {m: __m, host: __config.elasticsearch.options.host});
        __cb(new Error('not connected'));
    }
}

lib_es.__count = function (esQuery, __cb) {
    var __m = 'lib_es.__count';
    __logger.debug('request for elasticsearch count', {m: __m, host: __config.elasticsearch.options.host});
    if (lib_es.conn) {
        lib_es.conn.count(esQuery, function (error, response) {
            if (error) {
                __logger.error('Query Error:', {m: __m, host: __config.elasticsearch.options.host, query: esQuery});
                __cb(error, null);
            } else {
                __logger.debug('Query Success:', {m: __m, host: __config.elasticsearch.options.host, query: esQuery});
                __cb(null, response);
            }
        });
    }
    else {
        __logger.error('not connected:', {m: __m, host: __config.elasticsearch.options.host});
        __cb(new Error('not connected'));
    }
}

lib_es.__search = function (esQuery, __cb) {
    var __m = 'lib_es.__search';
    __logger.debug('request for elasticsearch search', {m: __m, host: __config.elasticsearch.options.host});
    if (lib_es.conn) {
        lib_es.conn.search(esQuery, function (error, response) {
            if (error) {
                __logger.error('Query Error:', {m: __m, host: __config.elasticsearch.options.host, query: esQuery});
                __cb(error, null);
            } else {
                __logger.debug('Query Success:', {m: __m, host: __config.elasticsearch.options.host, query: esQuery});
                __cb(null, response);
            }
        });
    }
    else {
        __logger.error('not connected:', {m: __m, host: __config.elasticsearch.options.host});
        __cb(new Error('not connected'));
    }
}


module.exports = lib_es;