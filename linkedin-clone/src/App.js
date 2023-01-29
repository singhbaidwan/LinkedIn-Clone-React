import "./App.css";
import Login from "./components/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import { useEffect } from "react";
import { getUserAuth } from "./actions";
import { connect } from "react-redux";

function App(props) {
  useEffect(() => {
    props.getUserAuth();
  }, []);

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

const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return { getUserAuth: () => dispatch(getUserAuth()) };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
