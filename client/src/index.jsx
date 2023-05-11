import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';

import { store } from "redux/store";
import App from "App";

const theme = createTheme({

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          background: "radial-gradient(circle, rgba(39,43,53,1) 0%, rgba(39,41,53,1) 100%)"
        },
      },
    },
  }
})

const root = createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme/>
      <App />
    </ThemeProvider>
  </Provider>
  // </React.StrictMode>
);
