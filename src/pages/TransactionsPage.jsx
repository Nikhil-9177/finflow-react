import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getFilteredSorted } from '../utils/tableUtils';
import { fmt, formatDate } from '../utils/finance';
import { CATEGORY_COLORS, CATEGORY_BG } from '../data/transactions';

const COLUMNS = [
  { key: 'date',        label: 'Date'        },
  { key: 'description', label: 'Description' },
  { key: 'category',    label: 'Category'    },
  { key: 'type',        label: 'Type'        },
  { key: 'amount',      label: 'Amount'      },
];

export default function TransactionsPage({ onEdit }) {
  const { state, dispatch } = useApp();
  const isAdmin = state.role === 'admin';

  const allFiltered = useMemo(() => getFilteredSorted(state), [state]);
  const total = allFiltered.length;
  const start = (state.currentPage - 1) * state.perPage;
  const paginated = allFiltered.slice(start, start + state.perPage);
  const totalPages = Math.ceil(total / state.perPage);

  const categories = [...new Set(state.transactions.map(t => t.category))].sort();
  const months = [...new Set(state.transactions.map(t => t.date.slice(0, 7)))].sort().reverse();

  function setFilter(key, value) {
    dispatch({ type: 'SET_FILTER', key, value });
  }

  function sortIcon(key) {
    if (state.sortKey !== key) return <span style={{ opacity: 0.3 }}>↕</span>;
    return <span>{state.sortDir === 1 ? '↑' : '↓'}</span>;
  }

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <div className="section-title">All Transactions</div>
          <div className="section-sub">{total} transaction{total !== 1 ? 's' : ''}</div>
        </div>
      </div>

      <div className="card">
        <div className="tx-controls">
          <div className="search-box">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.4, flexShrink: 0 }}>
              <circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5l3 3"/>
            </svg>
            <input
              type="text"
              placeholder="Search transactions..."
              value={state.filterSearch}
              onChange={e => setFilter('filterSearch', e.target.value)}
            />
          </div>
          <select className="filter-select" value={state.filterType} onChange={e => setFilter('filterType', e.target.value)}>
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select className="filter-select" value={state.filterCat} onChange={e => setFilter('filterCat', e.target.value)}>
            <option value="">All categories</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="filter-select" value={state.filterMonth} onChange={e => setFilter('filterMonth', e.target.value)}>
            <option value="">All months</option>
            {months.map(m => {
              const [y, mo] = m.split('-');
              const label = new Date(+y, +mo - 1, 1).toLocaleString('default', { month: 'long', year: 'numeric' });
              return <option key={m} value={m}>{label}</option>;
            })}
          </select>
        </div>

        <table className="tx-table">
          <thead>
            <tr>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => dispatch({ type: 'SET_SORT', key: col.key })}
                  style={col.key === 'amount' ? { textAlign: 'right' } : {}}
                >
                  {col.label} {sortIcon(col.key)}
                </th>
              ))}
              {isAdmin && <th style={{ width: 80 }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginated.map(t => (
              <tr key={t.id}>
                <td style={{ color: 'var(--text2)', whiteSpace: 'nowrap' }}>{formatDate(t.date)}</td>
                <td style={{ fontWeight: 500 }}>{t.description}</td>
                <td>
                  <span className="category-badge" style={{ background: CATEGORY_BG[t.category] || '#f5f5f5', color: CATEGORY_COLORS[t.category] || '#888' }}>
                    {t.category}
                  </span>
                </td>
                <td>
                  <span className="category-badge" style={{
                    background: t.type === 'income' ? 'var(--green-bg)' : 'var(--red-bg)',
                    color:      t.type === 'income' ? 'var(--green)'    : 'var(--red)',
                  }}>
                    {t.type}
                  </span>
                </td>
                <td className={t.type === 'income' ? 'amount-positive' : 'amount-negative'} style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                </td>
                {isAdmin && (
                  <td style={{ textAlign: 'center' }}>
                    <button className="action-btn edit" onClick={() => onEdit(t)}>Edit</button>
                    <button className="action-btn del" onClick={() => { if (confirm('Delete this transaction?')) dispatch({ type: 'DELETE_TX', payload: t.id }); }}>Del</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {total === 0 && (
          <div className="empty-state">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="6" y="6" width="28" height="28" rx="4"/><path d="M13 20h14M13 14h8M13 26h5"/>
            </svg>
            No transactions found
          </div>
        )}

        {total > 0 && (
          <div className="pagination">
            <span className="page-info">Showing {start + 1}–{Math.min(start + state.perPage, total)} of {total}</span>
            <div className="page-btns">
              <button className="page-btn" disabled={state.currentPage === 1} onClick={() => dispatch({ type: 'SET_PAGE_NUM', payload: state.currentPage - 1 })}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => Math.abs(p - state.currentPage) <= 2)
                .map(p => (
                  <button key={p} className={`page-btn${p === state.currentPage ? ' active' : ''}`} onClick={() => dispatch({ type: 'SET_PAGE_NUM', payload: p })}>{p}</button>
                ))}
              <button className="page-btn" disabled={state.currentPage === totalPages} onClick={() => dispatch({ type: 'SET_PAGE_NUM', payload: state.currentPage + 1 })}>›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
