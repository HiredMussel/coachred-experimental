import express = require('express');
import mongoose = require('mongoose');
import jsonWebToken = require('jsonwebtoken');

import { AthleteModel } from '../../models/AthleteModel';
import { RestResponse } from '../../interfaces/RestResponse';

export async function refreshAthleteLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.header('Authorization')) {
        const bearerToken = req.header('Authorization').split(' ')[1];
        AthleteModel.findOne({token: bearerToken}).then((athlete: any) => {
            if (!athlete) {
                return next();
            }
            try {
                const tokenData: any = jsonWebToken.verify(bearerToken, process.env.SECRET);
                const newToken = jsonWebToken.sign({
                    email: tokenData.email,
                    seed: Math.random()
                },process.env.SECRET, {
                    expiresIn: 1800 // JSON web token expires after 30 minutes of inactivity
                });
                athlete.token = newToken;
                athlete.save().then(() => {
                    res.locals.bearerToken = newToken;
                    return next();
                }).catch((err: any) => {
                    const response: RestResponse = {
                        status: 'fail',
                        message: 'unable to persist login session',
                        data: {}
                    };
                    return res.status(500).json(response);
                });
            } catch (err) {
                return next();
            }
        });
    } else {
        return next();
    }
}