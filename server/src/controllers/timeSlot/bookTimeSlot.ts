// Logic Structure:

// A once-off slot can be booked in any slot type.
// A repeating slot must be booked in the matching type (logic for allowing fortnightly booking of a weekly slot is
// ideal, but a stretch goal at this point)
// If a slot is booked, a check is first run to ensure that there are no clashes. If there are clashes, booking the 
// slot is impossible and a message should be returned.

import express = require('express');
import { CoachModel} from '../../models/CoachModel';
import { findAvailability } from '../../helpers/findAvailability';
import { RestResponse } from '../../interfaces/RestResponse';
import { AthleteInterface } from '../../interfaces/AthleteInterface';

export default async (req: express.Request, res: express.Response) => {

    const bearerToken: string = res.locals.bearerToken;

    const athlete: AthleteInterface = res.locals.Athlete;
    const slotId: string = req.body.slotId;
    const coachId: string = req.body.coachId;
    const numSessions: number = req.body.numSessions;
    const initialDate: Date = new Date(req.body.initialDate);
    const initialTimestamp: number = initialDate.getTime();

    CoachModel.findById(coachId).then(async (coach: any) => {

        const timeSlot = coach.timeSlots.id(slotId);

        if (numSessions > await findAvailability(coach, timeSlot, initialDate)) {
            const response: RestResponse = {
                status: 'fail',
                message: 'booking clash detected',
                data: {
                    token: bearerToken
                }
            };

            return res.status(400).json(response);

        } else {
            let endDate = initialDate
            if (timeSlot.repeat === "Weekly") {
                for(let i = 0; i < numSessions; i++) {
                    let dateToBook = new Date(initialTimestamp + i*1000*60*60*24*7);
                    endDate = dateToBook;
                }
            } else if (timeSlot.repeat === "Fortnightly") {
                for(let i = 0; i < numSessions; i++) {
                    let dateToBook = new Date(initialTimestamp + i*1000*60*60*24*14);
                    endDate = dateToBook;
                }
            } else if (timeSlot.repeat === "Monthly") {
                for(let i = 0; i < numSessions; i++) {
                    let monthToCheck = initialDate.getMonth() + i;
                    let yearToCheck = initialDate.getFullYear();
                    while (monthToCheck > 11) {
                        monthToCheck -= 12;
                        yearToCheck += 1;
                    }
                    let lastDay = 31;
                    if ([3,5,8,10].includes(monthToCheck)) {
                        lastDay = 30;
                    } else if (monthToCheck === 1) {
                        const isLeapYear = (yearToCheck % 4) ? 0 : 1;
                        lastDay = 28 + isLeapYear;
                    }
                    const dayToBook = Math.min(lastDay, initialDate.getDate());
                    endDate = new Date(yearToCheck, monthToCheck, dayToBook);
                }
            }
            const booking = {
                firstName: athlete.firstName,
                lastName: athlete.lastName,
                phone: athlete.phone,
                email: athlete.email,
                startDate: initialDate,
                endDate: endDate
            };
            timeSlot.bookedBy.push(booking);
            coach.save();
        }
    }).then(() => {
        const response: RestResponse = {
            status: 'success',
            message: 'successfully booked session',
            data: {
                token: bearerToken
            }
        };

        return res.status(200).json(response);

    }).catch ((err: any) => {
        const response: RestResponse = {
            status: 'fail',
            message: 'unable to book specified slot - internal error',
            data: {
                token: bearerToken
            }
        };

        return res.status(500).json(response);
    });
}