const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Вказуємо шлях до бази даних
const dbPath = path.resolve(__dirname, '../../data/app.db');
const db = new sqlite3.Database(dbPath);

// Оновлені функції, які тепер підтримують параметри (params)
const all = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
};

module.exports = { db, all, get, run };