import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Transaction from "./pages/Transaction";
import Settings from "./pages/Settings";
import Accounts from "./pages/Accounts";
import Categories from "./pages/Categories";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Transaction" element={<Transaction />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/Accounts" element={<Accounts />} />
          <Route path="/Categories" element={<Categories />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
