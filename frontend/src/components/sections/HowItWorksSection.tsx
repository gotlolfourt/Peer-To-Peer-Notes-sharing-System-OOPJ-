import React from 'react';
import { Search, Link2, UploadCloud, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'DISCOVER',
      subtitle: 'Find notes shared by other students.',
      desc: 'Browse lecture notes and exam revision cheat-sheets indexed across CSE, AIML, ECE, Mechanical, and General Engineering. Search by keywords, professors, or exam targets.',
      icon: Search,
      pill: 'QUERY & DISCOVER',
      accent: 'border-sage-border hover:border-lime',
    },
    {
      num: '02',
      title: 'CONNECT',
      subtitle: 'Connect with peers and access shared resources.',
      desc: 'Establish peer-to-peer links directly. Initiate high-speed multithreaded downloads with local disk caching and verifiable contributor reputation points.',
      icon: Link2,
      pill: 'P2P PROTOCOL',
      accent: 'border-sage-border hover:border-lime',
    },
    {
      num: '03',
      title: 'SHARE',
      subtitle: 'Upload your notes & contribute to the knowledge net.',
      desc: 'Publish your lecture summaries and formula sheets. Every download awards you +2 to +5 reputation points, elevating your standing in the university knowledge network.',
      icon: UploadCloud,
      pill: 'COLLECTIVE REPUTATION',
      accent: 'border-sage-border hover:border-lime',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-sage-border/40">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="badge-mono text-lime font-semibold block mb-2">SYSTEM WORKFLOW</span>
        <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-ivory tracking-tight mb-4">
          HOW THE NETWORK <br />
          <span className="font-serif italic font-normal text-sage-light">powers student collaboration.</span>
        </h2>
        <p className="text-sm text-ivory-muted leading-relaxed">
          Built on Object-Oriented principles, SHARENOTE guarantees peer privacy, zero central bottlenecks, and fair recognition for high-yield study materials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className={`relative rounded-2xl bg-ink-charcoal/90 border ${step.accent} p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-card-dark group`}
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-heading font-black text-4xl text-sage-border group-hover:text-lime transition-colors">
                    {step.num}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-ink-elevated border border-sage-border flex items-center justify-center text-lime group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="badge-mono text-[10px] text-lime mb-2">{step.pill}</div>
                <h3 className="font-heading font-bold text-xl text-ivory mb-2 tracking-tight">
                  {step.title}
                </h3>
                <h4 className="font-serif italic text-sage-light text-base mb-4">
                  {step.subtitle}
                </h4>
                <p className="text-xs text-ivory-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-sage-border/40 flex items-center text-xs font-mono text-ivory-dim">
                <span className="w-2 h-2 rounded-full bg-lime mr-2" />
                <span>Zero intermediaries • 100% Student Driven</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
