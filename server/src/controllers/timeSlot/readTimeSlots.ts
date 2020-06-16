import express = require('express');
import { CoachModel } from '../../models/CoachModel';

export async function readTimeSlots (req : express.Request, res : express.Response) {
    const coachId = req.query.coachId;
    const bearerToken = res.locals.bearerToken;
    try {
            let slotsToReturn: Array<any> = [];
            const desiredDate = new Date(Date.parse(req.params.date));
            CoachModel.findById(coachId).then((coach: any) => {

                coach.timeSlots.forEach((slot: any) => {
                    const slotDate = new Date(Date.parse(slot.date));
                    if (slotDate.toDateString() == desiredDate.toDateString()) {
                        slotsToReturn.push(slot);
                    } else if (Date.parse(req.params.date) > Date.parse(slot.date)){
                        if (slot.repeat === 'Weekly' && slotDate.getDay() === desiredDate.getDay()) {
                            slotsToReturn.push(slot);
                        } else if (slot.repeat === 'Fortnightly' && slotDate.getDay() === desiredDate.getDay()) {
                            const weeksBetween = (dayOne: number, dayTwo: number) => {
                                return (dayTwo - dayOne)/(60*60*24*7*1000);
                            }
                            if (!(weeksBetween(Date.parse(slot.date),Date.parse(req.params.date)) &1)) {
                                slotsToReturn.push(slot);
                            }
                        } else if (slot.repeat === 'Monthly') {
                            const currentMonth = desiredDate.getMonth();
                            let lastDay = 31;
                            if ([3,5,8,10].includes(currentMonth)) {
                                lastDay = 30;
                            } else if (currentMonth === 1) {
                                const isLeapYear = (desiredDate.getFullYear() % 4) ? 0 : 1;
                                const lastDay = 28 + isLeapYear;
                            }
                            if (slotDate.getDate() === desiredDate.getDate() 
                            || desiredDate.getDate() === lastDay && slotDate.getDate() > lastDay) {
                                slotsToReturn.push(slot);
                            }
                        }
                    }
                })
                return res.status(200).json({
                    status: 'success',
                    message: 'slots retrieved',
                    data: {
                        slots: slotsToReturn,
                        token: bearerToken
                    }
                })
            })
        } catch (err) {
            return res.status(404).json({
                status: 'fail',
                message: 'Unable to find slots',
                data: {
                    token: bearerToken
                }
            })
    }
}