const { all, get, run } = require("../db/dbClient");

const shiftsRepository = {
  getAll: async (filters = {}) => {
    let sql = "SELECT id, userId, date, status, createdAt FROM Shifts";
    const conditions = [];
    const params = [];

    if (filters.userId) {
        conditions.push("userId = ?");
        params.push(Number(filters.userId));
    }
    if (filters.status) {
        conditions.push("status = ?");
        params.push(filters.status);
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
        sql += " LIMIT ?";
        params.push(Number(filters.limit));
    }

    sql += ";";
    return await all(sql, params);
  },

  getById: async (id) => {
    return await get(`SELECT id, userId, date, status, createdAt FROM Shifts WHERE id = ?;`, [Number(id)]);
  },

  add: async (entity) => {
    const now = new Date().toISOString();
    const sql = `
      INSERT INTO Shifts (userId, date, status, createdAt)
      VALUES (?, ?, ?, ?);
    `;
    
    const result = await run(sql, [Number(entity.userId), entity.date, entity.status || 'Planned', now]);
    return await get(`SELECT id, userId, date, status, createdAt FROM Shifts WHERE id = ?;`, [result.lastID]);
  },

  update: async (id, entity, ownerId) => {
    const sql = `
      UPDATE Shifts
      SET date = ?, status = ?
      WHERE id = ? AND userId = ?; 
    `;
    
    const result = await run(sql, [entity.date, entity.status, Number(id), Number(ownerId)]);
    if (result.changes === 0) return null;
    
    return await get(`SELECT id, userId, date, status, createdAt FROM Shifts WHERE id = ?;`, [Number(id)]);
  },

  delete: async (id, ownerId) => {
    const sql = `DELETE FROM Shifts WHERE id = ? AND userId = ?;`;
    const result = await run(sql, [Number(id), Number(ownerId)]);
    return result.changes > 0;
  }
};

module.exports = shiftsRepository;