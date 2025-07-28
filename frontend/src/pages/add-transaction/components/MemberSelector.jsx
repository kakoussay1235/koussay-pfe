import React from 'react';
import Select from '../../../components/ui/Select';

const MemberSelector = ({ value, onChange, error }) => {
  const familyMembers = [
    { 
      value: 'marie', 
      label: 'Marie Dubois', 
      description: 'Épouse',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    { 
      value: 'pierre', 
      label: 'Pierre Dubois', 
      description: 'Époux',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    { 
      value: 'sophie', 
      label: 'Sophie Dubois', 
      description: 'Fille (16 ans)',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    },
    { 
      value: 'lucas', 
      label: 'Lucas Dubois', 
      description: 'Fils (12 ans)',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }
  ];

  return (
    <div className="mb-6">
      <Select
        label="Membre de la famille"
        placeholder="Sélectionner un membre"
        options={familyMembers}
        value={value}
        onChange={onChange}
        error={error}
        required
        searchable
      />
    </div>
  );
};

export default MemberSelector;