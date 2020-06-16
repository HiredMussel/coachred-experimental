import express = require('express');
import mongoose = require('mongoose');

import { RestResponse } from '../../interfaces/RestResponse';

export async function deleteCoach(req: express.Request, res: express.Response) {
    const bearerToken = res.locals.bearerToken;
    let coach = res.locals.coach;
    coach.deleted = true;
    coach.save().then( () => {
        const response: RestResponse = {
            status: 'ok',
            message: 'coach deleted',
            data: {}
        };

        return res.status(200).json(response);

    }).catch((err:any) => {
        const response: RestResponse = {
            status: 'fail',
            message: 'unable to delete coach',
            data: {
                token: bearerToken
            }
        }

        return res.status(500).json(response);
    });
}