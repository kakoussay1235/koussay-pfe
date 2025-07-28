import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import dataService from '../../../services/dataService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t, currentLanguage } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    language: currentLanguage,
    currency: 'EUR',
    householdMembers: [{ name: '', role: 'husband' }]
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    }
  });

  const languageOptions = [
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'English' }
  ];

  const currencyOptions = [
    { value: 'TND', label: 'Tunisian Dinar (د.ت)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'GBP', label: 'British Pound (£)' }
  ];

  const roleOptions = [
    { value: 'husband', label: t('husband') },
    { value: 'wife', label: t('wife') },
    { value: 'child', label: t('child') },
    { value: 'other', label: t('other') }
  ];

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(requirements).filter(Boolean).length;
    
    setPasswordStrength({ score, requirements });
    return score >= 4;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'password') {
      validatePassword(value);
    }
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.householdMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFormData(prev => ({ ...prev, householdMembers: updatedMembers }));
  };

  const addMember = () => {
    if (formData.householdMembers.length < 6) {
      setFormData(prev => ({
        ...prev,
        householdMembers: [...prev.householdMembers, { name: '', role: 'child' }]
      }));
    }
  };

  const removeMember = (index) => {
    if (formData.householdMembers.length > 1) {
      const updatedMembers = formData.householdMembers.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, householdMembers: updatedMembers }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = t('required');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('invalidEmail');
    }
    
    if (!formData.password) {
      newErrors.password = t('required');
    } else if (!validatePassword(formData.password)) {
      newErrors.password = t('passwordTooShort');
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('passwordsNoMatch');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    formData.householdMembers.forEach((member, index) => {
      if (!member.name.trim()) {
        newErrors[`member_${index}`] = t('required');
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setIsLoading(true);
    
    try {
      // Register user through auth context
      await register(formData);
      
      // Initialize household members in data service
      formData.householdMembers.forEach(member => {
        dataService.addMember({
          name: member.name,
          role: member.role
        });
      });
      
      navigate('/dashboard');
    } catch (error) {
      setErrors({ submit: error.message || t('error') });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return 'bg-error';
    if (passwordStrength.score <= 3) return 'bg-warning';
    return 'bg-success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 2) return currentLanguage === 'fr' ? 'Faible' : 'Weak';
    if (passwordStrength.score <= 3) return currentLanguage === 'fr' ? 'Moyen' : 'Medium';
    return currentLanguage === 'fr' ? 'Fort' : 'Strong';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}>
          {currentStep > 1 ? <Icon name="Check" size={16} /> : '1'}
        </div>
        <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}>
          2
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {currentLanguage === 'fr' ? 'Informations personnelles' : 'Personal Information'}
            </h2>
            <p className="text-muted-foreground">
              {currentLanguage === 'fr' ?'Créez votre compte pour commencer à gérer vos finances familiales' :'Create your account to start managing your family finances'
              }
            </p>
          </div>

          <Input
            label={currentLanguage === 'fr' ? 'Nom complet' : 'Full Name'}
            type="text"
            placeholder={currentLanguage === 'fr' ? 'Entrez votre nom complet' : 'Enter your full name'}
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            error={errors.fullName}
            required
          />

          <Input
            label={t('email')}
            type="email"
            placeholder={currentLanguage === 'fr' ? 'votre@email.com' : 'your@email.com'}
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            required
          />

          <div className="space-y-2">
            <Input
              label={t('password')}
              type="password"
              placeholder={currentLanguage === 'fr' ? 'Créez un mot de passe sécurisé' : 'Create a secure password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              required
            />
            
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {currentLanguage === 'fr' ? 'Force du mot de passe:' : 'Password strength:'}
                  </span>
                  <span className={`font-medium ${
                    passwordStrength.score <= 2 ? 'text-error' : 
                    passwordStrength.score <= 3 ? 'text-warning' : 'text-success'
                  }`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries({
                    length: currentLanguage === 'fr' ? '8+ caractères' : '8+ characters',
                    uppercase: currentLanguage === 'fr' ? 'Majuscule' : 'Uppercase',
                    lowercase: currentLanguage === 'fr' ? 'Minuscule' : 'Lowercase',
                    number: currentLanguage === 'fr' ? 'Chiffre' : 'Number',
                    special: currentLanguage === 'fr' ? 'Caractère spécial' : 'Special char'
                  }).map(([key, label]) => (
                    <div key={key} className={`flex items-center space-x-1 ${
                      passwordStrength.requirements[key] ? 'text-success' : 'text-muted-foreground'
                    }`}>
                      <Icon 
                        name={passwordStrength.requirements[key] ? "Check" : "X"} 
                        size={12} 
                      />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Input
            label={t('confirmPassword')}
            type="password"
            placeholder={currentLanguage === 'fr' ? 'Confirmez votre mot de passe' : 'Confirm your password'}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            required
          />

          <Button
            type="button"
            onClick={handleNextStep}
            className="w-full"
            iconName="ArrowRight"
            iconPosition="right"
          >
            {currentLanguage === 'fr' ? 'Continuer' : 'Continue'}
          </Button>
        </div>
      )}

      {/* Step 2: Household Setup */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {currentLanguage === 'fr' ? 'Configuration du foyer' : 'Household Setup'}
            </h2>
            <p className="text-muted-foreground">
              {currentLanguage === 'fr' ?'Personnalisez vos préférences et ajoutez les membres de votre famille' :'Customize your preferences and add your family members'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label={currentLanguage === 'fr' ? 'Langue préférée' : 'Preferred Language'}
              options={languageOptions}
              value={formData.language}
              onChange={(value) => handleInputChange('language', value)}
            />

            <Select
              label={currentLanguage === 'fr' ? 'Devise' : 'Currency'}
              options={currencyOptions}
              value={formData.currency}
              onChange={(value) => handleInputChange('currency', value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground">
                {currentLanguage === 'fr' ? 'Membres du foyer' : 'Household Members'}
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                iconName="Plus"
                iconPosition="left"
                onClick={addMember}
                disabled={formData.householdMembers.length >= 6}
              >
                {t('addMember')}
              </Button>
            </div>

            {formData.householdMembers.map((member, index) => (
              <div key={index} className="flex items-end space-x-3 p-4 bg-muted rounded-lg">
                <div className="flex-1">
                  <Input
                    label={`${currentLanguage === 'fr' ? 'Membre' : 'Member'} ${index + 1}`}
                    type="text"
                    placeholder={currentLanguage === 'fr' ? 'Nom du membre' : 'Member name'}
                    value={member.name}
                    onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                    error={errors[`member_${index}`]}
                    required
                  />
                </div>
                <div className="flex-1">
                  <Select
                    label={currentLanguage === 'fr' ? 'Rôle' : 'Role'}
                    options={roleOptions}
                    value={member.role}
                    onChange={(value) => handleMemberChange(index, 'role', value)}
                  />
                </div>
                {formData.householdMembers.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    iconName="Trash2"
                    onClick={() => removeMember(index)}
                    className="text-error hover:text-error"
                  />
                )}
              </div>
            ))}
          </div>

          {errors.submit && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
              <p className="text-sm text-error">{errors.submit}</p>
            </div>
          )}

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              iconName="ArrowLeft"
              iconPosition="left"
              className="flex-1"
            >
              {currentLanguage === 'fr' ? 'Retour' : 'Back'}
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              iconName="UserPlus"
              iconPosition="left"
              className="flex-1"
            >
              {isLoading 
                ? (currentLanguage === 'fr' ? 'Création...' : 'Creating...')
                : (currentLanguage === 'fr' ? 'Créer le compte' : 'Create Account')
              }
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default RegistrationForm;