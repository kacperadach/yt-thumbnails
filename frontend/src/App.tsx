import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ApiErrorBanner from "./components/ApiErrorBanner";
import Editor from "./components/edit/Editor";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import MarketingPage from "./marketing/MarketingPage";
import { initializeAnalytics } from "./lib/ga";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa, ThemeMinimal } from "@supabase/auth-ui-shared";
import { Spinner } from "react-bootstrap";
import { userSession } from "./lib/signals";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { supabase } from "./lib/supabase";
import Login from "./components/auth/Login";
import LoadingSpinner from "./components/auth/LoadingSpinner";

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
    <Theme accentColor="jade">
      <BrowserRouter>
        <ApiErrorBanner />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit/:id" element={<Editor />} />
          <Route path="/marketing" element={<MarketingPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Theme>
  );
}

export default App;
