import { createContext, useContext, useReducer, useEffect } from 'react';
import { SAMPLE_TRANSACTIONS } from '../data/transactions';

const DATA_VERSION = 'v2';

function loadStorage() {
  if (localStorage.getItem('ff_version') !== DATA_VERSION) {
    localStorage.removeItem('ff_transactions');
    localStorage.setItem('ff_version', DATA_VERSION);
  }
  return {
    transactions: JSON.parse(localStorage.getItem('ff_transactions') || 'null') || [...SAMPLE_TRANSACTIONS],
    role:  localStorage.getItem('ff_role')  || 'viewer',
    theme: localStorage.getItem('ff_theme') || 'light',
  };
}

const initial = {
  ...loadStorage(),
  page: 'overview',
  sortKey: 'date',
  sortDir: -1,
  filterSearch: '',
  filterType: '',
  filterCat: '',
  filterMonth: '',
  currentPage: 1,
  perPage: 10,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE':       return { ...state, page: action.payload, currentPage: 1 };
    case 'SET_ROLE':       return { ...state, role: action.payload };
    case 'SET_THEME':      return { ...state, theme: action.payload };
    case 'SET_SORT':
      return {
        ...state,
        sortKey: action.key,
        sortDir: state.sortKey === action.key ? state.sortDir * -1 : -1,
      };
    case 'SET_FILTER':     return { ...state, [action.key]: action.value, currentPage: 1 };
    case 'SET_PAGE_NUM':   return { ...state, currentPage: action.payload };
    case 'ADD_TX': {
      const newId = Math.max(...state.transactions.map(t => t.id), 0) + 1;
      return { ...state, transactions: [{ ...action.payload, id: newId }, ...state.transactions] };
    }
    case 'EDIT_TX':
      return { ...state, transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TX':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    localStorage.setItem('ff_transactions', JSON.stringify(state.transactions));
    localStorage.setItem('ff_role',  state.role);
    localStorage.setItem('ff_theme', state.theme);
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.transactions, state.role, state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
