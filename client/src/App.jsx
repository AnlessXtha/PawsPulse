import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import OurServicesPage from "./routes/OurServicesPage";
import { Layout, RequireAuth } from "@/routes/Layouts/Layout";
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
import VetLayout from "@/routes/Layouts/VetLayout";
import AnalyticBoard from "@/routes/Vet/AnalyticBoard";
import VaccinationsVet from "@/routes/Vet/VaccinationsVet";
import MessagesVet from "@/routes/Vet/MessagesVet";
import RedirectBasedOnRole from "@/routes/RedirectBasedOnRole";
import AppointmentsVet from "@/routes/Vet/AppointmentsVet";
import AddReport from "@/routes/Vet/Report/AddReport";
import ReportsMainVet from "@/routes/Vet/Report/ReportsMainVet";
import { Toaster } from "@/components/shadcn-components/ui/sonner";
import RegisterVet from "@/routes/Admin/RegisterVet";
import ProfileVet from "@/routes/Vet/ProfileVet";
import OwnerProfile from "@/routes/Owner/OwnerProfile";
import UpdateReport from "@/routes/Vet/Report/UpdateReport";
import ViewAppointments from "@/routes/Owner/ViewAppoiments";
import NotificationPage from "@/components/components/Notification";
import ProfileAdmin from "@/routes/Admin/ProfileAdmin";

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
    // {
    //   path: "/",
    //   element: <Layout />,
    //   children: [
    //     {
    //       path: "/",
    //       element: <HomePage />,
    //     },
    //     {
    //       path: "/about",
    //       element: <OurServicesPage />,
    //     },
    //   ],
    // },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <RedirectBasedOnRole />,
        },
        {
          path: "/home",
          element: <HomePage />,
        },
        {
          path: "about",
          element: <OurServicesPage />,
        },
      ],
    },
    {
      path: "/vet",
      element: (
        <SidebarProvider>
          <VetLayout />
        </SidebarProvider>
      ),
      children: [
        {
          path: "dashboard",
          element: <VetDashboard />,
        },
        {
          path: "analytics",
          element: <AnalyticBoard />,
        },
        {
          path: "appointments",
          element: <AppointmentsVet />,
          // children: [
          //   {
          //     path: "addReport",
          //     element: <AddReport />,
          //   },
          // ],
        },

        {
          path: "reports",
          element: <ReportsMainVet />,
        },
        {
          path: "reports/addReport",
          element: <AddReport />,
        },
        {
          path: "reports/updateReport/:id",
          element: <UpdateReport />,
        },
        {
          path: "vaccinations",
          element: <VaccinationsVet />,
        },
        {
          path: "notifications",
          element: <NotificationPage />,
        },
        {
          path: "messages",
          element: <MessagesVet />,
        },
        { path: "profile", element: <ProfileVet /> },
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
            { path: "register-vet", element: <RegisterVet /> },
            { path: "profile", element: <ProfileAdmin /> },
          ],
        },
      ],
    },
    {
      path: "/",
      element: <RequireAuth allowedRoles={["owner"]} />,
      children: [
        {
          path: "/user",
          children: [
            {
              index: true,
              element: <Navigate to="pofile" replace />,
            },
            {
              path: "book",
              element: <BookApointment />,
            },
            {
              path: "viewMessages",
              element: <MessagesVet />,
            },
            {
              path: "viewAppointments",
              element: <ViewAppointments />,
            },
            {
              path: "profile",
              element: <OwnerProfile />,
            },
            {
              path: "notification",
              element: <NotificationPage />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
