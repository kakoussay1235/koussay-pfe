import React, { useState } from 'react';
import Input from '../../../components/ui/Input';

const DescriptionInput = ({ value, onChange, category, type }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock suggestions based on category and type
  const getSuggestions = (inputValue, category, type) => {
    const expenseSuggestions = {
      food: ['Courses Carrefour', 'Restaurant Le Bistrot', 'Boulangerie du coin', 'Marché local'],
      transport: ['Essence Total', 'Ticket de métro', 'Uber', 'Réparation voiture'],
      housing: ['Loyer appartement', 'Charges copropriété', 'Assurance habitation', 'Travaux'],
      utilities: ['Facture EDF', 'Facture eau', 'Internet Orange', 'Téléphone mobile'],
      healthcare: ['Pharmacie', 'Médecin généraliste', 'Dentiste', 'Mutuelle santé'],
      entertainment: ['Cinéma', 'Concert', 'Streaming Netflix', 'Livre'],
      shopping: ['Vêtements Zara', 'Chaussures', 'Électronique', 'Cadeaux'],
      education: ['Frais scolaires', 'Livres scolaires', 'Cours particuliers', 'Matériel'],
      other: ['Divers', 'Imprévu', 'Autre dépense']
    };

    const incomeSuggestions = {
      salary: ['Salaire mensuel', 'Prime de fin d\'année', 'Heures supplémentaires'],
      freelance: ['Mission consulting', 'Projet web', 'Formation'],
      investment: ['Dividendes', 'Plus-value', 'Intérêts'],
      rental: ['Loyer reçu', 'Location saisonnière'],
      bonus: ['Prime performance', 'Bonus annuel', 'Commission'],
      other: ['Remboursement', 'Cadeau', 'Autre revenu']
    };

    const categoryData = type === 'expense' ? expenseSuggestions : incomeSuggestions;
    const categorySuggestions = categoryData[category] || [];
    
    return categorySuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    
    if (inputValue.length > 0 && category) {
      const newSuggestions = getSuggestions(inputValue, category, type);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="mb-6 relative">
      <Input
        label="Description"
        type="text"
        placeholder="Décrivez la transaction..."
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          if (value.length > 0 && category) {
            const newSuggestions = getSuggestions(value, category, type);
            setSuggestions(newSuggestions);
            setShowSuggestions(newSuggestions.length > 0);
          }
        }}
        onBlur={() => {
          // Delay hiding suggestions to allow click
          setTimeout(() => setShowSuggestions(false), 200);
        }}
        required
      />
      
      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-lg shadow-modal z-10 mt-1">
          <div className="py-1 max-h-48 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-smooth"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DescriptionInput;