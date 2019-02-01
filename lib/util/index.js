/**
 * @namespace utils
 * @description utils
 * @author deepak.ambekar [5/25/2017].
 */

var utils = {};

var moment = require('moment-timezone');
var StatsD = require('node-statsd').StatsD;
var crypto = require('crypto');
var _ = require('underscore');

//hasOwnProperty of object
var hasOwnProperty = Object.prototype.hasOwnProperty;


utils.date = {};
utils.statsd = {};
utils.statsd.load = function(_host, _port) {
    var client = new StatsD({ host: _host, port: _port });
    util.stats = client;
}

utils.date.now_in_ms = function() {
    return moment().format('x');
};

utils.date.now = function() {
    return moment().format('X');
};

utils.date.nowUTC_in_ms = function() {
    return moment().utc().format('x');
};

utils.date.nowUTC = function() {
    return moment().utc().format('X');
};
utils.date.convertUTCToLocalTimeZone = function(utcepochtime, timezone) {
    return moment().tz(moment.utc(utcepochtime * 1000), timezone).format('X');
};

// Running the following code before any other code will create Array.isArray() if it's not natively available
if (!Array.isArray) {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

/**
 * check valid response code [mention in constants>>MESSAGES].
 * @memberof utils
 * @param code {number} response code
 * @return {{valid: boolean, statusCode: number}}
 */
function validateResponseCode(code) {
    var obj = {
        valid: false,
        statusCode: 200
    };
    for (var key in __define.RESPONSE_MESSAGES) {
        if (__define.RESPONSE_MESSAGES[key].code == code) {
            obj.valid = true;
            obj.statusCode = __define.RESPONSE_MESSAGES[key].status_code;
            break;
        }
    }
    return obj;
};
utils.validateResponseCode = validateResponseCode;

/**
 * send response of service based on options provided.
 * @memberof utils
 * @param response {object} used to send response
 * @param options {{type:object,custom_msg:string,custom_code:number,err:object,data:object}} send options
 */
function send(response, options) {
    var resData = {};
    var code = __define.RESPONSE_MESSAGES.INVALID_CODE.code;
    var msg = __define.RESPONSE_MESSAGES.INVALID_CODE.message;
    var data = options.data || null;
    var err = options.err || null;
    if (!isEmpty(options.type) && !findMissingKeyInObject(options.type, ['code', 'message'])) {
        code = options.type.code;
        msg = options.type.message;
    }
    if (options.custom_code)
        code = options.custom_code;
    if (options.custom_msg)
        msg = options.custom_msg;

    if (code == __define.RESPONSE_MESSAGES.INVALID_CODE.code) {
        msg = __define.RESPONSE_MESSAGES.INVALID_CODE.message;
        data = null;
        err = "Response code not mention so default INVALID_CODE response code selected. please mention valid response code, refer 'constants >> RESPONSE_MESSAGES object'";
    }

    var validCodeObj = validateResponseCode(code);
    if (!validCodeObj.valid)
        __logger.log("add response code '" + code + "' in constants >> RESPONSE_MESSAGES object");
    resData.code = code;
    resData.msg = msg;
    resData.data = data;
    if (process.env.NODE_ENV === __define.CUSTOM_CONSTANT.DEV_ENV && err) {
        resData.error = err;
    }
    response.status(validCodeObj.statusCode || 200).json(resData);
};
utils.send = send;
/**
 * Check object contain all keys in keyList
 * @memberof utils
 * @param obj {object} object
 * @param keyList {array} array of object key
 */
function findMissingKeyInObject(obj, keyList) {
    var missingKeys = [];
    if (keyList && keyList.length > 0) {
        _.each(keyList, function(key) {
            if (!hasOwnProperty.call(obj, key) || obj[key] === null)
                missingKeys.push(key);
        });
    }
    if (missingKeys.length === 0)
        return false;
    else
        return missingKeys.toString();
}
utils.findMissingKeyInObject = findMissingKeyInObject;

/**
 * check any required parameter is missing from request object or array object.
 * @memberof utils
 * @param request {object} request body
 * @param requiredParams {array} required params in request body
 * @return {*}
 */
function checkRequiredMissingParam(request, requiredParams) {
    var missingRequiredParamMsg = null;
    if (requiredParams && requiredParams.length > 0) {
        if (isArray(request)) {
            if (request.length > 0) {
                for (var i = 0; i < request.length; i++) {
                    var missingKeys = findMissingKeyInObject(request[i], requiredParams);
                    if (missingKeys) {
                        __logger.log("Missing parameter [" + missingKeys + "] in array of object =>" + JSON.stringify(request[i]));
                        missingRequiredParamMsg = "Missing parameter in request. [" + missingKeys + "] is missing in array of object";
                        break;
                    }
                }
            } else {
                missingRequiredParamMsg = "Missing parameter in request. Empty array request found.";
            }
        } else if (!isEmpty(request)) {
            var missingKeys = findMissingKeyInObject(request, requiredParams);
            if (missingKeys) {
                missingRequiredParamMsg = "Missing parameter in request. [" + missingKeys + "]";
            }
        } else {
            missingRequiredParamMsg = "Missing parameter in request. Empty request found.";
        }
    }

    if (isEmpty(missingRequiredParamMsg))
        return false;
    else
        return missingRequiredParamMsg;
}
utils.checkRequiredMissingParam = checkRequiredMissingParam;

function getTrueFalseValue(input) {
    if (input == 1 || input == "1" || input == true || input == "true")
        return true;
    else
        return false;
}
utils.getTrueFalseValue = getTrueFalseValue;

function isUndefinedNull(val) {
    if (val == 0 || val == false)
        return false;
    if (val == undefined || val == null || val == "")
        return true;
    return false;
}
utils.isUndefinedNull = isUndefinedNull;
/**
 * 'true' if object is empty otherwise 'false'
 * @memberof utils
 * @param obj {object} object can be 'object,string,number,array'
 * @returns {boolean}
 */
function isEmpty(obj) {
    // null and undefined are "empty"
    if (obj == 0 || obj == false)
        return false;

    if (obj == undefined || obj == null || obj == "")
        return true;

    if (typeof obj == "number" || typeof obj == "string" || typeof obj == "boolean")
        return false;
    // Assume if it has a length property with a non-zero value
    // that property is correct.
    if (obj.length > 0)
        return false;
    if (obj.length <= 0)
        return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key))
            return false;
    }
    return true;
}
utils.isEmpty = isEmpty;

/**
 * 'true' if object is array otherwise 'false'
 * @memberof utils
 * @param arr {array} array object
 * @returns {boolean}
 */
function isArray(arr) {
    try {
        return Array.isArray(arr);
    } catch (e) {
        __logger.error("Error in isArray function, ", e);
        return false;
    }
}
utils.isArray = isArray;

/**
 * return function name with file path.
 * @memberof utils
 * @param filePath
 * @param functionName
 * @returns {string}
 */
function formatFunctionName(filePath, functionName) {
    return "[" + filePath + "]=> " + functionName + " => ";
}
utils.formatFunctionName = formatFunctionName;
/**
 * get expire timestamp based on second provided.
 * @memberof utils
 * @param seconds {number} seconds to add in current time
 * @returns {number}
 */
function expiresAt(seconds) {
    var date = new Date();
    date.setSeconds(date.getSeconds() + seconds);
    return date.getTime();
}
utils.expiresAt = expiresAt;

/**
 * get hamc of text based on key and encodeType
 * @memberof utils
 * @param text {string} text
 * @param key {string} key used to create hmac
 * @param encodeType {string} algorithm to create hmac [default: sha256]
 * @returns {*}
 */
function getHmac(text, key, encodeType) {
    var secretkey = _config.authConfig.secretKey;
    var encodeMethod = 'sha256';
    if (key)
        secretkey = key;
    if (encodeType)
        encodeMethod = encodeType;
    return crypto.createHmac(encodeMethod, secretkey).update(text).digest('hex');
}
utils.getHmac = getHmac;

/**
 * encrypt text
 * @memberof utils
 * @param text {string} text to encrypt
 * @returns {*}
 */
function encryptCipher(text) {
    var cipher = crypto.createCipher(_config.authConfig.cipherAlgorithm, _config.authConfig.secretKey);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
utils.encryptCipher = encryptCipher;

/**
 * decrypt text
 * @memberof utils
 * @param text {string} encrypted text
 * @returns {*}
 */
function decryptCipher(text) {
    var decipher = crypto.createDecipher(_config.authConfig.cipherAlgorithm, _config.authConfig.secretKey);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}
utils.decryptCipher = decryptCipher;

function stringMatch(str1, str2) {
    if (!isEmpty(str1) && !isEmpty(str2)) {
        if (str1.toLowerCase() == str2.toLowerCase())
            return true;
    }
    return false;
}
utils.stringMatch = stringMatch;

function matchElementInStringArray(stringArrayList, keyword) {
    var found = false;
    for (var i = 0; i < stringArrayList.length; i++) {
        if (stringMatch(stringArrayList[i], keyword)) {
            found = true;
            break;
        }
    }
    return found;
}
utils.matchElementInStringArray = matchElementInStringArray

function haveAccessToUser(myUserType, accessUserType) {
    //check for admin user
    if (stringMatch(__define.CUSTOM_CONSTANT.USER_TYPE.ADMIN, myUserType)) {
        return matchElementInStringArray(__define.CUSTOM_CONSTANT.ACCESS_LEVEL.ADMIN, accessUserType);
    }
    //check for support user
    else if (stringMatch(__define.CUSTOM_CONSTANT.USER_TYPE.SUPPORT, myUserType)) {
        return matchElementInStringArray(__define.CUSTOM_CONSTANT.ACCESS_LEVEL.SUPPORT, accessUserType);
    }
    return false;
}
utils.haveAccessToUser = haveAccessToUser;
module.exports = utils;