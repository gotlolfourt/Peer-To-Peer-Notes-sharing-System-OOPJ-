import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  BookOpen, 
  UploadCloud, 
  Compass, 
  Users, 
  Menu, 
  X, 
  ArrowUpRight, 
  LogOut, 
  User as UserIcon,
  Layers,
  Activity
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Probe backend connection
    api.checkBackendHealth().then((alive) => setIsLiveApi(alive));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Notes', path: '/explore', icon: Compass },
    { name: 'Upload Notes', path: '/upload', icon: UploadCloud },
    { name: 'How It Works', path: '/#how-it-works', isAnchor: true },
    { name: 'Community', path: '/#community', isAnchor: true },
  ];

  const handleAnchorClick = (anchorId: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/' + anchorId);
    } else {
      const el = document.querySelector(anchorId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3.5 bg-ink/85 backdrop-blur-xl border-b border-sage-border/60 shadow-lg'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-ink-charcoal border border-sage-border group-hover:border-lime flex items-center justify-center transition-all duration-300 relative overflow-hidden shadow-glow-lime/20">
              <div className="absolute inset-0 bg-lime/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Layers className="w-5 h-5 text-lime transition-transform group-hover:scale-110" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-xl tracking-tight text-ivory group-hover:text-lime transition-colors">
                SHARE<span className="text-lime">NOTE</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-ivory-dim uppercase -mt-1">
                P2P KNOWLEDGE NET
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-ink-surface/80 border border-sage-border/70 rounded-full px-4 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              if (link.isAnchor) {
                return (
                  <button
                    key={link.name}
                    onClick={() => handleAnchorClick(link.path.replace('/', ''))}
                    className="px-3.5 py-1.5 text-xs font-heading font-medium tracking-wide text-ivory-muted hover:text-lime transition-colors"
                  >
                    {link.name}
                  </button>
                );
              }
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-medium tracking-wide transition-all ${
                    isActive
                      ? 'bg-lime text-ink font-semibold shadow-glow-lime/30'
                      : 'text-ivory-muted hover:text-ivory hover:bg-ink-charcoal'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Status indicator + Auth CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Backend connection pill */}
            <div
              title={isLiveApi ? 'Connected to Java REST Server (Port 7070)' : 'Running Standalone P2P Mock Engine'}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink-charcoal border border-sage-border/60 text-[10px] font-mono text-ivory-dim"
            >
              <span className={`w-2 h-2 rounded-full ${isLiveApi ? 'bg-emerald-400 animate-pulse' : 'bg-lime'}`} />
              <span>{isLiveApi ? 'JAVA API: ONLINE' : 'P2P MESH'}</span>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink-charcoal border border-sage-border hover:border-lime transition-all text-xs text-ivory"
                >
                  <div className="w-5 h-5 rounded-full bg-lime text-ink font-bold flex items-center justify-center text-[10px]">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <span className="font-heading font-medium">{currentUser.fullName.split(' ')[0]}</span>
                  <span className="font-mono text-[10px] text-lime">+{currentUser.reputationScore}</span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-full text-ivory-dim hover:text-red-400 hover:bg-ink-charcoal transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-heading font-medium text-ivory hover:text-lime transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary px-4 py-2 rounded-full text-xs flex items-center gap-1.5 shadow-glow-lime/20"
                >
                  <span>Join Network</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-ink-charcoal border border-sage-border text-ivory hover:text-lime"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-sage-border mt-3 px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-heading font-medium text-ivory hover:text-lime transition-colors py-1"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-sage-border flex flex-col gap-3">
            {currentUser ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary w-full py-2.5 rounded-lg text-center text-xs"
                >
                  Open Dashboard (@{currentUser.username})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 rounded-lg text-center text-xs text-red-400 bg-red-950/20 border border-red-900/40"
                >
                  Logout Session
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary w-full py-2.5 rounded-lg text-center text-xs"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full py-2.5 rounded-lg text-center text-xs"
                >
                  Register as Student or Faculty
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
