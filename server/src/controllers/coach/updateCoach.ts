import express = require('express');
import mongoose = require('mongoose');
import bCrypt = require('bcrypt');

import { CoachModel } from '../../models/CoachModel';
import { RestResponse } from '../../interfaces/RestResponse';

const proceedWithUpdate = (bearerToken: string, req: express.Request, res: express.Response) => {
        CoachModel.findOneAndUpdate({ token: bearerToken},req.body, (err) => {
        if (err) {
            const response: RestResponse = {
                status: 'fail',
                message: 'failed to update coach',
                data: {
                    token: bearerToken
                }
            };

            return res.status(500).json(response);
            
        } else {
            const response: RestResponse = {
                status: 'ok',
                message: 'coach successfully updated',
                data: {
                    token: bearerToken
                }
            };

            return res.status(200).json(response);
        }
    })
}

export async function updateCoach(req: express.Request, res: express.Response) {
    const bearerToken = req.header('Authorization').split(' ')[1];
    if (req.body.password) {
        try {
            req.body.salt = await bCrypt.genSalt();
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