const { db } = require('../utils/firebaseAdmin');

exports.getLoans = async (req, res) => {
  const { userId } = req.params;
  try {
    const snapshot = await db
      .collection('loans')
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .get();

    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (error) {
    console.error('getLoans error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.addLoan = async (req, res) => {
  const { userId, loan_name, total_amount, emi_amount, emi_due_day, remaining_months } = req.body;
  try {
    const docRef = await db.collection('loans').add({
      user_id: userId,
      loan_name,
      total_amount: Number(total_amount) || 0,
      emi_amount: Number(emi_amount) || 0,
      emi_due_day: Number(emi_due_day) || 1,
      remaining_months: Number(remaining_months) || 0,
      created_at: new Date().toISOString(),
    });
    res.status(201).json({ message: 'Loan added successfully', id: docRef.id });
  } catch (error) {
    console.error('addLoan error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLoan = async (req, res) => {
  const { loanId } = req.params;
  try {
    await db.collection('loans').doc(loanId).delete();
    res.json({ message: 'Loan deleted successfully' });
  } catch (error) {
    console.error('deleteLoan error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
