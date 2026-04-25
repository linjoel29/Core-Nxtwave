const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');

router.post('/log', incomeController.logIncome);
router.get('/history/:userId', incomeController.getHistory);

module.exports = router;
