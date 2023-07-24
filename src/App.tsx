import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import Home from "./pages/homepage/HomePage";
import About from "./pages/aboutpage/AboutPage";
import Contractors from "./pages/contractors/ContractorsPage";
import Services from "./pages/services/ServicesPage";
import Header from "./components/Header.component";
import Footer from "./components/Footer.component";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Header />
      <div>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/about">
            <About />
          </Route>
          <Route exact path="/contractors">
            <Contractors />
          </Route>
          <Route exact path="/services">
            <Services />
          </Route>
        </Switch>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
