const express = require('express');
const router = express.Router();
const shiftsController = require('../controllers/shifts.controller');
const { demoAuth } = require('../middleware/auth.middleware');

router.use(demoAuth); 
router.get('/', shiftsController.getAll);
router.get('/:id', shiftsController.getById);
router.post('/', shiftsController.create);
router.put('/:id', shiftsController.update);
router.delete('/:id', shiftsController.remove);

module.exports = router;