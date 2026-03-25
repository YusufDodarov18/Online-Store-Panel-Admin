import { lazy } from "react";

export const Products=lazy(()=>import("../../pages/Products/products.jsx"))
export const Others=lazy(()=>import("../../pages/Others/others.jsx"))
export const Order=lazy(()=>import("../../pages/Orders/order.jsx"))
export const EditProducts=lazy(()=>import("../../pages/EditProduct/editProduct.jsx"))
export const AddProducts=lazy(()=>import("../../pages/AddProduct/addProduct.jsx"))
export const GetOrderById=lazy(()=>import("../../pages/GetOrders/getOrderById.jsx"))