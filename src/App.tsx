import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ApiErrorBanner from "./components/ApiErrorBanner";
import { thumbnail } from "./lib/signals";
import Templates from "./components/Templates";
import Library from "./components/Library";
import Editor from "./components/edit/Editor";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit/:id" element={<Editor />} />

        {/* <div className="App">
          <div className="relative">
            <ApiErrorBanner />

            {!thumbnail.value && (
              <div>
                <div>
                  <Templates />
                </div>
                <div>
                  <Library />
                </div>
              </div>
            )}
            {thumbnail.value && <Editor />}
          </div>
        </div> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
