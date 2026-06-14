import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface WeightAreaChartProps {
  data: { date: string; label: string; weight: number | null }[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length && payload[0].value != null) {
    return (
      <div className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 py-2 shadow-xl">
        <p className="text-[11px] text-[#A1A1AA]">{label}</p>
        <p className="text-sm font-bold text-[#CCFF00]">{payload[0].value} kg</p>
      </div>
    );
  }
  return null;
}

export function WeightAreaChart({ data }: WeightAreaChartProps) {
  const validData = data.filter((d) => d.weight != null);

  if (validData.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-[#52525B] text-sm">
        No weight data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={validData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#CCFF00" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#CCFF00" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" opacity={0.5} vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#52525B', fontSize: 10 }}
          axisLine={{ stroke: '#2A2A2A' }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: '#52525B', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          domain={['dataMin - 1', 'dataMax + 1']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="weight"
          stroke="#CCFF00"
          strokeWidth={2}
          fill="url(#weightGradient)"
          dot={{ fill: '#CCFF00', strokeWidth: 2, r: 4, stroke: '#050505' }}
          activeDot={{ r: 6, fill: '#CCFF00', stroke: '#FFFFFF', strokeWidth: 2 }}
          animationDuration={1200}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
