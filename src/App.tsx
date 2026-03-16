import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OAuthCallbackHandler } from "@/components/auth/OAuthCallbackHandler";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Physics from "./pages/Physics";
import PhysicsChapter from "./pages/PhysicsChapter";
import Chemistry from "./pages/Chemistry";
import ChemistryChapter from "./pages/ChemistryChapter";
import Biology from "./pages/Biology";
import BiologyChapter from "./pages/BiologyChapter";
import Mathematics from "./pages/Mathematics";
import MathematicsChapter from "./pages/MathematicsChapter";
import Social from "./pages/Social";
import SocialPart2 from "./pages/SocialPart2";
import SocialChapter from "./pages/SocialChapter";
import Badges from "./pages/Badges";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <OAuthCallbackHandler />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/physics" element={<Physics />} />
          <Route path="/physics/chapter/:chapterId" element={<PhysicsChapter />} />
          <Route path="/chemistry" element={<Chemistry />} />
          <Route path="/chemistry/chapter/:chapterId" element={<ChemistryChapter />} />
          <Route path="/biology" element={<Biology />} />
          <Route path="/biology/chapter/:chapterId" element={<BiologyChapter />} />
          <Route path="/mathematics" element={<Mathematics />} />
          <Route path="/mathematics/chapter/:chapterId" element={<MathematicsChapter />} />
          <Route path="/social" element={<Social />} />
          <Route path="/social-part2" element={<SocialPart2 />} />
          <Route path="/social/chapter/:chapterId" element={<SocialChapter />} />
          {/* <Route path="/badges" element={<Badges />} /> */}{/* Hidden until auth is set up */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
