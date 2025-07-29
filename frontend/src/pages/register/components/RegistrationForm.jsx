import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { register } from '../../../services/authService';
import dataService from '../../../services/dataService'; 
const RegistrationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    language: 'en',
    currency: 'EUR',
    householdMembers: [{ name: '', role: 'husband' }],
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  });

  // Options arrays (simplified for demo)
  const languageOptions = [
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'English' },
  ];
  const currencyOptions = [
    { value: 'TND', label: 'Tunisian Dinar (د.ت)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'GBP', label: 'British Pound (£)' },
  ];
  const roleOptions = [
    { value: 'husband', label: 'Husband' },
    { value: 'wife', label: 'Wife' },
    { value: 'child', label: 'Child' },
    { value: 'other', label: 'Other' },
  ];

  // Password validation function
  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    const score = Object.values(requirements).filter(Boolean).length;
    setPasswordStrength({ score, requirements });
    return score >= 4;
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === 'password') validatePassword(value);

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Household member handlers
  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.householdMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFormData((prev) => ({ ...prev, householdMembers: updatedMembers }));
  };

  const addMember = () => {
    if (formData.householdMembers.length < 6) {
      setFormData((prev) => ({
        ...prev,
        householdMembers: [...prev.householdMembers, { name: '', role: 'child' }],
      }));
    }
  };

  const removeMember = (index) => {
    if (formData.householdMembers.length > 1) {
      const updated = formData.householdMembers.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, householdMembers: updated }));
    }
  };

  // Validation per step
  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (!validatePassword(formData.password)) newErrors.password = 'Password is too weak';

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    formData.householdMembers.forEach((member, idx) => {
      if (!member.name.trim()) newErrors[`member_${idx}`] = 'Member name is required';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step navigation handlers
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

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Prepare data without confirmPassword & householdMembers
      const { confirmPassword, householdMembers, ...registrationData } = formData;

      await register(registrationData);

      // Save household members
      for (const member of householdMembers) {
        await dataService.addMember(member);
      }

      navigate('/dashboard');
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength helper
  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return 'bg-red-500';
    if (passwordStrength.score <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 2) return 'Weak';
    if (passwordStrength.score <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto p-4">
      {/* Progress */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}
        >
          {currentStep > 1 ? <Icon name="Check" size={16} /> : '1'}
        </div>
        <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}
        >
          2
        </div>
      </div>

      {/* Step 1 */}
      {currentStep === 1 && (
        <>
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            error={errors.fullName}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Create a secure password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={errors.password}
            required
          />
          {formData.password && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Password strength:</span>
                <span className={`font-semibold ${getPasswordStrengthColor()}`}>
                  {getPasswordStrengthText()}
                </span>
              </div>
              <div className="w-full bg-gray-300 rounded h-2 mb-4">
                <div
                  className={`h-2 rounded ${getPasswordStrengthColor()}`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            required
          />
          <Button type="button" onClick={handleNextStep} className="w-full">
            Continue
          </Button>
        </>
      )}

      {/* Step 2 */}
      {currentStep === 2 && (
        <>
          <Select
            label="Preferred Language"
            options={languageOptions}
            value={formData.language}
            onChange={(value) => handleInputChange('language', value)}
          />
          <Select
            label="Currency"
            options={currencyOptions}
            value={formData.currency}
            onChange={(value) => handleInputChange('currency', value)}
          />

          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Household Members</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMember}
                disabled={formData.householdMembers.length >= 6}
              >
                Add Member
              </Button>
            </div>

            {formData.householdMembers.map((member, idx) => (
              <div key={idx} className="flex space-x-3 mb-3 items-end">
                <div className="flex-1">
                  <Input
                    label={`Member ${idx + 1}`}
                    type="text"
                    placeholder="Member name"
                    value={member.name}
                    onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                    error={errors[`member_${idx}`]}
                    required
                  />
                </div>
                <div className="flex-1">
                  <Select
                    label="Role"
                    options={roleOptions}
                    value={member.role}
                    onChange={(value) => handleMemberChange(idx, 'role', value)}
                  />
                </div>
                {formData.householdMembers.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeMember(idx)}
                    className="text-red-600"
                  >
                    <Icon name="Trash2" size={20} />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {errors.submit && (
            <div className="text-red-600 mb-3">{errors.submit}</div>
          )}

          <div className="flex space-x-4">
            <Button type="button" variant="outline" onClick={handlePrevStep} className="flex-1">
              Back
            </Button>
            <Button type="submit" loading={isLoading} className="flex-1">
              {isLoading ? 'Creating...' : 'Create Account'}
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default RegistrationForm;
