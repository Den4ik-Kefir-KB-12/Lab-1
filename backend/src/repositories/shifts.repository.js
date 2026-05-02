const { all, get, run } = require("../db/dbClient");

function escapeSqlString(s) {
    if (!s) return "";
    return String(s).replace(/'/g, "''");
}

const shiftsRepository = {
  getAll: async (filters = {}) => {
    let sql = "SELECT id, userId, date, status, createdAt FROM Shifts";
    const conditions = [];

    if (filters.userId) {
        conditions.push(`userId = ${Number(filters.userId)}`);
    }
    if (filters.status) {
        conditions.push(`status = '${escapeSqlString(filters.status)}'`);
    }
    
    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    const allowedSorts = ['id', 'date', 'createdAt', 'userId'];
    if (filters.sort && allowedSorts.includes(filters.sort)) {
        const order = filters.order === 'asc' ? 'ASC' : 'DESC';
        sql += ` ORDER BY ${filters.sort} ${order}`;
    } else {
        sql += " ORDER BY id DESC";
    }

    if (filters.limit) {
        sql += ` LIMIT ${Number(filters.limit)}`;
    }

    sql += ";";
    return await all(sql);
  },

  getById: async (id) => {
    const shiftId = Number(id);
    return await get(`SELECT id, userId, date, status, createdAt FROM Shifts WHERE id = ${shiftId};`);
  },

  add: async (entity) => {
    const userId = Number(entity.userId);
    const date = escapeSqlString(entity.date);
    const status = escapeSqlString(entity.status);
    const now = new Date().toISOString();

    const sql = `
      INSERT INTO Shifts (userId, date, status, createdAt)
      VALUES (${userId}, '${date}', '${status}', '${now}');
    `;
    
    const result = await run(sql);
    return await get(`SELECT id, userId, date, status, createdAt FROM Shifts WHERE id = ${result.lastID};`);
  },

  update: async (id, entity) => {
    const shiftId = Number(id);
    const userId = Number(entity.userId);
    const date = escapeSqlString(entity.date);
    const status = escapeSqlString(entity.status);
    
    const sql = `
      UPDATE Shifts
      SET userId = ${userId}, date = '${date}', status = '${status}'
      WHERE id = ${shiftId};
    `;
    
    const result = await run(sql);
    if (result.changes === 0) return null;
    
    return await get(`SELECT id, userId, date, status, createdAt FROM Shifts WHERE id = ${shiftId};`);
  },

  delete: async (id) => {
    const shiftId = Number(id);
    const result = await run(`DELETE FROM Shifts WHERE id = ${shiftId};`);
    return result.changes > 0;
  }
};

module.exports = shiftsRepository;