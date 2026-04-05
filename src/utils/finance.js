export function fmt(n) {
  return '₹' + Math.abs(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

export function fmtSigned(n) {
  return (n < 0 ? '-' : '') + fmt(n);
}

export function formatDate(s) {
  return new Date(s).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function getMonthLabel(d = new Date()) {
  return d.toLocaleString('default', { month: 'short' }).toUpperCase();
}

export function getMonthlyData(transactions, months) {
  const result = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear().toString().slice(2);
    const monthTx = transactions.filter(t => {
      const td = new Date(t.date);
      return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear();
    });
    const income  = monthTx.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
    const expense = monthTx.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
    result.push({ label, income, expense, net: income - expense });
  }
  return result;
}

export function calcSummary(transactions) {
  const now = new Date();
  const isThisMonth  = t => { const d = new Date(t.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); };
  const isLastMonth  = t => { const d = new Date(t.date); const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1); return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear(); };

  const thisMonth = transactions.filter(isThisMonth);
  const lastMonth = transactions.filter(isLastMonth);

  const income   = thisMonth.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const expenses = thisMonth.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  const balance  = transactions.reduce((a, t) => a + (t.type === 'income' ? t.amount : -t.amount), 0);
  const savings  = income - expenses;

  const lIncome   = lastMonth.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const lExpenses = lastMonth.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);

  const incomeChange = lIncome   ? +((income   - lIncome)   / lIncome   * 100).toFixed(1) : 0;
  const expChange    = lExpenses ? +((expenses - lExpenses) / lExpenses * 100).toFixed(1) : 0;

  return { balance, income, expenses, savings, incomeChange, expChange };
}
