const { run } = require("./dbClient");

async function initDb() {
    await run("PRAGMA foreign_keys = ON;");

    await run(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            createdAt TEXT NOT NULL
        );
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS Shifts (
            id INTEGER PRIMARY KEY,
            userId INTEGER NOT NULL,
            date TEXT NOT NULL,
            status TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
        );
    `);

    console.log("DB schema initialized");
}

module.exports = { initDb };