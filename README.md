# Smart Daily Savings Assistant (GigSaver)

> A fintech web app built for the real world — where income isn't always predictable, but saving still matters.


# The Problem

Most savings apps assume you earn a fixed salary every month. But what about the delivery driver who earns ₹800 one day and ₹2,400 the next? Or the freelancer juggling multiple clients with unpredictable income?

Traditional financial tools leave these people behind. The **Smart Daily Savings Assistant** was built specifically for them — gig workers, freelancers, daily wage earners — people who *want* to save but have never had a tool that works with their reality.


# The Solution

A dynamic, adaptive savings companion that meets you where you are financially — on good days and tough ones. Tell it what you earned today, what you spent, and it figures out a realistic amount to set aside. Not a fixed number pulled from thin air — something that actually makes sense given your day.



## Key Features

### Daily Smart Savings
- Enter your daily income and expenses
- Get an adaptive savings suggestion with a clear explanation
- See what percentage of your income you're saving
- Tweak the suggestion anytime — you're always in control
- AI-powered nudges to keep you motivated

### Goal-Based Savings
- Create personal savings goals (e.g., Laptop, Trip, Emergency Fund)
- Set a target amount and deadline
- Track progress %, remaining amount, and daily saving required
- Savings can be goal-specific or general

### Analytics Dashboard
- Visual savings trends (weekly & monthly)
- Key metrics at a glance:
  - Total savings
  - Average savings
  - Best saving day
  - Saving percentage over time

### Loan & EMI Management
- Add and track active loans
- Store loan name, EMI amount, and due date
- Get reminders for upcoming payments
- Savings suggestions automatically adjust based on EMI obligations

### Streaks & Badges
- Daily streak tracking for consistent saving
- 100+ badges across categories:
  -  Streaks
  - Total savings milestones
  - 🎯 Goals completed
  - ⭐ Daily achievements
- Earned vs. locked badge system with progress indicators

###  AI Integration
- Powered by **Google Gemini**
- Generates saving explanations and motivational nudges
- Provides goal progress insights
- *Note: AI handles communication, not calculations — savings logic is rule-based*

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite) + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | Firebase Firestore |
| Authentication | Firebase Authentication |
| AI | Google Gemini API |

---

## ⚙️ How the Savings Logic Works

The system uses a **micro-saving philosophy** — small, realistic amounts that add up over time rather than aggressive targets that feel impossible.

- 📈 Higher income → higher savings suggestion
- 📉 Higher expenses → suggestion is reduced
- 🏦 Active EMIs → savings capacity adjusted accordingly
- 🔁 Daily data is stored per day, separately for goal-based and general savings
- 🏆 Badge system dynamically recalculates using streak, total savings, days logged, and goals completed

---



## 🎯 Why This Exists

There are millions of people — gig workers, daily wage earners, small traders, freelancers — who want to save but have never had a tool built *for them*. This app bridges the gap between irregular income, practical saving habits, and goal-based financial planning.

It doesn't preach financial discipline. It just makes saving easier, smarter, and a little more human.

---

##  Acknowledgements

Built with  for everyone who earns differently but dreams the same.
