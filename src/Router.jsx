import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Error from "./pages/Error";

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
      errorElement: <Error />,
      element: <ProtectedRoute>
        <Layout />
      </ProtectedRoute>,
      children: [
        {
          index: true,
          element: <Navigate to="/home" replace />
        },
        {        
          path: "home",
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        }
      ]
    }
  ])

  return <RouterProvider router={router} />
}

export default Router;