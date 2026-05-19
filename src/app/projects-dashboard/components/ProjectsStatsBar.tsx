import React from 'react';
import { FolderOpen, Cpu, Clock } from 'lucide-react';

const stats = [
  { id: 'stat-projects', label: 'Total Projects', value: '14', icon: FolderOpen, color: 'text-primary', bg: 'bg-primary/10', delta: '+3 this month' },
  { id: 'stat-generations', label: 'AI Generations', value: '247', icon: Cpu, color: 'text-accent', bg: 'bg-accent/10', delta: 'Unlimited' },
  { id: 'stat-active', label: 'Last Active', value: '2h ago', icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-400/10', delta: 'Portfolio Site' },
];

export default function ProjectsStatsBar() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.id} className="card-base p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg}`}>
                <Icon size={16} className={stat.color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground tabular-nums">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            <p className="text-xs mt-1.5 font-medium text-primary">{stat.delta}</p>
          </div>
        );
      })}
    </div>
  );
}
