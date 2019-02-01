/**
 * @namespace authenticate
 * @description authentication logic goes here
 * @author deepak.ambekar [5/25/2017].
 */
var jwt = require('jwt-simple');
var dateUtil = require('date-format-utils');
var dynamodb = require('../db/dynamodb');
var auth = {};

/**
 * authenticate token send in request header
 * @memberof authenticate
 * @param request {object} service request
 * @param response {object} service response
 * @param next
 */
function authenticate(request, response, next) {

    if (request.method == 'OPTIONS') {
        __logger.debug("Auth options");
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        response.setHeader("access-control-expose-headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        next();
    } else {
        try {
            var token = request.headers['authorization'] || null;

            if (!__util.isEmpty(token)) {
                var decoded = jwt.decode(token, __config.authConfig.secretKey);
                __logger.log("decoded msg::", JSON.stringify(decoded));
                let query = {
                    "email": decoded.payload.email,
                    "password": decoded.payload.password
                };

                dynamodb.__getItem(__define.DYNAMODB_TABLES.T_USER, query, function(err, result) {
                    if (err) {
                        console.error("dynamodb error." + err);
                        __util.send(response, {
                            type: __define.RESPONSE_MESSAGES.NOT_AUTHORIZED
                        });
                    } else {
                        if (__util.isEmpty(result)) {
                            __util.send(response, {
                                type: __define.RESPONSE_MESSAGES.NOT_AUTHORIZED
                            });
                        } else {
                            var finalData = result.Item;
                            if (finalData.is_active) {
                                if (decoded.expire_at <= Date.now()) {
                                    console.log("Token Force Expire done, expire_at:", dateUtil.formatDate(decoded.expire_at, 'hh:mm:ss tt'));
                                    __util.send(response, {
                                        type: __define.RESPONSE_MESSAGES.TOKEN_EXPIRED
                                    });
                                } else {
                                    var inactiveTime = 0;
                                    if (decoded.last_modified < Date.now()) {
                                        inactiveTime = Math.abs((Date.now() - decoded.last_modified) / 60000);
                                    }
                                    if (inactiveTime >= __config.authConfig.inactiveTimeFrame) {
                                        console.log("Token Expire due to inactive");
                                        __util.send(response, {
                                            type: __define.RESPONSE_MESSAGES.TOKEN_EXPIRED
                                        });
                                    } else {
                                        console.log("Token authorized");
                                        request.decoded = decoded;
                                        var newToken = generateToken(decoded.payload, decoded.expire_at);
                                        response.setHeader('Authorization', newToken);
                                        next();
                                    }
                                }
                            } else {
                                __util.send(response, {
                                    type: __define.RESPONSE_MESSAGES.NOT_AUTHORIZED
                                });
                            }
                        }

                    }
                });
            } else {
                console.warn('UNAUTHORIZED ACCESS, request format:: ', { remote_host: request.ip, uri: request.url });
                __util.send(response, {
                    type: __define.RESPONSE_MESSAGES.NOT_AUTHORIZED
                });
            }

        } catch (e) {
            console.error("Error generating auth token, ", e);
            __util.send(response, {
                type: __define.RESPONSE_MESSAGES.NOT_AUTHORIZED
            });
        }
    }
};
auth.authenticate = authenticate;

/**
 * generate token for request
 * @memberof authenticate
 * @param payload {object} payload encoded in token
 * @param expire_at {number} token expire time
 * @returns {*}
 */
function generateToken(payload, expire_at) {
    var last_modified = Date.now();
    if (__util.isEmpty(expire_at)) {
        var time = 60 * 60;
        if (__config.authConfig.forceExpireTimeFrame && typeof __config.authConfig.forceExpireTimeFrame == "number")
            time = __config.authConfig.forceExpireTimeFrame * 60;
        else
            console.log("Default 60min force expire time frame set.");
        expire_at = __util.expiresAt(time);
    }
    var token = jwt.encode({
        last_modified: last_modified,
        expire_at: expire_at,
        payload: payload
    }, __config.authConfig.secretKey);

    return token;
}
auth.generateToken = generateToken;


module.exports = auth;