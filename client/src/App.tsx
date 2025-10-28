import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Strategies from "./pages/Strategies";
import BankrollManagement from "./pages/BankrollManagement";
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
import ManualRobot from "./pages/ManualRobot";

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
      <Route path="/betting-robot/manual" component={ManualRobot} />
      <Route path="/betting-robot" component={BettingRobot} />
      <Route path="/extension-guide" component={ExtensionGuide} />
      <Route path="/bankroll-management" component={BankrollManagement} />
      <Route path="/chat" component={Chat} />
      <Route path="/profile" component={Profile} />
        <Route path="/settings" component={Settings} />
      <Route path="/admin" component={AdminPanel} />
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
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

