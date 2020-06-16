import express = require('express');
import mongoose = require('mongoose');

import { validateSlot } from '../../validators/validateSlot';
import { RestResponse } from '../../interfaces/RestResponse';

export async function createSlot(req: express.Request, res: express.Response) {
    const coach = res.locals.coach;
    const bearerToken = res.locals.bearerToken;

    if (await validateSlot(req.body)) {
        try {

            coach.timeSlots.push(req.body);
            coach.save().then(() => {
                const response: RestResponse = {
                    status: 'ok',
                    message: 'slot created successfully',
                    data: {
                        token: bearerToken
                    }
                };

                return res.status(200).json(response);

            }).catch((err: any) => {
                const response: RestResponse = {
                    status: 'fail',
                    message: 'internal error - could not save slot',
                    data: {
                        token: bearerToken
                    }
                };

                return res.status(500).json(response);

            });

        } catch(err) {
            const response: RestResponse = {
                status: 'fail',
                message: 'internal error',
                data: {
                    token: bearerToken
                }
            };

            return res.status(500).json(response);

        }
    } else {
        const response: RestResponse = {
            status: 'fail',
            message: 'could not insert slot - validation unsuccessful',
            data: {
                token: bearerToken
            }
        };

        return res.status(400).json(response);
    }
}