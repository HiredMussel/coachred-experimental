import express = require('express');
import mongoose = require('mongoose');

import { CoachModel } from '../../models/CoachModel'
import { RestResponse } from '../../interfaces/RestResponse';

export function readAllCoaches(req: express.Request, res: express.Response) {
    const bearerToken: string | null = res.locals.bearerToken;
    let searchTerm = (req.query.sport ? {sport: req.query.sport} : {});

    CoachModel.find(searchTerm).then(coaches => {
        const response: RestResponse = {
            status: 'ok',
            message: 'coaches retrieved successfully',
            data: {
                coaches: coaches,
                token: bearerToken
            }
        };

        return res.status(200).json(response);

    }).catch(err => {
        const response: RestResponse = {
            status: 'fail',
            message: 'unable to retrieve list of coaches',
            data: {
                token: bearerToken
            }
        };

        return res.status(500).json(response);
    })
}