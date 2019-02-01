/**
 *
 * @author deepak.ambekar [6/19/2017].
 */

var serveStatic = require('serve-static');
var auth = require('../lib/auth/auth.js');
module.exports = function (app) {

    //region api routes
    var api_url_prefix='/' + __config.api_prefix + '/api';
    app.all(api_url_prefix + __config.authConfig.apiAuthAlias + "/*", [auth.authenticate]);
    require('./apiRoute')(app,api_url_prefix);
    //endregion

    app.use('/' + __config.api_prefix + '/apidocs', serveStatic('apidocs'));
//    app.use('/' + __config.api_prefix + '/demo', serveStatic('public'));
//    app.use('/favicon.ico', serveStatic('public'));
//    app.route('/*').get(function (req, res, next) {
//        __logger.warn('got invalid request format', {remote_host: req.ip, uri: req.url});
//        __util.send(res, {
//            type: __define.RESPONSE_MESSAGES.SERVER_ERROR
//        });
//    });

    app.route('/server-status').get(function(request,response){
        __logger.info("server-status request from, ",{remote_host:request.ip,uri:request.url,time:new Date()});
        __util.send(response, {
            type: __define.RESPONSE_MESSAGES.SUCCESS,
            custom_msg:__config.app_name+" server running.."
        });
    })
};