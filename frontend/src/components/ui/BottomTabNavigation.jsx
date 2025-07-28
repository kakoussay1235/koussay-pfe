import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { Users } from 'lucide-react';

const BottomTabNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'Home' },
    { label: 'Transactions', path: '/transactions', icon: 'List' },
    { label: 'Budget', path: '/budget-management', icon: 'Target' },
    { label: 'Reports', path: '/reports-analytics', icon: 'BarChart3' },
    { label: 'Famille', path: '/family-members', icon: 'Users' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden z-100">
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-smooth min-w-0 flex-1 ${
                isActive
                  ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon 
                name={item.icon} 
                size={20} 
                className={isActive ? 'text-primary' : 'text-current'}
              />
              <span className="text-xs font-medium mt-1 truncate">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabNavigation;