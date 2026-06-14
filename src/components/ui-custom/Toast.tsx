import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  isVisible: boolean;
  type?: 'success' | 'info';
}

export function Toast({ message, isVisible, type = 'success' }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`fixed bottom-20 left-4 right-4 z-[90] max-w-[448px] mx-auto px-4 py-3 rounded-xl border shadow-lg ${
            type === 'success'
              ? 'bg-[#0F0F0F] border-[#22C55E]/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
              : 'bg-[#0F0F0F] border-[#CCFF00]/30 shadow-[0_0_20px_rgba(204,255,0,0.1)]'
          }`}
        >
          <p className={`text-sm font-medium text-center ${
            type === 'success' ? 'text-[#22C55E]' : 'text-[#CCFF00]'
          }`}>
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
