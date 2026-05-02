const { all, get, run } = require("../db/dbClient");

function escapeSqlString(s) {
    if (!s) return "";
    return String(s).replace(/'/g, "''");
}

const swapRequestsRepository = {
  getAll: async () => {
    return await all("SELECT id, shiftId, reason, status, createdAt FROM SwapRequests ORDER BY id DESC;");
  },

  getById: async (id) => {
    const reqId = Number(id);
    return await get(`SELECT id, shiftId, reason, status, createdAt FROM SwapRequests WHERE id = ${reqId};`);
  },

  add: async (entity) => {
    const shiftId = Number(entity.shiftId);
    const reason = escapeSqlString(entity.reason);
    const status = entity.status ? escapeSqlString(entity.status) : 'Pending';
    const now = new Date().toISOString();

    const sql = `
      INSERT INTO SwapRequests (shiftId, reason, status, createdAt)
      VALUES (${shiftId}, '${reason}', '${status}', '${now}');
    `;
    
    const result = await run(sql);
    return await get(`SELECT id, shiftId, reason, status, createdAt FROM SwapRequests WHERE id = ${result.lastID};`);
  },

  update: async (id, entity) => {
    const reqId = Number(id);
    const shiftId = Number(entity.shiftId);
    const reason = escapeSqlString(entity.reason);
    const status = escapeSqlString(entity.status);
    
    const sql = `
      UPDATE SwapRequests
      SET shiftId = ${shiftId}, reason = '${reason}', status = '${status}'
      WHERE id = ${reqId};
    `;
    
    const result = await run(sql);
    if (result.changes === 0) return null;
    
    return await get(`SELECT id, shiftId, reason, status, createdAt FROM SwapRequests WHERE id = ${reqId};`);
  },

  delete: async (id) => {
    const reqId = Number(id);
    const result = await run(`DELETE FROM SwapRequests WHERE id = ${reqId};`);
    return result.changes > 0;
  }
};

module.exports = swapRequestsRepository;