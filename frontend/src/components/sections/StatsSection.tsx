import React, { useEffect, useState } from 'react';
import { StatCounter } from '../common/StatCounter';
import { api } from '../../services/api';
import { NetworkStats } from '../../types';
import { BookOpen, Users, Download, Layers, Activity } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const [stats, setStats] = useState<NetworkStats>({
    totalNotesShared: 248,
    activePeers: 64,
    totalDownloads: 1420,
    subjectsCovered: 18,
    activeTransfersNow: 3,
  });

  useEffect(() => {
    api.getStats().then((data) => setStats(data));
  }, []);

  const statItems = [
    {
      label: 'TOTAL NOTES SHARED',
      value: stats.totalNotesShared,
      suffix: '+',
      desc: 'Lecture notes & exam cheat-sheets uploaded across all departments',
      icon: BookOpen,
    },
    {
      label: 'ACTIVE CAMPUS PEERS',
      value: stats.activePeers,
      suffix: '',
      desc: 'Connected student and faculty peer nodes currently online',
      icon: Users,
    },
    {
      label: 'TOTAL DOWNLOADS',
      value: stats.totalDownloads,
      suffix: '+',
      desc: 'Successful peer-to-peer file transfers and study session copies',
      icon: Download,
    },
    {
      label: 'SUBJECTS COVERED',
      value: stats.subjectsCovered,
      suffix: '',
      desc: 'Engineering syllabus modules actively indexed on network',
      icon: Layers,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-sage-border/40">
      <div className="rounded-3xl bg-ink-charcoal border border-sage-border/60 p-8 sm:p-12 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-lime/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sage/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-sage-border/40 gap-4">
          <div>
            <span className="badge-mono text-lime font-semibold block mb-1">NETWORK TELEMETRY</span>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-ivory">
              Real-Time Academic Impact
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-ivory-dim">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>P2P Registry Live Sync Active</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
          {statItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="space-y-3">
                <div className="flex items-center gap-2 text-lime">
                  <Icon className="w-4 h-4" />
                  <span className="badge-mono text-[10px] tracking-wider text-ivory-muted">
                    {item.label}
                  </span>
                </div>

                <div className="text-4xl sm:text-5xl font-heading font-black text-ivory">
                  <StatCounter value={item.value} suffix={item.suffix} />
                </div>

                <p className="text-xs text-ivory-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
