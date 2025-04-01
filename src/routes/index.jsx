import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage"; // Import Register Page
import MainLayout from "../components/layout/MainLayout";
import DashboardPage from "../pages/DashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />
      },
      {
        path: "register",  // Add this route for the Register Page
        element: <RegisterPage />
      },
      {
        path: "dashboard",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />
          }
        ]
      }
    ]
  }
]);
