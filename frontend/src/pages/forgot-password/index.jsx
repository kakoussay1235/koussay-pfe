import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { t, currentLanguage } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError(t('required'));
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t('invalidEmail'));
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await resetPassword(email);
      setIsSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <Helmet>
        <title>{t('resetPassword')} - FamilyExpense</title>
        <meta name="description" content={
          currentLanguage === 'fr' 
            ? "Réinitialisez votre mot de passe FamilyExpense" :"Reset your FamilyExpense password"
        } />
      </Helmet>

      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Icon name="Lock" size={24} color="white" />
              </div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">
              {t('resetPassword')}
            </h1>
            <p className="text-muted-foreground">
              {currentLanguage === 'fr' ?'Entrez votre adresse email pour recevoir un lien de réinitialisation' :'Enter your email address to receive a reset link'
              }
            </p>
          </div>

          {/* Success State */}
          {isSuccess ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name="CheckCircle" size={32} className="text-success" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-medium text-foreground">
                  {currentLanguage === 'fr' ?'Email envoyé !' :'Email sent!'
                  }
                </h2>
                <p className="text-muted-foreground">
                  {currentLanguage === 'fr' ?'Nous avons envoyé un lien de réinitialisation à votre adresse email. Vérifiez votre boîte de réception et suivez les instructions.' :'We have sent a reset link to your email address. Check your inbox and follow the instructions.'
                  }
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleBackToLogin}
                  className="w-full"
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  {currentLanguage === 'fr' ?'Retour à la connexion' :'Back to login'
                  }
                </Button>
                
                <p className="text-sm text-muted-foreground">
                  {currentLanguage === 'fr' ? "Vous n'avez pas reçu l'email ?" : "Didn't receive the email?"
                  }{' '}
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="text-primary hover:text-primary/80 font-medium transition-smooth"
                  >
                    {currentLanguage === 'fr' ?'Renvoyer' :'Resend'
                    }
                  </button>
                </p>
              </div>
            </div>
          ) : (
            /* Reset Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label={t('email')}
                type="email"
                placeholder={currentLanguage === 'fr' ? 'votre@email.com' : 'your@email.com'}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                error={error}
                required
                autoComplete="email"
                autoFocus
              />

              <Button
                type="submit"
                className="w-full"
                loading={isSubmitting}
                iconName="Send"
                iconPosition="left"
              >
                {currentLanguage === 'fr' ?'Envoyer le lien de réinitialisation' :'Send reset link'
                }
              </Button>

              <div className="text-center">
                <Link 
                  to="/login"
                  className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-smooth"
                >
                  <Icon name="ArrowLeft" size={16} />
                  <span>
                    {currentLanguage === 'fr' ?'Retour à la connexion' :'Back to login'
                    }
                  </span>
                </Link>
              </div>
            </form>
          )}

          {/* Help Text */}
          <div className="text-center pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground">
              {currentLanguage === 'fr' ?'Besoin d\'aide ? Contactez notre support technique.' :'Need help? Contact our technical support.'
              }
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;