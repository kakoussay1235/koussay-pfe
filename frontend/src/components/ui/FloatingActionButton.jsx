import React from 'react';
import Button from './Button';

const FloatingActionButton = ({ 
  onClick, 
  iconName = 'Plus', 
  className = '',
  variant = 'default',
  size = 'default'
}) => {
  return (
    <div className={`fixed bottom-6 right-6 lg:hidden z-100 ${className}`}>
      <Button
        variant={variant}
        size={size}
        iconName={iconName}
        onClick={onClick}
        className="rounded-full shadow-modal hover:shadow-lg transition-all duration-150 w-14 h-14"
      />
    </div>
  );
};

export default FloatingActionButton;