import express = require('express');
import mongoose = require('mongoose');
import bCrypt = require('bcrypt');

import { RestResponse } from '../../interfaces/RestResponse';

const proceedWithUpdate = (bearerToken: string, req: express.Request, res: express.Response) => {
    
    let coach = res.locals.coach;

    Object.assign(coach, req.body);
    coach.save().then(()=>{
        const response: RestResponse = {
            status: 'ok',
            message: 'updated coach information successfully',
            data: {
                token: bearerToken
            }
        };

        return res.status(200).json(response);

    }).catch((err: any) => {
        const response: RestResponse = {
            status: 'fail',
            message: 'unable to update coach information',
            data: {
                token: bearerToken
            }
        };

        return res.status(500).json(response);
    });
}

export async function updateCoach(req: express.Request, res: express.Response) {
    const bearerToken = res.locals.bearerToken;
    if (req.body.password || req.body.salt || req.body.token) {
        try {
            req.body.salt = await bCrypt.genSalt();
            req.body.token = bearerToken;
            await bCrypt.hash(req.body.password, req.body.salt, (err, hash) => {
                req.body.password = hash;
                proceedWithUpdate(bearerToken, req, res);
            });
        } catch(err) {
            const response: RestResponse = {
                status: 'fail',
                message: 'failed to update security information',
                data: {
                    token: bearerToken
                }
            };
            res.status(500).json(response);
        }
    } else {
        proceedWithUpdate(bearerToken, req, res);
    }
}