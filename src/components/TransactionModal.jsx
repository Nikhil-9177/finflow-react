import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/transactions';

export default function TransactionModal({ open, onClose, editTx }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState({
    description: '', amount: '', type: 'expense',
    category: 'Food', date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (editTx) {
      setForm({ ...editTx, amount: String(editTx.amount) });
    } else {
      setForm({ description: '', amount: '', type: 'expense', category: 'Food', date: new Date().toISOString().slice(0, 10) });
    }
  }, [editTx, open]);

  function handleSave() {
    const { description, amount, type, category, date } = form;
    if (!description.trim() || !amount || !date) return;
    const tx = { description: description.trim(), amount: parseFloat(amount), type, category, date };
    if (editTx) {
      dispatch({ type: 'EDIT_TX', payload: { ...tx, id: editTx.id } });
    } else {
      dispatch({ type: 'ADD_TX', payload: tx });
    }
    onClose();
  }

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">{editTx ? 'Edit Transaction' : 'Add Transaction'}</div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Description</label>
            <input className="form-input" placeholder="e.g. Netflix subscription"
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input className="form-input" type="number" placeholder="0"
              value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Date</label>
          <input className="form-input" type="date"
            value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
        </div>

        <div className="modal-btns">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
