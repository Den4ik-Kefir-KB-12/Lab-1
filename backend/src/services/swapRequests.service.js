const swapRequestsRepo = require('../repositories/swapRequests.repository');

const swapRequestsService = {
  getAll: async () => {
    return await swapRequestsRepo.getAll();
  },

  getById: async (id) => {
    return await swapRequestsRepo.getById(id);
  },

  create: async (data) => {
    if (!data.shiftId || !data.reason) {
      const error = new Error("Поля shiftId та reason є обов'язковими");
      error.status = 400;
      error.code = "BAD_REQUEST";
      throw error;
    }
    return await swapRequestsRepo.add(data);
  },

  update: async (id, data) => {
    if (!data.shiftId || !data.reason || !data.status) {
      const error = new Error("Поля shiftId, reason та status є обов'язковими");
      error.status = 400;
      error.code = "BAD_REQUEST";
      throw error;
    }
    return await swapRequestsRepo.update(id, data);
  },

  remove: async (id) => {
    return await swapRequestsRepo.delete(id);
  }
};

module.exports = swapRequestsService;