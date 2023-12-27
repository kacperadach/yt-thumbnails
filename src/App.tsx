import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ApiErrorBanner from "./components/ApiErrorBanner";
import Editor from "./components/edit/Editor";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <ApiErrorBanner />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit/:id" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
