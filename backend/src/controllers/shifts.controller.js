const shiftsService = require('../services/shifts.service');

module.exports = {
  getAll: (req, res, next) => {
    try {
      const items = shiftsService.getAllShifts();
      res.status(200).json({ items });
    } catch (err) {
      next(err); 
    }
  },
  
  getById: (req, res, next) => {
    try {
      const item = shiftsService.getShiftById(req.params.id); // Читаем req.params (стр. 61)
      res.status(200).json(item);
    } catch (err) {
      next(err);
    }
  },
  
  create: (req, res, next) => {
    try {
      const newItem = shiftsService.createShift(req.body);
      res.status(201).json(newItem);
    } catch (err) {
      next(err);
    }
  },
  
  update: (req, res, next) => {
    try {
      const updatedItem = shiftsService.updateShift(req.params.id, req.body);
      res.status(200).json(updatedItem);
    } catch (err) {
      next(err);
    }
  },
  
  delete: (req, res, next) => {
    try {
      shiftsService.deleteShift(req.params.id);
      res.status(204).send(); 
    } catch (err) {
      next(err);
    }
  }
};