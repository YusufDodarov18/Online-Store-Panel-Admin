import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { ThemeContextProvider, useTheme } from "./theme/themeContext.jsx";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme } from "./muiStyle.js";
import { CssBaseline } from "@mui/material";
import Layout from "./layout/layout.jsx";
import { store } from "../providers/store/store.js";

function RootApp() {
  const { theme } = useTheme();
  return (
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <CssBaseline />
      <Layout />
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <StyledEngineProvider>
            <ThemeContextProvider>
                <RootApp/>
            </ThemeContextProvider>
        </StyledEngineProvider>
    </Provider>
);
