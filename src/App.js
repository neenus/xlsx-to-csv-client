import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './App.css';
import Home from './pages/homepage/HomePage';
import About from './pages/aboutpage/AboutPage';
import Footer from "./components/Footer.component";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <div>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/about">
            <About />
          </Route>
        </Switch>
      </div>
      <Footer />
    </Router>
  );
};

export default App;