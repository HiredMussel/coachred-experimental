import express = require('express');
import mongoose = require('mongoose');

import { SportModel } from '../../models/SportModel';
import { RestResponse } from '../../interfaces/RestResponse';

export async function readAllSports(req: express.Request, res: express.Response) {
    SportModel.find().then((sports: any) => {
        const sportList = sports.map((sport: any) => sport.name);

        const response: RestResponse = {
            status: 'ok',
            message: 'successfully retrieved list of sports',
            data: {
                sports: sportList
            }
        };

        return res.status(200).json(response);

    }).catch((err: any) => {
        const response: RestResponse = {
            status: 'fail',
            message: 'failed to retreive list of sports',
            data: {}
        };

        return res.status(500).json(response);
        
    });
}