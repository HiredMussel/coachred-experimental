import express = require('express');
import mongoose = require('mongoose');

import { AthleteModel } from '../../models/AthleteModel';
import { RestResponse } from '../../interfaces/RestResponse';

export async function readAthlete(req: express.Request, res: express.Response) {
    let athlete = {}
    // Re-enabling the block of code below will allow you to find an athlete by their id. Be careful of GDPR!
    // if (req.query.athleteId) {
    //     try {
    //         athlete = await AthleteModel.findById(req.query.athleteId);
    //     } catch (err) {
    //         const response: RestResponse = {
    //             status: 'fail',
    //             message: 'no athlete with specified id',
    //             data: {}
    //         };
    //         return res.status(404).json(response);
    //     }
    // } else {
        try {
            const bearerToken = req.header('Authorization').split(' ')[1];
            athlete = await AthleteModel.findOne({token: bearerToken});
        } catch (err) {
            const response: RestResponse = {
                status: 'fail',
                message: 'unable to resolve identification token',
                data: {}
            };
            return res.status(404).json(response);
        }
    // }
    if (!athlete) {
        const response: RestResponse = {
            status: 'fail',
            message: 'athlete not found',
            data: {}
        };
        return res.status(404).json(response);
    } else {
        const response: RestResponse = {
            status: 'ok',
            message: 'athlete found successfully',
            data: {
                athlete
            }
        };
        return res.status(200).json(response); 
    }
}