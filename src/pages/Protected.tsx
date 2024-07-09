import React, { ComponentType } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import useAuth from "../hooks/useAuth";

interface AuthRouteProps extends RouteProps {
  component: ComponentType<any>;
}

const ProtectedRoute: React.FC<AuthRouteProps> = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

export default ProtectedRoute;