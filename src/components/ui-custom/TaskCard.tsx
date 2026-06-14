import { motion } from 'framer-motion';
import { ICON_MAP } from '@/utils/constants';
import { formatTime } from '@/utils/dateHelpers';
import type { TaskItem } from '@/types';

interface TaskCardProps {
  task: TaskItem;
  onToggle: (taskId: string) => void;
  index: number;
}

export function TaskCard({ task, onToggle, index }: TaskCardProps) {
  const IconComponent = ICON_MAP[task.icon] || ICON_MAP['LayoutDashboard'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
      className={`relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${
        task.completed
          ? 'bg-[#0F0F0F] border-[#22C55E]/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
          : 'bg-[#0F0F0F] border-[#2A2A2A] hover:border-[#3A3A3A]'
      }`}
    >
      {/* Icon Circle */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${task.iconColor}15` }}
      >
        <IconComponent size={20} style={{ color: task.iconColor }} />
      </div>

      {/* Text Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-[15px] font-medium truncate ${
            task.completed ? 'text-[#A1A1AA] line-through' : 'text-white'
          }`}
        >
          {task.name}
        </p>
        <p className="text-[11px] text-[#52525B] tracking-wide">{task.subtitle}</p>
        {task.completedAt && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-[11px] text-[#22C55E] mt-0.5"
          >
            Completed {formatTime(task.completedAt)}
          </motion.p>
        )}
      </div>

      {/* Checkbox */}
      <motion.button
        onClick={() => onToggle(task.id)}
        whileTap={{ scale: 0.9 }}
        className="flex-shrink-0"
        aria-checked={task.completed}
        role="checkbox"
        aria-label={`Mark ${task.name} as ${task.completed ? 'incomplete' : 'complete'}`}
      >
        <motion.div
          animate={task.completed ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors duration-150 ${
            task.completed
              ? 'bg-[#22C55E] border-[#22C55E] shadow-[0_0_15px_rgba(34,197,94,0.4)]'
              : 'border-[#3A3A3A] bg-transparent'
          }`}
        >
          {task.completed && (
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.2 }}
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <motion.path
                d="M3 7L6 10L11 4"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.15, delay: 0.05 }}
              />
            </motion.svg>
          )}
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
