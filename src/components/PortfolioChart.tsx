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

// High-contrast KB-inspired palette
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
  
  // Calculate total for percentage if percent prop is missing
  const totalValue = data.reduce((sum: number, item: ChartData) => sum + item.value, 0);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, name, index }: any) => {
    // If percent is not provided by Recharts, calculate it
    const displayPercent = percent ? percent : (value / totalValue);
    const percentText = `${(displayPercent * 100).toFixed(0)}%`;
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // For very small slices, push label outside
    const isSmall = displayPercent < 0.08;

    if (isSmall) {
      const labelRadius = outerRadius * 1.25;
      const lx = cx + labelRadius * Math.cos(-midAngle * RADIAN);
      const ly = cy + labelRadius * Math.sin(-midAngle * RADIAN);
      return (
        <text 
          x={lx} 
          y={ly} 
          fill="#666" 
          textAnchor={lx > cx ? 'start' : 'end'} 
          dominantBaseline="central" 
          className="text-[10px] font-bold"
        >
          {`${name} ${percentText}`}
        </text>
      );
    }

    // Determine text color based on slice brightness (KB Gold is bright)
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
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 px-1">
        <h4 className="text-sm font-black text-gray-800 flex items-center space-x-2">
          <div className="w-1 h-3 bg-[var(--color-kb-gold)] rounded-full"></div>
          <span>{title}</span>
        </h4>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Chart Area */}
        <div className="h-[260px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
                animationBegin={0}
                animationDuration={1500}
              >
                {data.map((_, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="pointer-events-none">
                <tspan x="50%" dy="-0.5em" className="text-[9px] fill-gray-400 font-bold">구성 비중</tspan>
                <tspan x="50%" dy="1.2em" className="text-base fill-gray-800 font-black italic">100%</tspan>
              </text>
              <Tooltip 
                formatter={(value: any, name: any) => [
                  <span className="font-black text-[var(--color-kb-dark)]">{value}%</span>,
                  <span className="text-gray-500 font-bold">{name}</span>
                ]}
                contentStyle={{ 
                  borderRadius: '1.2rem', 
                  border: '1px solid #F3F4F6', 
                  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                  padding: '12px 16px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table Area */}
        <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar">
          {data.map((item: ChartData, index: number) => (
            <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl bg-white border border-gray-50 shadow-sm hover:border-[var(--color-kb-gold)] transition-all group">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full shadow-inner ring-2 ring-white" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-[11px] font-bold text-gray-700 group-hover:text-gray-900">{item.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-black text-[var(--color-kb-dark)] bg-[#FFFDE7] px-2.5 py-1 rounded-lg">
                  {item.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
