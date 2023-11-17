import { register } from './index';
import sqlite3 from 'sqlite3';
import './config/var';
import path from 'path';
import fastify from 'fastify';
const app = register();

//console.log(path.resolve(__dirname, './db/dinky.db'));

// init db
export const db = new sqlite3.Database(
    path.resolve(__dirname, './db/dinky.db'),
    sqlite3.OPEN_READWRITE,
    err => {
        if (err) return console.error(err.message);
        console.log('Connected to the in-memory SQlite database.');
    }
);

['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, async () => {
        await app.close();
        process.exit(0);
    });
});

// serve app
app.listen({ port: 5005 }, error => {
    if (error) {
        app.log.error(error);
        process.exit(1);
    }
});
