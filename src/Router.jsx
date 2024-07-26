import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import Home from "./pages/Home";

function Router() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/signup",
      element: <Signup />
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {        
          path: "home",
          element: <Home />,
          index: true
        }
      ]
    }
  ])

  return <RouterProvider router={router} />
}

export default Router;