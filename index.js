// const AWS = require("aws-sdk");
// global.__docClient = new AWS.DynamoDB.DocumentClient({
//     region: 'us-west-2',
//     accessKeyId: 'AKIAILTMVP7R6P23G7FQ',
//     secretAccessKey: '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'
// });
/*global.__db = require('./lib/db');
global.__async = require('async');
global.__define = require('./config/define');
global.__config = require('./config');
global.__util = require('./lib/util');

const loginModule = require('./modules/login');
const domainModule = require('./modules/domain');

__db.initialize(function(err) {
    if (err) {
        console.error("Error starting all databases", err);
    } else {
        console.info('started all databases');
    }
});

var array = [];

exports.handler = (event, context, callback) => {

    switch (event.module + "-" + event.method) {
        case 'User-POST':
            loginModule.login(event, callback);
            break;
        case 'Domain-POST':
            domainModule.postDomain(event, callback);
            break;
        case 'Domain-GET':
            domainModule.getDomains(event, callback);
            break;
        case 'Push-POST':
            for (var i = 0; i < event.array.length; i++) {
                array.push(event.array[i]);
            }
            callback(null, array);
            break;
        case 'Pop-POST':
            array.splice(event.value, 1);
            callback(null, array);
            break;
        default:
            callback(null, { "custom": event });
            break;
    }

    // if (event.module == "User" && event.method == "POST") {
    //     loginModule.login(event, callback);
    // } else if (event.module == "Domain" && event.method == "POST") {
    //     domainModule.postDomain(event, callback);
    // } else if (event.module == "Domain" && event.method == "GET") {
    //     domainModule.getDomains(event, callback);
    // } else if (event.method == "Push") {
    //     for (var i = 0; i < event.array; i++) {
    //         array.push(event.array[i]);
    //     }
    //     callback(null, event.array);
    // } else if (event.method == "Pop") {
    //     array.pop();
    //     callback(null, array);
    // } else {
    //     callback(null, { "custom": event });
    // }
};*/

const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

const binaryMimeTypes = [
    'application/javascript',
    'application/json',
    'application/octet-stream',
    'application/xml',
    'font/eot',
    'font/opentype',
    'font/otf',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'text/comma-separated-values',
    'text/css',
    'text/html',
    'text/javascript',
    'text/plain',
    'text/text',
    'text/xml'
]
const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
    console.log("event");
    console.log(event);
    awsServerlessExpress.proxy(server, event, context)
}