import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const BudgetChart = ({ chartData, chartType, onChartTypeChange }) => {
  const COLORS = ['#1E3A8A', '#0F766E', '#F59E0B', '#DC2626', '#059669', '#D97706', '#7C3AED', '#EC4899'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-modal p-3">
          <p className="text-sm font-medium text-card-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-muted-foreground">{entry.dataKey}</span>
              </div>
              <span className="text-sm font-medium text-card-foreground">
                €{entry.value.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-card border border-border rounded-lg shadow-modal p-3">
          <p className="text-sm font-medium text-card-foreground">{data.payload.name}</p>
          <p className="text-sm text-muted-foreground">
            €{data.value.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ({((data.value / chartData.reduce((sum, item) => sum + item.spent, 0)) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card p-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-card-foreground">Budget Analysis</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onChartTypeChange('bar')}
            className={`p-2 rounded-md transition-smooth ${
              chartType === 'bar' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:text-card-foreground'
            }`}
          >
            <Icon name="BarChart3" size={16} />
          </button>
          <button
            onClick={() => onChartTypeChange('pie')}
            className={`p-2 rounded-md transition-smooth ${
              chartType === 'pie' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:text-card-foreground'
            }`}
          >
            <Icon name="PieChart" size={16} />
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tick={{ fill: 'var(--color-muted-foreground)' }}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tick={{ fill: 'var(--color-muted-foreground)' }}
                tickFormatter={(value) => `€${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="budgetLimit" 
                fill="var(--color-muted)" 
                name="Budget Limit"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="spent" 
                fill="var(--color-primary)" 
                name="Spent"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="spent"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-4">
        {chartData.slice(0, 6).map((item, index) => (
          <div key={item.id} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: chartType === 'pie' ? COLORS[index % COLORS.length] : 'var(--color-primary)' }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                €{item.spent.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetChart;