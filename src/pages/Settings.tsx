import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, Download, Trash2, AlertTriangle, Bell, X } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { CustomToggle } from '@/components/ui-custom/CustomToggle';
import { GlassModal } from '@/components/ui-custom/GlassModal';

export function Settings() {
  const {
    settings,
    toggleReminder,
    requestNotificationPermission,
    exportData,
    resetAllData,
  } = useSettings();

  const [showResetModal, setShowResetModal] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);
  const [showResetToast, setShowResetToast] = useState(false);
  const [notifWarning, setNotifWarning] = useState(false);

  const handleToggleReminder = useCallback(
    async (index: number) => {
      if (settings.notificationsPermission === 'granted') {
        toggleReminder(index);
      } else if (settings.notificationsPermission === 'denied') {
        setNotifWarning(true);
      } else {
        const result = await requestNotificationPermission();
        if (result === 'granted') {
          toggleReminder(index);
        } else {
          setNotifWarning(true);
        }
      }
    },
    [settings.notificationsPermission, toggleReminder, requestNotificationPermission]
  );

  const handleExport = useCallback(() => {
    exportData();
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 2500);
  }, [exportData]);

  const handleReset = useCallback(() => {
    resetAllData();
    setShowResetModal(false);
    setShowResetToast(true);
    setTimeout(() => setShowResetToast(false), 3000);
  }, [resetAllData]);

  return (
    <div className="space-y-6">
      {/* Export Toast */}
      <AnimatePresence>
        {showExportToast && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-20 left-4 right-4 z-[90] max-w-[448px] mx-auto px-4 py-3 rounded-xl border bg-[#0F0F0F] border-[#CCFF00]/30"
          >
            <p className="text-sm font-medium text-[#CCFF00] text-center">Data exported successfully!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Toast */}
      <AnimatePresence>
        {showResetToast && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-20 left-4 right-4 z-[90] max-w-[448px] mx-auto px-4 py-3 rounded-xl border bg-[#0F0F0F] border-[#22C55E]/30"
          >
            <p className="text-sm font-medium text-[#22C55E] text-center">All data has been reset</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#52525B]/20 flex items-center justify-center">
          <SettingsIcon size={20} className="text-[#A1A1AA]" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Settings</h1>
          <p className="text-[13px] text-[#A1A1AA]">Customize your experience</p>
        </div>
      </div>

      {/* Notification Permission Warning */}
      <AnimatePresence>
        {notifWarning && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl px-4 py-3 flex items-start gap-3">
              <Bell size={16} className="text-[#EF4444] mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[13px] text-[#EF4444] font-medium">Browser notifications are blocked</p>
                <p className="text-[11px] text-[#A1A1AA] mt-1">
                  Enable notifications in your browser settings to receive reminders.
                </p>
              </div>
              <button onClick={() => setNotifWarning(false)} className="flex-shrink-0">
                <X size={14} className="text-[#52525B]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reminders Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Daily Reminders</h2>
          <p className="text-[13px] text-[#A1A1AA] mt-1">Browser notifications at scheduled times</p>
        </div>

        <div className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl divide-y divide-[#2A2A2A]">
          {settings.reminderTimes.map((reminder, index) => (
            <div key={reminder.task} className="px-4">
              <CustomToggle
                enabled={settings.remindersEnabled[index]}
                onToggle={() => handleToggleReminder(index)}
                label={reminder.task}
                sublabel={reminder.time}
              />
            </div>
          ))}
        </div>

        {/* Permission Request Button */}
        {settings.notificationsPermission !== 'granted' && (
          <button
            onClick={requestNotificationPermission}
            className="w-full py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[13px] font-semibold text-[#CCFF00] hover:bg-[#2A2A2A] transition-colors"
          >
            Enable Browser Notifications
          </button>
        )}
      </div>

      {/* Data Management Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">Data</h2>

        <div className="space-y-3">
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl hover:border-[#3A3A3A] transition-colors"
          >
            <Download size={18} className="text-[#A1A1AA]" />
            <span className="text-[14px] text-white font-medium">Export All Data</span>
          </button>

          <button
            onClick={() => setShowResetModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-[#0F0F0F] border border-[#EF4444]/30 rounded-xl hover:border-[#EF4444]/50 transition-colors"
          >
            <Trash2 size={18} className="text-[#EF4444]" />
            <span className="text-[14px] text-[#EF4444] font-medium">Reset All Progress</span>
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="text-center py-6 space-y-2">
        <h3 className="text-lg font-bold text-[#CCFF00]">Jaga Daily Discipline</h3>
        <p className="text-[11px] text-[#52525B] font-mono">v1.0.0</p>
        <p className="text-[13px] text-[#A1A1AA] italic">"Focus on doing, not managing."</p>
      </div>

      {/* Reset Confirmation Modal */}
      <GlassModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset All Progress"
      >
        <div className="flex flex-col items-center text-center py-4 space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#EF4444]/10 flex items-center justify-center">
            <AlertTriangle size={28} className="text-[#EF4444]" />
          </div>
          <div>
            <p className="text-[15px] text-white font-medium">
              This will permanently delete all your data including tasks, streaks, weight history, and study logs.
            </p>
            <p className="text-[13px] text-[#A1A1AA] mt-2">This action cannot be undone.</p>
          </div>
          <div className="flex gap-3 w-full pt-2">
            <button
              onClick={() => setShowResetModal(false)}
              className="flex-1 py-3 rounded-xl text-[13px] font-semibold text-[#A1A1AA] hover:bg-[#1A1A1A] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-3 rounded-xl text-[13px] font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] transition-colors"
            >
              Reset Everything
            </button>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
