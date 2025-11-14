import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['rgba(37, 150, 190, 1)', 'rgba(37, 150, 190, 0.9)', 'rgba(37, 150, 190, 0.8)', 'rgba(37, 150, 190, 0.7)', 'rgba(37, 150, 190, 0.6)', 'rgba(37, 150, 190, 0.5)'];

const PieChart = ({ data, dataKey = 'value', nameKey = 'name', height = 300 }) => {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: '14px', fontWeight: 600 }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey={dataKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '12px',
            padding: '10px',
            direction: 'rtl',
            textAlign: 'right',
          }}
          labelStyle={{ color: '#000000', fontWeight: 600 }}
        />
        <Legend
          wrapperStyle={{ direction: 'rtl', textAlign: 'right', paddingTop: '20px' }}
          iconType="circle"
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;

