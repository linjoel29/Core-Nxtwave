const express = require('express');
const router = express.Router();
const { db, admin } = require('../utils/firebaseAdmin');

// POST /api/goals/add
router.post('/add', async (req, res) => {
  try {
    const { userId, goalName, targetAmount, currentAmount, deadline } = req.body;
    
    if (!userId || !goalName || !targetAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const goal = {
      userId: req.body.userId,
      goalName: req.body.goalName,
      targetAmount: Number(req.body.targetAmount),
      currentAmount: Number(req.body.currentAmount) || 0,
      deadline: req.body.deadline,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('goals').add(goal);
    res.json({ success: true, message: 'Goal created successfully' });
  } catch (e) {
    console.error('POST /api/goals/add error:', e);
    res.status(500).json({ error: e.message });
  }
});

// GET /api/goals/:userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await db.collection('goals')
      .where('userId', '==', userId)
      .get();
      
    const goals = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    res.json({ goals });
  } catch (e) {
    console.error('GET /api/goals/:userId error:', e);
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/goals/:goalId
router.patch('/:goalId', async (req, res) => {
  try {
    const { goalId } = req.params;
    await db.collection('goals').doc(goalId).update({
      currentAmount: Number(req.body.currentAmount)
    });
    res.json({ success: true });
  } catch (e) {
    console.error('PATCH /api/goals/:goalId error:', e);
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/goals/:goalId
router.delete('/:goalId', async (req, res) => {
  try {
    const { goalId } = req.params;
    await db.collection('goals').doc(goalId).delete();
    res.json({ success: true });
  } catch (e) {
    console.error('DELETE /api/goals/:goalId error:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
