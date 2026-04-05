import { useApp } from '../context/AppContext';

const navItems = [
  { key: 'overview',     label: 'Overview',      icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="11" y="3" width="6" height="6" rx="1.5"/><rect x="3" y="11" width="6" height="6" rx="1.5"/><rect x="11" y="11" width="6" height="6" rx="1.5"/></svg> },
  { key: 'transactions', label: 'Transactions',  icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h14M3 10h14M3 14h8"/></svg> },
  { key: 'insights',     label: 'Insights',      icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 15l4-5 4 3 4-6"/><circle cx="3" cy="15" r="1.2" fill="currentColor"/></svg> },
];

export default function Sidebar({ open, onClose }) {
  const { state, dispatch } = useApp();

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">F</div>
          <span className="logo-name">FinFlow</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>
          {navItems.map(item => (
            <div
              key={item.key}
              className={`nav-item${state.page === item.key ? ' active' : ''}`}
              onClick={() => { dispatch({ type: 'SET_PAGE', payload: item.key }); onClose(); }}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="role-label">Role</div>
          <select
            className="role-select"
            value={state.role}
            onChange={e => dispatch({ type: 'SET_ROLE', payload: e.target.value })}
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
          <div className={`role-badge ${state.role}`}>
            ● {state.role === 'admin' ? 'Admin' : 'Viewer'}
          </div>
        </div>
      </aside>
    </>
  );
}
