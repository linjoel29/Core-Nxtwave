const express = require('express');
const router = express.Router();
const loansController = require('../controllers/loansController');

router.get('/:userId', loansController.getLoans);
router.post('/add', loansController.addLoan);
router.delete('/:loanId', loansController.deleteLoan);

module.exports = router;
