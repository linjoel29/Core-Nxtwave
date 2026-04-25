const { db } = require('../utils/firebaseAdmin');

exports.logIncome = async (req, res) => {
  const { userId, date, income, expense, saved, suggestion, ai_explanation } = req.body;
  try {
    const docRef = await db.collection('income_logs').add({
      user_id: userId,
      date,
      income: Number(income) || 0,
      expense: Number(expense) || 0,
      saved: Number(saved) || 0,
      suggestion: Number(suggestion) || 0,
      ai_explanation: ai_explanation || '',
      created_at: new Date().toISOString(),
    });
    res.status(201).json({ message: 'Logged successfully', id: docRef.id });
  } catch (error) {
    console.error('logIncome error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getHistory = async (req, res) => {
  const { userId } = req.params;
  try {
    const snapshot = await db
      .collection('income_logs')
      .where('user_id', '==', userId)
      .orderBy('date', 'desc')
      .limit(30)
      .get();

    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (error) {
    console.error('getHistory error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
