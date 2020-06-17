import express = require('express');
import { CoachModel } from '../../models/CoachModel';
import { findSlotsByDate } from '../../helpers/findSlotsByDate';
import { RestResponse } from '../../interfaces/RestResponse';

export async function readTimeSlots (req : express.Request, res : express.Response) {
    const coachId = req.query.coachId;
    const bearerToken = res.locals.bearerToken;

    let slotsToReturn: Array<any> = [];
    const desiredDate = new Date(Date.parse(req.params.date));
    CoachModel.findById(coachId).then(async (coach: any) => {

        const slotsToReturn = await findSlotsByDate(coach, desiredDate);
        const response: RestResponse = {
            status: 'success',
            message: 'slots retrieved',
            data: {
                slots: slotsToReturn,
                token: bearerToken
            }
        };

        return res.status(200).json(response);

    }).catch((err: any) => {
        const response: RestResponse = {
            status: 'fail',
            message: 'failed to find slots',
            data: {
                token: bearerToken
            }
        };

        return res.status(500).json(response);
    });
}