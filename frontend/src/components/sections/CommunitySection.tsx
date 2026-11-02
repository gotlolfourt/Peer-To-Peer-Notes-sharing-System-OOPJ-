import React from 'react';
import { MOCK_PEERS } from '../../services/mockData';
import { PeerCard } from '../common/PeerCard';
import { Users, Award, ShieldCheck, Flame } from 'lucide-react';

export const CommunitySection: React.FC = () => {
  return (
    <section id="community" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-sage-border/40">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-lime" />
            <span className="badge-mono text-lime font-semibold">PEER ROSTER</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-ivory tracking-tight">
            TOP ACADEMIC <br />
            <span className="font-serif italic font-normal text-lime">contributors & faculty.</span>
          </h2>
        </div>

        <p className="text-sm text-ivory-muted max-w-md leading-relaxed">
          Peers hold both local note collections and shared repositories. Meet the verified students and professors driving the top-rated curriculum notes across campus.
        </p>
      </div>

      {/* Peer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PEERS.slice(0, 6).map((peer) => (
          <PeerCard key={peer.username} peer={peer} />
        ))}
      </div>

      {/* Community Recognition Banner */}
      <div className="mt-12 p-6 sm:p-8 rounded-2xl glass-panel-glow border border-lime/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-lime text-ink flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-base text-ivory">Are you a Class Representative or Faculty?</h4>
            <p className="text-xs text-ivory-muted mt-0.5">
              Verified faculty and peer tutors earn official badges and priority indexing for university semester syllabi.
            </p>
          </div>
        </div>

        <a
          href="/register"
          className="btn-primary px-6 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-glow-lime/30"
        >
          Claim Academic Badge
        </a>
      </div>
    </section>
  );
};
