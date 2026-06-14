import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useDailyTasks } from '@/hooks/useDailyTasks';
import { useStreak } from '@/hooks/useStreak';
import { TaskCard } from '@/components/ui-custom/TaskCard';
import { ScoreRing } from '@/components/ui-custom/ScoreRing';
import { Confetti } from '@/components/ui-custom/Confetti';
import { Toast } from '@/components/ui-custom/Toast';

export function Dashboard() {
  const {
    tasks,
    toggleTask,
    completedCount,
    totalCount,
    percentage,
    isAllComplete,
    displayDate,
    newDayToast,
  } = useDailyTasks();

  const { streak, recordProductiveDay } = useStreak();
  const [showConfetti, setShowConfetti] = useState(false);
  const [prevAllComplete, setPrevAllComplete] = useState(false);

  // Trigger confetti when all tasks complete
  useEffect(() => {
    if (isAllComplete && !prevAllComplete) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
    setPrevAllComplete(isAllComplete);
  }, [isAllComplete, prevAllComplete]);

  // Record streak when tasks are completed
  const handleToggle = useCallback((taskId: string) => {
    toggleTask(taskId);
    // Check if this toggle will make it productive
    const task = tasks.find((t) => t.id === taskId);
    if (task && !task.completed) {
      // Task is being checked
      const willBeCompleted = completedCount + 1;
      if (willBeCompleted >= 6) {
        setTimeout(() => recordProductiveDay(willBeCompleted, totalCount), 100);
      }
    }
  }, [toggleTask, tasks, completedCount, totalCount, recordProductiveDay]);

  return (
    <div className="space-y-6">
      <Confetti isActive={showConfetti} />

      {/* New Day Toast */}
      <Toast
        message="New day, new discipline!"
        isVisible={newDayToast}
        type="info"
      />

      {/* Header: Streak Badge + Score Ring */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {/* Streak Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A1A1A] border border-[#2A2A2A]">
            <Flame size={14} className="text-[#CCFF00]" />
            <span className="text-[11px] font-bold text-[#CCFF00] uppercase tracking-widest">
              {streak.current} DAY STREAK
            </span>
          </div>
          {/* Date */}
          <p className="text-[13px] text-[#A1A1AA] pl-1">{displayDate}</p>
        </div>

        {/* Score Ring */}
        <ScoreRing percentage={percentage} size={64} />
      </div>

      {/* Daily Score Summary */}
      <div className="flex items-center gap-3 bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl p-4">
        <div className="flex-1">
          <p className="text-[13px] text-[#A1A1AA]">
            <span className="text-white font-bold">{completedCount}</span> of{' '}
            <span className="text-white font-bold">{totalCount}</span> completed
          </p>
          <div className="mt-2 h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#CCFF00] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-[#CCFF00]">
            {completedCount}/{totalCount}
          </p>
          <p className="text-[10px] text-[#52525B] uppercase tracking-wider">Daily Score</p>
        </div>
      </div>

      {/* Completion Banner */}
      <AnimatePresence>
        {isAllComplete && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-[#CCFF00] rounded-2xl px-4 py-3 text-center">
              <p className="text-sm font-bold text-[#050505]">
                All tasks complete! Streak continues!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task List */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white tracking-tight">Today's Checklist</h2>
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleToggle}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
