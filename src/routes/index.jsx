import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import LoginPage from "../pages/LoginPage";
import ForgetPasswordPage from "../pages/ForgetPasswordPage";
import RegisterPage from "../pages/RegisterPage";
import UserPanelPage from "../pages/UserPanelPage";
import MainLayout from "../components/layout/MainLayout";
import DashboardPage from "../pages/DashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        index: true,
        element: <LoginPage />
      },
      {
        path: "register",  // ]the Register Page
        element: <RegisterPage />
      },
      {
        path: "forgot-password",  //Update Password
        element: <ForgetPasswordPage />
      },
      {
        path: "dashboard",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />
          },
          {
            path: "users", 
            element: <UserPanelPage />
          }
        ]
      }
    ]
  }
]);
