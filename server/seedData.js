require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { db, admin } = require('./utils/firebaseAdmin');

// ── Helpers ──────────────────────────────────────────────────────────────────
const randomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/** Returns YYYY-MM-DD string for N days ago */
const dateNDaysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

const TS = admin.firestore.FieldValue.serverTimestamp;

// ── Data ─────────────────────────────────────────────────────────────────────
const USER_ID = 'testUser123';

// 7 income_log documents — one per day for the last 7 days
const incomeLogDocs = Array.from({ length: 7 }, (_, i) => {
  const income  = randomBetween(500, 2000);
  const expense = randomBetween(200, 800);
  const saved   = Math.max(0, Math.round(income - expense * 0.3));
  return {
    userId:         USER_ID,
    date:           dateNDaysAgo(6 - i),   // oldest first → newest last
    income,
    expense,
    saved,
    suggestion:     randomBetween(50, 300),
    ai_explanation: 'You saved well today! Keep up the good work.',
    createdAt:      TS(),
  };
});

// 2 loan documents
const loanDocs = [
  {
    userId:           USER_ID,
    loan_name:        'Home Loan',
    total_amount:     500000,
    emi_amount:       5000,
    emi_due_day:      5,
    remaining_months: 24,
    createdAt:        TS(),
  },
  {
    userId:           USER_ID,
    loan_name:        'Bike Loan',
    total_amount:     80000,
    emi_amount:       2000,
    emi_due_day:      15,
    remaining_months: 8,
    createdAt:        TS(),
  },
];

// 1 user document (with fixed doc ID)
const userDoc = {
  name:         'Test User',
  email:        'test@walletin.com',
  firebase_uid: USER_ID,
  createdAt:    TS(),
};

// ── Seed ─────────────────────────────────────────────────────────────────────
async function seed() {
  try {
    console.log('🌱 Starting Firestore seed...\n');

    // income_logs
    console.log('📝 Inserting 7 income_log documents...');
    const logPromises = incomeLogDocs.map((doc) =>
      db.collection('income_logs').add(doc)
    );
    const logRefs = await Promise.all(logPromises);
    logRefs.forEach((ref, i) =>
      console.log(`   ✔ income_logs/${ref.id}  (${incomeLogDocs[i].date})`)
    );

    // loans
    console.log('\n💳 Inserting 2 loan documents...');
    const loanPromises = loanDocs.map((doc) =>
      db.collection('loans').add(doc)
    );
    const loanRefs = await Promise.all(loanPromises);
    loanRefs.forEach((ref, i) =>
      console.log(`   ✔ loans/${ref.id}  (${loanDocs[i].loan_name})`)
    );

    // users — use .doc(USER_ID).set() for a fixed document ID
    console.log('\n👤 Inserting user document...');
    await db.collection('users').doc(USER_ID).set(userDoc);
    console.log(`   ✔ users/${USER_ID}`);

    console.log('\n✅ Seed data inserted successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

seed();
