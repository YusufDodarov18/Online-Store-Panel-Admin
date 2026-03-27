import {
  Box,
  BottomNavigation as MuiBottomNav,
  BottomNavigationAction,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LayersIcon from "@mui/icons-material/Layers";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useState } from "react";

const Nav_Items = [
  { label: "Панель уп.", icon: <DashboardIcon />, path: "/dashboard" },
  { label: "Заказы", icon: <ShoppingCartIcon />, path: "/dashboard/orders" },
  { label: "Продукты", icon: <LayersIcon />, path: "/dashboard/products" },
  { label: "Другой", icon: <BarChartIcon />, path: "/dashboard/others" },
];

const BottomNavigation = ({ navigate }) => {
  const [value, setValue] = useState(0);

  return (
    <Box
      sx={{
        display: { xs: "block", md: "none" },
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
      }}
    >
      <MuiBottomNav
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          navigate(Nav_Items[newValue].path);
        }}
        sx={{
          boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        {Nav_Items.map((item, index) => (
          <BottomNavigationAction
            key={index}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </MuiBottomNav>
    </Box>
  );
};

export default BottomNavigation;
