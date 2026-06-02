const { all, get, run } = require("../db/dbClient");

const swapRequestsRepository = {
  getAll: async () => {
    return await all("SELECT id, shiftId, reason, status, createdAt FROM SwapRequests ORDER BY id DESC;");
  },

  getById: async (id) => {
    return await get(`SELECT id, shiftId, reason, status, createdAt FROM SwapRequests WHERE id = ?;`, [Number(id)]);
  },

  add: async (entity) => {
    const now = new Date().toISOString();
    const sql = `
      INSERT INTO SwapRequests (shiftId, reason, status, createdAt)
      VALUES (?, ?, ?, ?);
    `;
    
    const result = await run(sql, [Number(entity.shiftId), entity.reason, entity.status || 'Pending', now]);
    return await get(`SELECT id, shiftId, reason, status, createdAt FROM SwapRequests WHERE id = ?;`, [result.lastID]);
  },

  update: async (id, entity) => {
    const sql = `
      UPDATE SwapRequests
      SET shiftId = ?, reason = ?, status = ?
      WHERE id = ?;
    `;
    
    const result = await run(sql, [Number(entity.shiftId), entity.reason, entity.status, Number(id)]);
    if (result.changes === 0) return null;
    
    return await get(`SELECT id, shiftId, reason, status, createdAt FROM SwapRequests WHERE id = ?;`, [Number(id)]);
  },

  delete: async (id) => {
    const result = await run(`DELETE FROM SwapRequests WHERE id = ?;`, [Number(id)]);
    return result.changes > 0;
  }
};

module.exports = swapRequestsRepository;