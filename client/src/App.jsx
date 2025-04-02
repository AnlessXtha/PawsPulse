import { createBrowserRouter, RouterProvider } from "react-router-dom";
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

function App() {
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
      path: "/admin",
      element: (
        <SidebarProvider>
          <AdminLayout />
        </SidebarProvider>
      ),

      children: [
        {
          path: "dashboard",
          element: <AdminDashboard />,
        },
        {
          path: "userControl",
          element: <UserControl />,
        },
        {
          path: "petControl",
          element: <PetControl />,
        },
        {
          path: "vetControl",
          element: <VetControl />,
        },
        {
          path: "appointmentControl",
          // element: <AppointmentControl />,
        },
        // {
        //   path: "petControl",
        //   element: <PetControl />,
        // },
      ],
    },
    {
      // path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/profile",
          element: <ProfilePage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
