const { GoogleGenerativeAI } = require('@google/generative-ai');
const { db } = require('../utils/firebaseAdmin');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

exports.calculateSavings = async (req, res) => {
  try {
    const { userId, todayIncome, todayExpense, incomeHistory } = req.body;

    const remaining = todayIncome - todayExpense;

    let trend = 'stable';
    if (incomeHistory && incomeHistory.length > 0) {
      const overallAvg = incomeHistory.reduce((a, b) => a + b, 0) / incomeHistory.length;
      const last3 = incomeHistory.slice(0, 3);
      const last3Avg = last3.length > 0 ? (last3.reduce((a, b) => a + b, 0) / last3.length) : overallAvg;
      if (last3Avg > overallAvg) trend = 'increasing';
      else if (last3Avg < overallAvg) trend = 'decreasing';
    }

    // Fetch loans from Firestore
    let totalEmi = 0;
    try {
      const loansSnap = await db
        .collection('loans')
        .where('user_id', '==', userId)
        .get();
      loansSnap.docs.forEach(doc => {
        totalEmi += Number(doc.data().emi_amount) || 0;
      });
    } catch (loansErr) {
      console.error('Failed to fetch loans for savings calc:', loansErr.message);
    }

    const loanBurdenRatio = todayIncome > 0 ? (totalEmi / todayIncome) : 0;

    let loanBurden = 'low';
    if (loanBurdenRatio > 0.5) loanBurden = 'high';
    else if (loanBurdenRatio >= 0.2 && loanBurdenRatio <= 0.5) loanBurden = 'moderate';

    let base = remaining * 0.2;
    if (trend === 'increasing') base *= 1.2;
    if (trend === 'decreasing') base *= 0.7;
    if (loanBurden === 'high') base *= 0.5;
    if (loanBurden === 'low') base *= 1.1;

    let suggestion = Math.min(Math.max(base, 10), 500);
    suggestion = Math.round(suggestion);

    let status = 'safe';
    if (suggestion > remaining * 0.3) status = 'tight';
    else if (suggestion > remaining * 0.15) status = 'moderate';

    let ai_explanation = "Great job logging your income today. Let's put a small portion aside for your savings!";

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `Explain why saving ₹${suggestion} is recommended today for a user with irregular income. Keep it simple and practical. Data: Income ₹${todayIncome}, Expense ₹${todayExpense}, Trend: ${trend}.`;
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        ai_explanation = result.response.text();
      } catch (aiErr) {
        console.error('AI Error:', aiErr);
      }
    }

    res.json({ suggestion, status, ai_explanation, trend, loanBurden });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
