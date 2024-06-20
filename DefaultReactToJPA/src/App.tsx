import { Route, Routes } from "react-router-dom";
import "./App.css";
import About from "./pages/About";
import Home from "./pages/Home";
import Participants from "./pages/Participants";
import Disciplines from "./pages/Disciplines";
import Results from "./pages/Results";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/participants" element={<Participants />} />
        <Route path="/disciplines" element={<Disciplines />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </>
  );
}

export default App;
