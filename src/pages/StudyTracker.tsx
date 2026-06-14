import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, ChevronDown, Clock } from 'lucide-react';
import { useStudySessions } from '@/hooks/useStudySessions';
import { TNPSC_SUBJECTS, CODING_TOPICS } from '@/utils/constants';
import { formatDateLabel } from '@/utils/dateHelpers';
import { GlassModal } from '@/components/ui-custom/GlassModal';
import { Toast } from '@/components/ui-custom/Toast';

type TabType = 'tnpsc' | 'coding';

export function StudyTracker() {
  const { weeklyHours, monthlyHours, recentSessions, addSession } = useStudySessions();
  const [activeTab, setActiveTab] = useState<TabType>('tnpsc');
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  // Form state
  const [subject, setSubject] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [notes, setNotes] = useState('');

  const subjects = activeTab === 'tnpsc' ? TNPSC_SUBJECTS : CODING_TOPICS;

  const handleOpenModal = useCallback((preselectedSubject?: string) => {
    setSubject(preselectedSubject || subjects[0]);
    setHours('');
    setMinutes('');
    setNotes('');
    setShowModal(true);
  }, [subjects]);

  const handleSave = useCallback(() => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    if (h === 0 && m === 0) return;

    addSession(activeTab, subject, h, m, notes);
    setShowModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }, [activeTab, subject, hours, minutes, notes, addSession]);

  const toggleDateExpand = useCallback((date: string) => {
    setExpandedDates((prev) => {
      const next = new Set(prev);
      if (next.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }
      return next;
    });
  }, []);

  // Group sessions by date
  const sessionsByDate = recentSessions.reduce((acc, session) => {
    if (session.type !== activeTab) return acc;
    if (!acc[session.date]) acc[session.date] = [];
    acc[session.date].push(session);
    return acc;
  }, {} as Record<string, typeof recentSessions>);

  const tabData = activeTab === 'tnpsc'
    ? { title: 'TNPSC Study', summary1: `${weeklyHours.tnpsc}h this week`, summary2: `${monthlyHours.tnpsc}h this month`, color: '#3B82F6' }
    : { title: 'Coding Practice', summary1: `${weeklyHours.coding}h this week`, summary2: `${monthlyHours.coding}h this month`, color: '#10B981' };

  return (
    <div className="space-y-6">
      <Toast message="Session logged successfully!" isVisible={showToast} />

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/15 flex items-center justify-center">
          <BookOpen size={20} className="text-[#3B82F6]" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Study Tracker</h1>
          <p className="text-[13px] text-[#A1A1AA]">Log your learning sessions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative flex bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl p-1">
        <motion.div
          layoutId="tab-underline"
          className="absolute bottom-1 h-0.5 bg-[#CCFF00] rounded-full"
          style={{
            width: 'calc(50% - 8px)',
            left: activeTab === 'tnpsc' ? '4px' : 'calc(50% + 4px)',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
        <button
          onClick={() => setActiveTab('tnpsc')}
          className={`flex-1 py-2.5 text-[13px] font-semibold rounded-lg transition-colors ${
            activeTab === 'tnpsc' ? 'text-white' : 'text-[#52525B]'
          }`}
        >
          TNPSC Study
        </button>
        <button
          onClick={() => setActiveTab('coding')}
          className={`flex-1 py-2.5 text-[13px] font-semibold rounded-lg transition-colors ${
            activeTab === 'coding' ? 'text-white' : 'text-[#52525B]'
          }`}
        >
          Coding Practice
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
        >
          {/* Summary */}
          <div className="flex gap-3">
            <div className="flex-1 bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold text-[#52525B] uppercase tracking-widest">This Week</p>
              <p className="text-2xl font-extrabold mt-1" style={{ color: tabData.color }}>
                {tabData.summary1}
              </p>
            </div>
            <div className="flex-1 bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold text-[#52525B] uppercase tracking-widest">This Month</p>
              <p className="text-2xl font-extrabold text-white mt-1">{tabData.summary2}</p>
            </div>
          </div>

          {/* Quick-add Subject Pills */}
          <div className="space-y-2">
            <p className="text-[13px] text-[#A1A1AA]">Quick log — tap a subject</p>
            <div className="flex flex-wrap gap-2">
              {subjects.map((s) => (
                <button
                  key={s}
                  onClick={() => handleOpenModal(s)}
                  className="px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl text-[13px] text-white hover:border-[#CCFF00]/50 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Session History */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Sessions</h2>
            <div className="space-y-2">
              {Object.entries(sessionsByDate).length === 0 && (
                <p className="text-[13px] text-[#52525B] text-center py-8">No sessions yet. Start logging!</p>
              )}
              {Object.entries(sessionsByDate).map(([date, sessions]) => {
                const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
                const totalHours = (totalMinutes / 60).toFixed(1);
                const isExpanded = expandedDates.has(date);

                return (
                  <div key={date} className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleDateExpand(date)}
                      className="w-full flex items-center justify-between px-4 py-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] text-white font-medium">
                          {formatDateLabel(date)}
                        </span>
                        <span className="text-[11px] text-[#52525B]">— {totalHours}h</span>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={16} className="text-[#52525B]" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-3 space-y-2">
                            {sessions.map((session) => (
                              <div
                                key={session.id}
                                className="flex items-start gap-2 bg-[#1A1A1A] rounded-lg px-3 py-2"
                              >
                                <Clock size={14} className="text-[#52525B] mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-[12px] text-white font-medium">
                                    {session.subject} — {Math.floor(session.durationMinutes / 60)}h {session.durationMinutes % 60}m
                                  </p>
                                  {session.notes && (
                                    <p className="text-[11px] text-[#52525B] truncate">{session.notes}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => handleOpenModal()}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-[#CCFF00] rounded-full flex items-center justify-center shadow-lg shadow-[#CCFF00]/20"
      >
        <Plus size={24} className="text-[#050505]" />
      </motion.button>

      {/* Log Session Modal */}
      <GlassModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Log ${activeTab === 'tnpsc' ? 'TNPSC Study' : 'Coding Practice'}`}
      >
        <div className="space-y-4">
          {/* Subject Select */}
          <div>
            <label className="text-[12px] font-medium text-[#A1A1AA] uppercase tracking-wider mb-2 block">
              {activeTab === 'tnpsc' ? 'Subject' : 'Topic'}
            </label>
            <div className="flex flex-wrap gap-2">
              {subjects.map((s) => (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                    subject === s
                      ? 'bg-[#CCFF00] text-[#050505]'
                      : 'bg-[#1A1A1A] text-[#A1A1AA] hover:bg-[#2A2A2A]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Time Input */}
          <div>
            <label className="text-[12px] font-medium text-[#A1A1AA] uppercase tracking-wider mb-2 block">
              Duration
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="number"
                  min="0"
                  max="12"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-lg font-bold text-white placeholder-[#52525B] focus:outline-none focus:border-[#CCFF00] transition-colors text-center"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] text-xs">h</span>
              </div>
              <span className="text-[#52525B] font-medium">:</span>
              <div className="flex-1 relative">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-lg font-bold text-white placeholder-[#52525B] focus:outline-none focus:border-[#CCFF00] transition-colors text-center"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] text-xs">m</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[12px] font-medium text-[#A1A1AA] uppercase tracking-wider mb-2 block">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
              rows={3}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[13px] text-white placeholder-[#52525B] focus:outline-none focus:border-[#CCFF00] transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 py-3 rounded-xl text-[13px] font-semibold text-[#A1A1AA] hover:bg-[#1A1A1A] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hours && !minutes}
              className="flex-1 py-3 rounded-xl text-[13px] font-bold text-[#050505] bg-[#CCFF00] hover:bg-[#B8E600] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Save Session
            </button>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
