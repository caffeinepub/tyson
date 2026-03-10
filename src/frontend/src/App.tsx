import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AIChatSection from "./components/AIChatSection";
import CheckTool from "./components/CheckTool";
import Footer from "./components/Footer";
import HackingAttacksSection from "./components/HackingAttacksSection";
import HeroSection from "./components/HeroSection";
import Navigation from "./components/Navigation";
import PricingSection from "./components/PricingSection";
import SupportSection from "./components/SupportSection";
import TipsSection from "./components/TipsSection";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background font-body">
        <Navigation />
        <main>
          <HeroSection />
          <CheckTool />
          <TipsSection />
          <HackingAttacksSection />
          <AIChatSection />
          <PricingSection />
          <SupportSection />
        </main>
        <Footer />
      </div>
      <Toaster position="top-right" theme="dark" />
    </QueryClientProvider>
  );
}
