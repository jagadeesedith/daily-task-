import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NAV_ITEMS } from '@/utils/constants';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-[#0F0F0F]/90 backdrop-blur-xl border-t border-[#2A2A2A]">
      <div className="max-w-[480px] mx-auto h-full flex items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              whileTap={{ scale: 0.9 }}
              className="relative flex flex-col items-center justify-center w-14 h-14 gap-0.5"
              aria-label={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-[1px] w-6 h-0.5 bg-[#CCFF00] rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={22}
                className={isActive ? 'text-[#CCFF00]' : 'text-[#52525B]'}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span
                className={`text-[10px] font-semibold tracking-wider ${
                  isActive ? 'text-[#CCFF00]' : 'text-[#52525B]'
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
