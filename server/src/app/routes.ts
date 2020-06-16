// Routes file for the Coach Red API
import express = require('express');
import cors = require('cors');

// Import required controllers for routes to work
import { createAthlete } from '../controllers/athlete/createAthlete';
import { deleteAthlete } from '../controllers/athlete/deleteAthlete';
import { readAthlete } from '../controllers/athlete/readAthlete';
import { loginAthlete } from '../controllers/athlete/loginAthlete';
import { updateAthlete } from '../controllers/athlete/updateAthlete';

import { createCoach } from '../controllers/coach/createCoach';
import { readAllCoaches } from '../controllers/coach/readAllCoaches';
import { readCoach } from '../controllers/coach/readCoach';
import { loginCoach } from '../controllers/coach/loginCoach';
import { updateCoach } from '../controllers/coach/updateCoach';
import { deleteCoach } from '../controllers/coach/deleteCoach';

export function routes(app : express.Application) {
    // Handle CORS preflight request
    app.options('*', cors());

    app.get('/', (req : express.Request, res : express.Response) => {
        res.send('Hello World!');
    });

    // Athlete routes
    app.post('/athlete', createAthlete);
    app.delete('/athlete', deleteAthlete);
    app.get('/athlete', readAthlete);
    app.post('/athlete/login', loginAthlete);
    app.put('/athlete', updateAthlete);

    // Coach routes
    app.post('/coach', createCoach);
    app.get('/coach', readAllCoaches);
    app.get('/coach/:id',readCoach);
    app.post('/coach/login', loginCoach);
    app.put('/coach',updateCoach);
    app.delete('/coach',deleteCoach);
}