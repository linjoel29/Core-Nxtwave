const express = require('express');
const router  = express.Router();
const { db }  = require('../utils/firebaseAdmin');

// GET /analytics/:userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log(`[analytics] GET /analytics/${userId}`);

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    // Query Firestore — sort in memory to avoid needing a composite index
    const snapshot = await db
      .collection('income_logs')
      .where('userId', '==', userId)
      .get();

    const logs = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 30);

    if (!logs || logs.length === 0) {
      console.log('[analytics] No records found for userId:', userId);
      return res.json({
        logs:      [],
        totalSaved: 0,
        dailyAvg:   0,
        bestDay:    { date: null, amount: 0 },
        chartData:  [],
      });
    }

    console.log(`[analytics] Found ${logs.length} records`);

    const totalSaved = logs.reduce((sum, log) => sum + (Number(log.saved) || 0), 0);
    const dailyAvg   = logs.length > 0 ? Math.round(totalSaved / logs.length) : 0;

    const bestDay = logs.reduce((best, log) =>
      (Number(log.saved) || 0) > (Number(best?.saved) || 0) ? log : best, logs[0]);

    const chartData = logs.map(r => ({
      date:    r.date,
      saved:   Number(r.saved)   || 0,
      income:  Number(r.income)  || 0,
      expense: Number(r.expense) || 0,
    }));

    return res.json({
      logs,
      totalSaved,
      dailyAvg,
      bestDay: { date: bestDay?.date || null, amount: Number(bestDay?.saved) || 0 },
      chartData,
    });
  } catch (err) {
    console.error('[analytics] Error:', err.message, err.stack);
    return res.status(500).json({ error: 'Failed to load analytics: ' + err.message });
  }
});

module.exports = router;
