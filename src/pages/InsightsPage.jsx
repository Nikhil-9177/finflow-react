import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Tooltip,
} from 'chart.js';
import { useApp } from '../context/AppContext';
import { fmt, getMonthlyData } from '../utils/finance';
import { CATEGORY_COLORS } from '../data/transactions';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function InsightCard({ icon, bg, label, value, sub }) {
  return (
    <div className="insight-card">
      <div className="insight-icon" style={{ background: bg }}>{icon}</div>
      <div className="insight-title">{label}</div>
      <div className="insight-value">{value}</div>
      <div className="insight-sub">{sub}</div>
    </div>
  );
}

export default function InsightsPage() {
  const { state } = useApp();
  const isDark = state.theme === 'dark';
  const textColor = isDark ? '#908d84' : '#6b6960';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

  const now = new Date();
  const isThisMonth = t => { const d = new Date(t.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); };
  const isLastMonth = t => { const d = new Date(t.date); const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1); return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear(); };

  const thisMonthTx = state.transactions.filter(isThisMonth);
  const lastMonthTx = state.transactions.filter(isLastMonth);

  const catTotals = {};
  thisMonthTx.filter(t => t.type === 'expense').forEach(t => { catTotals[t.category] = (catTotals[t.category] || 0) + t.amount; });
  const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

  const thisIncome  = thisMonthTx.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const thisExp     = thisMonthTx.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  const lastExp     = lastMonthTx.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  const expChange   = lastExp ? +((thisExp - lastExp) / lastExp * 100).toFixed(0) : 0;
  const savingsRate = thisIncome ? +((thisIncome - thisExp) / thisIncome * 100).toFixed(0) : 0;

  const monthlyData = getMonthlyData(state.transactions, 6);
  const barData = {
    labels: monthlyData.map(d => d.label),
    datasets: [
      { label: 'Income',   data: monthlyData.map(d => d.income),  backgroundColor: 'rgba(74,222,128,0.7)',  borderRadius: 4 },
      { label: 'Expenses', data: monthlyData.map(d => d.expense), backgroundColor: 'rgba(248,113,113,0.7)', borderRadius: 4 },
    ],
  };
  const barOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ' ' + ctx.dataset.label + ': ' + fmt(ctx.raw) } } },
    scales: {
      x: { ticks: { color: textColor, font: { size: 11 } }, grid: { display: false } },
      y: { ticks: { color: textColor, font: { size: 11 }, callback: v => '₹' + (v / 1000).toFixed(0) + 'k' }, grid: { color: gridColor } },
    },
  };

  const allCatTotals = {};
  state.transactions.filter(t => t.type === 'expense').forEach(t => { allCatTotals[t.category] = (allCatTotals[t.category] || 0) + t.amount; });
  const sortedCats = Object.entries(allCatTotals).sort((a, b) => b[1] - a[1]);

  const catData = {
    labels: sortedCats.map(([k]) => k),
    datasets: [{ data: sortedCats.map(([, v]) => v), backgroundColor: sortedCats.map(([k]) => CATEGORY_COLORS[k] || '#94a3b8'), borderRadius: 4 }],
  };
  const catOptions = {
    indexAxis: 'y', responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ' ' + fmt(ctx.raw) } } },
    scales: {
      x: { ticks: { color: textColor, font: { size: 11 }, callback: v => '₹' + (v / 1000).toFixed(0) + 'k' }, grid: { color: gridColor } },
      y: { ticks: { color: textColor, font: { size: 11 } }, grid: { display: false } },
    },
  };

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <div className="section-title">Spending Insights</div>
          <div className="section-sub">Patterns and analysis</div>
        </div>
      </div>

      <div className="insights-grid">
        <InsightCard icon="🏆" bg="#fff7ed" label="Top Spending Category"
          value={topCat ? topCat[0] : '—'}
          sub={topCat ? fmt(topCat[1]) + ' this month' : 'No expenses yet'} />
        <InsightCard icon="📊" bg="#f0fdf4" label="Expense vs Last Month"
          value={(expChange >= 0 ? '+' : '') + expChange + '%'}
          sub={'Expenses ' + (expChange >= 0 ? 'increased' : 'decreased') + ' by ' + Math.abs(expChange) + '%'} />
        <InsightCard icon="💰" bg="#eff4ff" label="Savings Rate"
          value={savingsRate + '%'}
          sub="Of income saved this month" />
      </div>

      <div className="charts-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="chart-card">
          <div className="section-header" style={{ marginBottom: 10 }}>
            <div>
              <div className="section-title">Monthly Income vs Expenses</div>
              <div className="section-sub">6-month comparison</div>
            </div>
          </div>
          <div className="chart-legend">
            {[['Income','rgba(74,222,128,0.7)'],['Expenses','rgba(248,113,113,0.7)']].map(([l,c])=>(
              <div key={l} className="legend-item"><span className="legend-dot" style={{ background: c }} />{l}</div>
            ))}
          </div>
          <div style={{ position: 'relative', height: 220 }}>
            <Bar key={isDark} data={barData} options={barOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="section-header" style={{ marginBottom: 10 }}>
            <div>
              <div className="section-title">Category Breakdown</div>
              <div className="section-sub">All-time expenses</div>
            </div>
          </div>
          <div style={{ position: 'relative', height: sortedCats.length * 36 + 20 }}>
            <Bar key={isDark} data={catData} options={catOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
