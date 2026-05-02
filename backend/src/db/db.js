const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../data/app.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Помилка підключення до БД:', err.message);
    } else {
        console.log(`Підключено до бази даних: ${dbPath}`);
    }
});

module.exports = db;