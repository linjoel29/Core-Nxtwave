const express = require('express');
const router = express.Router();
const savingsController = require('../controllers/savingsController');

router.post('/calculate', savingsController.calculateSavings);

module.exports = router;
