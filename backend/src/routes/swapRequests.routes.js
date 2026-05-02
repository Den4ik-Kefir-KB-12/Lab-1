const express = require('express');
const router = express.Router();
const swapRequestsController = require('../controllers/swapRequests.controller');

router.get('/', swapRequestsController.getAll);
router.get('/:id', swapRequestsController.getById);
router.post('/', swapRequestsController.create);
router.put('/:id', swapRequestsController.update);
router.delete('/:id', swapRequestsController.remove);

module.exports = router;