import express = require('express');
import expressMongoSanitize = require('express-mongo-sanitize');
import bodyParser = require('body-parser');
import { verifyAthlete } from '../controllers/athlete/verifyAthlete';
import { refreshAthleteLogin } from '../controllers/athlete/refreshAthleteLogin';
import { verifyCoach } from '../controllers/coach/verifyCoach';

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

    // Operations not requiring authentication, but which nonetheless constitute interaction with the API and should
    // therefore prevent a time-out
    app.get('/coach',refreshAthleteLogin);
    app.get('/coach/:id',refreshAthleteLogin);

    // Operations requiring the user to be logged in as a Coach
    app.put('/coach',verifyCoach);
    app.delete('/coach',verifyCoach);
}