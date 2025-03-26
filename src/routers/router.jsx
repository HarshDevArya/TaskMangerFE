import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import Dashboard from "../pages/Dashboard";

import RequireAuth from "./requireAuth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    ),
  },
]);
export default router;
