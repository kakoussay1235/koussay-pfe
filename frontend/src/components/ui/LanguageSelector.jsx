import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Select from './Select';

const LanguageSelector = ({ variant = "default", className = "" }) => {
  const { currentLanguage, changeLanguage, getAvailableLanguages } = useLanguage();

  const languageOptions = getAvailableLanguages().map(lang => ({
    value: lang.code,
    label: `${lang.flag} ${lang.name}`
  }));

  return (
    <Select
      value={currentLanguage}
      onChange={changeLanguage}
      options={languageOptions}
      variant={variant}
      className={className}
      aria-label="Select language"
    />
  );
};

export default LanguageSelector;