import { RouterProvider } from "react-router-dom";
import router from "./routers/router";

import { AuthProvider } from "./context/Authcontxr";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
