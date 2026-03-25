import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function AuthCheck({ children }) {
  const token = localStorage.getItem("admin");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token && location.pathname === "/") {
      navigate("/dashboard");
    } else if (!token && location.pathname.startsWith("/dashboard")) {
      navigate("/");
    }
  }, [token, location.pathname, navigate]);

  return children;
}

export default AuthCheck;
