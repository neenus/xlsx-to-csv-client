import React, { ComponentType } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import useAuth from "../hooks/useAuth";

interface AuthRouteProps extends RouteProps {
  component: ComponentType<any>;
}

const ProtectedRoute: React.FC<AuthRouteProps> = ({ component: Component, ...rest }) => {
  const { isAuthenticated, isInitializing } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isInitializing) {
          // Don't redirect until we've tried to rehydrate session from cookie
          return null;
        }
        return isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />;
      }}
    />
  );
}

export default ProtectedRoute;
