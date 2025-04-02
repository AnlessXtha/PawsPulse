import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import Navbar from "@/components/shared/Navbar";

const Layout = () => {
  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

const RequireAuth = ({ allowedRoles }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(currentUser?.userType)) {
    return <Navigate to="/" replace />;
  }

  // If userType is "owner", render the layout with Navbar
  if (currentUser?.userType === "owner") {
    return (
      <div className="layout">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export { Layout, RequireAuth };
