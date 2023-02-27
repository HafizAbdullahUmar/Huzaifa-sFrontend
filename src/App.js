import "./App.css";
import NavbarComponent from "./components/NavbarComponent";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Warehouse from "./components/Warehouse";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Sale from "./components/Sale";
import Owner from "./components/Owner";
import useWarehouseStore from "./store/warehouseStore";

function App() {
  const { isLoggedIn } = useWarehouseStore((state) => ({
    isLoggedIn: state.isLoggedIn,
  }));
  return (
    <>
      <Router>
        <NavbarComponent />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/sale" element={<Sale />} />
          {isLoggedIn ? <Route path="/owner" element={<Owner />} /> : ""}
        </Routes>
      </Router>
    </>
  );
}

export default App;
