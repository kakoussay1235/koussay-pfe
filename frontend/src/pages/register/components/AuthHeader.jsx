import React from 'react';
import Icon from '../../../components/AppIcon';

const AuthHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-card">
          <Icon name="DollarSign" size={32} color="white" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-foreground mb-2">
        FamilyExpense
      </h1>
      
      <p className="text-muted-foreground text-lg">
        Gérez vos finances familiales en toute simplicité
      </p>
    </div>
  );
};

export default AuthHeader;