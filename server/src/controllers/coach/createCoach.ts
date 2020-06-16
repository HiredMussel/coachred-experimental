import express = require('express');
import mongoose = require('mongoose');
import bCrypt = require('bcrypt');
import jsonWebToken = require('jsonwebtoken');

import { CoachModel } from '../../models/CoachModel';
import { CoachInterface } from '../../interfaces/CoachInterface';
import { RestResponse } from '../../interfaces/RestResponse';
import { validateCoach } from '../../validators/validateCoach';

export async function createCoach(req: express.Request, res: express.Response) {
    if(await CoachModel.findOne({email: req.body.email})) {
        const response: RestResponse = {
            status: 'fail',
            message: 'email already registered',
            data: {}
        }

        return res.status(400).json(response);
    }
    
    if (await validateCoach(req.body)) {
        try {    
            
            let coachToCreate: CoachInterface = req.body;

            coachToCreate.deleted = false;

            coachToCreate.timeSlots = [];

            coachToCreate.salt = await bCrypt.genSalt();

            bCrypt.hash(coachToCreate.password, coachToCreate.salt, (err: Error, hash: string) => {
                coachToCreate.password = hash;

                coachToCreate.token = jsonWebToken.sign({
                    email: coachToCreate.email, 
                    salt: Math.random()
                }, process.env.SECRET, {
                    expiresIn: 1800 // expires in 30 minutes
                });

                let athlete = new CoachModel(coachToCreate);

                athlete.save().then(() => {
                    const response: RestResponse = {
                        status: 'ok',
                        message: 'coach successfully created',
                        data: {}
                    };

                    return res.status(200).json(response);
                }).catch(err => {
                    const response: RestResponse = {
                        status: 'fail',
                        message: 'invalid data - invalid format for database entry',
                        data: {}
                    }
                    console.log(err);

                    return res.status(400).json(response);
                });

            });
        } catch(err) {

            const response: RestResponse = {
                status: 'fail',
                message: 'server error',
                data: {}
            };

            return res.status(500).json(response);

        }
    } else {
        const response: RestResponse = {
            status: 'fail',
            message: 'invalid data - data validation failed',
            data: {}
        }

        return res.status(400).json(response);
    }
}