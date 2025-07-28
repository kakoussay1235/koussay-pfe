import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Icon from '../AppIcon';
import Button from './Button';
import Select from './Select';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t, currentLanguage, changeLanguage, getAvailableLanguages } = useLanguage();

  const navigationItems = [
    { label: t('dashboard'), path: '/dashboard', icon: 'Home' },
    { label: t('transactions'), path: '/transactions', icon: 'List' },
    { label: 'Budget', path: '/budget-management', icon: 'Target' },
    { label: 'Reports', path: '/reports-analytics', icon: 'BarChart3' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleAddTransaction = () => {
    navigate('/add-transaction');
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  const languageOptions = getAvailableLanguages().map(lang => ({
    value: lang.code,
    label: `${lang.flag} ${lang.name}`
  }));

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-100">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="DollarSign" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">FamilyExpense</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                location.pathname === item.path
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Language Selector */}
          <div className="w-32">
            <Select
              value={currentLanguage}
              onChange={changeLanguage}
              options={languageOptions}
              variant="ghost"
            />
          </div>

          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={handleAddTransaction}
          >
            {t('addTransaction')}
          </Button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-smooth"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-modal z-200">
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setIsProfileOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted"
                  >
                    <Icon name="Settings" size={16} />
                    <span>{t('settings')}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            iconName="Plus"
            onClick={handleAddTransaction}
          />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md hover:bg-muted transition-smooth"
          >
            <Icon name={isMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <nav className="px-4 py-2 space-y-1">
            {/* Language Selector Mobile */}
            <div className="py-2 border-b border-border">
              <Select
                value={currentLanguage}
                onChange={changeLanguage}
                options={languageOptions}
                variant="ghost"
              />
            </div>

            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center space-x-3 w-full px-3 py-3 rounded-md text-sm font-medium transition-smooth ${
                  location.pathname === item.path
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
              </button>
            ))}
            
            <div className="border-t border-border pt-2 mt-2">
              {/* User Info */}
              <div className="px-3 py-2 text-sm">
                <p className="font-medium text-foreground">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>

              <button
                onClick={() => {
                  navigate('/profile');
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full px-3 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
              >
                <Icon name="Settings" size={20} />
                <span>{t('settings')}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-3 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
              >
                <Icon name="LogOut" size={20} />
                <span>{t('logout')}</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;