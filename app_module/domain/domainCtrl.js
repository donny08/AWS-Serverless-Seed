const dynamodb = require('../../lib/db/dynamodb');
const auth = require('../../lib/auth/auth');
var filePath = "domain/domainCtrl";
/**
 * 
 * Add Domain.
 */
exports.postDomain = (request, response) => {
    __async.auto({
        check_domain_exist: function(callback) {
            let query = {
                "domain_url": request.body.domainUrl
            };
            // let params = {
            //     TableName: __define.DYNAMODB_TABLES.T_DOMAINS,
            //     Key: {
            //         "domain_url": request.body.domainUrl
            //     }
            // };

            dynamodb.__getItem(__define.DYNAMODB_TABLES.T_DOMAINS, query, function(err, result) {

                if (err) {
                    console.error("dynamodb error." + err);
                    callback(err, null);
                } else {
                    // console.log("data returned from dynamodb", result);
                    // callback(__define.RESPONSE_MESSAGES.DOMAIN_NAME_EXIT, null);
                    // if (result && result.item != undefined) {
                    //     callback(__define.RESPONSE_MESSAGES.DOMAIN_NAME_EXIT, null);
                    // } else {
                    //     callback(null, 'proceed');
                    // }
                    console.log("data returned from dynamodb", result);
                    var length = Object.keys(result).length;
                    if (length == 0) {
                        callback(null, 'proceed');
                    } else {
                        callback(__define.RESPONSE_MESSAGES.DOMAIN_NAME_EXIT, null);
                    }
                }
            });

            /*__docClient.get(params, function(err, data) { //JSON.stringify(err, null, 2)
                if (err) {
                    callback(err, null);
                } else {
                    console.log("domain url", Object.keys(data).length);
                    var length = Object.keys(data).length;
                    if (length == 0) {
                        callback(null, 'proceed');
                    } else {
                        callback({
                            status: 400,
                            message: "domain already taken"
                        }, null);
                    }
                }
            });*/
        },
        insert_into_table: ['check_domain_exist', function(results, callback) {

            let params = {
                Item: {
                    domain_url: request.body.domainUrl, //event.url
                    email: request.body.email, //event.email
                    environment: request.body.environment,
                    platform: request.body.platform,
                    location: request.body.location,
                    role: request.body.role,
                    current_ip: 'N/A',
                    client: request.body.client,
                    sys_ip: request.body.sys_ip,
                    ispublic: request.body.ispublic,
                    point_ip: request.body.point_ip,
                    profile_obj: request.body.profileObj
                },
                ReturnConsumedCapacity: "TOTAL",
                ReturnItemCollectionMetrics: "SIZE",
                TableName: __define.DYNAMODB_TABLES.T_DOMAINS
            };
            dynamodb.__insertItem(__define.DYNAMODB_TABLES.T_DOMAINS, params.Item, function(err, result) {

                if (err) {
                    console.error("dynamodb error." + err);
                    callback(err, null);
                } else {
                    callback(null, params.Item);
                }
            });
            // __docClient.put(params, function(err, data) {
            //     if (err) {
            //         callback(err, null);
            //     } else {
            //         callback(null, {
            //             status: 200,
            //             message: "Thank you! Your request has been submitted."
            //         });
            //     }
            // });
        }]
    }, function(err, results) {
        if (err) {
            console.log("error", err);
            __util.send(response, { type: err });
        } else {
            __util.send(response, {
                type: __define.RESPONSE_MESSAGES.SUCCESS,
                data: results.insert_into_table
            });
            // callback(null, results.insert_into_table);
        }
    });
}

/**
 * Get all domains.
 */
exports.getDomains = (request, response) => {
    let params = {
        TableName: __define.DYNAMODB_TABLES.T_DOMAINS
    };


    dynamodb.__scan(__define.DYNAMODB_TABLES.T_DOMAINS, params, function(err, result) {
        if (err) {
            console.error("dynamodb error." + err);
            __util.send(response, { type: err });
        } else {
            __util.send(response, {
                type: __define.RESPONSE_MESSAGES.SUCCESS,
                data: result.Items
            });
        }
    });

    // __docClient.scan(params, function(err, data) {
    //     if (err) {
    //         callback(err, null);
    //     } else {
    //         callback(null, data);
    //     }
    // });
};

/**
 * 
 * Login.
 */
exports.login = (request, response) => {
    console.log("Request from API", request);
    let query = {
        "username": request.body.username,
        "password": request.body.password
    };

    dynamodb.__getItem(__define.DYNAMODB_TABLES.T_USER, query, function(err, result) {
        if (err) {
            console.error("dynamodb error." + err);
            __util.send(response, { type: err });
        } else {
            console.log("Login data", result);
            if (__util.isEmpty(result)) {
                __util.send(response, { type: __define.RESPONSE_MESSAGES.LOGIN_FAILED });
            } else if (!result.Item.is_active) {
                __util.send(response, { type: __define.RESPONSE_MESSAGES.INACTIVE_USER });
            } else {
                var token = auth.generateToken(result.Item);
                var finalData = result.Item;
                delete finalData.password;
                finalData.token = token;
                __util.send(response, {
                    type: __define.RESPONSE_MESSAGES.SUCCESS,
                    data: result.Item
                });
            }

        }
    });
}