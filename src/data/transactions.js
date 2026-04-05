function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
function monthsAgo(m, day) {
  const d = new Date();
  d.setMonth(d.getMonth() - m);
  d.setDate(day);
  return d.toISOString().slice(0, 10);
}

export const SAMPLE_TRANSACTIONS = [
  { id: 1,  date: daysAgo(2),      description: 'Salary (This Month)',   category: 'Salary',        type: 'income',  amount: 85000 },
  { id: 2,  date: daysAgo(4),      description: 'Grocery Store',         category: 'Food',          type: 'expense', amount: 3240  },
  { id: 3,  date: daysAgo(5),      description: 'Uber Ride',             category: 'Transport',     type: 'expense', amount: 450   },
  { id: 4,  date: daysAgo(6),      description: 'Netflix Subscription',  category: 'Entertainment', type: 'expense', amount: 649   },
  { id: 5,  date: daysAgo(7),      description: 'Freelance Project',     category: 'Freelance',     type: 'income',  amount: 22000 },
  { id: 6,  date: daysAgo(9),      description: 'Electricity Bill',      category: 'Utilities',     type: 'expense', amount: 1850  },
  { id: 7,  date: daysAgo(10),     description: 'Amazon Shopping',       category: 'Shopping',      type: 'expense', amount: 4799  },
  { id: 8,  date: daysAgo(11),     description: 'Doctor Visit',          category: 'Healthcare',    type: 'expense', amount: 800   },
  { id: 9,  date: daysAgo(12),     description: 'Swiggy Order',          category: 'Food',          type: 'expense', amount: 650   },
  { id: 10, date: daysAgo(13),     description: 'Internet Bill',         category: 'Utilities',     type: 'expense', amount: 999   },
  { id: 11, date: monthsAgo(1,28), description: 'Freelance Design',      category: 'Freelance',     type: 'income',  amount: 15000 },
  { id: 12, date: monthsAgo(1,25), description: 'Petrol',                category: 'Transport',     type: 'expense', amount: 2800  },
  { id: 13, date: monthsAgo(1,22), description: 'Zomato',                category: 'Food',          type: 'expense', amount: 520   },
  { id: 14, date: monthsAgo(1,18), description: 'Clothing Store',        category: 'Shopping',      type: 'expense', amount: 3200  },
  { id: 15, date: monthsAgo(1,15), description: 'Salary Last Month',     category: 'Salary',        type: 'income',  amount: 85000 },
  { id: 16, date: monthsAgo(1,10), description: 'Gym Membership',        category: 'Healthcare',    type: 'expense', amount: 1500  },
  { id: 17, date: monthsAgo(1,8),  description: 'Rent',                  category: 'Utilities',     type: 'expense', amount: 18000 },
  { id: 18, date: monthsAgo(1,5),  description: 'Dominos Pizza',         category: 'Food',          type: 'expense', amount: 780   },
  { id: 19, date: monthsAgo(2,28), description: 'Salary 2 Months Ago',   category: 'Salary',        type: 'income',  amount: 85000 },
  { id: 20, date: monthsAgo(2,22), description: 'Book Purchase',         category: 'Shopping',      type: 'expense', amount: 1200  },
  { id: 21, date: monthsAgo(2,18), description: 'Train Tickets',         category: 'Transport',     type: 'expense', amount: 1650  },
  { id: 22, date: monthsAgo(2,14), description: 'Valentine Dinner',      category: 'Food',          type: 'expense', amount: 2800  },
  { id: 23, date: monthsAgo(2,10), description: 'Freelance Logo',        category: 'Freelance',     type: 'income',  amount: 8000  },
  { id: 24, date: monthsAgo(2,5),  description: 'Mobile Recharge',       category: 'Utilities',     type: 'expense', amount: 599   },
  { id: 25, date: monthsAgo(3,28), description: 'Salary 3 Months Ago',   category: 'Salary',        type: 'income',  amount: 85000 },
  { id: 26, date: monthsAgo(3,25), description: 'Headphones',            category: 'Shopping',      type: 'expense', amount: 8999  },
  { id: 27, date: monthsAgo(3,20), description: 'Ola Cab',               category: 'Transport',     type: 'expense', amount: 380   },
  { id: 28, date: monthsAgo(3,15), description: 'Spotify Premium',       category: 'Entertainment', type: 'expense', amount: 119   },
  { id: 29, date: monthsAgo(3,10), description: 'Grocery Run',           category: 'Food',          type: 'expense', amount: 4100  },
  { id: 30, date: monthsAgo(4,28), description: 'Salary 4 Months Ago',   category: 'Salary',        type: 'income',  amount: 85000 },
  { id: 31, date: monthsAgo(4,20), description: 'Big Shopping Haul',     category: 'Shopping',      type: 'expense', amount: 9500  },
  { id: 32, date: monthsAgo(4,15), description: 'Bonus Payment',         category: 'Salary',        type: 'income',  amount: 25000 },
  { id: 33, date: monthsAgo(4,10), description: 'Restaurant Dinner',     category: 'Food',          type: 'expense', amount: 3400  },
  { id: 34, date: monthsAgo(5,10), description: 'Flight Tickets',        category: 'Transport',     type: 'expense', amount: 12000 },
  { id: 35, date: monthsAgo(5,5),  description: 'Freelance Web Dev',     category: 'Freelance',     type: 'income',  amount: 35000 },
];

export const CATEGORY_COLORS = {
  Food:          '#f87171',
  Transport:     '#60a5fa',
  Shopping:      '#c084fc',
  Entertainment: '#fb923c',
  Healthcare:    '#34d399',
  Utilities:     '#94a3b8',
  Salary:        '#4ade80',
  Freelance:     '#facc15',
  Other:         '#a8a29e',
};

export const CATEGORY_BG = {
  Food:          '#fef2f2',
  Transport:     '#eff6ff',
  Shopping:      '#faf5ff',
  Entertainment: '#fff7ed',
  Healthcare:    '#f0fdf4',
  Utilities:     '#f8fafc',
  Salary:        '#f0fdf4',
  Freelance:     '#fefce8',
  Other:         '#fafaf9',
};

export const CATEGORIES = [
  'Food','Transport','Shopping','Entertainment',
  'Healthcare','Utilities','Salary','Freelance','Other',
];
