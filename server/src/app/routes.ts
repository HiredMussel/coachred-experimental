import express = require('express');
import cors = require('cors');

export function routes(app : express.Application) {
    app.options('*', cors());

    app.get('/', (req : express.Request, res : express.Response) => {
        res.send('Hello World!');
    });
}