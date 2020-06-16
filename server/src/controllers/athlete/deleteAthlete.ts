import express = require('express');
import mongoose = require('mongoose');

import { RestResponse } from '../../interfaces/RestResponse';

export async function deleteAthlete(req: express.Request, res: express.Response) {
    const bearerToken = res.locals.bearerToken;
    let athlete = res.locals.athlete;
    athlete.deleted = true;
    athlete.save().then( () => {
        const response: RestResponse = {
            status: 'ok',
            message: 'athlete deleted',
            data: {}
        };

        return res.status(200).json(response);

    }).catch((err:any) => {
        const response: RestResponse = {
            status: 'fail',
            message: 'unable to delete athlete',
            data: {
                token: bearerToken
            }
        }

        return res.status(500).json(response);
    });
}