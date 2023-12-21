import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Home from "./components/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import { getOrSetUserId, fetchThumbnails } from "./lib/api";

function App() {
  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;
