import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const IncomeChart = () => {
  const incomeData = [
    { month: 'Jan', income: 4200, expenses: 3100 },
    { month: 'Fév', income: 4500, expenses: 3300 },
    { month: 'Mar', income: 4200, expenses: 3200 },
    { month: 'Avr', income: 4800, expenses: 3400 },
    { month: 'Mai', income: 4600, expenses: 3500 },
    { month: 'Jun', income: 4700, expenses: 3200 },
    { month: 'Jul', income: 4900, expenses: 3600 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-modal">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        Évolution Revenus vs Dépenses
      </h3>
      <div className="h-64 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={incomeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `${value}€`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="var(--color-success)" 
              strokeWidth={2}
              name="Revenus"
              dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="var(--color-error)" 
              strokeWidth={2}
              name="Dépenses"
              dot={{ fill: 'var(--color-error)', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeChart;