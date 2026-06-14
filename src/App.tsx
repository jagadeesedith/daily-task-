import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Statistics } from '@/pages/Statistics';
import { WeightTracker } from '@/pages/WeightTracker';
import { StudyTracker } from '@/pages/StudyTracker';
import { Settings } from '@/pages/Settings';
import { useReminders } from '@/hooks/useReminders';



function AppContent() {
  useReminders();
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/stats" element={<Statistics />} />
          <Route path="/weight" element={<WeightTracker />} />
          <Route path="/study" element={<StudyTracker />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
