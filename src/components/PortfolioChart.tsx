import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface PortfolioChartProps {
  title: string;
  data: ChartData[];
}

const COLORS = [
  '#FFCC00', // KB Gold
  '#333333', // KB Deep Gray
  '#FF9900', // Orange Accent
  '#555555', // Medium Gray
  '#FFD633', // Light Gold
  '#1A1A1A', // Near Black
  '#FFB300', // Amber Gold
  '#777777', // Light Gray
];

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ title, data }) => {
  const RADIAN = Math.PI / 180;
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, name, index }: any) => {
    const displayPercent = percent ? percent : (value / totalValue);
    const percentText = `${(displayPercent * 100).toFixed(0)}%`;
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    const isSmall = displayPercent < 0.12;

    if (isSmall) {
      const labelRadius = outerRadius * 1.15;
      const lx = cx + labelRadius * Math.cos(-midAngle * RADIAN);
      const ly = cy + labelRadius * Math.sin(-midAngle * RADIAN);
      return (
        <text 
          x={lx} 
          y={ly} 
          fill="#4B5563" 
          textAnchor={lx > cx ? 'start' : 'end'} 
          dominantBaseline="central" 
          className="text-[10px] font-black"
        >
          {percentText}
        </text>
      );
    }

    const textColor = (index % COLORS.length === 0 || index % COLORS.length === 4) ? '#333' : 'white';

    return (
      <text 
        x={x} 
        y={y} 
        fill={textColor} 
        textAnchor="middle" 
        dominantBaseline="central" 
        className="text-[11px] font-black"
      >
        {percentText}
      </text>
    );
  };

  return (
    <div className="w-full flex flex-col items-center h-auto">
      <div className="w-full flex items-center mb-6 px-1">
        <h4 className="text-sm font-black text-gray-800 flex items-center space-x-2">
          <div className="w-1 h-3 bg-gradient-to-b from-[var(--color-kb-gold)] to-[var(--color-kb-gold-dark)] rounded-full"></div>
          <span>{title}</span>
        </h4>
      </div>
      
      {/* Chart Main Area - Fixed relative height for SVG but parent container is auto */}
      <div className="w-full h-[240px] relative mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
              labelLine={false}
              label={renderCustomizedLabel}
              animationBegin={0}
              animationDuration={1200}
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke="white"
                  strokeWidth={3}
                />
              ))}
            </Pie>
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="pointer-events-none">
              <tspan x="50%" dy="-0.5em" className="text-[9px] fill-gray-400 font-bold">합계</tspan>
              <tspan x="50%" dy="1.2em" className="text-base fill-gray-800 font-black">100%</tspan>
            </text>
            <Tooltip 
              formatter={(value: any, name: any) => [
                <span className="font-black text-[var(--color-kb-dark)]">{value}%</span>,
                <span className="text-gray-500 font-bold">{name}</span>
              ]}
              contentStyle={{ 
                borderRadius: '1.5rem', 
                border: 'none', 
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                padding: '12px 16px',
                zIndex: 50
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Integrated Legend: No max-height, flows naturally */}
      <div className="w-full flex flex-wrap justify-center gap-2">
        {data.map((item, index) => (
          <div 
            key={item.name} 
            className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-white border border-gray-100 shadow-sm hover:border-[var(--color-kb-gold)] transition-all cursor-default group"
          >
            <div 
              className="w-2.5 h-2.5 rounded-full shadow-sm" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <span className="text-[10px] font-black text-gray-700 group-hover:text-gray-900 whitespace-nowrap">{item.name}</span>
            <span className="text-[10px] font-black text-[var(--color-kb-dark)] opacity-70">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
