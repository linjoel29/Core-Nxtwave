require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors    = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { db, admin } = require('./utils/firebaseAdmin');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

console.log('✅ Firebase Admin initialized — project: walletin-ca915');

// ── Analytics Router ──────────────────────────────────────────────────────────
const analyticsRouter = require('./routes/analytics');
app.use('/analytics', analyticsRouter);

// ── Gemini Helper ─────────────────────────────────────────────────────────────
async function callGemini(prompt, fallback) {
  try {
    if (!process.env.GEMINI_API_KEY) return fallback;
    const model  = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (e) {
    console.error('Gemini error:', e.message);
    return fallback;
  }
}

// ── Streak Helper ─────────────────────────────────────────────────────────────
async function getStreak(userId) {
  try {
    // Query without compound orderBy to avoid composite index requirement
    const snapshot = await db
      .collection('income_logs')
      .where('userId', '==', userId)
      .get();
    // Filter saved > 0 and sort in memory
    const allDocs = snapshot.docs.map(d => d.data()).filter(r => (Number(r.saved) || 0) > 0);
    allDocs.sort((a, b) => new Date(b.date) - new Date(a.date));

    const data = allDocs;
    if (!data || data.length === 0) return { current: 0, longest: 0 };

    const uniqueDates = [...new Set(data.map(r => r.date))].sort((a, b) => new Date(b) - new Date(a));

    let currentStreak = 0, longestStreak = 0, tempStreak = 1;

    for (let i = 0; i < uniqueDates.length; i++) {
      if (i === 0) {
        currentStreak = 1; tempStreak = 1;
      } else {
        const prev     = new Date(uniqueDates[i - 1]);
        const curr     = new Date(uniqueDates[i]);
        const diffDays = Math.round((prev - curr) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) { tempStreak++; if (i === tempStreak - 1) currentStreak = tempStreak; }
        else tempStreak = 1;
      }
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    }
    return { current: currentStreak, longest: longestStreak };
  } catch (e) {
    console.error('getStreak error:', e.message);
    return { current: 0, longest: 0 };
  }
}

// ────────────────────────────────────────────────────────────────────────────
// POST /predict
// ────────────────────────────────────────────────────────────────────────────
app.post('/predict', async (req, res) => {
  try {
    const { userId, income, expense } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const incomeNum  = Number(income)  || 0;
    const expenseNum = Number(expense) || 0;

    // Fetch income_logs and sort in memory to avoid index requirement
    const logsSnap = await db
      .collection('income_logs')
      .where('userId', '==', userId)
      .get();
    let logs = logsSnap.docs.map(d => d.data());
    logs.sort((a, b) => new Date(b.date) - new Date(a.date));
    logs = logs.slice(0, 30);

    let trend = 'stable';
    if (logs.length > 1) {
      const history    = logs.map(l => Number(l.income) || 0);
      const overallAvg = history.reduce((a, b) => a + b, 0) / history.length;
      const last3Avg   = history.slice(0, 3).reduce((a, b) => a + b, 0) / Math.min(3, history.length);
      if (last3Avg > overallAvg * 1.05) trend = 'increasing';
      else if (last3Avg < overallAvg * 0.95) trend = 'decreasing';
    }

    // Fetch loans
    const loansSnap = await db.collection('loans').where('userId', '==', userId).get();
    const totalEmi  = loansSnap.docs.reduce((acc, d) => acc + (Number(d.data().emi) || Number(d.data().emi_amount) || 0), 0);

    const remaining  = incomeNum - expenseNum;
    let baseSaving   = Math.max(remaining * 0.10, 10);
    if (incomeNum  > 3000)            baseSaving *= 1.2; else baseSaving *= 0.8;
    if (trend === 'increasing')       baseSaving *= 1.2;
    if (trend === 'decreasing')       baseSaving *= 0.7;
    if (expenseNum > incomeNum * 0.7) baseSaving *= 0.5;
    if (totalEmi   > incomeNum * 0.3) baseSaving *= 0.5;

    const saving = remaining < 50 ? 0 : Math.round(Math.min(baseSaving, 1000));

    const explanation = saving > 0
      ? await callGemini(
          `Explain in 2 short sentences why saving ₹${saving} today is recommended. ` +
          `Data: Income ₹${incomeNum}, Expense ₹${expenseNum}, Trend: ${trend}, EMI load: ₹${totalEmi}. ` +
          `Do NOT suggest a different amount. Be encouraging.`,
          `Saving ₹${saving} today keeps you on track — small amounts add up over time!`
        )
      : 'No savings suggested due to limited remaining balance. Try reducing expenses tomorrow.';

    res.json({ saving, explanation, trend });
  } catch (e) {
    console.error('POST /predict error:', e.message, e.stack);
    res.status(500).json({ error: e.message });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// POST /log-entry
// Body: { userId, income, expense, saving, date, explanation }
// ────────────────────────────────────────────────────────────────────────────
app.post('/log-entry', async (req, res) => {
  try {
    const { userId, income, expense, saving, date, explanation } = req.body;

    console.log('[log-entry] Received:', { userId, income, expense, saving, date });

    if (!userId) return res.status(400).json({ error: 'userId is required' });
    if (!date)   return res.status(400).json({ error: 'date is required' });

    // ── Build Firestore document (camelCase field names for consistency) ──────
    const logEntry = {
      userId,
      date,
      income:         Number(income)  || 0,
      expense:        Number(expense) || 0,
      saved:          Number(saving)  || 0,
      suggestion:     Number(saving)  || 0,
      ai_explanation: explanation || '',
      createdAt:      admin.firestore.FieldValue.serverTimestamp(),
    };

    console.log('[log-entry] Writing to Firestore income_logs');
    await db.collection('income_logs').add(logEntry);

    // Auto-award badges based on cumulative savings
    const savedAmt = Number(saving) || 0;
    if (savedAmt > 0) {
      const allLogsSnap = await db
        .collection('income_logs')
        .where('userId', '==', userId)
        .get();
      const total = allLogsSnap.docs.reduce((acc, d) => acc + (Number(d.data().saved) || 0), 0);

      const badgesSnap = await db
        .collection('badges')
        .where('userId', '==', userId)
        .get();
      const earned = new Set(badgesSnap.docs.map(d => d.data().badge_name));

      const thresholds = [
        { name: 'Bronze', amount: 1000 },
        { name: 'Silver', amount: 5000 },
        { name: 'Gold',   amount: 10000 },
      ];
      for (const t of thresholds) {
        if (total >= t.amount && !earned.has(t.name)) {
          await db.collection('badges').add({
            userId,
            badge_name: t.name,
            awarded_at: admin.firestore.FieldValue.serverTimestamp(),
          });
          console.log(`[log-entry] Badge awarded: ${t.name} to ${userId}`);
        }
      }
    }

    console.log('[log-entry] Success');
    res.status(201).json({ success: true, message: 'Entry logged successfully' });
  } catch (e) {
    console.error('[log-entry] Unexpected error:', e.message, e.stack);
    res.status(500).json({ error: e.message });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// GET /dashboard/:userId
// ────────────────────────────────────────────────────────────────────────────
app.get('/dashboard/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const allLogsSnap = await db
      .collection('income_logs')
      .where('userId', '==', userId)
      .get();
    const totalSavings = allLogsSnap.docs.reduce((acc, d) => acc + (Number(d.data().saved) || 0), 0);

    const { current: currentStreak, longest: longestStreak } = await getStreak(userId);

    const badgesSnap = await db.collection('badges').where('userId', '==', userId).get();
    const badges = badgesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const loansSnap = await db.collection('loans').where('userId', '==', userId).get();
    const loans = loansSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    let loanReminder = null;
    const todayDay  = new Date().getDate();
    const hasDueEmi = loans.some(l => Number(l.emi_due_day || l.due_date) === todayDay);
    if (hasDueEmi) {
      loanReminder = await callGemini(
        'Write a single polite 1-sentence reminder: loan EMI is due today, plan savings carefully.',
        'Your loan EMI is due today — please plan your finances carefully! 💳'
      );
    }

    const nudge = await callGemini(
      'Give a single short motivational savings tip under 12 words for a daily savings app user.',
      'Every rupee saved today is a step toward financial freedom! 🚀'
    );

    res.json({
      totalSavings,
      currentStreak,
      longestStreak,
      badges,
      loanReminder,
      nudge,
      activeLoansCount: loans.length,
    });
  } catch (e) {
    console.error('GET /dashboard error:', e.message, e.stack);
    res.status(500).json({ error: e.message });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// POST /loan  |  GET /loan/:userId  |  DELETE /loan/:loanId
// ────────────────────────────────────────────────────────────────────────────
app.post('/loan', async (req, res) => {
  try {
    const { userId, loan_name, amount, emi, due_date } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const docRef = await db.collection('loans').add({
      userId:    userId,
      loan_name,
      amount:    Number(amount)   || 0,
      emi:       Number(emi)      || 0,
      due_date:  Number(due_date) || 1,
      created_at: new Date().toISOString(),
    });
    res.status(201).json({ success: true, id: docRef.id });
  } catch (e) {
    console.error('POST /loan error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.get('/loan/:userId', async (req, res) => {
  try {
    const snap = await db
      .collection('loans')
      .where('userId', '==', req.params.userId)
      .get();
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(data);
  } catch (e) {
    console.error('GET /loan error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.delete('/loan/:loanId', async (req, res) => {
  try {
    await db.collection('loans').doc(req.params.loanId).delete();
    res.json({ success: true });
  } catch (e) {
    console.error('DELETE /loan error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// GET /history/:userId  (legacy)
// ────────────────────────────────────────────────────────────────────────────
app.get('/history/:userId', async (req, res) => {
  try {
    const snap = await db
      .collection('income_logs')
      .where('userId', '==', req.params.userId)
      .get();
    let data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
    data = data.slice(0, 30);
    res.json({ logs: data, savings: data });
  } catch (e) {
    console.error('GET /history error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// ── Loans route (from controllers) ───────────────────────────────────────────
const loansRouter = require('./routes/loans');
app.use('/loans', loansRouter);

// ── Income route (from controllers) ──────────────────────────────────────────
const incomeRouter = require('./routes/income');
app.use('/income', incomeRouter);

// ── Savings route ─────────────────────────────────────────────────────────────
const savingsRouter = require('./routes/savings');
app.use('/savings', savingsRouter);

// ────────────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
