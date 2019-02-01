var lib_dynamodb = {};

const AWS = require('aws-sdk');

lib_dynamodb.close = function(__callback) {
    if (__config.dynamodb.init) {
        console.info('lib_dynamodb.close, function called');
        __callback(null);
    } else {
        __callback(null);
    }
};

lib_dynamodb.init = function(__callback) {
    if (!__config.dynamodb.init) {
        lib_dynamodb.conn = null;
        __callback(null);
        return;
    }
    console.info('lib_dynamodb.init, function called');
    setTimeout(function() {
        console.info("dynamodb init")
        lib_dynamodb.conn = new AWS.DynamoDB.DocumentClient({
            region: __config.dynamodb.region,
            accessKeyId: __config.dynamodb.accessKeyId,
            secretAccessKey: __config.dynamodb.secretAccessKey
        });
        __callback(null);

    }, __config.dynamodb.delay_connection_callback);

};

lib_dynamodb.__query = function(table_name, find_params, __cb) {
    var __m = 'lib_dynamodb.__query';
    console.log(lib_dynamodb.conn)
    lib_dynamodb.conn.query(find_params, function(err, data) {
        if (err) {
            console.error('failed', { m: __m, table: table_name, err: err });
            __cb(err);
        } else {
            console.info('success', { m: __m, table: table_name });
            __cb(null, data);
        }
    });
}

lib_dynamodb.__scan = function(table_name, find_params, __cb) {
    var __m = 'lib_dynamodb.__scan';

    lib_dynamodb.conn.scan(find_params, function(err, data) {
        if (err) {
            console.error('failed', { m: __m, table: table_name, conn: lib_dynamodb.conn, err: err });
            __cb(err);
        } else {
            console.info('success', { m: __m, table: table_name });
            __cb(null, data);
        }
    });
};

lib_dynamodb.__getItem = function(table_name, find_params, __cb) {
    var __m = 'lib_dynamodb.__getItem';
    console.info('got request', { m: __m, table: table_name, find_params: JSON.stringify(find_params) });
    var params = {
        TableName: table_name,
        Key: find_params
            // ReturnConsumedCapacity: "TOTAL"
    };

    lib_dynamodb.conn.get(params, function(err, data) {
        if (err) {
            console.error('failed', { m: __m, table: table_name, find_params: JSON.stringify(find_params), err: err });
            __cb(err);
        } else {
            console.info('success', { m: __m, table: table_name, find_params: JSON.stringify(find_params), data: data });
            __cb(null, data);
        }
    });
};

lib_dynamodb.__insertItem = function(table_name, document, __cb) {
    var __m = 'lib_dynamodb.__insertItem';
    console.info('got request', { m: __m, table: table_name, document: JSON.stringify(document) });
    var params = {
        TableName: table_name,
        ReturnConsumedCapacity: "TOTAL",
        Item: document
    };

    lib_dynamodb.conn.put(params, function(err, data) {
        if (err) {
            console.error('failed', { m: __m, table: table_name, document: JSON.stringify(document), err: err });
            __cb(err);
        } else {
            console.info('success', { m: __m, table: table_name, document: JSON.stringify(document), data: data });
            __cb(null);
        }
    });
};


lib_dynamodb.__updateItem = function(table_name, find_params, update_params, __cb) {
    var __m = 'lib_dynamodb.__updateItem';
    console.info('got request', { m: __m, table: table_name, find_params: find_params, update_params: update_params });
    var params = {
        TableName: table_name,
        Key: find_params,
        AttributeUpdates: {}
    };
    for (var field_name in update_params) {
        params.AttributeUpdates[field_name] = {
            Action: 'PUT',
            Value: update_params[field_name]
        };
    }


    lib_dynamodb.conn.update(params, function(err, data) {
        if (err) {
            console.error('failed', { m: __m, table: table_name, find_params: find_params, update_params: update_params, err: err });
            __cb(err);
        } else {
            console.info('success', { m: __m, table: table_name, find_params: find_params, update_params: update_params });
            __cb(null);
        }
    });
};
module.exports = lib_dynamodb;