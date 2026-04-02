import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../../pages/Login/login.jsx";
import DashboardLayout from "../../pages/DashboardLayout/dashboard.jsx"
import DashBoard from "../../pages/Dashboard/dashboard.jsx";
import Error from "../../pages/Error/error.jsx";
import {
  AddProducts,
  EditProducts,
  Order,
  Others,
  Products,
} from "../routes/routes.jsx";
import { Suspense, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Loading from "../components/loading.jsx";
import AuthCheck from "../../utils/AuthCheck.js";

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AuthCheck>
          <Login />
        </AuthCheck>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <AuthCheck>
          <DashboardLayout />
        </AuthCheck>
      ),
      children: [
        {
          index: true,
          element: <DashBoard />,
        },
        {
          path: "orders",
          element: <Order />,
        },
        {
          path: "others",
          element: <Others />,
        },
        {
          path: "products",
          element: <Products />,
        },
        {
          path: "add-product",
          element: <AddProducts />,
        },
        {
          path: "editProduct/:id",
          element: <EditProducts />,
        },
      ],
    },
    {
      path: "*",
      element: <Error />,
    },
  ]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
      <ToastContainer />
    </>
  );
}
