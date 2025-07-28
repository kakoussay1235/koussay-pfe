class DataService {
  constructor() {
    this.storageKeys = {
      transactions: 'familyExpense_transactions',
      members: 'familyExpense_members',
      categories: 'familyExpense_categories',
      reservedFunds: 'familyExpense_reservedFunds',
      budgets: 'familyExpense_budgets',
      settings: 'familyExpense_settings'
    };
    this.initializeDefaultData();
  }

  initializeDefaultData() {
    // Initialize default categories if they don't exist
    if (!this.getCategories().length) {
      this.setCategories([
        // Income categories
        { id: 'salary', name: 'Salaire', type: 'income', color: '#10B981' },
        { id: 'freelance', name: 'Freelance', type: 'income', color: '#8B5CF6' },
        { id: 'investment', name: 'Investissement', type: 'income', color: '#06B6D4' },
        { id: 'gift', name: 'Cadeau', type: 'income', color: '#F59E0B' },
        { id: 'other_income', name: 'Autre', type: 'income', color: '#6B7280' },
        
        // Expense categories
        { id: 'food', name: 'Alimentation', type: 'expense', color: '#EF4444' },
        { id: 'transport', name: 'Transport', type: 'expense', color: '#3B82F6' },
        { id: 'housing', name: 'Logement', type: 'expense', color: '#8B5CF6' },
        { id: 'entertainment', name: 'Loisirs', type: 'expense', color: '#10B981' },
        { id: 'health', name: 'Santé', type: 'expense', color: '#EC4899' },
        { id: 'education', name: 'Éducation', type: 'expense', color: '#06B6D4' },
        { id: 'shopping', name: 'Achats', type: 'expense', color: '#F59E0B' },
        { id: 'utilities', name: 'Services publics', type: 'expense', color: '#84CC16' },
        { id: 'other_expense', name: 'Autre', type: 'expense', color: '#6B7280' }
      ]);
    }

    // Initialize default reserved funds
    if (!this.getReservedFunds().length) {
      this.setReservedFunds([
        { id: 'emergency', name: 'Urgence', balance: 0, target: 1000, color: '#EF4444' },
        { id: 'savings', name: 'Épargne', balance: 0, target: 5000, color: '#10B981' },
        { id: 'vacation', name: 'Vacances', balance: 0, target: 2000, color: '#3B82F6' }
      ]);
    }
  }

  // Generic storage methods
  getFromStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error reading from storage (${key}):`, error);
      return null;
    }
  }

  setToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error writing to storage (${key}):`, error);
      return false;
    }
  }

  // Transactions
  getTransactions() {
    return this.getFromStorage(this.storageKeys.transactions) || [];
  }

  addTransaction(transaction) {
    let transactions = this.getTransactions();
    const newTransaction = {
      ...transaction,
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString()
    };
    transactions.push(newTransaction);
    this.setToStorage(this.storageKeys.transactions, transactions);
    return newTransaction;
  }

  updateTransaction(id, updates) {
    let transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updates, updatedAt: new Date().toISOString() };
      this.setToStorage(this.storageKeys.transactions, transactions);
      return transactions[index];
    }
    return null;
  }

  deleteTransaction(id) {
    let transactions = this.getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    this.setToStorage(this.storageKeys.transactions, filtered);
    return filtered.length < transactions.length;
  }

  getTransactionsByFilter(filters = {}) {
    let transactions = this.getTransactions();
    
    if (filters.type) {
      transactions = transactions.filter(t => t.type === filters.type);
    }
    
    if (filters.category) {
      transactions = transactions.filter(t => t.category === filters.category);
    }
    
    if (filters.member) {
      transactions = transactions.filter(t => t.member === filters.member);
    }
    
    if (filters.startDate) {
      transactions = transactions.filter(t => new Date(t.date) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      transactions = transactions.filter(t => new Date(t.date) <= new Date(filters.endDate));
    }
    
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Members
  getMembers() {
    return this.getFromStorage(this.storageKeys.members) || [];
  }

  addMember(member) {
    const members = this.getMembers();
    const newMember = {
      ...member,
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString()
    };
    members.push(newMember);
    this.setToStorage(this.storageKeys.members, members);
    return newMember;
  }

  updateMember(id, updates) {
    const members = this.getMembers();
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
      members[index] = { ...members[index], ...updates, updatedAt: new Date().toISOString() };
      this.setToStorage(this.storageKeys.members, members);
      return members[index];
    }
    return null;
  }

  deleteMember(id) {
    const members = this.getMembers();
    const filtered = members.filter(m => m.id !== id);
    this.setToStorage(this.storageKeys.members, filtered);
    return filtered.length < members.length;
  }

  // Categories
  getCategories() {
    return this.getFromStorage(this.storageKeys.categories) || [];
  }

  setCategories(categories) {
    this.setToStorage(this.storageKeys.categories, categories);
  }

  getCategoriesByType(type) {
    return this.getCategories().filter(c => c.type === type);
  }

  // Reserved Funds
  getReservedFunds() {
    return this.getFromStorage(this.storageKeys.reservedFunds) || [];
  }

  setReservedFunds(funds) {
    this.setToStorage(this.storageKeys.reservedFunds, funds);
  }

  updateReservedFundBalance(id, amount) {
    const funds = this.getReservedFunds();
    const index = funds.findIndex(f => f.id === id);
    if (index !== -1) {
      funds[index].balance += amount;
      this.setReservedFunds(funds);
      return funds[index];
    }
    return null;
  }

  // Financial calculations
  calculateBalance() {
    let transactions = this.getTransactions();
    return transactions.reduce((balance, transaction) => {
      return transaction.type === 'income' 
        ? balance + parseFloat(transaction.amount)
        : balance - parseFloat(transaction.amount);
    }, 0);
  }

  getMonthlyIncome(month = new Date().getMonth(), year = new Date().getFullYear()) {
    let transactions = this.getTransactions();
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'income' && 
               date.getMonth() === month && 
               date.getFullYear() === year;
      })
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  }

  getMonthlyExpenses(month = new Date().getMonth(), year = new Date().getFullYear()) {
    let transactions = this.getTransactions();
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && 
               date.getMonth() === month && 
               date.getFullYear() === year;
      })
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  }

  getSpendingByCategory(type = 'expense', period = 'month') {
    let transactions = this.getTransactionsByFilter({ type });
    const now = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(0);
    }

    const filtered = transactions.filter(t => new Date(t.date) >= startDate);
    const categoryTotals = {};

    filtered.forEach(transaction => {
      const category = transaction.category;
      categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(transaction.amount);
    });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }

  exportData(format = 'json') {
    const data = {
      transactions: this.getTransactions(),
      members: this.getMembers(),
      categories: this.getCategories(),
      reservedFunds: this.getReservedFunds(),
      exportDate: new Date().toISOString()
    };

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    }
    
    // CSV format for transactions
    if (format === 'csv') {
      let transactions = data.transactions;
      const headers = ['Date', 'Type', 'Amount', 'Category', 'Member', 'Description'];
      const csvRows = [headers.join(',')];
      
      transactions.forEach(t => {
        const row = [
          t.date,
          t.type,
          t.amount,
          t.category,
          t.member,
          `"${t.description?.replace(/"/g, '""') || ''}"`
        ];
        csvRows.push(row.join(','));
      });
      
      return csvRows.join('\n');
    }

    return data;
  }
}

// Create and export singleton instance
const dataService = new DataService();
export default dataService;