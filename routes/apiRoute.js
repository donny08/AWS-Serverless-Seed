/**
 *
 * @author deepak.ambekar [6/19/2017].
 */

//var express = require('express');
//var router = express.Router();
//
//var loginCtrl = require('../../app_modules/login/loginCtrl');
//
//router.post('/signin', loginCtrl.signin);
//router.post('/signup', loginCtrl.signUp);
//
//
//_logger.debug("login route initialized");
//
//module.exports = router;
module.exports = function(app, route_url_prefix) {

    var authConfig = __config.authConfig;
    var basic_url_prefix = route_url_prefix;
    var auth_url_prefix = route_url_prefix + __config.authConfig.apiAuthAlias;
    //region Initializing Route
    console.log("Initializing API Routes");

    //region Normal Route
    console.log(basic_url_prefix)

    app.use(basic_url_prefix + '/domain/', require('./routes_helper/domainRoute').basicRouter);

    //endregion

    //region Authentication Route

    app.use(auth_url_prefix + '/domain/', require('./routes_helper/domainRoute').authRouter);
    // app.use(auth_url_prefix + '/smpp_gateway/', require('./routes_helper/smppGatewayRoute').authRouter);
    // app.use(auth_url_prefix + '/msc_code/', require('./routes_helper/mscCodeRoute').authRouter);
    // app.use(auth_url_prefix + '/smpp_report/', require('./routes_helper/smppDlrRoute').authRouter);
    // app.use(auth_url_prefix + '/smpp_dashboard/', require('./routes_helper/smppDashboardRoute').authRouter);
    // app.use(auth_url_prefix + '/smpp_route/', require('./routes_helper/smppRouteRoute').authRouter);
    // app.use(auth_url_prefix + '/smpp_session/', require('./routes_helper/smppSessionRoute').authRouter);

    //endregion

    console.log("Initializing API Routes Completed");
    //endregion

};