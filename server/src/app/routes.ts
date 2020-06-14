// Routes file for the Coach Red API
import express = require('express');
import cors = require('cors');

// Import required controllers for routes to work
import { createAthlete } from '../controllers/athlete/createAthlete';

export function routes(app : express.Application) {
    // Handle CORS preflight request
    app.options('*', cors());

    app.get('/', (req : express.Request, res : express.Response) => {
        res.send('Hello World!');
    });

    // Athlete routes
    app.post('/athlete', createAthlete);
}