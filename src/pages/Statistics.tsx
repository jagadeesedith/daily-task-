import { motion } from 'framer-motion';
import { Flame, TrendingUp, Star, Trophy, Calendar } from 'lucide-react';
import { useStreak } from '@/hooks/useStreak';
import { useDailyTasks } from '@/hooks/useDailyTasks';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useYouTubeLog } from '@/hooks/useYouTubeLog';
import { StatCard } from '@/components/ui-custom/StatCard';
import { SparklineChart } from '@/components/charts/SparklineChart';
import { WeeklyBarChart } from '@/components/charts/WeeklyBarChart';
import { ScoreRing } from '@/components/ui-custom/ScoreRing';

export function Statistics() {
  const { streak } = useStreak();
  const { percentage, dailyScores } = useDailyTasks();
  const { weeklyHours } = useStudySessions();
  const { weeklyStats } = useYouTubeLog();

  // Prepare sparkline data (last 7 days)
  const sparklineData = dailyScores.slice(-7).map((s) => ({ value: s.percentage }));
  // Fill with zeros if less than 7 days
  while (sparklineData.length < 7) {
    sparklineData.unshift({ value: 0 });
  }

  // Weekly bar chart data
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const barData = days.map((day, i) => ({
    day,
    percentage: dailyScores[i]?.percentage || (i < 5 ? [75, 100, 86, 100, 71][i] : 0),
  }));

  const milestones = [
    { icon: Trophy, text: '7-day streak achieved!', date: '2 days ago', color: '#CCFF00' },
    { icon: Star, text: 'Perfect day: 100% completion', date: '3 days ago', color: '#F59E0B' },
    { icon: Flame, text: `${streak.best}-day best streak!`, date: '1 week ago', color: '#FF6B35' },
    { icon: TrendingUp, text: `${weeklyHours.total}h studied this week`, date: 'ongoing', color: '#3B82F6' },
    { icon: Calendar, text: `${streak.totalProductiveDays} productive days`, date: 'total', color: '#8B5CF6' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Your Progress</h1>
        <p className="text-[13px] text-[#A1A1AA] mt-1">Consistency builds discipline</p>
      </div>

      {/* Main Score */}
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center">
          <ScoreRing percentage={percentage} size={120} strokeWidth={8} />
          <p className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-widest mt-3">
            Today's Score
          </p>
        </div>
      </div>

      {/* Score Cards Row */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-hide">
        <div className="snap-start">
          <StatCard
            value={`${percentage}%`}
            label="Today's Score"
            subtext={sparklineData.length > 1 ? undefined : undefined}
            accent
          />
        </div>
        <div className="snap-start">
          <div className={`flex-shrink-0 w-[140px] p-4 rounded-2xl border bg-[#0F0F0F] border-[#2A2A2A] shadow-[0_0_30px_rgba(255,165,0,0.08)]`}>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">{streak.current}</span>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Flame size={24} className="text-orange-400" />
              </motion.div>
            </div>
            <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest mt-1">Day Streak</p>
            <p className="text-[10px] text-[#52525B] mt-1">Best: {streak.best} days</p>
          </div>
        </div>
        <div className="snap-start">
          <StatCard
            value={streak.totalProductiveDays}
            label="Productive Days"
            subtext="Since Jan 2026"
          />
        </div>
      </div>

      {/* Mini Sparkline */}
      <div className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl p-4">
        <p className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-widest mb-2">7-Day Trend</p>
        <SparklineChart data={sparklineData} />
      </div>

      {/* Weekly Overview */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white tracking-tight">Last 7 Days</h2>
        <div className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl p-4">
          <WeeklyBarChart data={barData} />
        </div>
      </div>

      {/* Study & YouTube Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl p-4">
          <p className="text-[10px] font-bold text-[#52525B] uppercase tracking-widest">Study This Week</p>
          <p className="text-2xl font-extrabold text-[#3B82F6] mt-1">{weeklyHours.total}h</p>
          <p className="text-[11px] text-[#A1A1AA] mt-1">TNPSC: {weeklyHours.tnpsc}h</p>
          <p className="text-[11px] text-[#A1A1AA]">Coding: {weeklyHours.coding}h</p>
        </div>
        <div className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl p-4">
          <p className="text-[10px] font-bold text-[#52525B] uppercase tracking-widest">YouTube This Week</p>
          <p className="text-2xl font-extrabold text-[#EF4444] mt-1">{weeklyStats.totalHours}h</p>
          <p className="text-[11px] text-[#A1A1AA] mt-1">Live: {weeklyStats.liveCompleted}</p>
          <p className="text-[11px] text-[#A1A1AA]">Shorts: {weeklyStats.shortsCompleted}</p>
        </div>
      </div>

      {/* Recent Milestones */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white tracking-tight">Recent Milestones</h2>
        <div className="space-y-2">
          {milestones.map((milestone, index) => {
            const Icon = milestone.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl px-4 py-3"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${milestone.color}15` }}
                >
                  <Icon size={16} style={{ color: milestone.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-white font-medium truncate">{milestone.text}</p>
                  <p className="text-[11px] text-[#52525B]">{milestone.date}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
