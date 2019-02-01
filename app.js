const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
// const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const app = express();

global.__db = require('./lib/db');
global.__async = require('async');
global.__define = require('./config/define');
global.__config = require('./config');
global.__util = require('./lib/util');
global.__logger = console;

// const loginModule = require('./modules/login');
// const domainModule = require('./modules/domain');


app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
app.use(cors());
// app.use(awsServerlessExpressMiddleware.eventContext());
require('./routes')(app);

__db.initialize(function(err) {
    if (err) {
        console.error("Error starting all databases", err);
    } else {
        console.info('started all databases');
    }
});

// app.get('/hello', (req, res) => {
//     res.json("req.apiGateway.event")
// })
const port = 3000

app.listen(port);
console.log(`listening on http://localhost:${port}`);

//module.exports = app