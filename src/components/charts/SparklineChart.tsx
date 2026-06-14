import { ResponsiveContainer, Area, AreaChart } from 'recharts';

interface SparklineChartProps {
  data: { value: number }[];
  height?: number;
}

export function SparklineChart({ data, height = 40 }: SparklineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#CCFF00" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#CCFF00" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke="#CCFF00"
          strokeWidth={2}
          fill="url(#sparklineGradient)"
          isAnimationActive={true}
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
