import express = require('express');
import expressMongoSanitize = require('express-mongo-sanitize');
import bodyParser = require('body-parser');
import { verifyAthlete } from '../controllers/athlete/checkAthleteLogin';
import { refreshAthleteLogin } from '../controllers/athlete/refreshAthleteLogin';

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

    // Operations requiring the user to be logged in as an Athlete
    app.delete('/athlete',verifyAthlete);
    app.put('/athlete',verifyAthlete);
    app.get('/athlete',verifyAthlete);

    //Operations should refresh the login of the user if they happen to be logged in already
    app.use('/', refreshAthleteLogin);
}