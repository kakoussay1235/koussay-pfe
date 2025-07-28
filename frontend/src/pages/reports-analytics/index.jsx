import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import FloatingActionButton from '../../components/ui/FloatingActionButton';
import Button from '../../components/ui/Button';


// Import components
import ChartWidget from './components/ChartWidget';
import DateRangeSelector from './components/DateRangeSelector';
import SpendingDistributionChart from './components/SpendingDistributionChart';
import IncomeExpenseChart from './components/IncomeExpenseChart';
import CategoryPerformanceChart from './components/CategoryPerformanceChart';
import ReservedFundsChart from './components/ReservedFundsChart';
import FilterPanel from './components/FilterPanel';
import ExportControls from './components/ExportControls';
import SummaryStats from './components/SummaryStats';

const ReportsAnalytics = () => {
  const [selectedRange, setSelectedRange] = useState('month');
  const [customRange, setCustomRange] = useState({ startDate: '', endDate: '' });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    members: [],
    transactionType: 'all',
    amountRange: { min: '', max: '' }
  });

  // Mock data
  const spendingData = [
    { name: 'Alimentation', value: 1250, total: 4500 },
    { name: 'Transport', value: 680, total: 4500 },
    { name: 'Logement', value: 1200, total: 4500 },
    { name: 'Loisirs', value: 450, total: 4500 },
    { name: 'Santé', value: 320, total: 4500 },
    { name: 'Vêtements', value: 280, total: 4500 },
    { name: 'Autres', value: 320, total: 4500 }
  ];

  const incomeExpenseData = [
    { month: 'Jan', income: 4200, expenses: 3800 },
    { month: 'Fév', income: 4500, expenses: 4100 },
    { month: 'Mar', income: 4200, expenses: 3900 },
    { month: 'Avr', income: 4800, expenses: 4200 },
    { month: 'Mai', income: 4200, expenses: 3850 },
    { month: 'Jun', income: 4600, expenses: 4300 },
    { month: 'Jul', income: 4200, expenses: 4500 }
  ];

  const categoryPerformanceData = [
    { category: 'Alimentation', spent: 1250, budget: 1300 },
    { category: 'Transport', spent: 680, budget: 700 },
    { category: 'Logement', spent: 1200, budget: 1200 },
    { category: 'Loisirs', spent: 450, budget: 400 },
    { category: 'Santé', spent: 320, budget: 500 },
    { category: 'Vêtements', spent: 280, budget: 300 }
  ];

  const reservedFundsData = [
    { month: 'Jan', emergency: 2000, savings: 1500, leisure: 800 },
    { month: 'Fév', emergency: 2200, savings: 1650, leisure: 750 },
    { month: 'Mar', emergency: 2400, savings: 1800, leisure: 900 },
    { month: 'Avr', emergency: 2300, savings: 1900, leisure: 850 },
    { month: 'Mai', emergency: 2500, savings: 2100, leisure: 950 },
    { month: 'Jun', emergency: 2700, savings: 2300, leisure: 900 },
    { month: 'Jul', emergency: 2900, savings: 2500, leisure: 1000 }
  ];

  const categories = [
    { id: 1, name: 'Alimentation' },
    { id: 2, name: 'Transport' },
    { id: 3, name: 'Logement' },
    { id: 4, name: 'Loisirs' },
    { id: 5, name: 'Santé' },
    { id: 6, name: 'Vêtements' }
  ];

  const members = [
    { id: 1, name: 'Marie Dubois' },
    { id: 2, name: 'Pierre Dubois' },
    { id: 3, name: 'Sophie Dubois' }
  ];

  const summaryStats = {
    totalIncome: 31700,
    totalExpenses: 28650,
    netBalance: 3050,
    reservedFunds: 6400,
    avgDailyExpense: 136.4,
    topCategory: 'Alimentation'
  };

  const handleExport = async (option) => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      console.log(`Exporting ${option.format} - ${option.type}`);
      setIsExporting(false);
      
      // Show success message (in real app, this would trigger a download)
      alert(`Export ${option.label} terminé avec succès !`);
    }, 2000);
  };

  const handleAddTransaction = () => {
    // Navigate to add transaction or open modal
    console.log('Add transaction');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Rapports & Analyses</h1>
              <p className="text-muted-foreground mt-1">
                Analysez vos finances avec des graphiques détaillés et des rapports personnalisés
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                iconName="Filter"
                iconPosition="left"
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden"
              >
                Filtres
              </Button>
              <ExportControls 
                onExport={handleExport}
                isExporting={isExporting}
              />
            </div>
          </div>

          {/* Date Range Selector */}
          <DateRangeSelector
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
            customRange={customRange}
            onCustomRangeChange={setCustomRange}
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Charts Area */}
            <div className="lg:col-span-9 space-y-6">
              {/* Income vs Expenses Trend */}
              <ChartWidget
                title="Évolution Revenus vs Dépenses"
                onExport={() => handleExport({ format: 'png', type: 'income-expense' })}
              >
                <IncomeExpenseChart data={incomeExpenseData} />
              </ChartWidget>

              {/* Spending Distribution */}
              <ChartWidget
                title="Répartition des Dépenses"
                onExport={() => handleExport({ format: 'png', type: 'spending-distribution' })}
              >
                <SpendingDistributionChart data={spendingData} />
              </ChartWidget>

              {/* Category Performance */}
              <ChartWidget
                title="Performance par Catégorie"
                onExport={() => handleExport({ format: 'png', type: 'category-performance' })}
              >
                <CategoryPerformanceChart data={categoryPerformanceData} />
              </ChartWidget>

              {/* Reserved Funds Evolution */}
              <ChartWidget
                title="Évolution des Fonds Réservés"
                onExport={() => handleExport({ format: 'png', type: 'reserved-funds' })}
              >
                <ReservedFundsChart data={reservedFundsData} />
              </ChartWidget>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-3 space-y-6">
              {/* Summary Stats */}
              <SummaryStats stats={summaryStats} />

              {/* Desktop Filter Panel */}
              <div className="hidden lg:block">
                <FilterPanel
                  filters={filters}
                  onFiltersChange={setFilters}
                  isOpen={true}
                  onToggle={() => {}}
                  categories={categories}
                  members={members}
                />
              </div>

              {/* Quick Actions */}
              <div className="bg-card rounded-lg border border-border p-4">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">
                  Actions rapides
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    iconName="Calendar"
                    iconPosition="left"
                    fullWidth
                    onClick={() => console.log('Schedule report')}
                  >
                    Programmer un rapport
                  </Button>
                  <Button
                    variant="outline"
                    iconName="Settings"
                    iconPosition="left"
                    fullWidth
                    onClick={() => console.log('Configure alerts')}
                  >
                    Configurer les alertes
                  </Button>
                  <Button
                    variant="outline"
                    iconName="Share"
                    iconPosition="left"
                    fullWidth
                    onClick={() => console.log('Share report')}
                  >
                    Partager le rapport
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filter Panel */}
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        isOpen={isFilterOpen}
        onToggle={() => setIsFilterOpen(!isFilterOpen)}
        categories={categories}
        members={members}
      />

      {/* Mobile Navigation */}
      <BottomTabNavigation />
      
      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={handleAddTransaction}
        iconName="Plus"
      />
    </div>
  );
};

export default ReportsAnalytics;