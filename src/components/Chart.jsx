import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Chart = ({ data, dataKey, name, color = 'rgba(37, 150, 190, 1)', height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
        <XAxis 
          dataKey="name" 
          stroke="#1E293B"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#1E293B"
          style={{ fontSize: '12px' }}
        />
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
          wrapperStyle={{ direction: 'rtl', textAlign: 'right' }}
          iconType="line"
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          name={name}
          stroke={color}
          strokeWidth={3}
          dot={{ fill: color, r: 5 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;

