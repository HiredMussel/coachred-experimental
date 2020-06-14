import express = require('express');
import mongoose = require('mongoose');
import bCrypt = require('bcrypt');
import jsonWebToken = require('jsonwebtoken');

import { AthleteModel } from '../../models/AthleteModel';
import { AthleteInterface } from '../../interfaces/AthleteInterface';
import { RestResponse } from '../../interfaces/RestResponse';

export async function createAthlete(req: express.Request, res: express.Response) {

    try {    
        
        let athleteToCreate: AthleteInterface = req.body;

        athleteToCreate.salt = await bCrypt.genSalt();

        bCrypt.hash(athleteToCreate.password, athleteToCreate.salt, (err: Error, hash: string) => {
            athleteToCreate.password = hash;

            athleteToCreate.token = jsonWebToken.sign({
                email: athleteToCreate.email, 
                password: athleteToCreate.password
            }, process.env.SECRET, {
                expiresIn: 1800 // expires in 30 minutes
            });

            let athlete = new AthleteModel(athleteToCreate);

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
                    message: 'invalid data',
                    data: {
                        error: err
                    }
                }

                return res.status(400).json(response);
            });

        });

    } catch(err) {

        const response: RestResponse = {
            status: 'fail',
            message: 'server error',
            data: {
                error: err
            }
        };

        return res.status(500).json(response);

    }
}