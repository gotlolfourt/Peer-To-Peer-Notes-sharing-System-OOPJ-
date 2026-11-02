import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-ink-950 border-t border-sage-border/60 overflow-hidden pt-16 pb-12">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-lime/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-sage-border/40">
          
          {/* Brand & Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-ink-charcoal border border-sage-border flex items-center justify-center">
                <Layers className="w-5 h-5 text-lime" />
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-ivory">
                SHARE<span className="text-lime">NOTE</span>
              </span>
            </div>

            <p className="text-sm font-serif italic text-sage-light text-lg">
              "Knowledge is better when it is shared."
            </p>

            <p className="text-xs text-ivory-muted leading-relaxed max-w-sm">
              An open, decentralized academic peer-to-peer knowledge network. Built with Java OOP principles, SQLite JDBC persistence, embedded REST services, and high-performance 3D visualization.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://github.com/gotlolfourt/Peer-To-Peer-Notes-sharing-System-OOPJ-"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-ink-charcoal border border-sage-border hover:border-lime text-xs text-ivory transition-colors group"
              >
                <svg className="w-4 h-4 text-lime fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub Repository</span>
                <ArrowUpRight className="w-3 h-3 text-ivory-dim group-hover:text-lime transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

          {/* Column: Platform */}
          <div className="space-y-3">
            <h4 className="badge-mono text-lime">Platform</h4>
            <ul className="space-y-2 text-xs text-ivory-muted">
              <li>
                <Link to="/" className="hover:text-lime transition-colors">Home Network</Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-lime transition-colors">Explore Public Notes</Link>
              </li>
              <li>
                <Link to="/upload" className="hover:text-lime transition-colors">Upload Note Studio</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-lime transition-colors">Peer Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Column: Academic Categories */}
          <div className="space-y-3">
            <h4 className="badge-mono text-lime">Departments</h4>
            <ul className="space-y-2 text-xs text-ivory-muted">
              <li><Link to="/explore?dept=CSE" className="hover:text-lime transition-colors">Computer Science (CSE)</Link></li>
              <li><Link to="/explore?dept=AIML" className="hover:text-lime transition-colors">AI & Machine Learning</Link></li>
              <li><Link to="/explore?dept=ECE" className="hover:text-lime transition-colors">Electronics (ECE)</Link></li>
              <li><Link to="/explore?dept=MECHANICAL" className="hover:text-lime transition-colors">Mechanical Engineering</Link></li>
              <li><Link to="/explore?dept=GENERAL" className="hover:text-lime transition-colors">General Engineering</Link></li>
            </ul>
          </div>

          {/* Column: Architecture & Specs */}
          <div className="space-y-3">
            <h4 className="badge-mono text-lime">Architecture</h4>
            <div className="bg-ink-charcoal p-3 rounded-xl border border-sage-border/50 text-[11px] font-mono text-ivory-muted space-y-1.5">
              <div className="flex items-center gap-1.5 text-ivory">
                <Cpu className="w-3.5 h-3.5 text-lime" />
                <span>Core: Java SE 27</span>
              </div>
              <div>Database: SQLite 3 (JDBC)</div>
              <div>REST API: Port 7070</div>
              <div>Concurrency: Multi-threaded Tasks</div>
              <div className="text-emerald-400">Status: Verified 65/65 Tests</div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory-dim gap-4">
          <div>
            &copy; {new Date().getFullYear()} SHARENOTE P2P. College Project - Object Oriented Programming with Java (OOPJ).
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-lime" />
              <span>Decentralized Peer Network</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
