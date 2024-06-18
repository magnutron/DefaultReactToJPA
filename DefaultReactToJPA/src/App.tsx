import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import About from "./pages/About";
import Home from "./pages/Home";
import Entity1Page from "./pages/Entity1Page";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/entity1page" element={<Entity1Page />} />
      </Routes>
    </>
  );
}

export default App;
