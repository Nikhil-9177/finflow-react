import { useApp } from '../context/AppContext';
import { getFilteredSorted } from '../utils/tableUtils';

const PAGE_TITLES = { overview: 'Overview', transactions: 'Transactions', insights: 'Insights' };

export default function Topbar({ onMenuClick, onAddClick }) {
  const { state, dispatch } = useApp();
  const isAdmin = state.role === 'admin';

  function exportCSV() {
    const rows = getFilteredSorted(state);
    const header = 'Date,Description,Category,Type,Amount\n';
    const body = rows.map(t => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`).join('\n');
    const blob = new Blob([header + body], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'finflow-transactions.csv';
    a.click();
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-btn" onClick={onMenuClick} title="Menu">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="3" y1="6" x2="17" y2="6"/>
            <line x1="3" y1="10" x2="17" y2="10"/>
            <line x1="3" y1="14" x2="17" y2="14"/>
          </svg>
        </button>
        <span className="topbar-title">{PAGE_TITLES[state.page]}</span>
      </div>
      <div className="topbar-right">
        {isAdmin && (
          <>
            <button className="btn" onClick={exportCSV}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 2v9M5 8l3 3 3-3M3 13h10"/>
              </svg>
              Export CSV
            </button>
            <button className="btn primary" onClick={onAddClick}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 3v10M3 8h10"/>
              </svg>
              Add Transaction
            </button>
          </>
        )}
        <button
          className="icon-btn"
          onClick={() => dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' })}
          title="Toggle theme"
        >
          {state.theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
