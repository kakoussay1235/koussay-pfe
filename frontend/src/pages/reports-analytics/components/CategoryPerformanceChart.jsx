import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CategoryPerformanceChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-modal">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex justify-between space-x-4">
              <span className="text-sm text-muted-foreground">Budget:</span>
              <span className="text-sm font-medium text-popover-foreground">
                {data.payload.budget.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-sm text-muted-foreground">Dépensé:</span>
              <span className="text-sm font-medium text-popover-foreground">
                {data.value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-sm text-muted-foreground">Restant:</span>
              <span className={`text-sm font-medium ${
                (data.payload.budget - data.value) >= 0 ? 'text-success' : 'text-error'
              }`}>
                {(data.payload.budget - data.value).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="category" 
            stroke="var(--color-muted-foreground)"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="var(--color-muted-foreground)"
            fontSize={12}
            tickFormatter={(value) => `${value}€`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="spent" 
            fill="var(--color-primary)"
            radius={[4, 4, 0, 0]}
            name="Dépensé"
          />
          <Bar 
            dataKey="budget" 
            fill="var(--color-muted)"
            radius={[4, 4, 0, 0]}
            name="Budget"
            opacity={0.3}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPerformanceChart;