// src/routes/RedirectBasedOnRole.tsx
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import HomePage from "@/routes/HomePage";

const RedirectBasedOnRole = () => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <HomePage />;
  }

  switch (currentUser.userType) {
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;
    case "vet":
      return <Navigate to="/vet/dashboard" replace />;
    case "owner":
      return <Navigate to="/bookAppointment" replace />;
    default:
      return <HomePage />;
  }
};

export default RedirectBasedOnRole;
