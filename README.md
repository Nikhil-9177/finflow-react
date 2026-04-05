# FinFlow — Finance Dashboard (React + Vite)

A clean, interactive personal finance dashboard built with React, Vite, and Chart.js.

Live Demo: *(add your Vercel link here after deployment)*

---

## Project Structure

```
finflow/
├── src/
│   ├── context/
│   │   └── AppContext.jsx       <- global state (useReducer + localStorage)
│   ├── data/
│   │   └── transactions.js      <- mock data + category constants
│   ├── utils/
│   │   ├── finance.js           <- calcSummary, fmt, getMonthlyData
│   │   └── tableUtils.js        <- filter + sort logic
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   └── TransactionModal.jsx
│   ├── pages/
│   │   ├── OverviewPage.jsx
│   │   ├── TransactionsPage.jsx
│   │   └── InsightsPage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── vercel.json
└── README.md
```

---

## Getting Started

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
npm run preview
```

---

## Deploy to Vercel

Option 1 - Vercel dashboard:
1. Push repo to GitHub
2. vercel.com -> New Project -> Import repo
3. Framework auto-detects as Vite
4. Click Deploy

Option 2 - CLI:
```bash
npm i -g vercel
vercel
```

---

## Features

- Summary cards with month-over-month trends
- Balance trend line chart + spending donut chart
- Transactions table: search, filter, sort, paginate
- Insights: top category, expense change %, savings rate, bar charts
- Role-based UI: Viewer (read-only) vs Admin (add/edit/delete/export CSV)
- Dark mode + localStorage persistence
- Fully responsive

---

## Tech Stack

- React 18 + Vite
- Chart.js + react-chartjs-2
- useReducer + Context API
- CSS custom properties (no Tailwind/MUI)
- localStorage for persistence
