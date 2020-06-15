import mongoose = require('mongoose');

const server: string = process.env.MONGO_URI;
const database: string = process.env.DB_NAME;

class Database {
    constructor() {
        this._connect();
        this._configure();
    }

    _connect() {
        mongoose.connect(`${server}/${database}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log(`Database connection successful`);
        }).catch(err => {
            console.error(`Error connecting to database: ${err}`);
        });
    }

    _configure() {
        mongoose.set('useFindAndModify', false);
    }
}

export const db = new Database();