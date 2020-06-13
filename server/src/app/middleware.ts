import express = require('express');
import expressMongoSanitize = require('express-mongo-sanitize');
import bodyParser = require('body-parser');

export function middleware(app : express.Application) {
    app.use(bodyParser.json());
    app.use(expressMongoSanitize());
}