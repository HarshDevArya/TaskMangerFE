import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Authcontxr";

export default function RequireAuth({ children }) {
  const { user } = useAuth();
  console.log("user", user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
