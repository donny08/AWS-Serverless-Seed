/**
 * Created by Yogendra Maurya on 6/9/2015.
 */
var lib_mongo = {};
var mongodb = require('mongodb');
var __config = require('../../config');
var __logger = require('../../lib/logger');
var MongoClient = require('mongodb').MongoClient;
var mongoAutoIncrement = require("mongodb-autoincrement");

lib_mongo.close = function(__callback) {
    if (__config.mongo.init) {
        __logger.warn('lib_mongo.close, function called', { uri: __config.mongo.uri });
        lib_mongo.conn.close();
        __callback(null);
    } else {
        __callback(null);
    }
};

lib_mongo.init = function(__callback) {
    if (!__config.mongo.init) {
        lib_mongo.conn = null;
        __callback(null);
        return;
    }
    MongoClient.connect(__config.mongo.uri, function(err, database) {
        if (err) {
            __logger.error('lib_mongo.init, error connecting mongodb in init():', { uri: __config.mongo.uri });
            __callback(err);
        } else {
            __logger.info('lib_mongo.init, success connection to mongodb in init():', { uri: __config.mongo.uri });
            lib_mongo.conn = database;
            __callback(null);

            //add default admin user
            if (database.databaseName == __config.db_name)
                require('../../app_module/user/userDbCtrl').insertDefaultAdminUser(database);

            database.on('error', function() {
                __logger.error('lib_mongo.init, error connecting mongodb:', { uri: __config.mongo.uri });
                lib_mongo.conn = null;
            });
            database.on('close', function() {
                __logger.error('lib_mongo.init, connection closed:', { uri: __config.mongo.uri });
            });
            database.on('reconnect', function() {
                __logger.info('lib_mongo.init, re-connected to mongodb:', { uri: __config.mongo.uri });
                lib_mongo.conn = database;
            });
        }
    });
};

lib_mongo.__autoIncrement = function(collection_name, query_index, __cb) {
    __logger.debug('lib_mongo.__autoIncrement, request', { db: 'mongo', collection: collection_name, query_index: query_index });
    if (lib_mongo.conn) {
        mongoAutoIncrement.getNextSequence(lib_mongo.conn, collection_name, function(err, autoIndex) {
            if (err) {
                __logger.error('lib_mongo.__autoIncrement, failed', { db: 'mongo', collection: collection_name, query_index: query_index });
                __cb(err, null);
            } else {
                var collection = lib_mongo.conn.collection(collection_name);
                collection.createIndex(query_index, { unique: true });
                __logger.debug('lib_mongo.__autoIncrement, success', { db: 'mongo', collection: collection_name, query_index: query_index });
                __cb(null, autoIndex);
            }
        });
    } else {
        __logger.error('lib_mongo.__autoIncrement, error connecting mongodb:', { uri: __config.mongo.uri });
        __cb(new Error('not connected'));
    }
};

lib_mongo.__distinct = function(collection_name, distinct_param, __cb) {
    __logger.debug('lib_mongo.__distinct, request', { db: 'mongo', collection: collection_name, distinct_param: distinct_param });
    if (lib_mongo.conn) {
        var dbinfo = collection_name.split('.');
        var current_conn = lib_mongo.conn;
        if (dbinfo.length > 1) {
            current_conn = lib_mongo.conn.db(dbinfo[0]);
            collection_name = dbinfo[1];
        }
        current_conn.collection(collection_name).distinct(distinct_param, function(err, result) {
            if (err) {
                __logger.error('lib_mongo.__distinct, failed', { db: 'mongo', collection: collection_name, distinct_param: distinct_param });
                __cb(err, null);
            } else {
                __logger.debug('lib_mongo.__distinct, success', { db: 'mongo', collection: collection_name, distinct_param: distinct_param });
                __cb(null, result);
            }
        });
    } else {
        __logger.error('lib_mongo.__distinct, error connecting mongodb:', { uri: __config.mongo.uri });
        __cb(new Error('not connected'));
    }
};

lib_mongo.__findOne = function(collection_name, find_params, select_params, __cb) {
    __logger.debug('lib_mongo.__findOne, request', { db: 'mongo', collection: collection_name, params: find_params });
    if (lib_mongo.conn) {
        select_params = select_params || {};
        lib_mongo.conn.collection(collection_name).findOne(find_params, select_params, function(err, result) {
            if (err) {
                __logger.error('lib_mongo.__findOne, failed', { db: 'mongo', collection: collection_name, params: find_params });
                __cb(err, null);
            } else {
                __logger.debug('lib_mongo.__findOne, success', { db: 'mongo', collection: collection_name, params: find_params });
                __cb(null, result);
            }
        });
    } else {
        __logger.error('lib_mongo.__findOne, error connecting mongodb:', { uri: __config.mongo.uri });
        __cb(new Error('not connected'));
    }
};
lib_mongo.__find = function(collection_name, find_params, select_params, __cb) {
    __logger.debug('lib_mongo.__find, request', { db: 'mongo', collection: collection_name, params: find_params });
    if (lib_mongo.conn) {
        select_params = select_params || {};
        lib_mongo.conn.collection(collection_name).find(find_params, select_params).toArray(function(err, result) {
            if (err) {
                __logger.error('lib_mongo.__find, failed', { db: 'mongo', collection: collection_name, params: find_params });
                __cb(err, null);
            } else {
                __logger.debug('lib_mongo.__find, success', { db: 'mongo', collection: collection_name, params: find_params });
                __cb(null, result);
            }
        });
    } else {
        __logger.error('lib_mongo.__find, error connecting mongodb:', { uri: __config.mongo.uri });
        __cb(new Error('not connected'));
    }
};

lib_mongo.__findSort = function(collection_name, find_params, select_params, sort_params, __cb) {
    __logger.debug('lib_mongo.__find, request', { db: 'mongo', collection: collection_name, params: find_params, sort_params: sort_params });
    if (lib_mongo.conn) {
        select_params = select_params || {};
        sort_params = sort_params || {};
        lib_mongo.conn.collection(collection_name).find(find_params, select_params).sort(sort_params).toArray(function(err, result) {
            if (err) {
                __logger.error('lib_mongo.__find, failed', { db: 'mongo', collection: collection_name, params: find_params, sort_params: sort_params });
                __cb(err, null);
            } else {
                __logger.debug('lib_mongo.__find, success', { db: 'mongo', collection: collection_name, params: find_params, sort_params: sort_params });
                __cb(null, result);
            }
        });
    } else {
        __logger.error('lib_mongo.__find, error connecting mongodb:', { uri: __config.mongo.uri });
        __cb(new Error('not connected'));
    }
};

lib_mongo.__aggregate = function(collection_name, find_params, select_params, sort_params, __cb) {
    __logger.debug('lib_mongo.__aggregate, request', { db: 'mongo', collection: collection_name, params: find_params, sort_params: sort_params });
    if (lib_mongo.conn) {
        select_params = select_params || {};
        sort_params = sort_params || {};
        lib_mongo.conn.collection(collection_name).aggregate([find_params, select_params, sort_params]).toArray(function(err, result) {
            if (err) {
                __logger.error('lib_mongo.__aggregate, failed', { db: 'mongo', collection: collection_name, params: find_params, sort_params: sort_params });
                __cb(err, null);
            } else {
                __logger.debug('lib_mongo.__aggregate, success', { db: 'mongo', collection: collection_name, params: find_params, sort_params: sort_params });
                __cb(null, result);
            }
        });
    } else {
        __logger.error('lib_mongo.__aggregate, error connecting mongodb:', { uri: __config.mongo.uri });
        __cb(new Error('not connected'));
    }
};

lib_mongo.__insert = function(collection_name, document, __cb) {
    __logger.debug('lib_mongo.__insert, request', { db: 'mongo', collection: collection_name, document: document });
    if (lib_mongo.conn) {
        lib_mongo.conn.collection(collection_name).insert(document, { w: 1 }, function(err, result) {
            if (err) {
                __logger.error('lib_mongo.__insert, failed', { db: 'mongo', collection: collection_name, document: document });
                __cb(err, null);
            } else {
                __logger.debug('lib_mongo.__insert, success', { db: 'mongo', collection: collection_name, document: document });
                __cb(null, result);
            }
        });
    } else {
        __logger.error('lib_mongo.__insert, error connecting mongodb:', { uri: __config.mongo.uri });
        __cb(new Error('not connected'));
    }
};
lib_mongo.__update = function(collection_name, find_params, update_params, __cb) {
    __logger.debug('lib_mongo.__update, request', { db: 'mongo', collection: collection_name, params: find_params });
    if (lib_mongo.conn) {
        lib_mongo.conn.collection(collection_name).update(find_params, { "$set": update_params }, function(err, result) {
            if (err) {
                __logger.error('lib_mongo.__update, failed', { db: 'mongo', collection: collection_name, params: find_params });
                __cb(err, null);
            } else {
                __logger.debug('lib_mongo.__update, success', { db: 'mongo', collection: collection_name, params: find_params });
                __cb(null, result);
            }
        });
    } else {
        __logger.error('lib_mongo.__update, error connecting mongodb:', { uri: __config.mongo.uri });
        __cb(new Error('not connected'));
    }
};
lib_mongo.__multiupdate = function(collection_name, find_params, update_params, __cb) {
    __logger.debug('lib_mongo.__multiupdate, request', { db: 'mongo', collection: collection_name, params: find_params });
    if (lib_mongo.conn) {
        lib_mongo.conn.collection(collection_name).update(find_params, { "$set": update_params }, { multi: true, upsert: true }, function(err, result) {
            if (err) {
                __logger.error('lib_mongo.__multiupdate, failed', { db: 'mongo', collection: collection_name, params: find_params });
                __cb(err, null);
            } else {
                __logger.debug('lib_mongo.__multiupdate, success', { db: 'mongo', collection: collection_name, params: find_params });
                __cb(null, result);
            }
        });
    } else {
        __logger.error('lib_mongo.__multiupdate, error connecting mongodb:', { uri: __config.mongo.uri });
        __cb(new Error('not connected'));
    }
};
lib_mongo.__incr = function(collection_name, find_params, update_params, update_options, __cb) {
    __logger.debug('lib_mongo.__incr, request', { db: 'mongo', collection: collection_name, params: find_params });
    if (lib_mongo.conn) {
        lib_mongo.conn.collection(collection_name).update(find_params, update_params, update_options, function(err, result) {
            if (err) {
                __logger.error('lib_mongo.__incr, failed', { db: 'mongo', collection: collection_name, params: find_params });
                __cb(err, null);
            } else {
                __logger.debug('lib_mongo.__incr, success', { db: 'mongo', collection: collection_name, params: find_params });
                __cb(null, result);
            }
        });
    } else {
        __logger.error('lib_mongo.__update, error connecting mongodb:', { uri: __config.mongo.uri });
        __cb(new Error('not connected'));
    }
};
lib_mongo.__push = function(collection_name, find_params, push_params, update_params, __cb) {
    __logger.debug('lib_mongo.__push, request', { db: 'mongo', collection: collection_name, params: find_params });
    if (lib_mongo.conn) {
        var update_fields = {};
        if (push_params) {
            update_fields["$push"] = push_params;
        }
        if (update_params) {
            update_fields["$set"] = update_params;
        }

        lib_mongo.conn.collection(collection_name).update(find_params, update_fields, function(err, result) {
            if (err) {
                __logger.error('lib_mongo.__push, failed', { db: 'mongo', collection: collection_name, params: find_params });
                __cb(err, null);
            } else {
                __logger.debug('lib_mongo.__push, success', { db: 'mongo', collection: collection_name, params: find_params });
                __cb(null, result);
            }
        });
    } else {
        __logger.error('lib_mongo.__update, error connecting mongodb:', { uri: __config.mongo.uri });
        __cb(new Error('not connected'));
    }
};
lib_mongo.__delete = function(collection_name, find_params, __cb) {
    __logger.debug('lib_mongo.__delete, request', { db: 'mongo', collection: collection_name, params: find_params });
    if (lib_mongo.conn) {
        lib_mongo.conn.collection(collection_name).remove(find_params, function(err, result) {
            if (err) {
                __logger.error('lib_mongo.__delete, failed', { db: 'mongo', collection: collection_name, params: find_params });
                __cb(err, null);
            } else {
                __logger.debug('lib_mongo.__delete, success', { db: 'mongo', collection: collection_name, params: find_params });
                __cb(null, result);
            }
        });
    } else {
        __logger.error('lib_mongo.__delete, error connecting mongodb:', { uri: __config.mongo.uri });
        __cb(new Error('not connected'));
    }
};
lib_mongo.__eval = function(mongo_function, find_param, __cb) {
    __logger.debug('lib_mongo.__eval, request', { db: 'mongo', function: mongo_function, params: find_param });
    if (lib_mongo.conn) {
        lib_mongo.conn.eval(mongo_function + "(" + find_param + ")", function(err, result) {
            // lib_mongo.conn.collection(collection_name).find(find_params, select_params).toArray(function(err, result) {
            if (err) {
                __logger.error('lib_mongo.__eval, failed', { db: 'mongo', function: mongo_function, params: find_param });
                __cb(err, null);
            } else {
                __logger.debug('lib_mongo.__eval, success', { db: 'mongo', function: mongo_function, params: find_param });
                __cb(null, result);
            }
        });
    } else {
        __logger.error('lib_mongo.__eval, error connecting mongodb:', { uri: __config.mongo.uri });
        __cb(new Error('not connected'));
    }
};
module.exports = lib_mongo;