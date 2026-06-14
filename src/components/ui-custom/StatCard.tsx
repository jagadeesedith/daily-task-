import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  value: string | number;
  label: string;
  subtext?: string | null;
  accent?: boolean;
  icon?: LucideIcon | null;
}

export function StatCard({ value, label, subtext, accent = false, icon: Icon }: StatCardProps) {
  return (
    <div
      className={`flex-shrink-0 w-[140px] p-4 rounded-2xl border bg-[#0F0F0F] ${
        accent
          ? 'border-[#CCFF00]/30 shadow-[0_0_30px_rgba(204,255,0,0.08)]'
          : 'border-[#2A2A2A]'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-3xl font-extrabold text-white tracking-tight">{value}</span>
        {Icon && <Icon size={20} className="text-[#CCFF00]" />}
      </div>
      <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest mt-1">{label}</p>
      {subtext && <p className="text-[10px] text-[#52525B] mt-1">{subtext}</p>}
    </div>
  );
}
