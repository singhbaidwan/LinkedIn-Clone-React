import "./App.css";
import Login from "./components/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={
              <div>
                <Header />
                <Home />
              </div>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
