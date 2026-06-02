const shiftsService = require('../services/shifts.service');

const getAll = async (req, res, next) => {
  try {
    const filters = { ...req.query, userId: req.user.id };
    const shifts = await shiftsService.getAllShifts(filters);
    res.status(200).json({ items: shifts });
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const shift = await shiftsService.getShiftById(req.params.id, req.user.id);
    res.status(200).json(shift);
  } catch (error) { next(error); }
};

const create = async (req, res, next) => {
  try {
    const shiftData = { ...req.body, userId: req.user.id };
    const newShift = await shiftsService.createShift(shiftData);
    res.status(201).json(newShift);
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const updatedShift = await shiftsService.updateShift(req.params.id, req.body, req.user.id);
    res.status(200).json(updatedShift);
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await shiftsService.deleteShift(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, create, update, remove };