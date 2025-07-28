import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import FloatingActionButton from '../../components/ui/FloatingActionButton';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import BudgetCategoryCard from './components/BudgetCategoryCard';
import BudgetSummaryCard from './components/BudgetSummaryCard';
import BudgetChart from './components/BudgetChart';
import AddCategoryModal from './components/AddCategoryModal';
import BulkBudgetModal from './components/BulkBudgetModal';

const BudgetManagement = () => {
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const [period, setPeriod] = useState('Monthly');
  const [expandedCards, setExpandedCards] = useState({});
  const [chartType, setChartType] = useState('bar');
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // Mock data for budget categories
  const mockCategories = [
    {
      id: "1",
      name: "Alimentation",
      budgetLimit: 800,
      spent: 650,
      icon: "ShoppingCart",
      color: "bg-primary",
      transactionCount: 24,
      recentTransactions: [
        { id: "t1", description: "Supermarché Carrefour", amount: 85.50, date: "27/07/2025" },
        { id: "t2", description: "Boulangerie du coin", amount: 12.30, date: "26/07/2025" },
        { id: "t3", description: "Marché local", amount: 45.20, date: "25/07/2025" }
      ]
    },
    {
      id: "2",
      name: "Transport",
      budgetLimit: 300,
      spent: 280,
      icon: "Car",
      color: "bg-secondary",
      transactionCount: 15,
      recentTransactions: [
        { id: "t4", description: "Essence Total", amount: 65.00, date: "27/07/2025" },
        { id: "t5", description: "Métro mensuel", amount: 75.20, date: "01/07/2025" }
      ]
    },
    {
      id: "3",
      name: "Logement",
      budgetLimit: 1200,
      spent: 1200,
      icon: "Home",
      color: "bg-accent",
      transactionCount: 8,
      recentTransactions: [
        { id: "t6", description: "Loyer juillet", amount: 950.00, date: "01/07/2025" },
        { id: "t7", description: "Électricité EDF", amount: 120.50, date: "15/07/2025" },
        { id: "t8", description: "Internet Orange", amount: 39.99, date: "10/07/2025" }
      ]
    },
    {
      id: "4",
      name: "Loisirs",
      budgetLimit: 400,
      spent: 520,
      icon: "Gamepad2",
      color: "bg-error",
      transactionCount: 12,
      recentTransactions: [
        { id: "t9", description: "Cinéma UGC", amount: 24.00, date: "26/07/2025" },
        { id: "t10", description: "Restaurant Le Bistrot", amount: 85.50, date: "24/07/2025" }
      ]
    },
    {
      id: "5",
      name: "Santé",
      budgetLimit: 200,
      spent: 145,
      icon: "Heart",
      color: "bg-success",
      transactionCount: 6,
      recentTransactions: [
        { id: "t11", description: "Pharmacie Centrale", amount: 25.80, date: "22/07/2025" },
        { id: "t12", description: "Consultation médecin", amount: 25.00, date: "18/07/2025" }
      ]
    },
    {
      id: "6",
      name: "Vêtements",
      budgetLimit: 250,
      spent: 180,
      icon: "Shirt",
      color: "bg-warning",
      transactionCount: 4,
      recentTransactions: [
        { id: "t13", description: "Zara", amount: 89.99, date: "20/07/2025" },
        { id: "t14", description: "H&M", amount: 45.50, date: "15/07/2025" }
      ]
    }
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'fr';
    setCurrentLanguage(savedLanguage);
    setCategories(mockCategories);
  }, []);

  const translations = {
    fr: {
      title: "Gestion du Budget",
      monthly: "Mensuel",
      yearly: "Annuel",
      addCategory: "Ajouter Catégorie",
      bulkAdjust: "Ajustement Groupé",
      exportReport: "Exporter Rapport"
    },
    en: {
      title: "Budget Management",
      monthly: "Monthly",
      yearly: "Yearly",
      addCategory: "Add Category",
      bulkAdjust: "Bulk Adjust",
      exportReport: "Export Report"
    }
  };

  const t = translations[currentLanguage];

  // Calculate budget summary
  const budgetSummary = {
    totalBudget: categories.reduce((sum, cat) => sum + cat.budgetLimit, 0),
    totalSpent: categories.reduce((sum, cat) => sum + cat.spent, 0),
    totalRemaining: categories.reduce((sum, cat) => sum + (cat.budgetLimit - cat.spent), 0),
    overBudgetCategories: categories.filter(cat => cat.spent > cat.budgetLimit)
  };

  const handleToggleExpand = (categoryId) => {
    setExpandedCards(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleUpdateBudget = (categoryId, newBudget) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, budgetLimit: newBudget } : cat
    ));
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const handleAddCategory = (newCategory) => {
    setCategories(prev => [...prev, newCategory]);
  };

  const handleBulkUpdate = (updatedCategories) => {
    setCategories(prev => prev.map(cat => {
      const updated = updatedCategories.find(updated => updated.id === cat.id);
      return updated ? { ...cat, budgetLimit: updated.newBudgetLimit } : cat;
    }));
  };

  const handleExportReport = () => {
    // Mock export functionality
    console.log('Exporting budget report...');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                {t.title}
              </h1>
              <p className="text-muted-foreground">
                Gérez vos budgets par catégorie et suivez vos dépenses en temps réel
              </p>
            </div>
            
            {/* Period Toggle */}
            <div className="flex items-center space-x-2 mt-4 lg:mt-0">
              <div className="bg-muted rounded-lg p-1 flex">
                <button
                  onClick={() => setPeriod('Monthly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                    period === 'Monthly' ?'bg-card text-card-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t.monthly}
                </button>
                <button
                  onClick={() => setPeriod('Yearly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                    period === 'Yearly' ?'bg-card text-card-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t.yearly}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setIsAddCategoryModalOpen(true)}
              >
                {t.addCategory}
              </Button>
              <Button
                variant="outline"
                iconName="Settings"
                iconPosition="left"
                onClick={() => setIsBulkModalOpen(true)}
              >
                {t.bulkAdjust}
              </Button>
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                onClick={handleExportReport}
              >
                {t.exportReport}
              </Button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Budget Categories - Main Content */}
            <div className="lg:col-span-8 space-y-4">
              {/* Budget Chart */}
              <BudgetChart
                chartData={categories}
                chartType={chartType}
                onChartTypeChange={setChartType}
              />

              {/* Category Cards */}
              <div className="space-y-4">
                {categories.map((category) => (
                  <BudgetCategoryCard
                    key={category.id}
                    category={category}
                    onUpdateBudget={handleUpdateBudget}
                    onDeleteCategory={handleDeleteCategory}
                    isExpanded={expandedCards[category.id]}
                    onToggleExpand={() => handleToggleExpand(category.id)}
                  />
                ))}
              </div>

              {/* Empty State */}
              {categories.length === 0 && (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <Icon name="Target" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    Aucune catégorie de budget
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Commencez par créer votre première catégorie de budget pour suivre vos dépenses.
                  </p>
                  <Button
                    variant="default"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => setIsAddCategoryModalOpen(true)}
                  >
                    Créer une catégorie
                  </Button>
                </div>
              )}
            </div>

            {/* Budget Summary Sidebar */}
            <div className="lg:col-span-4">
              <BudgetSummaryCard
                budgetSummary={budgetSummary}
                period={period}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Actions */}
      <div className="lg:hidden fixed bottom-20 left-4 right-4 flex items-center justify-center space-x-3 z-50">
        <Button
          variant="outline"
          size="sm"
          iconName="Settings"
          onClick={() => setIsBulkModalOpen(true)}
          className="bg-card shadow-modal"
        />
        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          onClick={handleExportReport}
          className="bg-card shadow-modal"
        />
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => setIsAddCategoryModalOpen(true)}
        iconName="Plus"
      />

      {/* Modals */}
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onAddCategory={handleAddCategory}
      />

      <BulkBudgetModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        categories={categories}
        onBulkUpdate={handleBulkUpdate}
      />

      <BottomTabNavigation />
    </div>
  );
};

export default BudgetManagement;