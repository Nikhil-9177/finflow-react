export function getFilteredSorted(state) {
  let txs = [...state.transactions];

  if (state.filterSearch) {
    const q = state.filterSearch.toLowerCase();
    txs = txs.filter(t =>
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  }
  if (state.filterType)  txs = txs.filter(t => t.type === state.filterType);
  if (state.filterCat)   txs = txs.filter(t => t.category === state.filterCat);
  if (state.filterMonth) txs = txs.filter(t => t.date.slice(0, 7) === state.filterMonth);

  const { sortKey: k, sortDir: d } = state;
  txs.sort((a, b) => {
    if (k === 'date')   return d * (new Date(a.date) - new Date(b.date));
    if (k === 'amount') return d * (a.amount - b.amount);
    return d * String(a[k]).localeCompare(String(b[k]));
  });

  return txs;
}
