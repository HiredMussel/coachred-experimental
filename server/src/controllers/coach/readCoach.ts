import express = require('express');
import mongoose = require('mongoose');

import { CoachModel } from '../../models/CoachModel';
import { RestResponse } from '../../interfaces/RestResponse';

export async function readCoach(req: express.Request, res: express.Response) {
    let coach: any = {}
    const bearerToken: string | null = res.locals.bearerToken;

    try {
        coach = await CoachModel.findById(req.params.id);
        if (!coach || coach.deleted) {
            const response: RestResponse = {
                status: 'fail',
                message: 'unable to find coach with specified id in database',
                data: {
                    token: bearerToken
                }
            };
            return res.status(404).json(response);
        } else {
            const response: RestResponse = {
                status: 'ok',
                message: 'coach found successfully',
                data: {
                    coach,
                    token: bearerToken
                },
            };
            return res.status(200).json(response); 
        }
    } catch (err) {
        const response: RestResponse = {
            status: 'fail',
            message: 'database query unsuccessful - coach with specified id not found',
            data: {}
        };
        return res.status(404).json(response);
    }
}