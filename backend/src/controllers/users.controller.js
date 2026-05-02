const usersService = require("../services/users.service");

const usersController = {
  getAll: async (req, res, next) => {
    try {
      const items = await usersService.getAllUsers();
      res.status(200).json({ items });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const item = await usersService.getUserById(req.params.id);
      res.status(200).json(item);
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const newItem = await usersService.createUser(req.body);
      res.status(201).json(newItem);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const updatedItem = await usersService.updateUser(req.params.id, req.body);
      res.status(200).json(updatedItem);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await usersService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
};

module.exports = usersController;