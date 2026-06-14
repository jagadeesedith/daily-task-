import { motion } from 'framer-motion';

interface CustomToggleProps {
  enabled: boolean;
  onToggle: () => void;
  label: string;
  sublabel?: string;
}

export function CustomToggle({ enabled, onToggle, label, sublabel }: CustomToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-3 px-1"
      aria-checked={enabled}
      role="switch"
    >
      <div className="text-left">
        <p className="text-[15px] text-white font-medium">{label}</p>
        {sublabel && <p className="text-[11px] text-[#52525B] mt-0.5">{sublabel}</p>}
      </div>
      <div
        className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
          enabled ? 'bg-[#CCFF00]' : 'bg-[#1A1A1A]'
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`absolute top-1 w-5 h-5 rounded-full shadow-md ${
            enabled ? 'bg-[#050505]' : 'bg-[#52525B]'
          }`}
        />
      </div>
    </button>
  );
}
