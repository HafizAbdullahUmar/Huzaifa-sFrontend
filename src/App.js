import "./App.css";
import NavbarComponent from "./components/NavbarComponent";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Warehouse from "./components/Warehouse";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Router>
        <NavbarComponent />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/warehouse" element={<Warehouse />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
