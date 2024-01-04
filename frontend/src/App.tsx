import { useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ApiErrorBanner from "./components/ApiErrorBanner";
import Editor from "./components/edit/Editor";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import MarketingPage from "./marketing/MarketingPage";
import { initializeAnalytics } from "./lib/ga";

function App() {
  useEffect(() => {
    initializeAnalytics();
  }, []);

  return (
    <BrowserRouter>
      <ApiErrorBanner />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit/:id" element={<Editor />} />
        <Route path="/marketing" element={<MarketingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
