import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import FloatingActionButton from '../../components/ui/FloatingActionButton';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';
import TransactionCard from './components/TransactionCard';
import TransactionTable from './components/TransactionTable';
import FilterPanel from './components/FilterPanel';
import TransactionModal from './components/TransactionModal';
import BulkActions from './components/BulkActions';
import TransactionSummary from './components/TransactionSummary';

const TransactionsPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    category: '',
    member: '',
    type: '',
    amountMin: '',
    amountMax: '',
    search: ''
  });

  // Mock transactions data
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'expense',
      description: 'Courses alimentaires Carrefour',
      amount: 127.50,
      category: 'alimentation',
      member: 'marie',
      date: '2025-01-25',
      notes: 'Courses hebdomadaires pour la famille'
    },
    {
      id: 2,
      type: 'income',
      description: 'Salaire mensuel',
      amount: 3200.00,
      category: 'salaire',
      member: 'pierre',
      date: '2025-01-24',
      notes: 'Salaire janvier 2025'
    },
    {
      id: 3,
      type: 'expense',
      description: 'Essence voiture',
      amount: 65.80,
      category: 'transport',
      member: 'pierre',
      date: '2025-01-23',
      notes: 'Plein d\'essence station Total'
    },
    {
      id: 4,
      type: 'expense',
      description: 'Facture électricité',
      amount: 89.45,
      category: 'logement',
      member: 'marie',
      date: '2025-01-22',
      notes: 'Facture EDF bimestrielle'
    },
    {
      id: 5,
      type: 'income',
      description: 'Freelance développement web',
      amount: 850.00,
      category: 'freelance',
      member: 'marie',
      date: '2025-01-21',
      notes: 'Projet site web pour client'
    },
    {
      id: 6,
      type: 'expense',
      description: 'Restaurant famille',
      amount: 78.90,
      category: 'loisirs',
      member: 'pierre',
      date: '2025-01-20',
      notes: 'Dîner en famille au restaurant italien'
    },
    {
      id: 7,
      type: 'expense',
      description: 'Médicaments pharmacie',
      amount: 23.45,
      category: 'sante',
      member: 'sophie',
      date: '2025-01-19',
      notes: 'Médicaments pour Sophie'
    },
    {
      id: 8,
      type: 'expense',
      description: 'Abonnement Netflix',
      amount: 15.99,
      category: 'loisirs',
      member: 'lucas',
      date: '2025-01-18',
      notes: 'Abonnement mensuel streaming'
    },
    {
      id: 9,
      type: 'income',
      description: 'Remboursement assurance',
      amount: 156.30,
      category: 'autres',
      member: 'marie',
      date: '2025-01-17',
      notes: 'Remboursement frais médicaux'
    },
    {
      id: 10,
      type: 'expense',
      description: 'Fournitures scolaires',
      amount: 42.60,
      category: 'education',
      member: 'sophie',
      date: '2025-01-16',
      notes: 'Cahiers et stylos pour l\'école'
    }
  ]);

  // Member names mapping
  const memberNames = {
    marie: 'Marie Dubois',
    pierre: 'Pierre Dubois',
    sophie: 'Sophie Dubois',
    lucas: 'Lucas Dubois'
  };

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Apply search
    const query = searchQuery.toLowerCase() || filters.search.toLowerCase();
    if (query) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(query) ||
        transaction.amount.toString().includes(query) ||
        transaction.category.toLowerCase().includes(query) ||
        (transaction.member && memberNames[transaction.member].toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.dateFrom) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.dateTo));
    }
    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }
    if (filters.member) {
      filtered = filtered.filter(t => t.member === filters.member);
    }
    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }
    if (filters.amountMin) {
      filtered = filtered.filter(t => t.amount >= parseFloat(filters.amountMin));
    }
    if (filters.amountMax) {
      filtered = filtered.filter(t => t.amount <= parseFloat(filters.amountMax));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [transactions, searchQuery, filters, sortBy, sortOrder]);

  // Sort options
  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'amount', label: 'Montant' },
    { value: 'category', label: 'Catégorie' },
    { value: 'description', label: 'Description' }
  ];

  // Handle pull to refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Transaction actions
  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleDeleteTransaction = (transaction) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      setTransactions(prev => prev.filter(t => t.id !== transaction.id));
      setSelectedTransactions(prev => prev.filter(id => id !== transaction.id));
    }
  };

  const handleSaveTransaction = (transactionData) => {
    if (selectedTransaction) {
      // Update existing transaction
      setTransactions(prev => prev.map(t => 
        t.id === selectedTransaction.id ? { ...transactionData, id: selectedTransaction.id } : t
      ));
    } else {
      // Add new transaction
      setTransactions(prev => [...prev, { ...transactionData, id: Date.now() }]);
    }
  };

  // Bulk actions
  const handleSelectTransaction = (id, checked) => {
    if (checked) {
      setSelectedTransactions(prev => [...prev, id]);
    } else {
      setSelectedTransactions(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedTransactions(filteredTransactions.map(t => t.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleBulkCategorize = () => {
    console.log('Bulk categorize:', selectedTransactions);
    // Implement bulk categorization logic
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedTransactions.length} transaction(s) ?`)) {
      setTransactions(prev => prev.filter(t => !selectedTransactions.includes(t.id)));
      setSelectedTransactions([]);
    }
  };

  const handleBulkExport = () => {
    const selectedData = transactions.filter(t => selectedTransactions.includes(t.id));
    const csvContent = [
      ['Date', 'Description', 'Catégorie', 'Membre', 'Type', 'Montant', 'Notes'],
      ...selectedData.map(t => [
        new Date(t.date).toLocaleDateString('fr-FR'),
        t.description,
        t.category,
        memberNames[t.member] || '',
        t.type === 'income' ? 'Revenu' : 'Dépense',
        t.amount.toFixed(2) + ' €',
        t.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportAll = () => {
    const csvContent = [
      ['Date', 'Description', 'Catégorie', 'Membre', 'Type', 'Montant', 'Notes'],
      ...filteredTransactions.map(t => [
        new Date(t.date).toLocaleDateString('fr-FR'),
        t.description,
        t.category,
        memberNames[t.member] || '',
        t.type === 'income' ? 'Revenu' : 'Dépense',
        t.amount.toFixed(2) + ' €',
        t.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `toutes-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Transactions</h1>
              <p className="text-muted-foreground">
                Gérez vos revenus et dépenses familiales
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                onClick={handleExportAll}
                className="hidden lg:flex"
              >
                Exporter
              </Button>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={handleAddTransaction}
                className="hidden lg:flex"
              >
                Nouvelle transaction
              </Button>
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-6">
            {/* Desktop Sidebar Filters */}
            <div className="hidden lg:block lg:col-span-3">
              <FilterPanel
                filters={filters}
                onFiltersChange={setFilters}
                onClose={() => {}}
                isOpen={true}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              {/* Transaction Summary */}
              <TransactionSummary 
                transactions={transactions}
                filteredTransactions={filteredTransactions}
              />

              {/* Search and Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    type="search"
                    placeholder="Rechercher une transaction..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Mobile Filter Button */}
                  <Button
                    variant="outline"
                    iconName="Filter"
                    onClick={() => setIsFilterOpen(true)}
                    className="lg:hidden"
                  />
                  
                  {/* Sort Controls */}
                  <Select
                    options={sortOptions}
                    value={sortBy}
                    onChange={setSortBy}
                    className="w-32"
                  />
                  
                  <Button
                    variant="outline"
                    size="icon"
                    iconName={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  />
                  
                  {/* View Mode Toggle */}
                  <div className="hidden lg:flex bg-muted rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`p-2 rounded-md transition-smooth ${
                        viewMode === 'cards' ? 'bg-card shadow-sm' : 'hover:bg-card/50'
                      }`}
                    >
                      <Icon name="LayoutGrid" size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-2 rounded-md transition-smooth ${
                        viewMode === 'table' ? 'bg-card shadow-sm' : 'hover:bg-card/50'
                      }`}
                    >
                      <Icon name="List" size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bulk Actions */}
              <BulkActions
                selectedCount={selectedTransactions.length}
                onCategorize={handleBulkCategorize}
                onDelete={handleBulkDelete}
                onExport={handleBulkExport}
                onClearSelection={() => setSelectedTransactions([])}
              />

              {/* Transactions List */}
              {isRefreshing ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Receipt" size={24} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-card-foreground mb-2">
                    Aucune transaction trouvée
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || Object.values(filters).some(f => f) 
                      ? 'Essayez de modifier vos critères de recherche'
                      : 'Commencez par ajouter votre première transaction'
                    }
                  </p>
                  <Button
                    variant="default"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={handleAddTransaction}
                  >
                    Ajouter une transaction
                  </Button>
                </div>
              ) : (
                <>
                  {/* Mobile Cards View */}
                  <div className="lg:hidden space-y-4">
                    {filteredTransactions.map(transaction => (
                      <TransactionCard
                        key={transaction.id}
                        transaction={{
                          ...transaction,
                          member: memberNames[transaction.member]
                        }}
                        onEdit={handleEditTransaction}
                        onDelete={handleDeleteTransaction}
                        onView={handleViewTransaction}
                      />
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block">
                    {viewMode === 'table' ? (
                      <TransactionTable
                        transactions={filteredTransactions.map(t => ({
                          ...t,
                          member: memberNames[t.member]
                        }))}
                        onEdit={handleEditTransaction}
                        onDelete={handleDeleteTransaction}
                        onView={handleViewTransaction}
                        selectedTransactions={selectedTransactions}
                        onSelectTransaction={handleSelectTransaction}
                        onSelectAll={handleSelectAll}
                      />
                    ) : (
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {filteredTransactions.map(transaction => (
                          <TransactionCard
                            key={transaction.id}
                            transaction={{
                              ...transaction,
                              member: memberNames[transaction.member]
                            }}
                            onEdit={handleEditTransaction}
                            onDelete={handleDeleteTransaction}
                            onView={handleViewTransaction}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filter Panel */}
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        onClose={() => setIsFilterOpen(false)}
        isOpen={isFilterOpen}
      />

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
        onSave={handleSaveTransaction}
        onDelete={(id) => {
          setTransactions(prev => prev.filter(t => t.id !== id));
          setSelectedTransactions(prev => prev.filter(selectedId => selectedId !== id));
        }}
      />

      {/* Mobile FAB */}
      <FloatingActionButton
        onClick={handleAddTransaction}
        iconName="Plus"
      />

      <BottomTabNavigation />
    </div>
  );
};

export default TransactionsPage;