const { all, get, run } = require("../db/dbClient");

function escapeSqlString(s) {
    if (!s) return "";
    return String(s).replace(/'/g, "''");
}

const usersRepository = {
  getAll: async () => {
    return await all("SELECT id, email, name, createdAt FROM Users ORDER BY id DESC;");
  },

  getById: async (id) => {
    const userId = Number(id);
    return await get(`SELECT id, email, name, createdAt FROM Users WHERE id = ${userId};`);
  },

  add: async (entity) => {
    const email = escapeSqlString(entity.email);
    const name = escapeSqlString(entity.name);
    const now = new Date().toISOString();

    const sql = `
      INSERT INTO Users (email, name, createdAt)
      VALUES ('${email}', '${name}', '${now}');
    `;
    
    const result = await run(sql);
    
    return await get(`SELECT id, email, name, createdAt FROM Users WHERE id = ${result.lastID};`);
  },

  update: async (id, entity) => {
    const userId = Number(id);
    const email = escapeSqlString(entity.email);
    const name = escapeSqlString(entity.name);
    
    const sql = `
      UPDATE Users
      SET email = '${email}', name = '${name}'
      WHERE id = ${userId};
    `;
    
    const result = await run(sql);
    if (result.changes === 0) return null; 
    
    return await get(`SELECT id, email, name, createdAt FROM Users WHERE id = ${userId};`);
  },

  delete: async (id) => {
    const userId = Number(id);
    const result = await run(`DELETE FROM Users WHERE id = ${userId};`);
    return result.changes > 0;
  }
};

module.exports = usersRepository;