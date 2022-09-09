import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const sid = Cookies.get("SESSION") || "";
  if (sid) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
}
