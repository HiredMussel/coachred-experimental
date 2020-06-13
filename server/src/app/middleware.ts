import express = require('express');
import expressMongoSanitize = require('express-mongo-sanitize');
import bodyParser = require('body-parser');

export function middleware(app : express.Application) {
    app.use(bodyParser.json());
    app.use(expressMongoSanitize());
    app.use(function(req : express.Request, res : express.Response, next : express.NextFunction) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Credentials', 'true')
        next();
    });
}