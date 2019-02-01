var DYNAMODB_TABLES = {
    T_DOMAINS: 'domains',
    T_USER: 'user'
};

const CUSTOM_CONSTANT = {
    DEV_ENV: "development",
    USER_TYPE: {
        USER: "user",
        SUPPORT: "support",
        ADMIN: "admin"
    },
    ACCESS_LEVEL: {
        USER: [],
        SUPPORT: ["user"],
        ADMIN: ["user", "support"]
    },
    SMPP_BIND_MODE: {
        TRANSMITTER: { ABBR: "TX", BIND_MODE: 1, SMPP_MODE: "transmitter" },
        RECEIVER: { ABBR: "RX", BIND_MODE: 2, SMPP_MODE: "receiver" },
        TRANSCEIVER: { ABBR: "RX", BIND_MODE: 3, SMPP_MODE: "transceiver" }
    }

};

var RESPONSE_MESSAGES = {
    INVALID_REQUEST: {
        status_code: 400,
        code: 400,
        message: 'Invalid request'
    },
    PAGE_NOT_FOUND: {
        status_code: 404,
        code: 404,
        message: 'requested resource not found.'
    },
    TOKEN_EXPIRED: {
        status_code: 401,
        code: 401,
        message: 'Access token is expired.'
    },
    NOT_AUTHORIZED: {
        status_code: 401,
        code: 402,
        message: 'Unauthorized access'
    },
    ACCESS_DENIED: {
        status_code: 403,
        code: 403,
        message: 'Access denied'
    },
    SERVER_TIMEOUT: {
        status_code: 408,
        code: 408,
        message: 'Server timeout.'
    },
    SERVER_ERROR: {
        status_code: 500,
        code: 500,
        message: 'Something went wrong. Please try again later.'
    },
    SUCCESS: {
        status_code: 200,
        code: 2000,
        message: 'Success'
    },
    NO_RECORDS_FOUND: {
        status_code: 200,
        code: 3000,
        message: 'No record found.'
    },
    INCOMPLETE: {
        status_code: 200,
        code: 3001,
        message: 'Incomplete request'
    },
    INVALID_CODE: {
        status_code: 200,
        code: 3002,
        message: 'Response code and msg not mention. please select valid response code.'
    },
    FAILED: {
        status_code: 200,
        code: 3003,
        message: 'Failed'
    },
    LOGIN_FAILED: {
        status_code: 401,
        code: 3004,
        message: 'Username and/or Password Invalid.'
    },
    INACTIVE_USER: {
        status_code: 401,
        code: 3009,
        message: 'User is Inactive.'
    },
    USERNAME_EXIT: {
        status_code: 200,
        code: 3005,
        message: 'username already exit.'
    },
    ERROR_ACCOUNT_CREATE: {
        status_code: 200,
        code: 3006,
        message: 'invalid account creation.'
    },
    DOMAIN_NAME_EXIT: {
        status_code: 400,
        code: 3007,
        message: 'domain already exit.'
    },
    ROUTE_NAME_EXIT: {
        status_code: 200,
        code: 3007,
        message: 'route name already exit.'
    },
    ACCOUNT_ID_EXIT: {
        status_code: 200,
        code: 3008,
        message: 'account id already exit.'
    }
}

module.exports.RESPONSE_MESSAGES = RESPONSE_MESSAGES;
module.exports.DYNAMODB_TABLES = DYNAMODB_TABLES;
module.exports.CUSTOM_CONSTANT = CUSTOM_CONSTANT;