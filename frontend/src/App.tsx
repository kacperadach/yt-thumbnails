import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ApiErrorBanner from "./components/layout/ApiErrorBanner";
import Editor from "./components/edit/Editor";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
import Navbar from "./components/layout/Navbar";
import MarketingPage from "./marketing/MarketingPage";
import { initializeAnalytics } from "./lib/ga";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa, ThemeMinimal } from "@supabase/auth-ui-shared";
import { Spinner } from "react-bootstrap";
import { showSubscriptionDialog, userSession } from "./lib/signals";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
// import "./radixThemes.css";
import { supabase } from "./lib/supabase";
import Login from "./components/auth/Login";
import LoadingSpinner from "./components/auth/LoadingSpinner";
import PrivacyPolicy from "./components/auth/PrivacyPolicy";
import TermsOfService from "./components/auth/TermsOfService";
import SubscriptionDialog from "./components/subscription/SubscriptionDialog";

function App() {
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    initializeAnalytics();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      userSession.value = session;
      setAuthChecked(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      userSession.value = session;
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!authChecked) {
    return <LoadingSpinner />;
  }

  if (!userSession.value) {
    return <Login />;
  }

  return (
    <Theme
      accentColor="jade"
      style={{ height: "100vh" }}
      className="flex flex-column"
    >
      <BrowserRouter>
        <ApiErrorBanner />

        <SubscriptionDialog
          open={showSubscriptionDialog.value}
          setOpen={(open: boolean) => (showSubscriptionDialog.value = open)}
        />

        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit/:id" element={<Editor />} />
          <Route path="/marketing" element={<MarketingPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Routes>
      </BrowserRouter>
    </Theme>
  );
}

export default App;
