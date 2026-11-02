import React from 'react';
import { Link } from 'react-router-dom';
import { KnowledgeHero3D } from '../3d/KnowledgeHero3D';
import { ArrowUpRight, Compass, UploadCloud, ChevronDown, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-ink">
      {/* 3D Knowledge Ecosystem Canvas in Background */}
      <KnowledgeHero3D />

      {/* Foreground Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ink-charcoal/90 border border-sage-border backdrop-blur-md mb-8 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
          <span className="badge-mono text-lime font-semibold">
            AN OPEN NETWORK FOR SHARED KNOWLEDGE
          </span>
        </div>

        {/* Oversized Swiss-style Heading */}
        <h1 className="font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-ivory uppercase leading-[0.95] mb-6">
          YOUR KNOWLEDGE. <br />
          <span className="font-serif italic font-normal text-lime lowercase tracking-normal">
            the world's
          </span>{' '}
          NEXT RESOURCE.
        </h1>

        {/* Editorial Supporting Description */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-ivory-muted font-normal leading-relaxed mb-10">
          Discover, share and exchange verified lecture notes, revision formula guides, and exam cheat-sheets with an autonomous decentralized community built around learning together.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            to="/explore"
            className="btn-primary w-full sm:w-auto px-8 py-4 rounded-full text-sm flex items-center justify-center gap-2 shadow-glow-lime"
          >
            <Compass className="w-4 h-4 text-ink" />
            <span>Explore Notes Registry</span>
            <ArrowUpRight className="w-4 h-4 text-ink" />
          </Link>

          <Link
            to="/upload"
            className="btn-secondary w-full sm:w-auto px-8 py-4 rounded-full text-sm flex items-center justify-center gap-2"
          >
            <UploadCloud className="w-4 h-4 text-lime" />
            <span>Share Your Knowledge</span>
          </Link>
        </div>

        {/* Metric preview pills */}
        <div className="mt-14 flex flex-wrap justify-center items-center gap-4 text-xs font-mono text-ivory-dim">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-surface/80 border border-sage-border/50">
            <span className="text-lime font-bold">240+</span>
            <span>Public Notes</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-surface/80 border border-sage-border/50">
            <span className="text-lime font-bold">5</span>
            <span>Departments (CSE, AIML, ECE, MECH, GEN)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-surface/80 border border-sage-border/50">
            <span className="text-lime font-bold">100%</span>
            <span>P2P Decentralized</span>
          </div>
        </div>
      </div>

      {/* Animated Bottom Scroll Indicator */}
      <a
        href="#network"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-ivory-dim hover:text-lime transition-colors z-10"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase">Scroll Down</span>
        <ChevronDown className="w-4 h-4 animate-bounce text-lime" />
      </a>
    </section>
  );
};
