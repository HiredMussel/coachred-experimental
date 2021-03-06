import express = require('express');
import mongoose = require('mongoose');
import jsonWebToken = require('jsonwebtoken');

import { CoachModel } from '../../models/CoachModel';
import { RestResponse } from '../../interfaces/RestResponse';

export async function refreshCoachLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.header('Authorization')) {
        const bearerToken = req.header('Authorization').split(' ')[1];
        CoachModel.findOne({token: bearerToken}).then((coach: any) => {
            if (!coach) {
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
                coach.token = newToken;
                coach.save().then(() => {
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