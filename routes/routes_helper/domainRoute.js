var express = require('express');
var basicRouter = express.Router(); // api which not required authentication
var authRouter = express.Router(); // api which required authentication
var domainCtrl = require('../../app_module/domain/domainCtrl');
var routeName = "domain ";

function basicRoute(router) {

    router.post('/login', domainCtrl.login);

    console.log(routeName + "route (basic) initialized...");
    return router;
}

function authenticateRoute(router) {

    router.post('/create_domain', domainCtrl.postDomain);
    router.get('/domain_all', domainCtrl.getDomains);

    console.log(routeName + "route (authenticate) initialized...");
    return router;
}

module.exports = {
    basicRouter: basicRoute(basicRouter),
    authRouter: authenticateRoute(authRouter)
};