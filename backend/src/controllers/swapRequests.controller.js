const swapRequestsService = require('../services/swapRequests.service');

const getAll = async (req, res, next) => {
  try {
    const requests = await swapRequestsService.getAll();
    res.status(200).json({ items: requests });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const request = await swapRequestsService.getById(req.params.id);
    if (!request) {
      return res.status(404).json({ status: 404, message: 'Заявку не знайдено' });
    }
    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const newRequest = await swapRequestsService.create(req.body);
    res.status(201).json(newRequest);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const updatedRequest = await swapRequestsService.update(req.params.id, req.body);
    if (!updatedRequest) {
      return res.status(404).json({ status: 404, message: 'Заявку не знайдено' });
    }
    res.status(200).json(updatedRequest);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const isDeleted = await swapRequestsService.remove(req.params.id);
    if (!isDeleted) {
      return res.status(404).json({ status: 404, message: 'Заявку не знайдено' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };