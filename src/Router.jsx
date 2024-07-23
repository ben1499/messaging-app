import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

function Router() {
  const router = createBrowserRouter([

  ])

  return <RouterProvider router={router} />
}

export default Router;