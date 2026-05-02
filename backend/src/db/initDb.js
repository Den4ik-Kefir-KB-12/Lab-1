const { run, get } = require("./dbClient");

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

    await run(`
        CREATE TABLE IF NOT EXISTS SwapRequests (
            id INTEGER PRIMARY KEY,
            shiftId INTEGER NOT NULL,
            reason TEXT NOT NULL,
            status TEXT DEFAULT 'Pending',
            createdAt TEXT NOT NULL,
            FOREIGN KEY (shiftId) REFERENCES Shifts(id) ON DELETE CASCADE
        );
    `);

    console.log("DB schema initialized");
    

    await seedData();
}

async function seedData() {

    const row = await get("SELECT COUNT(*) as count FROM Users");
    
    if (row && row.count === 0) {
        console.log("База порожня. Додаємо тестові дані (Seed)...");
        
        const now = new Date().toISOString();

        await run(`INSERT INTO Users (email, name, createdAt) VALUES ('alice@gmail.com', 'Alice', '${now}')`);
        await run(`INSERT INTO Users (email, name, createdAt) VALUES ('bob@gmail.com', 'Bob', '${now}')`);

        await run(`INSERT INTO Shifts (userId, date, status, createdAt) VALUES (1, '2026-06-01', 'Planned', '${now}')`);
        await run(`INSERT INTO Shifts (userId, date, status, createdAt) VALUES (2, '2026-06-02', 'Planned', '${now}')`);

        await run(`INSERT INTO SwapRequests (shiftId, reason, status, createdAt) VALUES (1, 'Захворів, потрібна заміна', 'Pending', '${now}')`);
        await run(`INSERT INTO SwapRequests (shiftId, reason, status, createdAt) VALUES (2, 'Сімейні обставини', 'Approved', '${now}')`);
        
        console.log("Тестові дані успішно додано!");
    }
}

module.exports = { initDb };