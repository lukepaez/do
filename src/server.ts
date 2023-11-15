import { register } from './index';
import sqlite3 from 'sqlite3';
import './config/var';
import path from 'path';
const app = register();

export const db = new sqlite3.Database(
    path.resolve(__dirname, './db/dinky.db'),
    sqlite3.OPEN_READWRITE,
    err => {
        if (err) return console.error(err.message);
        console.log('Connected to the in-memory SQlite database.');
    }
);

// serve app
app.listen(
    {
        port: 5005,
        listenTextResolver: addr => {
            return `do server is listening at ${addr}`;
        },
    },
    error => {
        if (error) {
            app.log.error(error);
            process.exit(1);
        }
    }
);
