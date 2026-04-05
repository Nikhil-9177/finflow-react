import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import TransactionModal from './components/TransactionModal';
import OverviewPage from './pages/OverviewPage';
import TransactionsPage from './pages/TransactionsPage';
import InsightsPage from './pages/InsightsPage';

function AppInner() {
  const { state, dispatch } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTx, setEditTx] = useState(null);

  function openAdd() { setEditTx(null); setModalOpen(true); }
  function openEdit(tx) { setEditTx(tx); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditTx(null); }

  return (
    <div className="app">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main">
        <Topbar onMenuClick={() => setSidebarOpen(true)} onAddClick={openAdd} />
        {state.page === 'overview'     && <OverviewPage onNavigateToTransactions={() => dispatch({ type: 'SET_PAGE', payload: 'transactions' })} />}
        {state.page === 'transactions' && <TransactionsPage onEdit={openEdit} />}
        {state.page === 'insights'     && <InsightsPage />}
      </div>
      <TransactionModal open={modalOpen} onClose={closeModal} editTx={editTx} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
