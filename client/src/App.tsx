import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect, useRef } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Developers from "./pages/Developers";
import AuditTool from "./pages/AuditTool";
import Admin from "./pages/Admin";
import DecisionLog from "./pages/DecisionLog";
import ReportViewer from "./pages/ReportViewer";
import PreciselyIntegration from "./pages/PreciselyIntegration";
import ApiKeys from "./pages/ApiKeys";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

// Scroll to top only on route *changes* (not initial mount)
function ScrollToTop() {
  const [location] = useLocation();
  const prevLocation = useRef(location);
  useEffect(() => {
    if (prevLocation.current !== location) {
      prevLocation.current = location;
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Nav />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/audit" component={AuditTool} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/developers" component={Developers} />
        <Route path="/admin" component={Admin} />
        <Route path="/decisions" component={DecisionLog} />
        <Route path="/decisions/api-keys" component={ApiKeys} />
        <Route path="/report/decision/:id" component={ReportViewer} />
        <Route path="/report/fleet" component={ReportViewer} />
        <Route path="/integrations/precisely" component={PreciselyIntegration} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
