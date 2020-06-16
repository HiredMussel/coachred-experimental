import express = require('express');
import mongoose = require('mongoose');

import { AthleteModel } from '../../models/AthleteModel';
import { RestResponse } from '../../interfaces/RestResponse';

export async function readAthlete(req: express.Request, res: express.Response) {
    const athlete = res.locals.athlete;
    const bearerToken = res.locals.bearerToken;

    if (!athlete) {
        const response: RestResponse = {
            status: 'fail',
            message: 'athlete not found',
            data: {
                token: bearerToken
            }
        };

        return res.status(404).json(response);

    } else {
        const response: RestResponse = {
            status: 'fail',
            message: 'athlete retrieved successfully',
            data: {
                athlete,
                token: bearerToken
            }
        };

        return res.status(200).json(response);
    }
}