import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient } from '@tanstack/react-query';
import Index from './pages/index';
import AuthPage from './pages/AuthPage';
import NotFound from './pages/NotFound';
import UserCenter from './components/UserCenter';
import ChatInterface from './components/ChatInterface';
import VideoChat from './components/VideoChat';
import GrowthTimeline from './components/GrowthTimeline';
import Profile from './components/Profile';
import PersonaSelection from './components/PersonaSelection';
import TherapistManager from './components/TherapistManager';
import OnboardingFlow from './components/OnboardingFlow';

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/onboarding" element={<OnboardingFlow />} />
          <Route path="/persona-selection" element={<PersonaSelection />} />
          <Route path="/user-center" element={<UserCenter />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/video-call" element={<VideoChat />} />
          <Route path="/growth" element={<GrowthTimeline />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/therapist-manager" element={<TherapistManager />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
