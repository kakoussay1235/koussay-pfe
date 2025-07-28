import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';


const AuthFooter = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Terms and Privacy */}
      <div className="text-center text-sm text-muted-foreground">
        <p className="mb-2">
          En créant un compte, vous acceptez nos{' '}
          <button className="text-primary hover:underline font-medium">
            Conditions d'utilisation
          </button>{' '}
          et notre{' '}
          <button className="text-primary hover:underline font-medium">
            Politique de confidentialité
          </button>
        </p>
        <div className="flex items-center justify-center space-x-2 mt-3">
          <div className="w-4 h-4 bg-success rounded-sm flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xs">Conforme RGPD</span>
        </div>
      </div>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-muted-foreground mb-4">
          Vous avez déjà un compte ?
        </p>
        <Button
          variant="outline"
          onClick={() => navigate('/login')}
          className="w-full"
        >
          Se connecter
        </Button>
      </div>

      {/* Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-border">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Icon name="PieChart" size={24} className="text-primary" />
          </div>
          <h3 className="font-medium text-foreground mb-1">Suivi en temps réel</h3>
          <p className="text-sm text-muted-foreground">
            Visualisez vos dépenses instantanément
          </p>
        </div>
        
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Icon name="Users" size={24} className="text-secondary" />
          </div>
          <h3 className="font-medium text-foreground mb-1">Gestion familiale</h3>
          <p className="text-sm text-muted-foreground">
            Partagez et organisez les finances
          </p>
        </div>
        
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Icon name="Shield" size={24} className="text-accent" />
          </div>
          <h3 className="font-medium text-foreground mb-1">Sécurisé</h3>
          <p className="text-sm text-muted-foreground">
            Vos données sont protégées
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
        <p>&copy; {new Date().getFullYear()} FamilyExpense. Tous droits réservés.</p>
      </div>
    </div>
  );
};

export default AuthFooter;