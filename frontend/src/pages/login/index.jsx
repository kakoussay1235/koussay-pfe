import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();
  const { t, currentLanguage, changeLanguage, getAvailableLanguages } = useLanguage();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = t('required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('invalidEmail');
    }
    
    if (!formData.password) {
      newErrors.password = t('required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setErrors({ 
        submit: error.message || (currentLanguage === 'fr' ? 'Erreur de connexion' : 'Login error')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const languageOptions = getAvailableLanguages().map(lang => ({
    value: lang.code,
    label: `${lang.flag} ${lang.name}`
  }));

  return (
    <>
      <Helmet>
        <title>{t('login')} - FamilyExpense</title>
        <meta name="description" content={
          currentLanguage === 'fr' 
            ? "Connectez-vous à votre compte FamilyExpense pour gérer vos finances familiales" :"Sign in to your FamilyExpense account to manage your family finances"
        } />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Left Side - Form Section */}
          <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
            <div className="w-full max-w-md space-y-8">
              {/* Header */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Icon name="DollarSign" size={24} color="white" />
                  </div>
                </div>
                <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">
                  {t('login')}
                </h1>
                <p className="text-muted-foreground">
                  {currentLanguage === 'fr' ?'Connectez-vous à votre compte FamilyExpense' :'Sign in to your FamilyExpense account'
                  }
                </p>
              </div>

              {/* Language Selector */}
              <div className="flex justify-center">
                <div className="w-40">
                  <Select
                    value={currentLanguage}
                    onChange={changeLanguage}
                    options={languageOptions}
                    variant="ghost"
                  />
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label={t('email')}
                  type="email"
                  placeholder={currentLanguage === 'fr' ? 'votre@email.com' : 'your@email.com'}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  required
                  autoComplete="email"
                />

                <Input
                  label={t('password')}
                  type="password"
                  placeholder={currentLanguage === 'fr' ? 'Votre mot de passe' : 'Your password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={errors.password}
                  required
                  autoComplete="current-password"
                />

                {errors.submit && (
                  <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
                    <p className="text-sm text-error">{errors.submit}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  loading={isSubmitting || isLoading}
                  iconName="LogIn"
                  iconPosition="left"
                >
                  {t('loginButton')}
                </Button>

                <div className="text-center">
                  <Link 
                    to="/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 transition-smooth"
                  >
                    {t('forgotPassword')}
                  </Link>
                </div>
              </form>

              {/* Register Link */}
              <div className="text-center pt-6 border-t border-border">
                <p className="text-muted-foreground text-sm">
                  {currentLanguage === 'fr' 
                    ? "Pas encore de compte ?" :"Don't have an account?"
                  }{' '}
                  <Link 
                    to="/register" 
                    className="text-primary hover:text-primary/80 font-medium transition-smooth"
                  >
                    {t('register')}
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Information Section */}
          <div className="lg:flex-1 bg-muted/30 p-4 lg:p-8 flex items-center justify-center">
            <div className="w-full max-w-lg">
              <div className="space-y-6">
                <h2 className="text-2xl lg:text-3xl font-semibold text-foreground">
                  {currentLanguage === 'fr' ?'Gérez vos finances familiales' :'Manage your family finances'
                  }
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center mt-1">
                      <Icon name="Check" size={16} color="white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        {currentLanguage === 'fr' ?'Suivi des transactions' :'Transaction tracking'
                        }
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {currentLanguage === 'fr' ?'Enregistrez et catégorisez toutes vos dépenses et revenus' :'Record and categorize all your expenses and income'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mt-1">
                      <Icon name="PieChart" size={16} color="white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        {currentLanguage === 'fr' ?'Analyses et rapports' :'Analytics and reports'
                        }
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {currentLanguage === 'fr' ?'Visualisez vos habitudes de dépenses avec des graphiques détaillés' :'Visualize your spending habits with detailed charts'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center mt-1">
                      <Icon name="Users" size={16} color="white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        {currentLanguage === 'fr' ?'Gestion familiale' :'Family management'
                        }
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {currentLanguage === 'fr' ?'Gérez les finances de tous les membres de votre foyer' :'Manage finances for all your household members'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;