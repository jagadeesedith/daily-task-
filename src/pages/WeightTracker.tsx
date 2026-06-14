import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Check, Scale } from 'lucide-react';
import { useWeightHistory } from '@/hooks/useWeightHistory';
import { WeightAreaChart } from '@/components/charts/WeightAreaChart';
import { Toast } from '@/components/ui-custom/Toast';
import { formatDateLabel } from '@/utils/dateHelpers';

export function WeightTracker() {
  const { latestWeight, weightTrend, chartData, recentEntries, addEntry, hasTodayEntry } = useWeightHistory();
  const [inputWeight, setInputWeight] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(() => {
    const weight = parseFloat(inputWeight);
    if (isNaN(weight) || weight <= 0) return;

    addEntry(weight);
    setInputWeight('');
    setSaved(true);
    setShowToast(true);

    setTimeout(() => setSaved(false), 1500);
    setTimeout(() => setShowToast(false), 2500);
  }, [inputWeight, addEntry]);

  return (
    <div className="space-y-6">
      <Toast message="Weight saved successfully!" isVisible={showToast} />

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 flex items-center justify-center">
          <Scale size={20} className="text-[#8B5CF6]" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Weight Tracker</h1>
          <p className="text-[13px] text-[#A1A1AA]">Track your daily weight</p>
        </div>
      </div>

      {/* Current Weight Display */}
      <div className="text-center py-4">
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-5xl font-black text-white tracking-tighter">
            {latestWeight?.toFixed(1) || '--'}
          </span>
          <span className="text-xl font-semibold text-[#A1A1AA]">kg</span>
        </div>
        {weightTrend && (
          <div
            className={`inline-flex items-center gap-1 mt-3 px-3 py-1.5 rounded-full ${
              weightTrend.isLoss
                ? 'bg-[#22C55E]/10 text-[#22C55E]'
                : 'bg-[#EF4444]/10 text-[#EF4444]'
            }`}
          >
            {weightTrend.isLoss ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            <span className="text-[13px] font-semibold">
              {weightTrend.isLoss ? '' : '+'}{weightTrend.change} kg this week
            </span>
          </div>
        )}
      </div>

      {/* Weight Input */}
      {!hasTodayEntry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl p-4"
        >
          <p className="text-[13px] text-[#A1A1AA] mb-3">Enter today's weight</p>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="number"
                step="0.1"
                value={inputWeight}
                onChange={(e) => setInputWeight(e.target.value)}
                placeholder="--"
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xl font-bold text-white placeholder-[#52525B] focus:outline-none focus:border-[#CCFF00] transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#52525B] text-sm font-medium">
                kg
              </span>
            </div>
            <motion.button
              onClick={handleSave}
              whileTap={{ scale: 0.95 }}
              disabled={!inputWeight || parseFloat(inputWeight) <= 0}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                saved
                  ? 'bg-[#22C55E]'
                  : 'bg-[#CCFF00] hover:bg-[#B8E600] disabled:opacity-30 disabled:cursor-not-allowed'
              }`}
            >
              <Check size={20} className={saved ? 'text-white' : 'text-[#050505]'} />
            </motion.button>
          </div>
        </motion.div>
      )}

      {hasTodayEntry && (
        <div className="bg-[#0F0F0F] border border-[#22C55E]/30 rounded-2xl p-4 text-center">
          <p className="text-[#22C55E] font-semibold">Today's weight already recorded!</p>
        </div>
      )}

      {/* Weight History Chart */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white tracking-tight">30-Day Trend</h2>
        <div className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl p-4">
          <WeightAreaChart data={chartData} />
        </div>
      </div>

      {/* Recent Entries */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white tracking-tight">Recent Entries</h2>
        <div className="space-y-2">
          {recentEntries.map((entry, index) => {
            const isToday = index === 0 && hasTodayEntry;
            return (
              <motion.div
                key={entry.date}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl ${
                  isToday
                    ? 'bg-[#0F0F0F] border-l-[3px] border-l-[#CCFF00] border border-[#2A2A2A]'
                    : 'bg-[#0F0F0F] border border-[#2A2A2A]'
                }`}
              >
                <span className="text-[13px] text-[#A1A1AA]">{formatDateLabel(entry.date)}</span>
                <span className="text-[15px] font-bold text-white">{entry.weight.toFixed(1)} kg</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
