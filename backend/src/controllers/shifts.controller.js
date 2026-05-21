const shiftsService = require("../services/shifts.service");

const shiftsController = {
  getAll: async (req, res, next) => {
    try {
      const items = await shiftsService.getAllShifts(req.query);
      res.status(200).json({ items });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const item = await shiftsService.getShiftById(req.params.id);
      res.status(200).json(item);
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const newItem = await shiftsService.createShift(req.body);
      res.status(201).json(newItem);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const updatedItem = await shiftsService.updateShift(req.params.id, req.body);
      res.status(200).json(updatedItem);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await shiftsService.deleteShift(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
};

module.exports = shiftsController;