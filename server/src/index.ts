/**
 * This file is the main file which runs our backend API. It will listen on the port declared in
 * the .env file under PORT. Because this app uses bearer token authentication it will by default only
 * serve files over https. If you wish to serve over http as well then uncomment the relevant lines
 */

// Module import block
require('dotenv').config()
import express = require('express');
import mongoose = require('mongoose');
import fs = require('fs');
import https = require('https');
// import http = require('http'); // Uncomment to enable HTTP server
import path = require('path');

// import helper scripts to register middleware and routes
import { middleware } from './app/middleware';
import { routes } from './app/routes';

// import any required interfaces
import { SSLCredentials } from './interfaces/SSLCredentials';

// import the database. Constant declaration is required to avoid import elision
import { db } from './app/db';
const Database = db;

// create our express application
const app : express.Application = express();
const httpsPort : number = parseInt(process.env.HTTPS_PORT);
// const httpPort : number = parseInt(process.env.HTTP_PORT); // Uncomment this line to enable HTTP

// perform necessary setup for HTTPS
const sslCert : string = fs.readFileSync(path.resolve(__dirname, '../sslcert/server.cert')).toString();
const sslKey : string = fs.readFileSync(path.resolve(__dirname, '../sslcert/server.key')).toString();
const credentials : SSLCredentials = {key : sslKey, cert : sslCert};

// call helper functions to register middleware and set up routing
middleware(app);
routes(app);

// have our https server begin listening on the necessary port and log a success message to the console
https.createServer(credentials, app).listen(httpsPort);
console.log(`https server listening on port ${httpsPort}`)

// have our http serve begin listening on the necessary port and log a success message to the console
// http.createServer(app).listen(httpPort);                         // Uncomment these lines to enable HTTP
// console.log(`http server listening on port ${httpPort}`);