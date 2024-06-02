import React from "react";
import ReactDOM from "react-dom/client";

import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider
} from "@mui/material/styles";
import "./index.css";
import App from "./App.tsx";

const theme = createTheme({
  typography: {
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);
