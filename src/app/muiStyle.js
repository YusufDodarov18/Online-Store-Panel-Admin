import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f9fafb",
      paper: "#ffffff",
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#161b2e",
      paper: "#1e293b",
    },
  },
});

export const inputSx = {
  "& .MuiFilledInput-root": {
    borderRadius: 2,
    backgroundColor: (theme) =>
      theme.palette.mode === "dark"
        ? "rgba(2,6,23,0.9)"
        : "rgba(243,244,246,1)",
  },
  "& .MuiFilledInput-root:before": {
    borderBottom: "none",
  },
  "& .MuiFilledInput-root:after": {
    borderBottom: "none",
  },
  "& input": {
    padding: "14px 12px",
  },
};
export const darkOnlyInputSx = {
  "& .MuiInputBase-root": {
    borderRadius: 2,
    backgroundColor: (theme) =>
      theme.palette.mode === "dark" ? "#1e293b" : "white",
    color: (theme) => (theme.palette.mode === "dark" ? "white" : "black"),
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: (theme) =>
        theme.palette.mode === "dark" ? "gray" : "rgba(0,0,0,0.2)",
    },
    "&:hover fieldset": {
      borderColor: (theme) =>
        theme.palette.mode === "dark" ? "white" : "rgba(0,0,0,0.4)",
    },
    "&.Mui-focused fieldset": {
      borderColor: (theme) =>
        theme.palette.mode === "dark" ? "#E91E63" : "#2563eb",
    },
  },
 
};

export const darkOnlySelectSx = {
  backgroundColor: (theme) =>
    theme.palette.mode === "dark" ? "#1e293b" : "white",
  "& .MuiSelect-select": {
    color: (theme) => (theme.palette.mode === "dark" ? "white" : "black"),
  },
  "& .MuiSvgIcon-root": {
    color: (theme) => (theme.palette.mode === "dark" ? "white" : "black"),
  },
  "& fieldset": {
    borderColor: (theme) =>
      theme.palette.mode === "dark" ? "gray" : "rgba(0,0,0,0.2)",
  },
  "&:hover fieldset": {
    borderColor: (theme) =>
      theme.palette.mode === "dark" ? "white" : "rgba(0,0,0,0.4)",
  },
  "&.Mui-focused fieldset": {
    borderColor: (theme) =>
      theme.palette.mode === "dark" ? "#E91E63" : "#2563eb",
  },
};
