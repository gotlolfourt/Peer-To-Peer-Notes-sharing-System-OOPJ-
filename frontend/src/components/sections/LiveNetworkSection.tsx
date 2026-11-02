import React from 'react';
import { NetworkMesh3D } from '../3d/NetworkMesh3D';
import { Activity, Radio, Cpu, Share2, ShieldCheck } from 'lucide-react';

export const LiveNetworkSection: React.FC = () => {
  return (
    <section id="network" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Radio className="w-4 h-4 text-lime animate-pulse" />
            <span className="badge-mono text-lime font-semibold">LIVE NODE TOPOLOGY</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-ivory tracking-tight">
            THE KNOWLEDGE <br />
            <span className="font-serif italic font-normal text-sage-light">mesh network.</span>
          </h2>
        </div>

        <p className="text-sm text-ivory-muted max-w-md leading-relaxed">
          Watch notes stream between autonomous student and faculty nodes in real time. Each download strengthens peer reputation and reinforces the decentralized curriculum archive.
        </p>
      </div>

      {/* 3D Interactive Network Component */}
      <NetworkMesh3D />

      {/* Bottom Network Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        <div className="p-5 rounded-2xl bg-ink-charcoal border border-sage-border/50 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-ink-elevated text-lime border border-sage-border">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-ivory">Direct Peer Exchange</h4>
            <p className="text-xs text-ivory-muted mt-1 leading-relaxed">
              No intermediary gatekeepers. Notes travel directly between student and faculty caches.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-ink-charcoal border border-sage-border/50 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-ink-elevated text-lime border border-sage-border">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-ivory">Reputation Consensus</h4>
            <p className="text-xs text-ivory-muted mt-1 leading-relaxed">
              Contributors earn +5 points for sharing and +2 points every time their notes are verified.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-ink-charcoal border border-sage-border/50 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-ink-elevated text-lime border border-sage-border">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-ivory">Multi-threaded Transfers</h4>
            <p className="text-xs text-ivory-muted mt-1 leading-relaxed">
              Background worker threads execute non-blocking concurrent downloads with zero UI freeze.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
