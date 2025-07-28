import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import FloatingActionButton from '../../components/ui/FloatingActionButton';
import FinancialSummaryCard from './components/FinancialSummaryCard';
import SpendingChart from './components/SpendingChart';
import IncomeChart from './components/IncomeChart';
import QuickActionCard from './components/QuickActionCard';
import RecentTransactionsList from './components/RecentTransactionsList';
import AlertNotifications from './components/AlertNotifications';
import BudgetProgressCard from './components/BudgetProgressCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState('fr');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'fr';
    setCurrentLanguage(savedLanguage);
  }, []);

  // Mock financial data
  const financialSummary = {
    currentBalance: 3450.75,
    monthlyIncome: 4900.00,
    monthlyExpenses: 3200.00,
    reservedFunds: 1250.50,
    emergencyFund: 850.00,
    savingsFund: 400.50
  };

  const handleAddTransaction = () => {
    navigate('/add-transaction');
  };

  const getLanguageText = (key) => {
    const texts = {
      fr: {
        dashboard: 'Tableau de Bord',
        currentBalance: 'Solde Actuel',
        monthlyIncome: 'Revenus Mensuels',
        monthlyExpenses: 'Dépenses Mensuelles',
        reservedFunds: 'Fonds Réservés',
        financialOverview: 'Vue d\'Ensemble Financière',
        analytics: 'Analyses',
        quickActions: 'Actions Rapides'
      },
      en: {
        dashboard: 'Dashboard',
        currentBalance: 'Current Balance',
        monthlyIncome: 'Monthly Income',
        monthlyExpenses: 'Monthly Expenses',
        reservedFunds: 'Reserved Funds',
        financialOverview: 'Financial Overview',
        analytics: 'Analytics',
        quickActions: 'Quick Actions'
      }
    };
    return texts[currentLanguage][key] || texts.fr[key];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Main Content */}
      <main className="pt-16 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-semibold text-foreground">
              {getLanguageText('dashboard')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {currentLanguage === 'fr' ?'Vue d\'ensemble de vos finances familiales' :'Overview of your family finances'
              }
            </p>
          </div>

          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
            <FinancialSummaryCard
              title={getLanguageText('currentBalance')}
              amount={financialSummary.currentBalance}
              icon="Wallet"
              trend="up"
              trendValue="+5.2%"
              variant="success"
            />
            <FinancialSummaryCard
              title={getLanguageText('monthlyIncome')}
              amount={financialSummary.monthlyIncome}
              icon="TrendingUp"
              trend="up"
              trendValue="+2.1%"
            />
            <FinancialSummaryCard
              title={getLanguageText('monthlyExpenses')}
              amount={financialSummary.monthlyExpenses}
              icon="TrendingDown"
              trend="down"
              trendValue="-1.8%"
              variant="warning"
            />
            <FinancialSummaryCard
              title={getLanguageText('reservedFunds')}
              amount={financialSummary.reservedFunds}
              icon="PiggyBank"
              trend="up"
              trendValue="+8.5%"
            />
          </div>

          {/* Alert Notifications */}
          <div className="mb-6">
            <AlertNotifications />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-8 space-y-6">
              {/* Charts Row */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <SpendingChart />
                <IncomeChart />
              </div>
              
              {/* Budget Progress */}
              <BudgetProgressCard />
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Actions */}
              <QuickActionCard />
              
              {/* Recent Transactions */}
              <RecentTransactionsList />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <BottomTabNavigation />
      
      {/* Floating Action Button for Mobile */}
      <FloatingActionButton
        onClick={handleAddTransaction}
        iconName="Plus"
        variant="default"
      />
    </div>
  );
};

export default Dashboard;