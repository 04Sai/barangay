import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./client/Hero";
import Hero2 from "./client/Hero2";
import Hero3 from "./client/Hero3";
import Hero4 from "./client/Hero4";
import NavBar from "./client/NavBar";
import Register from "./client/Register";
import Login from "./client/Login";

const App = () => {
  return (
    <Router>
      <div className="bg-black w-full overflow-hidden">
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Hero2 />
                <Hero3 />
                <Hero4 />
              </>
            }
          />
        </Routes>
        
      </div>
    </Router>
  );
};

export default App;
