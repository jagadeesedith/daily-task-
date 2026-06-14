import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface WeeklyBarChartProps {
  data: { day: string; percentage: number }[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 py-2 shadow-xl">
        <p className="text-[11px] text-[#A1A1AA]">{label}</p>
        <p className="text-sm font-bold text-[#CCFF00]">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
}

export function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="day"
          tick={{ fill: '#A1A1AA', fontSize: 11 }}
          axisLine={{ stroke: '#2A2A2A' }}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="percentage"
          radius={[6, 6, 0, 0]}
          animationDuration={800}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.percentage >= 80 ? '#CCFF00' : '#1A1A1A'}
              stroke={entry.percentage >= 80 ? 'none' : '#2A2A2A'}
              strokeWidth={1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
