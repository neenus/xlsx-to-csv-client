import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import Home from "./pages/homepage/HomePage";
import About from "./pages/aboutpage/AboutPage";
import Contractors from "./pages/contractors/ContractorsPage";
import Services from "./pages/services/ServicesPage";
import Login from "./pages/login/LoginPage";
import Header from "./components/Header.component";
import Footer from "./components/Footer.component";
import { ToastContainer } from "react-toastify";

import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./pages/Protected";


const App = () => {
  return (
    <div>
      <UserProvider>
        <Router>
          <ToastContainer />
          <Header />
          <div>
            <Switch>
              <ProtectedRoute exact path="/" component={Home} />
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/about">
                <About />
              </Route>
              <ProtectedRoute exact path="/contractors" component={Contractors} />
              <ProtectedRoute exact path="/services" component={Services} />
            </Switch>
          </div>
          <Footer />
        </Router>
      </UserProvider>
    </div>
  );
};

export default App;
