import express = require('express');
import mongoose = require('mongoose');
import bCrypt = require('bcrypt');
import jsonWebToken = require('jsonwebtoken');

import { CoachModel } from '../../models/CoachModel';
import { CoachInterface } from '../../interfaces/CoachInterface';
import { RestResponse } from '../../interfaces/RestResponse';

export async function createCoach(req: express.Request, res: express.Response) {
    if(await CoachModel.findOne({email: req.body.email})) {
        const response: RestResponse = {
            status: 'fail',
            message: 'email already registered',
            data: {}
        }

        return res.status(400).json(response);
    }

    try {    
        
        let athleteToCreate: CoachInterface = req.body;

        athleteToCreate.salt = await bCrypt.genSalt();

        bCrypt.hash(athleteToCreate.password, athleteToCreate.salt, (err: Error, hash: string) => {
            athleteToCreate.password = hash;

            athleteToCreate.token = jsonWebToken.sign({
                email: athleteToCreate.email, 
                salt: Math.random()
            }, process.env.SECRET, {
                expiresIn: 1800 // expires in 30 minutes
            });

            let athlete = new CoachModel(athleteToCreate);

            athlete.save().then(() => {
                const response: RestResponse = {
                    status: 'ok',
                    message: 'athlete successfully created',
                    data: {}
                };

                return res.status(200).json(response);
            }).catch(err => {
                const response: RestResponse = {
                    status: 'fail',
                    message: 'invalid data',
                    data: {}
                }

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
}