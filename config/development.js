module.exports = {
    port: 8001,
    logging: {
        log_file: './logs/smppWebApiLog/',
        mongo: {
            db: "mongodb://localhost:27017/phnapp",
            username: '',
            password: '',
            enabled: true
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
    mongo: {
        init: false,
        // host: '10.0.0.247',
        host: '',
        use_auth: true,
        options: {
            authSource: 'admin',
            authMechanism: 'DEFAULT',
            user: '',
            pass: ''
        }
    },
    redis: {
        init: false,
        host: "",
        db: "0",
        port: 6379
    }
};