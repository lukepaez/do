/* eslint-disable no-console */
import sqlite3 from 'sqlite3';

// open the database
const db = new sqlite3.Database(
    './db/chinook.db',
    sqlite3.OPEN_READWRITE,
    err => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the in-memory SQlite database.');
    }
);

//close the db connection
db.close(err => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Close the database connection.');
});

//some query examples
//
//db.serialize(() => {
//    db.each(`SELECT PlaylistId as id,
//                    Name as name
//             FROM playlists`, (err, row) => {
//      if (err) {
//        console.error(err.message);
//      }
//      console.log(row.id + "\t" + row.name);
//    });
//  });
//
////db.serialize(() => {
//    db.run('CREATE TABLE lorem (info TEXT)');
//
//    const stmt = db.prepare('INSERT INTO lorem VALUES (?)');
//    for (let i = 0; i < 10; i++) {
//        stmt.run('Ipsum ' + i);
//    }
//    stmt.finalize();
//
//    db.each('SELECT rowid AS id, info FROM lorem', (err, row) => {
//        console.log(row.id + ': ' + row.info);
//    });
//});
//
//function example
//function dbSum(a, b, db) {
//    db.get('SELECT (? + ?) sum', [a, b], (err, row) => {
//      if (err) {
//        console.error(err.message);
//      }
//      console.log(`The sum of ${a} and ${b} is ${row.sum}`);
//    });
//  }
//
