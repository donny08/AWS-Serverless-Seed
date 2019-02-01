var _ = require('lodash');
process.env.NODE_ENV  =  process.env.NODE_ENV || 'development';

var app_name = "hostname-registration"; //remember to rename this variable with new name(without spaces), it will also act as default mongodb database name and logging file name
var db_name = "vivasmpp"; //change if you want to have different database name than the application name.
var all = {
    env: process.env.NODE_ENV,
    //secret_key: "6de5661ab3c401bcb266dff913",
    app_name: app_name,
    db_name: db_name,
    api_prefix: app_name, //added to work with apache and passenger, acts as in general api prefix as well
    base_url: "http://localhost:8001/",
    port: 80,
    socket_io_port: 8002,
    default_credit: 0,
    default_server_response_timeout: 60000, // requests received will be timedout if not responded within the specified time
    authConfig: {
        apiAuthAlias: "/v1",
        secretKey: "6de5661ab3c401bcb266dff913",
        cipherAlgorithm: "aes-256-ctr",
        inactiveTimeFrame: 12 * 60, //min
        forceExpireTimeFrame: 24 * 60 //min
    },
    logging: {
        log_file: '/var/log/smppWebApiLog/',
        console: true,
        level: 'silly', //[silly,debug,verbose,info,warn,error]
        datePattern: 'yyyy-MM-dd', //log rotation
        maxsize: 104857600, //log rotates after specified size of file in bytes
        colorize: 'true',
        mongo: {
            host: "mdb.phnapp.com",
            db: "phnapp",
            port: 27017,
            username: 'admin',
            password: 'inf0viv@',
            enabled: false
        }
    },
    mysql: {
        init: false,
        options: {
            connection_limit: 10,
            host: 'localhost',
            user: 'root',
            password: '',
            database: ''
        }
    },
    postgresql: {
        init: false,
        options: {
            host: "localhost",
            user: "postgres",
            database: "test",
            password: "deepak",
            port: 5432,
            max_connection: 10
        }
    },
    elasticsearch: {
        init: false,
        use_auth: false,
        options: {
            host: "10.40.12.205",
            protocol: "http",
            username: "",
            password: "",
            apiVersion: "5.4",
            //log: 'trace',
            port: 9200
        }
    },
    mongo: {
        init: false,
        host: 'localhost',
        use_auth: false,
        options: {
            authSource: 'admin',
            authMechanism: 'DEFAULT',
            user: 'vivasmpp',
            pass: 'smppviva'
        }
    },
    dynamodb: {
        init: true,
        apiVersion: '2016-11-15',
        region: 'us-west-2',
        accessKeyId: 'AKIAJL7WNONZ7HOUUHZQ',
        secretAccessKey: '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',
        delay_connection_callback: 1000
    },
    rabbitmq: {
        init: false,
        amqp_url: "amqp://localhost:5672/test?heartbeat=30",
        reconnect_interval: 5000,
        delay_connection_callback: 1000
    },
    redis: {
        init: false,
        host: "localhost",
        db: "0",
        port: 6379
    },
    app_settings: {
        invalid_reponse: 'invalid',
        error_reponse: 'error',
        voice_account: {
            base_url: 'http://10.0.5.101',
            cdr_pingback_url: 'http://10.0.0.219:8001/api/cdr_pingback',
            username: '<na>',
            password: '<na>'
        },
        sms_account: {
            base_url: 'http://hapi.smsapi.org',
            username: '<na>',
            password: '<na>',
            senderid: '<na>',
            default_sms: 'Thank you for everything'
        },
        api_responses: {
            success: { code: 200, msg: 'success' },
            created: { code: 201, msg: '' },
            accepted: { code: 202, msg: '' },
            no_record_found: { code: 204, msg: '' },
            bad_request: { code: 400, msg: '' },
            auth_failed: { code: 401, msg: '' },
            not_found: { code: 404, msg: 'not found' },
            timedout: { code: 408, msg: 'server timeout' },
            error: { code: 500, msg: 'some error occurred' },
            invalid_account_creation: { code: 205, msg: 'invalid account creation' },
            user_exits: { code: 206, msg: 'username exits' }

        }
    },
    get_circle_operator_url: 'http://api.voice360.in/Inbound.asmx/get_caller_details?destination=',
    dlr_summary_record_limit: 50

};
all = _.merge(all, require('./' + process.env.NODE_ENV + '.js') || {});

all.logging.log_path = all.logging.log_file;
all.logging.log_file += app_name;
all.mysql.options.database = db_name;

all.mongo.uri = 'mongodb://' + all.mongo.host + '/' + db_name;
if (all.mongo.use_auth) {
    all.mongo.uri = 'mongodb://' + all.mongo.options.user + ':' + all.mongo.options.pass + '@' + all.mongo.host + '/' + db_name + '?authSource=' + all.mongo.options.authSource;
}


module.exports = all;