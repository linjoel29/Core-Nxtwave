// ──────────────────────────────────────────────────────────────────────────────
// Badge Definitions & Calculator — Gigsaver Achievement System
// ──────────────────────────────────────────────────────────────────────────────

export const ALL_BADGES = [
  // ── 🔥 STREAK BADGES ─────────────────────────────────────────────────────
  { id: 'streak_3', icon: '🔥', name: 'On Fire', desc: '3-day saving streak', req: 3, type: 'streak', category: 'Streaks' },
  { id: 'streak_7', icon: '⚡', name: 'Week Warrior', desc: '7-day saving streak', req: 7, type: 'streak', category: 'Streaks' },
  { id: 'streak_10', icon: '💫', name: 'Perfect Ten', desc: '10-day saving streak', req: 10, type: 'streak', category: 'Streaks' },
  { id: 'streak_14', icon: '🌟', name: 'Fortnight Fighter', desc: '14-day saving streak', req: 14, type: 'streak', category: 'Streaks' },
  { id: 'streak_21', icon: '🏅', name: 'Habit Builder', desc: '21-day saving streak', req: 21, type: 'streak', category: 'Streaks' },
  { id: 'streak_25', icon: '🎯', name: 'Quarter Master', desc: '25-day saving streak', req: 25, type: 'streak', category: 'Streaks' },
  { id: 'streak_30', icon: '👑', name: 'Monthly Legend', desc: '30-day saving streak', req: 30, type: 'streak', category: 'Streaks' },
  { id: 'streak_50', icon: '💎', name: 'Diamond Saver', desc: '50-day saving streak', req: 50, type: 'streak', category: 'Streaks' },
  { id: 'streak_100', icon: '🚀', name: 'Century Champion', desc: '100-day saving streak', req: 100, type: 'streak', category: 'Streaks' },
  { id: 'streak_365', icon: '🌈', name: 'Year of Glory', desc: '365-day saving streak', req: 365, type: 'streak', category: 'Streaks' },

  // ── 💰 TOTAL SAVINGS BADGES ───────────────────────────────────────────────
  { id: 'save_500', icon: '🌱', name: 'Seedling Saver', desc: 'Save ₹500 total', req: 500, type: 'totalSaved', category: 'Savings' },
  { id: 'save_1000', icon: '🥉', name: 'Bronze Saver', desc: 'Save ₹1,000 total', req: 1000, type: 'totalSaved', category: 'Savings' },
  { id: 'save_2000', icon: '💵', name: 'Money Sprout', desc: 'Save ₹2,000 total', req: 2000, type: 'totalSaved', category: 'Savings' },
  { id: 'save_5000', icon: '🥈', name: 'Silver Saver', desc: 'Save ₹5,000 total', req: 5000, type: 'totalSaved', category: 'Savings' },
  { id: 'save_10000', icon: '🥇', name: 'Gold Saver', desc: 'Save ₹10,000 total', req: 10000, type: 'totalSaved', category: 'Savings' },
  { id: 'save_25000', icon: '💎', name: 'Diamond Hoarder', desc: 'Save ₹25,000 total', req: 25000, type: 'totalSaved', category: 'Savings' },
  { id: 'save_50000', icon: '🏆', name: 'Elite Saver', desc: 'Save ₹50,000 total', req: 50000, type: 'totalSaved', category: 'Savings' },
  { id: 'save_100000', icon: '👑', name: 'Lakh Club', desc: 'Save ₹1,00,000 total', req: 100000, type: 'totalSaved', category: 'Savings' },
  { id: 'save_500000', icon: '🌟', name: 'Half Millionaire', desc: 'Save ₹5,00,000 total', req: 500000, type: 'totalSaved', category: 'Savings' },

  // ── 📅 DAYS LOGGED BADGES ─────────────────────────────────────────────────
  { id: 'days_1', icon: '👶', name: 'First Step', desc: 'Log income for first time', req: 1, type: 'daysLogged', category: 'Activity' },
  { id: 'days_5', icon: '🐣', name: 'Getting Started', desc: 'Log income 5 days', req: 5, type: 'daysLogged', category: 'Activity' },
  { id: 'days_10', icon: '🐥', name: 'Regular Tracker', desc: 'Log income 10 days', req: 10, type: 'daysLogged', category: 'Activity' },
  { id: 'days_20', icon: '📊', name: 'Data Lover', desc: 'Log income 20 days', req: 20, type: 'daysLogged', category: 'Activity' },
  { id: 'days_30', icon: '📅', name: 'Monthly Tracker', desc: 'Log income 30 days', req: 30, type: 'daysLogged', category: 'Activity' },
  { id: 'days_50', icon: '📈', name: 'Consistency King', desc: 'Log income 50 days', req: 50, type: 'daysLogged', category: 'Activity' },
  { id: 'days_100', icon: '🎖️', name: 'Century Tracker', desc: 'Log income 100 days', req: 100, type: 'daysLogged', category: 'Activity' },
  { id: 'days_200', icon: '🏅', name: 'Dedicated Logger', desc: 'Log income 200 days', req: 200, type: 'daysLogged', category: 'Activity' },
  { id: 'days_365', icon: '🌍', name: 'Full Year Logger', desc: 'Log income 365 days', req: 365, type: 'daysLogged', category: 'Activity' },

  // ── 🎯 GOALS BADGES ──────────────────────────────────────────────────────
  { id: 'goal_created', icon: '🎯', name: 'Goal Setter', desc: 'Create your first goal', req: 1, type: 'goalsCreated', category: 'Goals' },
  { id: 'goal_created_3', icon: '📝', name: 'Planner', desc: 'Create 3 goals', req: 3, type: 'goalsCreated', category: 'Goals' },
  { id: 'goal_created_5', icon: '🗺️', name: 'Visionary', desc: 'Create 5 goals', req: 5, type: 'goalsCreated', category: 'Goals' },
  { id: 'goal_created_10', icon: '🧭', name: 'Grand Planner', desc: 'Create 10 goals', req: 10, type: 'goalsCreated', category: 'Goals' },
  { id: 'goal_completed_1', icon: '✅', name: 'Goal Crusher', desc: 'Complete 1 goal', req: 1, type: 'goalsCompleted', category: 'Goals' },
  { id: 'goal_completed_3', icon: '🏆', name: 'Triple Threat', desc: 'Complete 3 goals', req: 3, type: 'goalsCompleted', category: 'Goals' },
  { id: 'goal_completed_5', icon: '🌟', name: 'Goal Master', desc: 'Complete 5 goals', req: 5, type: 'goalsCompleted', category: 'Goals' },
  { id: 'goal_completed_10', icon: '👑', name: 'Legend of Goals', desc: 'Complete 10 goals', req: 10, type: 'goalsCompleted', category: 'Goals' },

  // ── 💸 DAILY SAVING AMOUNT BADGES ─────────────────────────────────────────
  { id: 'daily_100', icon: '🌿', name: 'Century Saver', desc: 'Save ₹100 in a single day', req: 100, type: 'bestDay', category: 'Daily Records' },
  { id: 'daily_250', icon: '💸', name: 'Quarter Grand', desc: 'Save ₹250 in a single day', req: 250, type: 'bestDay', category: 'Daily Records' },
  { id: 'daily_500', icon: '🤑', name: 'High Roller', desc: 'Save ₹500 in a single day', req: 500, type: 'bestDay', category: 'Daily Records' },
  { id: 'daily_1000', icon: '💰', name: 'Grand Saver', desc: 'Save ₹1000 in a single day', req: 1000, type: 'bestDay', category: 'Daily Records' },
  { id: 'daily_2000', icon: '🔱', name: 'Power Saver', desc: 'Save ₹2000 in a single day', req: 2000, type: 'bestDay', category: 'Daily Records' },
  { id: 'daily_5000', icon: '⚜️', name: 'Mega Saver', desc: 'Save ₹5000 in a single day', req: 5000, type: 'bestDay', category: 'Daily Records' },

  // ── 🏦 LOAN BADGES ────────────────────────────────────────────────────────
  { id: 'loan_added', icon: '📋', name: 'Debt Aware', desc: 'Add your first loan', req: 1, type: 'loansAdded', category: 'Loans' },
  { id: 'loan_3', icon: '💳', name: 'Debt Manager', desc: 'Track 3 loans', req: 3, type: 'loansAdded', category: 'Loans' },
  { id: 'loan_5', icon: '🏦', name: 'Finance Pro', desc: 'Track 5 loans', req: 5, type: 'loansAdded', category: 'Loans' },
  { id: 'loan_cleared', icon: '🎊', name: 'Debt Slayer', desc: 'Clear a loan completely', req: 1, type: 'loansCleared', category: 'Loans' },

  // ── ⭐ SPECIAL ACHIEVEMENT BADGES ─────────────────────────────────────────
  { id: 'first_save', icon: '🌅', name: 'First Light', desc: 'Save money for the first time', req: 1, type: 'special_firstSave', category: 'Special' },
  { id: 'early_bird', icon: '🐦', name: 'Early Bird', desc: 'Log income before 8 AM', req: 1, type: 'special_earlyBird', category: 'Special' },
  { id: 'night_owl', icon: '🦉', name: 'Night Owl', desc: 'Log income after 10 PM', req: 1, type: 'special_nightOwl', category: 'Special' },
  { id: 'big_spender', icon: '🛍️', name: 'Expense Tracker', desc: 'Log expense over ₹1000', req: 1000, type: 'special_bigSpender', category: 'Special' },
  { id: 'frugal', icon: '🧘', name: 'Frugal Master', desc: 'Expense under 30% of income', req: 1, type: 'special_frugal', category: 'Special' },
  { id: 'comeback', icon: '🔄', name: 'Comeback Kid', desc: 'Save after 3 days gap', req: 1, type: 'special_comeback', category: 'Special' },
  { id: 'weekend_warrior', icon: '🎮', name: 'Weekend Warrior', desc: 'Save on a weekend', req: 1, type: 'special_weekend', category: 'Special' },
  { id: 'all_rounder', icon: '🎪', name: 'All Rounder', desc: 'Use all features of Gigsaver', req: 1, type: 'special_allRounder', category: 'Special' },
  { id: 'double_up', icon: '✌️', name: 'Double Up', desc: 'Save 2x the suggested amount', req: 1, type: 'special_doubleUp', category: 'Special' },
  { id: 'perfect_week', icon: '🌈', name: 'Perfect Week', desc: 'Save every day for 7 days', req: 1, type: 'special_perfectWeek', category: 'Special' },
  { id: 'high_income', icon: '📈', name: 'Big Earner', desc: 'Log income over ₹5000 in a day', req: 5000, type: 'special_highIncome', category: 'Special' },
  { id: 'zero_expense', icon: '🧊', name: 'No Spend Day', desc: 'Log ₹0 expense for a day', req: 1, type: 'special_zeroExpense', category: 'Special' },
  { id: 'half_save', icon: '💪', name: 'Power Move', desc: 'Save 50%+ of income in a day', req: 1, type: 'special_halfSave', category: 'Special' },

  // ── 🎮 LEVEL BADGES ───────────────────────────────────────────────────────
  { id: 'level_bronze', icon: '🟤', name: 'Bronze Level', desc: 'Earn 5 badges', req: 5, type: 'badgesEarned', category: 'Levels' },
  { id: 'level_silver', icon: '⚪', name: 'Silver Level', desc: 'Earn 10 badges', req: 10, type: 'badgesEarned', category: 'Levels' },
  { id: 'level_gold', icon: '🟡', name: 'Gold Level', desc: 'Earn 20 badges', req: 20, type: 'badgesEarned', category: 'Levels' },
  { id: 'level_platinum', icon: '🔵', name: 'Platinum Level', desc: 'Earn 35 badges', req: 35, type: 'badgesEarned', category: 'Levels' },
  { id: 'level_diamond', icon: '💠', name: 'Diamond Level', desc: 'Earn 50 badges', req: 50, type: 'badgesEarned', category: 'Levels' },
  { id: 'level_master', icon: '🔮', name: 'Master Level', desc: 'Earn 75 badges', req: 75, type: 'badgesEarned', category: 'Levels' },
  { id: 'level_legend', icon: '🏛️', name: 'Legendary', desc: 'Earn all badges', req: 100, type: 'badgesEarned', category: 'Levels' },

  // ── 📊 INCOME BADGES ──────────────────────────────────────────────────────
  { id: 'income_total_10k', icon: '💼', name: 'Earner', desc: 'Total income ₹10,000', req: 10000, type: 'totalIncome', category: 'Income' },
  { id: 'income_total_50k', icon: '💼', name: 'Hard Worker', desc: 'Total income ₹50,000', req: 50000, type: 'totalIncome', category: 'Income' },
  { id: 'income_total_100k', icon: '🏢', name: 'Income King', desc: 'Total income ₹1,00,000', req: 100000, type: 'totalIncome', category: 'Income' },
  { id: 'income_total_500k', icon: '🏰', name: 'Revenue Royal', desc: 'Total income ₹5,00,000', req: 500000, type: 'totalIncome', category: 'Income' },

  // ── 💡 SAVING RATE BADGES ─────────────────────────────────────────────────
  { id: 'rate_10', icon: '📊', name: 'Smart Starter', desc: 'Average saving rate 10%+', req: 10, type: 'savingRate', category: 'Saving Rate' },
  { id: 'rate_20', icon: '📈', name: 'Solid Saver', desc: 'Average saving rate 20%+', req: 20, type: 'savingRate', category: 'Saving Rate' },
  { id: 'rate_30', icon: '🎯', name: 'Expert Saver', desc: 'Average saving rate 30%+', req: 30, type: 'savingRate', category: 'Saving Rate' },
  { id: 'rate_50', icon: '🏆', name: 'Half & Half', desc: 'Average saving rate 50%+', req: 50, type: 'savingRate', category: 'Saving Rate' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Badge Calculator
// ──────────────────────────────────────────────────────────────────────────────
export const calculateBadges = (data) => {
  const {
    incomeLogs = [],
    loans = [],
    goals = [],
    totalSaved = 0,
  } = data;

  // ── Compute stats from raw data ──────────────────────────────────────────

  // Streak: consecutive days with saved > 0 counting backwards from today
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 400; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const hasEntry = incomeLogs.some(l => l.date === dateStr && (Number(l.saved) || 0) > 0);
    if (hasEntry) {
      streak++;
    } else {
      break;
    }
  }

  // Best single day saving
  const bestDay = incomeLogs.length > 0
    ? Math.max(...incomeLogs.map(l => Number(l.saved) || 0))
    : 0;

  // Total unique days logged
  const uniqueDates = new Set(incomeLogs.map(l => l.date));
  const daysLogged = uniqueDates.size;

  // Goals stats
  const goalsCompleted = goals.filter(
    g => (Number(g.currentAmount) || 0) >= (Number(g.targetAmount) || Infinity)
  ).length;
  const goalsCreated = goals.length;

  // Loans stats
  const loansAdded = loans.length;

  // Total income
  const totalIncome = incomeLogs.reduce((acc, l) => acc + (Number(l.income) || 0), 0);

  // Average saving rate
  const savingRate = totalIncome > 0 ? Math.round((totalSaved / totalIncome) * 100) : 0;

  // Special badge checks
  const hasEarlyBird = incomeLogs.some(l => {
    if (!l.createdAt) return false;
    const ts = l.createdAt.seconds ? new Date(l.createdAt.seconds * 1000) : new Date(l.createdAt);
    return ts.getHours() < 8;
  });

  const hasNightOwl = incomeLogs.some(l => {
    if (!l.createdAt) return false;
    const ts = l.createdAt.seconds ? new Date(l.createdAt.seconds * 1000) : new Date(l.createdAt);
    return ts.getHours() >= 22;
  });

  const hasBigSpender = incomeLogs.some(l => (Number(l.expense) || 0) >= 1000);

  const hasFrugal = incomeLogs.some(l => {
    const inc = Number(l.income) || 0;
    const exp = Number(l.expense) || 0;
    return inc > 0 && exp > 0 && (exp / inc) < 0.3;
  });

  const hasWeekendWarrior = incomeLogs.some(l => {
    const d = new Date(l.date);
    return (d.getDay() === 0 || d.getDay() === 6) && (Number(l.saved) || 0) > 0;
  });

  const hasFirstSave = incomeLogs.some(l => (Number(l.saved) || 0) > 0);

  const hasDoubleUp = incomeLogs.some(l => {
    const saved = Number(l.saved) || 0;
    const suggestion = Number(l.suggestion) || 0;
    return suggestion > 0 && saved >= suggestion * 2;
  });

  const hasHighIncome = incomeLogs.some(l => (Number(l.income) || 0) >= 5000);

  const hasZeroExpense = incomeLogs.some(l => (Number(l.expense) || 0) === 0);

  const hasHalfSave = incomeLogs.some(l => {
    const inc = Number(l.income) || 0;
    const saved = Number(l.saved) || 0;
    return inc > 0 && (saved / inc) >= 0.5;
  });

  // Comeback: saved after a gap of 3+ days
  let hasComeback = false;
  const sortedDates = [...uniqueDates].sort((a, b) => new Date(a) - new Date(b));
  for (let i = 1; i < sortedDates.length; i++) {
    const diff = Math.round((new Date(sortedDates[i]) - new Date(sortedDates[i - 1])) / (1000 * 60 * 60 * 24));
    if (diff >= 3) { hasComeback = true; break; }
  }

  // All Rounder: has used daily, goals, loans
  const hasAllRounder = incomeLogs.length > 0 && goals.length > 0 && loans.length > 0;

  // Perfect Week: 7 consecutive days (same as streak >= 7 but keep it separate for semantics)
  const hasPerfectWeek = streak >= 7;

  // ── Evaluate all badges ──────────────────────────────────────────────────
  // First pass: count non-level badges earned
  let earnedCount = 0;

  const getAchieved = (badge) => {
    switch (badge.type) {
      case 'streak':          return streak >= badge.req;
      case 'totalSaved':      return totalSaved >= badge.req;
      case 'daysLogged':      return daysLogged >= badge.req;
      case 'bestDay':         return bestDay >= badge.req;
      case 'goalsCreated':    return goalsCreated >= badge.req;
      case 'goalsCompleted':  return goalsCompleted >= badge.req;
      case 'loansAdded':      return loansAdded >= badge.req;
      case 'loansCleared':    return false; // Would need cleared-loans tracking
      case 'totalIncome':     return totalIncome >= badge.req;
      case 'savingRate':      return savingRate >= badge.req;
      case 'special_firstSave':   return hasFirstSave;
      case 'special_earlyBird':   return hasEarlyBird;
      case 'special_nightOwl':    return hasNightOwl;
      case 'special_bigSpender':  return hasBigSpender;
      case 'special_frugal':      return hasFrugal;
      case 'special_comeback':    return hasComeback;
      case 'special_weekend':     return hasWeekendWarrior;
      case 'special_allRounder':  return hasAllRounder;
      case 'special_doubleUp':    return hasDoubleUp;
      case 'special_perfectWeek': return hasPerfectWeek;
      case 'special_highIncome':  return hasHighIncome;
      case 'special_zeroExpense': return hasZeroExpense;
      case 'special_halfSave':    return hasHalfSave;
      case 'badgesEarned':        return false; // will resolve in second pass
      default: return false;
    }
  };

  // Count non-level badges
  ALL_BADGES.forEach(b => {
    if (b.type !== 'badgesEarned' && getAchieved(b)) earnedCount++;
  });

  // ── Build result lists ───────────────────────────────────────────────────
  const earned = [];
  const locked = [];

  const getProgress = (badge) => {
    let current = 0;
    switch (badge.type) {
      case 'streak':          current = streak; break;
      case 'totalSaved':      current = totalSaved; break;
      case 'daysLogged':      current = daysLogged; break;
      case 'bestDay':         current = bestDay; break;
      case 'goalsCreated':    current = goalsCreated; break;
      case 'goalsCompleted':  current = goalsCompleted; break;
      case 'loansAdded':      current = loansAdded; break;
      case 'totalIncome':     current = totalIncome; break;
      case 'savingRate':      current = savingRate; break;
      case 'badgesEarned':    current = earnedCount; break;
      default: return null;
    }
    return { current, percentage: Math.min(Math.round((current / badge.req) * 100), 100) };
  };

  ALL_BADGES.forEach(badge => {
    let achieved;
    if (badge.type === 'badgesEarned') {
      achieved = earnedCount >= badge.req;
    } else {
      achieved = getAchieved(badge);
    }

    const progress = getProgress(badge);

    if (achieved) {
      earned.push({ ...badge, achieved: true, progress });
    } else {
      locked.push({ ...badge, achieved: false, progress });
    }
  });

  return {
    earned,
    locked,
    stats: {
      streak,
      totalSaved,
      daysLogged,
      bestDay,
      goalsCreated,
      goalsCompleted,
      loansAdded,
      totalIncome,
      savingRate,
      earnedCount,
      totalBadges: ALL_BADGES.length,
    },
  };
};
