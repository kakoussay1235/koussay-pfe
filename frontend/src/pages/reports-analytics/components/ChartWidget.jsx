import React from 'react';
import Icon from '../../../components/AppIcon';

const ChartWidget = ({ 
  title, 
  children, 
  onExport, 
  onFullscreen, 
  isLoading = false,
  className = '' 
}) => {
  return (
    <div className={`bg-card rounded-lg border border-border shadow-card ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        <div className="flex items-center space-x-2">
          {onExport && (
            <button
              onClick={onExport}
              className="p-2 rounded-md hover:bg-muted transition-smooth"
              title="Export Chart"
            >
              <Icon name="Download" size={16} className="text-muted-foreground" />
            </button>
          )}
          {onFullscreen && (
            <button
              onClick={onFullscreen}
              className="p-2 rounded-md hover:bg-muted transition-smooth"
              title="Fullscreen"
            >
              <Icon name="Maximize2" size={16} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default ChartWidget;