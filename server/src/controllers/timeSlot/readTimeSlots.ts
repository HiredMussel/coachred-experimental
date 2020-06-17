import express = require('express');
import { CoachModel } from '../../models/CoachModel';
import { findSlotsByDate } from '../../helpers/findSlotsByDate';
import { RestResponse } from '../../interfaces/RestResponse';
import { filterForClashes } from '../../helpers/filterForClashes';
import { findAvailability } from '../../helpers/findAvailability';
import { SlotInterface } from '../../interfaces/SlotInterface';

export async function readTimeSlots (req : express.Request, res : express.Response) {
    const coachId = req.query.coachId;
    const bearerToken = res.locals.bearerToken;

    let timeSlots: Array<any> = [];
    const desiredDate = new Date(Date.parse(req.params.date));
    CoachModel.findById(coachId).then(async (coach: any) => {
        try {
            let timeSlots = await findSlotsByDate(coach, desiredDate);
            timeSlots = filterForClashes(timeSlots, desiredDate);
            let slotsToReturn = await Promise.all(timeSlots.map(async (slot) => {
                slot.availableFor = await findAvailability(coach, slot, desiredDate);
                console.log(slot);
                return slot;
            }));

            const response: RestResponse = {
                status: 'success',
                message: 'slots retrieved',
                data: {
                    slots: slotsToReturn,
                    token: bearerToken
                }
            };
    
            return res.status(200).json(response);

        } catch(err) {
            const response: RestResponse = {
                status: 'fail',
                message: 'failed to find slots',
                data: {
                    token: bearerToken
                }
            };
            console.log(err);

            return res.status(500).json(response);
        }
    });
}