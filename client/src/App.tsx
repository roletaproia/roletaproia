import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Strategies from "./pages/Strategies";
import Chat from "./pages/Chat";
import BettingRobot from "./pages/BettingRobot";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminPanel from "./pages/AdminPanel";
import ChatModeration from "./pages/ChatModeration";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MakeAdmin from "./pages/MakeAdmin";
import CreateAdmin from "./pages/CreateAdmin";
import ExtensionGuide from "./pages/ExtensionGuide";
import RobotModeSelection from "./pages/RobotModeSelection";
import ExtensionDownload from "./pages/ExtensionDownload";


import AdminSubscriptions from "./pages/AdminSubscriptions";
import LiveSignals from "./pages/LiveSignals";
import FinancialEducation from "./pages/FinancialEducation";
import BankrollManagement from "@/pages/BankrollManagement";
import AdvancedStatistics from "@/pages/AdvancedStatistics";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import HowItWorks from "@/pages/HowItWorks";
import FAQ from "@/pages/FAQ";
import Blog from "@/pages/Blog";
import BlogArticle from "@/pages/BlogArticle";


function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/strategies" component={Strategies} />
      <Route path="/betting-robot/select-mode" component={RobotModeSelection} />
      <Route path="/extension-download" component={ExtensionDownload} />


      <Route path="/betting-robot" component={BettingRobot} />
      <Route path="/live-signals" component={LiveSignals} />
      <Route path="/education" component={FinancialEducation} />
      <Route path="/bankroll" component={BankrollManagement} />
      <Route path="/statistics" component={AdvancedStatistics} />
      <Route path="/termos-de-uso" component={TermsOfService} />
      <Route path="/politica-de-privacidade" component={PrivacyPolicy} />
      <Route path="/como-funciona" component={HowItWorks} />
      <Route path="/faq" component={FAQ} />
      <Route path="/blog/:slug" component={BlogArticle} />
      <Route path="/blog" component={Blog} />

      <Route path="/extension-guide" component={ExtensionGuide} />
      <Route path="/chat" component={Chat} />
      <Route path="/profile" component={Profile} />
        <Route path="/settings" component={Settings} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/admin/subscriptions" component={AdminSubscriptions} />
      <Route path="/chat-moderation" component={ChatModeration} />
      <Route path="/make-admin" component={MakeAdmin} />
      <Route path="/create-admin" component={CreateAdmin} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
          <TooltipProvider>
            <Sonner />
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;

