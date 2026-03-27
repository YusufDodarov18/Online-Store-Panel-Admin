import { configureStore } from "@reduxjs/toolkit";
import brands from "../../features/Brands/brands";
import category from "../../features/Category/categories";
import product from "../../features/Products/products";
import color from "../../features/Colors/colors";

export const store = configureStore({
  reducer: {
    brands: brands,
    category: category,
    product: product,
    color: color,
  },
});
