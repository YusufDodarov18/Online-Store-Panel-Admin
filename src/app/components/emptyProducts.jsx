import { Link } from "react-router-dom";
import noProduct from "../assets/noProduct.png";
import { Box, Button, Typography } from "@mui/material";
import { Plus } from "lucide-react";
import { useTheme } from "../theme/themeContext";

export default function EmptyProducts() {
  const { theme } = useTheme();
  return (
    <Box className="flex flex-col py-5 justify-center text-center items-center gap-3">
      <img className="w-36 h-34" src={noProduct} />
      <Typography variant="h6" className="font-bold">
        Заказов пока нет.
      </Typography>
      <Typography sx={{ color: theme == "dark" ? "" : "#5A607F" }}>
        На этой странице будут отображаться все предстоящие заказы <br /> из
        вашего магазина. Если вы продаете товары офлайн, вы можете <br />{" "}
        добавлять заказы самостоятельно.
      </Typography>
      <Link to={`/dashboard/add-product`}>
        <Button
          variant="contained"
          sx={{
            bgcolor: theme === "dark" ? "#8B5CF6" : "#2563EB",
            color: "white",
            display: "flex",
            gap: 1,
          }}
        >
          <Plus /> Добавить заказ
        </Button>
      </Link>
    </Box>
  );
}
