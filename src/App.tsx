
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./components/AuthPage";
import OnboardingPage from "./components/OnboardingPage";
import PersonaSelection from "./components/PersonaSelection";
import ChatInterface from "./components/ChatInterface";
import GrowthTimeline from "./components/GrowthTimeline";
import UserCenter from "./components/UserCenter";
import VideoChat from "./components/VideoChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/persona-selection" element={<PersonaSelection />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/video-call" element={<VideoChat />} />
          <Route path="/growth" element={<GrowthTimeline />} />
          <Route path="/profile" element={<UserCenter />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
