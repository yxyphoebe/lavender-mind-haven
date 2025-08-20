
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TherapistProvider } from "@/contexts/TherapistContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./components/AuthPage";
import OnboardingPage from "./components/OnboardingPage";
import PersonaSelection from "./components/PersonaSelection";
import ChatInterface from "./components/ChatInterface";
import GrowthTimeline from "./components/GrowthTimeline";
import UserCenter from "./components/UserCenter";
import VideoChat from "./components/VideoChat";
import Profile from "./components/Profile";

import ImprovementFeedback from "./components/ImprovementFeedback";
import TherapistManagement from "./components/TherapistManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TherapistProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/selection" element={<PersonaSelection />} />
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/video-call" element={<VideoChat />} />
            <Route path="/growth" element={<GrowthTimeline />} />
            <Route path="/home" element={<UserCenter />} />
            <Route path="/profile" element={<Profile />} />
            
            <Route path="/feedback" element={<ImprovementFeedback />} />
            <Route path="/therapist" element={<TherapistManagement />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </TherapistProvider>
  </QueryClientProvider>
);

export default App;
