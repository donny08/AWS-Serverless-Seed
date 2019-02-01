module.exports = {
    logging: {
        log_file: '/var/log/smppWebApiLog/',
        mongo: {
            db: "mongodb://localhost:27017/phnapp",
            username: '',
            password: '',
            enabled: false
        }
    },
    mongo: {
        init: true,
        host: 'mongo.xyz.netviva.in',
        use_auth: true,
        options: {
            authSource: 'admin',
            authMechanism: 'DEFAULT',
            user: '',
            pass: ''
        }
    },
    redis: {
        init: true,
        host: "redis.xyz.netviva.in",
        db: "0",
        port: 6379
    },
};