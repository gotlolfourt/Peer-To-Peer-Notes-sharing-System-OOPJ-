import React, { useState } from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { LiveNetworkSection } from '../components/sections/LiveNetworkSection';
import { ExplorePreviewSection } from '../components/sections/ExplorePreviewSection';
import { HowItWorksSection } from '../components/sections/HowItWorksSection';
import { CommunitySection } from '../components/sections/CommunitySection';
import { StatsSection } from '../components/sections/StatsSection';
import { FastUploadCTA } from '../components/sections/FastUploadCTA';
import { NotePreviewModal } from '../components/modals/NotePreviewModal';
import { BaseNoteItem } from '../types';

export const HomePage: React.FC = () => {
  const [selectedNote, setSelectedNote] = useState<BaseNoteItem | null>(null);

  return (
    <div className="relative">
      {/* 1. Hero Section with 3D Knowledge Ecosystem */}
      <HeroSection />

      {/* 2. Live Knowledge Network 3D Section */}
      <LiveNetworkSection />

      {/* 3. Explore Verified Notes Grid */}
      <ExplorePreviewSection onPreviewNote={(note) => setSelectedNote(note)} />

      {/* 4. Three-Step Workflow: Discover -> Connect -> Share */}
      <HowItWorksSection />

      {/* 5. Peer & Faculty Community Roster */}
      <CommunitySection />

      {/* 6. Network Telemetry & Statistics */}
      <StatsSection />

      {/* 7. Fast Upload Call to Action */}
      <FastUploadCTA />

      {/* Note Detailed Preview Modal */}
      <NotePreviewModal note={selectedNote} onClose={() => setSelectedNote(null)} />
    </div>
  );
};
