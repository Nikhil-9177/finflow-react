import { useState, useEffect, useRef } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, Tooltip, Filler,
} from 'chart.js';
import { useApp } from '../context/AppContext';
import { calcSummary, fmt, fmtSigned, getMonthLabel, getMonthlyData, formatDate } from '../utils/finance';
import { CATEGORY_COLORS, CATEGORY_BG } from '../data/transactions';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Filler);

function SummaryCard({ label, value, color, trend }) {
  return (
    <div className="card">
      <div className="card-accent" style={{ background: color }} />
      <div className="card-label">{label}</div>
      <div className="card-value" style={{ color }}>{value}</div>
      {trend && (
        <div className={`card-trend ${trend.up ? 'up' : 'down'}`}>
          {trend.up ? '▲' : '▼'} {Math.abs(trend.val)}% vs last month
        </div>
      )}
    </div>
  );
}

export default function OverviewPage({ onNavigateToTransactions }) {
  const { state } = useApp();
  const [period, setPeriod] = useState(6);
  const isDark = state.theme === 'dark';

  const s = calcSummary(state.transactions);
  const mLabel = getMonthLabel();
  const savingsColor = s.savings >= 0 ? '#7c3aed' : '#dc2626';

  const monthlyData = getMonthlyData(state.transactions, period);
  const textColor  = isDark ? '#908d84' : '#6b6960';
  const gridColor  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

  const trendData = {
    labels: monthlyData.map(d => d.label),
    datasets: [
      { label: 'Income',   data: monthlyData.map(d => d.income),  borderColor: '#4ade80', backgroundColor: 'rgba(74,222,128,0.08)',  tension: 0.4, pointRadius: 3, fill: true },
      { label: 'Expenses', data: monthlyData.map(d => d.expense), borderColor: '#f87171', backgroundColor: 'rgba(248,113,113,0.08)', tension: 0.4, pointRadius: 3, fill: true },
      { label: 'Net',      data: monthlyData.map(d => d.net),     borderColor: '#60a5fa', backgroundColor: 'rgba(96,165,250,0.06)',  tension: 0.4, pointRadius: 3, fill: false, borderDash: [4, 3] },
    ],
  };

  const trendOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ' ' + ctx.dataset.label + ': ' + fmt(ctx.raw) } },
    },
    scales: {
      x: { ticks: { color: textColor, font: { size: 11 } }, grid: { color: gridColor } },
      y: { ticks: { color: textColor, font: { size: 11 }, callback: v => '₹' + (v / 1000).toFixed(0) + 'k' }, grid: { color: gridColor } },
    },
  };

  const catTotals = {};
  const now = new Date();
  state.transactions.forEach(t => {
    const d = new Date(t.date);
    if (t.type === 'expense' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
      catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
    }
  });
  const catEntries = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const catTotal = catEntries.reduce((a, [, v]) => a + v, 0);

  const donutData = {
    labels: catEntries.map(([k]) => k),
    datasets: [{
      data: catEntries.map(([, v]) => v),
      backgroundColor: catEntries.map(([k]) => CATEGORY_COLORS[k] || '#94a3b8'),
      borderWidth: 2,
      borderColor: isDark ? '#1c1b19' : '#fff',
    }],
  };
  const donutOptions = {
    responsive: true, maintainAspectRatio: false, cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ' ' + ctx.label + ': ' + fmt(ctx.raw) } },
    },
  };

  const recent = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <div className="section-title">Financial Overview</div>
          <div className="section-sub">{new Date().toLocaleString('default',{month:'long',year:'numeric'})} · All accounts</div>
        </div>
        <select className="filter-select" value={period} onChange={e => setPeriod(Number(e.target.value))}>
          <option value={3}>Last 3 months</option>
          <option value={6}>Last 6 months</option>
          <option value={12}>Last 12 months</option>
        </select>
      </div>

      <div className="cards-grid">
        <SummaryCard label="Total Balance"       value={fmt(s.balance)}   color="#2563eb" trend={null} />
        <SummaryCard label={`Income (${mLabel})`}   value={fmt(s.income)}    color="#16a34a" trend={{ val: s.incomeChange, up: s.incomeChange >= 0 }} />
        <SummaryCard label={`Expenses (${mLabel})`} value={fmt(s.expenses)}  color="#dc2626" trend={{ val: Math.abs(s.expChange), up: s.expChange <= 0 }} />
        <SummaryCard label={`Savings (${mLabel})`}  value={fmtSigned(s.savings)} color={savingsColor} trend={null} />
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="section-header" style={{ marginBottom: 10 }}>
            <div>
              <div className="section-title">Balance Trend</div>
              <div className="section-sub">Net balance over time</div>
            </div>
          </div>
          <div className="chart-legend">
            {[['Income','#4ade80'],['Expenses','#f87171'],['Net Balance','#60a5fa']].map(([l,c]) => (
              <div key={l} className="legend-item"><span className="legend-dot" style={{ background: c }} />{l}</div>
            ))}
          </div>
          <div style={{ position: 'relative', height: 220 }}>
            <Line key={`${period}-${isDark}`} data={trendData} options={trendOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="section-header" style={{ marginBottom: 10 }}>
            <div>
              <div className="section-title">Spending by Category</div>
              <div className="section-sub">This month</div>
            </div>
          </div>
          {catEntries.length > 0 ? (
            <>
              <div className="chart-legend">
                {catEntries.map(([k, v]) => (
                  <div key={k} className="legend-item">
                    <span className="legend-dot" style={{ background: CATEGORY_COLORS[k] }} />
                    {k} {catTotal ? Math.round(v / catTotal * 100) + '%' : ''}
                  </div>
                ))}
              </div>
              <div style={{ position: 'relative', height: 200 }}>
                <Doughnut key={isDark} data={donutData} options={donutOptions} />
              </div>
            </>
          ) : (
            <div className="empty-state">No expenses this month</div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="section-header" style={{ marginBottom: 14 }}>
          <div>
            <div className="section-title">Recent Transactions</div>
            <div className="section-sub">Last 5 transactions</div>
          </div>
          <button className="btn" onClick={onNavigateToTransactions}>View all →</button>
        </div>
        <table className="tx-table">
          <thead>
            <tr>
              <th>Date</th><th>Description</th><th>Category</th><th style={{ textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {recent.map(t => (
              <tr key={t.id}>
                <td style={{ color: 'var(--text2)' }}>{formatDate(t.date)}</td>
                <td style={{ fontWeight: 500 }}>{t.description}</td>
                <td>
                  <span className="category-badge" style={{ background: CATEGORY_BG[t.category] || '#f5f5f5', color: CATEGORY_COLORS[t.category] || '#888' }}>
                    {t.category}
                  </span>
                </td>
                <td className={t.type === 'income' ? 'amount-positive' : 'amount-negative'} style={{ textAlign: 'right' }}>
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
