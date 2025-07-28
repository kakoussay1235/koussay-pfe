import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ReservedFundsChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-modal">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-muted-foreground">{entry.name}</span>
              </div>
              <span className="text-sm font-medium text-popover-foreground">
                {entry.value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
          ))}
          <div className="border-t border-border mt-2 pt-2">
            <div className="flex justify-between space-x-4">
              <span className="text-sm font-medium text-popover-foreground">Total:</span>
              <span className="text-sm font-medium text-popover-foreground">
                {payload.reduce((sum, entry) => sum + entry.value, 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
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
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorEmergency" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-error)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--color-error)" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorLeisure" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
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
          <Legend />
          <Area
            type="monotone"
            dataKey="emergency"
            stackId="1"
            stroke="var(--color-error)"
            fill="url(#colorEmergency)"
            name="Urgence"
          />
          <Area
            type="monotone"
            dataKey="savings"
            stackId="1"
            stroke="var(--color-success)"
            fill="url(#colorSavings)"
            name="Épargne"
          />
          <Area
            type="monotone"
            dataKey="leisure"
            stackId="1"
            stroke="var(--color-accent)"
            fill="url(#colorLeisure)"
            name="Loisirs"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReservedFundsChart;