const usersService = require('../services/users.service');

module.exports = {
  getAll: (req, res, next) => {
    try {
      const items = usersService.getAllUsers();
      res.status(200).json({ items });
    } catch (err) { next(err); }
  },
  
  getById: (req, res, next) => {
    try {
      const item = usersService.getUserById(req.params.id);
      res.status(200).json(item);
    } catch (err) { next(err); }
  },
  
  create: (req, res, next) => {
    try {
      const newItem = usersService.createUser(req.body);
      res.status(201).json(newItem);
    } catch (err) { next(err); }
  },
  
  update: (req, res, next) => {
    try {
      const updatedItem = usersService.updateUser(req.params.id, req.body);
      res.status(200).json(updatedItem);
    } catch (err) { next(err); }
  },
  
  delete: (req, res, next) => {
    try {
      usersService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (err) { next(err); }
  }
};