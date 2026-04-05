# FinFlow — Finance Dashboard (React + Vite)

A clean and interactive personal finance dashboard built using React and Vite. This application helps users manage their financial data with powerful visualization, filtering, and tracking features.

---

## 📁 Project Structure

```
finflow/
├── src/
│   ├── context/
│   │   └── AppContext.jsx       # Global state (useReducer + localStorage)
│   ├── data/
│   │   └── transactions.js      # Mock data + category constants
│   ├── utils/
│   │   ├── finance.js           # Financial calculations (summary, monthly data)
│   │   └── tableUtils.js        # Filtering and sorting logic
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
└── README.md
```

---

## ⚙️ Getting Started

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
npm run preview
```

---

## ✨ Features

* 📊 Summary cards with financial insights and trends
* 📈 Balance trend line chart
* 🍩 Spending distribution (donut chart)
* 📋 Transactions table with:

  * Search
  * Filter
  * Sort
  * Pagination
* 📊 Insights section:

  * Top spending category
  * Expense change percentage
  * Savings rate
  * Bar chart analytics
* 👤 Role-based UI:

  * Viewer (read-only)
  * Admin (add/edit/delete/export CSV)
* 🌙 Dark mode support
* 💾 Data persistence using localStorage
* 📱 Fully responsive design

---

## 🛠️ Tech Stack

* React 18
* Vite
* Chart.js + react-chartjs-2
* Context API + useReducer
* CSS (custom properties)
* localStorage

---

## 📌 Description

FinFlow is designed to provide a simple yet powerful interface for managing personal finances. It focuses on usability, clean UI, and efficient state management while delivering meaningful insights through data visualization.

---
