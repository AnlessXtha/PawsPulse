import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import OurServicesPage from "./routes/OurServicesPage";
import { Layout, RequireAuth } from "@/routes/Layouts/Layout";
import ProfilePage from "@/routes/ProfilePage";
import Login from "@/routes/Login";
import Register from "@/routes/Register";
import HomePage from "@/routes/HomePage";
import RegisterPet from "@/routes/RegisterPet";
import AdminDashboard from "@/routes/Admin/AdminDashboard";
import VetDashboard from "@/routes/Vet/VetDashboard";
import UserControl from "@/routes/Admin/UserControl";
import PetControl from "@/routes/Admin/PetControl";
import AdminLayout from "@/routes/Layouts/AdminLayout";
import { SidebarProvider } from "@/context/SidebarContext";
import VetControl from "@/routes/Admin/VetControl";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import AppointmentControl from "@/routes/Admin/AppointmentControl";
import BookApointment from "@/routes/Owner/BookApointment";

function App() {
  const { currentUser } = useContext(AuthContext);

  console.log(currentUser, "currentUser");
  console.log(currentUser?.userType, "userType");

  const router = createBrowserRouter([
    {
      path: "/login",
      children: [
        {
          path: "",
          element: <Login />,
        },
        // {
        //   path: "forgot-password",
        //   element: <ForgotPasswordMailPage />,
        // },
        // {
        //   path: "forgot-password/:id",
        //   element: <ForgotPasswordChangePasswordPage />,
        // },
      ],
    },
    {
      path: "/register",
      children: [
        {
          path: "",
          element: <Register />,
        },
        {
          path: "pet",
          element: <RegisterPet />,
        },
      ],
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/about",
          element: <OurServicesPage />,
        },

        {
          path: "/vetDashboard",
          element: <VetDashboard />,
        },
      ],
    },
    {
      path: "/",
      element: <RequireAuth allowedRoles={["admin"]} />,
      children: [
        {
          path: "/admin",
          element: (
            <SidebarProvider>
              <AdminLayout />
            </SidebarProvider>
          ),
          children: [
            {
              index: true,
              element: <Navigate to="dashboard" replace />,
            },
            { path: "dashboard", element: <AdminDashboard /> },
            { path: "userControl", element: <UserControl /> },
            { path: "petControl", element: <PetControl /> },
            { path: "vetControl", element: <VetControl /> },
            { path: "appointmentControl", element: <AppointmentControl /> },
          ],
        },
      ],
    },
    {
      path: "/",
      element: <RequireAuth allowedRoles={["owner"]} />,
      children: [
        {
          path: "/bookAppointment",
          element: <BookApointment />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
